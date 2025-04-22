
// 使用认证前请先完成webshare的ip授权

let authCredentials = {
    username: "kissabcd",
    password: "kissabcd00"
};
let host = null;
let port = null;
let authListener = null;
// 浏览器弹窗自动身份验
function setupAuthListener() {
    if (authListener) {
        chrome.webRequest.onAuthRequired.removeListener(authListener);
    }
    authListener = function (details, cb) {
        console.log("收到认证请求:", details);
        if (details.isProxy) {
            cb({ authCredentials });
        } else {
            cb({ cancel: true });
        }
    }


    chrome.webRequest.onAuthRequired.addListener(
        authListener,
        { urls: ["<all_urls>"] },
        ['asyncBlocking']
    );

    // 强制刷新请求处理器
    chrome.webRequest.handlerBehaviorChanged(function () {
        console.log("已强制刷新网络请求处理器");
    });

}
// 添加清除认证缓存的函数
function clearAuthCache(callback) {
    if (chrome.browsingData) {
        chrome.browsingData.remove({
            "since": 0
        }, {
            "cache": true,
            "cookies": false,
        }, function() {
            console.log("认证缓存已清除");
            if (callback) callback();
        });
    } else {
        if (callback) callback();
    }
}
// 认证函数
setupAuthListener();

// 设置代理
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
                console.log('代理配置成功');
                updateBadge(true);
                setTimeout(setupAuthListener, 500);
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
                console.log('代理清除成功');
                updateBadge(false);
            }
        }
    );
}

// 获取代理状态
function getProxyStatus(callback) {
    chrome.proxy.settings.get(
        { 'incognito': false },
        function (config) {
            console.log("当前代理配置:", config);
            if (config.value.mode === "fixed_servers") {
                chrome
                return callback(true);
            }
            return callback(false);
        }
    );
}

// 更新扩展图标
function updateBadge(isActive) {
    if (isActive) {
        chrome.action.setBadgeText({ text: "ON" });
        chrome.action.setBadgeBackgroundColor({ color: "#28a745" }); // 绿色
    } else {
        chrome.action.setBadgeText({ text: "OFF" });
        chrome.action.setBadgeBackgroundColor({ color: "#dc3545" }); // 红色
    }
}





// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("收到消息:", request.action);
    switch (request.action) {
        case "startProxy":
            setProxy();
            sendResponse({ success: true });
            break;
        case "stopProxy":
            clearProxy();
            sendResponse({ success: true });
            break;
        case "clearProxy":
            clearProxy();
            sendResponse({ success: true });
            break;
        case "refreshAuth":
            clearAuthCache(() => {
                setupAuthListener();
            });
            break;
        case "getProxyStatus":
            getProxyStatus((status) => {
                updateBadge(status);
                sendResponse({ active: status });
            });
            break;
        default:
            sendResponse({ success: false });
    }
    return true; // 保持消息通道开放以支持异步响应
});

// 监听浏览器启动时
chrome.runtime.onStartup.addListener(() => {
    setupAuthListener();
    getProxyStatus((status) => {
        updateBadge(status);
    })
});
chrome.runtime.onInstalled.addListener(() => {
    setupAuthListener();
    getProxyStatus((status) => {
        updateBadge(status);
    })
});
chrome.proxy.onProxyError.addListener(
    (details) => {
        console.error("代理错误", details);
    }
)
