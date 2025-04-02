import json
from service.util import app_path

class App_Config:
    def __init__(self):
        self.app_path = app_path()

    def set_wallet_config(self, wallet_config: str) -> None:
        # 将wallet_config 数组数据 写入文件
        with open(f"{self.app_path}/storage/walllet.json", "w") as f:
            f.write(json.dumps(wallet_config))


    def get_wallet_config(self) -> str:
        with open(f"{self.app_path}/storage/walllet.json", "r") as f:
            return json.load(f)

    def set_url_config(self, url_config: str) -> None:
        with open(f"{self.app_path}/storage/url.json", "w") as f:
            f.write(json.dumps(url_config))

    def get_url_config(self) -> list:
        with open(f"{self.app_path}/storage/url.json", "r") as f:
            return json.load(f)

    def get_app_config(self) -> dict:
        with open(f"{self.app_path}/storage/config.json", "r") as f:
            return json.load(f)

    def set_app_config(self, app_config: dict) -> None:
        with open(f"{self.app_path}/storage/config.json", "w") as f:
            f.write(json.dumps(app_config))
