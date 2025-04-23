import subprocess
import psutil
import os
from service.chrome_extension import Chrome_Extension
from service.app_config import App_Config
from service.util import (
    get_app_config, 
    get_url_config, 
    get_proxy_config, 
    user_extensions_path,
    get_name_proxy,
    clear_user_data,
)
from service.bookmark import enable_bookmark_bar, add_name_bookmark


# chrome_path = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
# user_data_dir = "--user-data-dir=d:\\chrome100 app\\"
# telegram_path = "D:\\telegram100-app\\"

# 打开的chrome进程
open_chrome_process = []
# 打开的telegram进程
open_telegram_process = []


class Api:
    def __init__(self):
        self.chrome_extension = Chrome_Extension()
        self.app_config = App_Config()
        
    # 打开chrome
    def open_chrome(self, names: list[str] | str):
        config = get_app_config()
        url_config = get_url_config()
        proxy_config = get_proxy_config()
        url = url_config["url"]
        
        chrome_path = os.path.join(config["chrome_path"], "chrome.exe")
        # 加载扩展  webshare.io代理插件
        proxy_extensions = os.path.join(user_extensions_path, "proxy")

        if isinstance(names, str):
            names = [names]
            
        for name in names:
            user_data_dir = os.path.join(config["user_data_dir"], name)
            proxy = get_name_proxy(name)
            if proxy:
                ip,port,username,password = proxy.split(":")
                proxy = [f"--proxy-server={ip}:{port}"]
                print("ks", ip, port)
            
            # 在启动Chrome前修改Preferences文件启用书签栏
            enable_bookmark_bar(user_data_dir)
            # 添加书签
            add_name_bookmark(user_data_dir, name)
            if not url_config["use"]:
                url = []
            if not proxy_config["use"]:
                proxy = []
            process = subprocess.Popen(
                [
                    chrome_path, 
                    f"--user-data-dir={user_data_dir}",
                    # f"--load-extension={proxy_extensions}",
                    # *proxy,
                    *url,
                ]
            )
            open_chrome_process.append(
                {
                    "name": name,
                    "pid": process.pid,
                }
            )
        return True

    # 打开telegram
    def open_tg(self, names: list[str] | str):
        config = get_app_config()
        if isinstance(names, str):
            names = [names]
        for name in names:
            item_path = os.path.join(config["telegram_path"], name, "Telegram.exe")
            process = subprocess.Popen([item_path])
            open_telegram_process.append(
                {
                    "name": name,
                    "pid": process.pid,
                }
            )
        return True

    def close_chrome_all(self):
        for proc in psutil.process_iter(["pid", "name"]):
            try:
                if "chrome.exe" in proc.info["name"].lower():
                    proc.kill()
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
        open_chrome_process.clear()
        return True

    def close_tg_all(self):
        for proc in psutil.process_iter(["pid", "name"]):
            if "telegram.exe" in proc.info["name"].lower():
                proc.kill()
        open_telegram_process.clear()
        return True

    # 关闭指定pid的chrome进程
    def close_chrome(self, name: str):
        for item in open_chrome_process:
            if item["name"] == name:
                print("需要关闭的chrome进程", item["pid"])
                proc = psutil.Process(item["pid"])
                proc.kill()
                open_chrome_process.remove(item)
                break
        return True

    # 关闭指定pid的telegram进程
    def close_tg(self, name: str):
        for item in open_telegram_process:
            if item["name"] == name:
                print("需要关闭的telegram进程", item["pid"])
                proc = psutil.Process(item["pid"])
                proc.kill()
                open_telegram_process.remove(item)
                break
        return True

    # 监听指定进程pid，如果不存在此pid,从open_chrome_process_ids或open_telegram_process_ids中删除
    # 返回open_chrome_process_ids和open_telegram_process_ids
    def get_open_all(self):
        pids = psutil.pids()
        global open_chrome_process
        global open_telegram_process

        if len(open_chrome_process) > 0:
            for item in open_chrome_process:
                if item["pid"] in pids:
                    # print("chrome进程存在3", item["pid"])
                    pass
                else:
                    # print("chrome", item["pid"], "不存在")
                    open_chrome_process.remove(item)
                    continue

        if len(open_telegram_process) > 0:
            for item in open_telegram_process:
                if item["pid"] in pids:
                    # print("telegram进程存在", item["pid"])
                    pass
                else:
                    open_telegram_process.remove(item)
                    continue

        return {
            "open_chrome_process": open_chrome_process,
            "open_telegram_process": open_telegram_process,
        }


    def clear_cache(self):
        clear_user_data()