import os
import sys
import json
import shutil

# 使用用户的文档目录
user_path = os.environ.get('appdata')
user_data_path = os.path.join(user_path, "AirdropTools")
user_extensions_path = os.path.join(user_data_path, "extensions")
config_json_path = os.path.join(user_data_path, "config.json")
wallet_json_path = os.path.join(user_data_path, "wallet.json")
url_json_path = os.path.join(user_data_path, "url.json")
proxy_json_path = os.path.join(user_data_path, "proxy.json")


# 程序目录
def app_path():
    if getattr(sys, "frozen", False):
        base_path = sys._MEIPASS
    else:
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return base_path


# 获取用户配置
def get_app_config():
    try:
        with open(config_json_path, "r", encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


# 获取用户url配置
def get_url_config():
    try:
        with open(url_json_path, "r", encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []


# 获取用户钱包配置
def get_wallet_config():
    try:
        with open(wallet_json_path, "r", encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    
# 获取用户钱包配置
def get_proxy_config():
    try:
        with open(proxy_json_path, "r", encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

# 获取程序存储目录
def get_app_storage_path():
    return os.path.join(app_path(), "storage")

def get_app_extensions_path():
    return os.path.join(app_path(), "extensions")

"""
获取钱包名称在钱包列表中的索引
:param name: 钱包名称
:return: 钱包名称在钱包列表中的索引
"""
def get_name_index(name: str):
    wallet_config = get_wallet_config()
    for index, item in enumerate(wallet_config):
        if item == name:
            return index
    return -1

def get_proxy_by_index(findex: str):
    proxy_config = get_proxy_config()
    list_data = proxy_config["proxy"]
    if len(list_data) == 0:
        return None
    for index, item in enumerate(list_data):
        if index == findex:
            return item
    return None

def get_name_proxy(name: str):
    index = get_name_index(name)
    if index == -1:
        return None
    return get_proxy_by_index(index)

def start_init():
    app_storage_path = get_app_storage_path()
    app_extensions_path = get_app_extensions_path()
    if not os.path.exists(user_data_path):
        shutil.copytree(app_storage_path, user_data_path)
        shutil.copytree(app_extensions_path, user_extensions_path)
    
    
def clear_user_data():
    app_storage_path = get_app_storage_path()
    app_extensions_path = get_app_extensions_path()
    # 删除用户数据目录,并重新复制
    if os.path.exists(user_data_path):
        shutil.rmtree(user_data_path)
    shutil.copytree(app_storage_path, user_data_path)
    shutil.copytree(app_extensions_path, user_extensions_path)