import testnet.bin.monadTest.config as config
from eth_account import Account
from web3 import Web3
import time
from loguru import logger
import random
import sys
import utils.util as util
from utils.web3 import create_web3_instance, check_balance
from config.private_key import private_key
from utils.proxy import proxy_manager
import os

BALANCE_THRESHOLD: float = 0.001
DEFAULT_ATTEMPTS: int = 10000000
GAS_LIMIT: int = 200000

def run(private_key, proxy = None):
    # 账户设置
    my_account = Account.from_key(private_key)
    my_address = my_account.address

    logger.info(f"使用钱包地址: {my_address},正在连接RPC...")
    
    # 使用工具函数创建Web3实例
    w3 = create_web3_instance(config.test_monad_rpc, proxy)
    
    #  合约地址
    contract_address = "0xBce2C725304e09CEf4cD7639760B67f8A0Af5bc4"
    # SeaPort 合约地址
    checksum_address = w3.to_checksum_address(contract_address)
    
    abi_string = [{"type":"function","name":"frontrun","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getScore","inputs":[{"name":"participant","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"tuple","internalType":"struct Score","components":[{"name":"wins","type":"uint128","internalType":"uint128"},{"name":"losses","type":"uint128","internalType":"uint128"}]}],"stateMutability":"view"},{"type":"function","name":"getScores","inputs":[],"outputs":[{"name":"","type":"tuple[]","internalType":"struct Frontrunner.ParticipantData[]","components":[{"name":"Address","type":"address","internalType":"address"},{"name":"Wins","type":"uint256","internalType":"uint256"},{"name":"Losses","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"}]

    # 创建合约实例
    contract = w3.eth.contract(address=checksum_address, abi=abi_string)
    
    if not check_balance(w3, my_account.address, low_balance=0.05):
        return
    
    # 分数检查
    try:
        wins, losses = contract.functions.getScore(my_account.address).call()

        if wins > 0 or losses > 0:
            logger.info(f"已赢{wins}次 ,输 {losses}次")
        else:
            logger.info("第一次尝试，好运")
            
    except Exception as e:
        logger.error(f"获取分数失败，跳过...")
        
    # 非零交易计数
    nonce: int = w3.eth.get_transaction_count(my_account.address)
    logger.info(f"Nonce: {nonce}")
    # 链ID
    chain_id: int = w3.eth.chain_id
    # 默认gas价格
    gas_price_wei: int = w3.to_wei(52, 'gwei')

    # attempts: int = 200
    attempts: int = random.randint(4, 20)
    logger.info(f"{my_address} 当前需要尝试次数: {attempts}")
    
    while True:
        if not check_balance(w3, my_account.address, low_balance=0.05):
            return
        try:
            # Build the transaction with the given nonce and gas price.
            txn = contract.functions.frontrun().build_transaction({
                'chainId': chain_id,
                'gas': GAS_LIMIT,
                'gasPrice': gas_price_wei,
                'nonce': nonce,
            })

            # Sign the transaction with the private key.
            signed_txn = my_account.sign_transaction(txn)

            # Send the signed transaction.
            tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
            logger.info(f"Sent transaction with nonce {nonce}. Tx hash: {tx_hash.hex()}")
        except Exception as e:
            logger.error(f"出错了 {nonce}: {e}")
    
        nonce += 1
        # 等待时间
        time.sleep(random.randint(3, 15))
        attempts -= 1
        if attempts == 0:
            # 达到最大尝试次数
            logger.info("达到最大尝试次数...")
            break
    

if __name__ == "__main__":
    
    # 运行参数 py shmonad.py eth-c871
    if len(sys.argv) > 1:
        name = sys.argv[1]
        name = name.strip().lower()
        # 根据name获取私钥
        find_item = None
        for item in private_key:
            if item["name"].lower() == name:
                find_item = item
                break
        # 输入错误
        if not find_item:
            logger.error(f"不存在该钱包编号: {name}")
            sys.exit()
        else:
            logger.success(f"使用钱包编号: {name}, 开始运行")
            # 为测试获取一个随机代理
            proxy = proxy_manager.get_random_proxy()
            # 启动键盘监听
            util.start_keyboard_listener()
            run(find_item["private_key"], proxy)
    else:
        logger.error("输入钱包编号")
        util.exit()
    
