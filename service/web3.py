from web3 import Web3
import requests
from service.config.private_key import private_key

def create_web3_instance(rpc_url='https://testnet-rpc.monad.xyz', proxy=None):
    if proxy:
        try:
            # 创建带有代理的会话
            session = requests.Session()
            session.proxies = proxy
            w3 = Web3(Web3.HTTPProvider(rpc_url, session=session))
            if w3.is_connected():
                print('成功连接到 RPC', rpc_url)
                return w3
            else:
                print(f"无法连接到 {rpc_url}，可能是代理问题")
                return None
        except Exception as e:
            # 如果使用代理失败，回退到直接连接
            return None
    else:
        w3 = Web3(Web3.HTTPProvider(rpc_url))
        print(f"直接连接到 {rpc_url}")
        return w3
    
# 检查余额是否低于指定值
def check_balance(w3, address, low_balance = 0.05):
    print("钱包余额：",w3.eth.get_balance(address))
    balance = w3.from_wei(w3.eth.get_balance(address), 'ether')
    if balance < low_balance:
        print(f"余额{balance}, 低于指定值{low_balance}")
        return False
    else:
        return True
    
    
def get_private_key(name):
    for item in private_key:
        if name.lower() == item.get('name').lower():
            return item.get('private_key')
    return None