import os
import json
import time



user_path = os.environ.get('APPDATA')
# 获取 AppData 路径
appdata = os.environ.get('APPDATA')
wallet_dir = os.path.join(appdata, 'AirdropTools')
wallet_json_path = os.path.join(wallet_dir, 'wallet.json')

# 添加调试信息
print(f"AppData 路径: {appdata}")
print(f"钱包目录: {wallet_dir}")
print(f"钱包文件路径: {wallet_json_path}")
print(f"目录是否存在: {os.path.exists(wallet_dir)}")
print(f"文件是否存在: {os.path.exists(wallet_json_path)}")

try:
    with open(wallet_json_path, "r") as f:
        print(json.load(f))
except FileNotFoundError:
    print("文件不存在")
except Exception as e:
    print(f"读取文件时出错: {e}")

time.sleep(5)