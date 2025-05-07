import os
import json
import time


proxy = ['121.0.1.2:882','2121.0.1.2:8229']

# #判断文件是否存在
# if os.path.exists('./webshare.txt'):
#     # 如果存在，删除文件
#     os.remove('./webshare.txt')

with open('./webshare.txt', 'w', encoding='utf-8') as f:
    for p in proxy:
        f.write(p + '\n')
    
    
