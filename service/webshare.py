import requests
 
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