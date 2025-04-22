
// 使用认证前请先完成webshare的ip授权

const webshare_proxy_key = "qp3ib2jesv7dxajv53uzdl4ri72h7zzr9n0h3del"

let authCredentials = {
    username: "kissabcd",
    password: "kissabcd00"
};
let proxyActive = false;
const host = "104.252.149.247";
const port = 5661;


chrome.webRequest.onAuthRequired.addListener(
    function callbackFn(details, cb) {
        console.log("收到认证请求:", details);
        cb({ authCredentials });
        if (details.isProxy) {
            cb({ authCredentials });
        } else {
            cb({ cancel: true });
        }
    },
    { urls: ["<all_urls>"] },
    ['asyncBlocking']
);

function setProxy() {
    console.log("正在设置代理为...");
    chrome.proxy.settings.set(
        {
            value: {
                mode: "fixed_servers",
                rules: {
                    singleProxy: {
                        scheme: "http",
                        host,
                        port,
                    },
                    bypassList: ["*webshare.io", "*.posthog.com"]
                }
            },
            scope: 'regular'
        },
        function () {
            if (chrome.runtime.lastError) {
                console.error('Proxy setup error:', chrome.runtime.lastError);
            } else {
                chrome.storage.local.set({ proxyActive: true });
                proxyActive = true;
                console.log('代理配置成功');
            }
        }
    );
}


// 清除代理设置
function clearProxy() {
    chrome.proxy.settings.set(
        { scope: 'regular', value: { mode: "direct" } },
        function () {
            if (chrome.runtime.lastError) {
                console.error('Error clearing proxy:', chrome.runtime.lastError);
            } else {
                proxyActive = false;
                chrome.storage.local.set({ proxyActive: false });
                console.log('代理清除成功');
            }
        }
    );
}

chrome.proxy.onProxyError.addListener(
    (details) => {
        console.error("代理错误", details);
    }
)

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("收到消息:", request.action);

    if (request.action === "startProxy") {
        setProxy();
        sendResponse({ success: true });
    }
    else if (request.action === "stopProxy") {
        clearProxy();
        sendResponse({ success: true });
    }
    else if (request.action === "getProxyStatus") {
        chrome.storage.local.get(['proxyActive'], function(result) {
            console.log("获取代理状态:", result.proxyActive);
            sendResponse({ active: result.proxyActive === undefined ? true : result.proxyActive });
        });
    }

    return true; // 保持消息通道开放以支持异步响应
});


chrome.runtime.onStartup.addListener(initializeProxyState);
chrome.runtime.onInstalled.addListener(initializeProxyState);

function initializeProxyState() {
    chrome.storage.local.get(['proxyActive'], function(result) {
        if (result.proxyActive) {
            proxyActive = true;
            setProxy();
            console.log("启动时恢复代理状态");
        }
    });
}