import webview
from service.api import Api
import sys

if getattr(sys, "frozen", False):
    ui = './distFrontend/index.html'
else:
    ui = "http://localhost:3000/"


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
    window = create_window()
    webview.start(debug=True)
