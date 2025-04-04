import webview
from service.api import Api
import sys
from service.util import start_init

isProduction = getattr(sys, "frozen", False)
ui = './distFrontend/index.html' if isProduction else "http://localhost:3000/"
debug = not isProduction


def create_window():
    api = Api()
    window = webview.create_window(
        "Airdrop tools",
        ui,
        js_api=api,
        width=1000,
        height=800,
        resizable=True,
        min_size=(1000, 800),
    )
    return window

if __name__ == "__main__":
    start_init()
    window = create_window()
    webview.start(debug=debug)