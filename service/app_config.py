import json
from service.util import (
    config_json_path,
    wallet_json_path,
    url_json_path,
)

class App_Config:

    def set_wallet_config(self, wallet_config: str) -> None:
        # 将wallet_config 数组数据 写入文件
        with open(wallet_json_path, "w") as f:
            f.write(json.dumps(wallet_config))

    def get_wallet_config(self) -> str:
        with open(wallet_json_path, "r") as f:
            return json.load(f)

    def set_url_config(self, url_config: str) -> None:
        with open(url_json_path, "w") as f:
            f.write(json.dumps(url_config))

    def get_url_config(self) -> list:
        with open(url_json_path, "r") as f:
            return json.load(f)

    def get_app_config(self) -> dict:
        with open(config_json_path, "r") as f:
            return json.load(f)

    def set_app_config(self, app_config: dict) -> None:
        with open(config_json_path, "w") as f:
            f.write(json.dumps(app_config))
