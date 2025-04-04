import os
import sys
import json
import shutil

# 使用用户的文档目录
user_path = os.environ.get('appdata')
user_data_path = os.path.join(user_path, "AirdropTools")
config_json_path = os.path.join(user_data_path, "config.json")
wallet_json_path = os.path.join(user_data_path, "wallet.json")
url_json_path = os.path.join(user_data_path, "url.json")


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


# 获取程序存储目录
def get_app_storage_path():
    return os.path.join(app_path(), "storage")

def start_init():
    app_storage_path = get_app_storage_path()
    if not os.path.exists(user_data_path):
        shutil.copytree(app_storage_path, user_data_path)
    
    
