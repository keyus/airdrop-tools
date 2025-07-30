import requests
from service.util import webshare_txt_path
 
class Webshare:
    def __init__(self):
        self.token = "qp3ib2jesv7dxajv53uzdl4ri72h7zzr9n0h3del"
        self.base_url = "https://proxy.webshare.io/api/v2"
        self.headers = {"Authorization": "Token qp3ib2jesv7dxajv53uzdl4ri72h7zzr9n0h3del"}
    def get_my_ip(self):
        response = requests.get(
            f"{self.base_url}/proxy/ipauthorization/whatsmyip/",
            headers=self.headers
        )
        return response.json()
    #获取已授权的IP列表
    def get_ipauthorization(self):
        response = requests.get(
            f"{self.base_url}/proxy/ipauthorization/",
            headers=self.headers
        )
        return response.json()
    #移除已授权的IP
    def remove_ipauthorization(self, id):
        requests.delete(
            f"{self.base_url}/proxy/ipauthorization/{id}/",
            headers=self.headers
        )
        return {"status": 200, "message": "移除成功"}
    
    #添加已授权的IP
    def add_ipauthorization(self, json):
        response = requests.post(
            f"{self.base_url}/proxy/ipauthorization/",
            headers=self.headers,
            json=json
        )
        return response.json()
    
    # 更新代理列表
    def update_proxy(self):
        response = requests.get(
            f"{self.base_url}/proxy/list/?mode=direct&page=1&page_size=100",
            headers=self.headers,
        )
        json_data = response.json()
        if json_data["count"] > 0:
            with open(webshare_txt_path, 'w') as f:
                for item in json_data["results"]:
                    if item["valid"]:
                        f.write(f"{item['proxy_address']}:{item['port']}\n")
        return True