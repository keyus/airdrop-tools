import os
import sys
import json

def app_path():
    if getattr(sys, 'frozen', False):
        base_path = sys._MEIPASS
    else:
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return base_path

def get_app_config():
    with open(f"{app_path()}/storage/config.json", "r") as f:
        return json.load(f)
