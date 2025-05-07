from eth_account import Account
import time
import random
from service.web3 import create_web3_instance, check_balance
from service.util import evaluate_js

BALANCE_THRESHOLD: float = 0.001
DEFAULT_ATTEMPTS: int = 10000000
GAS_LIMIT: int = 200000
def create_message_code(content,key="shmonad", type="loading", duration=0):
    code = f"""
    window.message.open({{
        key: '{key}',
        type: '{type}',
        content: '{content}',
        duration: {duration},
    }});
    """
    return code
    

def run_shmonad(private_key, proxy = None):
    # 账户设置
    my_account = Account.from_key(private_key)
    my_address = my_account.address
    # 使用工具函数创建Web3实例
    w3 = create_web3_instance(proxy=proxy)
    if w3 is None:
        print("无法连接到RPC，退出...")
        evaluate_js(create_message_code("无法连接到RPC，退出...", type="error", duration=3))
        return
    
    #  合约地址
    contract_address = "0xBce2C725304e09CEf4cD7639760B67f8A0Af5bc4"
    # SeaPort 合约地址
    checksum_address = w3.to_checksum_address(contract_address)
    
    abi_string = [{"type":"function","name":"frontrun","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getScore","inputs":[{"name":"participant","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"tuple","internalType":"struct Score","components":[{"name":"wins","type":"uint128","internalType":"uint128"},{"name":"losses","type":"uint128","internalType":"uint128"}]}],"stateMutability":"view"},{"type":"function","name":"getScores","inputs":[],"outputs":[{"name":"","type":"tuple[]","internalType":"struct Frontrunner.ParticipantData[]","components":[{"name":"Address","type":"address","internalType":"address"},{"name":"Wins","type":"uint256","internalType":"uint256"},{"name":"Losses","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"}]
    # 创建合约实例
    contract = w3.eth.contract(address=checksum_address, abi=abi_string)
    if not check_balance(w3, my_account.address, low_balance=0.05):
        return
        
    # 非零交易计数
    nonce: int = w3.eth.get_transaction_count(my_account.address)
    # 链ID
    chain_id: int = w3.eth.chain_id
    # 默认gas价格
    gas_price_wei: int = w3.to_wei(52, 'gwei')

    # attempts: int = 200
    attempts: int = random.randint(2, 10)
    evaluate_js(create_message_code(f"当前需要尝试次数...{attempts}"))
    print(f"{my_address} 当前需要尝试次数: {attempts}")
    
    while True:
        if not check_balance(w3, my_account.address, low_balance=0.05):
            return
        try:
            txn = contract.functions.frontrun().build_transaction({
                'chainId': chain_id,
                'gas': GAS_LIMIT,
                'gasPrice': gas_price_wei,
                'nonce': nonce,
            })

            signed_txn = my_account.sign_transaction(txn)
            tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
            evaluate_js(create_message_code(f"剩余次数：{attempts} , Sent nonce {nonce}, tx hash: {tx_hash.hex()}"))
            print(f"剩余次数：{attempts}: Sent transaction with nonce {nonce}. Tx hash: {tx_hash.hex()}")
        except Exception as e:
            evaluate_js(create_message_code(f"出错了 {nonce}: {e}", type="error", duration=3))
            print(f"出错了 {nonce}: {e}")
    
        nonce += 1
        # 等待时间
        time.sleep(random.randint(2, 6))
        attempts -= 1
        if attempts == 0:
            # 达到最大尝试次数
            print("达到最大尝试次数...")
            evaluate_js(create_message_code(f"达到最大尝试次数", type="success", duration=3))
            break
    

