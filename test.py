import os
import json
import time

import requests

proxy = ["121.0.1.2:882", "2121.0.1.2:8229"]

# #判断文件是否存在
# if os.path.exists('./webshare.txt'):
#     # 如果存在，删除文件
#     os.remove('./webshare.txt')

headers = {
    "Authorization": "Token qp3ib2jesv7dxajv53uzdl4ri72h7zzr9n0h3del"
}

#返回以下格式的纯文本文件
response = requests.get(
    f"https://proxy.webshare.io/api/v2/proxy/list/?mode=direct&page=1&page_size=100", headers=headers,
)

json_data = response.json()

print(json_data)

if json_data["count"] > 0:
    with open('./webshare.txt', 'w') as f:
        for item in json_data["results"]:
            if item["valid"]:
                f.write(f"{item['proxy_address']}:{item['port']}\n")