// 获取DOM元素
const startProxyBtn = document.getElementById('startProxy');
const stopProxyBtn = document.getElementById('stopProxy');
const statusContent = document.getElementById('status');


stopProxyBtn.addEventListener('click', () => {
    // 发送消息给后台脚本，停止代理
    chrome.runtime.sendMessage({ action: "stopProxy" }, (response) => {
        if (response && response.success) {
            statusContent.textContent = '已停止';
            console.log("已停止");
        } else {
            console.error("停止代理失败");
        }
    });
})

startProxyBtn.addEventListener('click', () => {
    // 发送消息给后台脚本，开始代理
    chrome.runtime.sendMessage({ action: "startProxy" }, (response) => {
        if (response && response.success) {
            statusContent.textContent = '已启动';
            console.log("已启动");
        } else {
            console.error("启动代理失败");
        }
    });
})

document.addEventListener('DOMContentLoaded', () => {
    // 页面加载完成后，获取代理状态
    chrome.runtime.sendMessage({ action: "getProxyStatus" }, (response) => {
        if (response && response.active) {
            statusContent.textContent = '已启动';
        } else {
            statusContent.textContent = '已停止';
        }
    });
})