let proxyCredentials = {
    username: "",
    password: ""
};

chrome.webRequest.onAuthRequired.addListener((e, call) => {
    call({
        authCredentials: {
            username: proxyCredentials.username, 
            password: proxyCredentials.password,
        }
    })
}, {
    urls: ["<all_urls>"]
}, ["asyncBlocking"])

// 代理认证处理
chrome.webRequest.onAuthRequired.addListener(
    function (details, callback) {
        if (details.isProxy) {
            callback({ authCredentials: proxyCredentials });
        }
    },
    { urls: ["<all_urls>"] },
    ["asyncBlocking"]
);

// 设置代理配置
function setProxyConfig() {
    const config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                scheme: "http",
                host: "198.23.239.134",
                port: 6540
            },
            bypassList: ["*webshare.io", "*.posthog.com"]
        }
    };

    chrome.proxy.settings.set(
        {
            value: config,
            scope: 'regular'
        },
        function () {
            if (chrome.runtime.lastError) {
                console.error('Proxy setup error:', chrome.runtime.lastError);
            } else {
                console.log('Proxy configured successfully');
            }
        }
    );
}

// 清除代理配置
function clearProxyConfig() {
    chrome.proxy.settings.clear(
        { scope: 'regular' },
        function () {
            if (chrome.runtime.lastError) {
                console.error('Error clearing proxy:', chrome.runtime.lastError);
            } else {
                console.log('Proxy cleared successfully');
            }
        }
    );
}

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'setProxy') {
        setProxyConfig();
        sendResponse({ status: 'success' });
    } else if (request.action === 'clearProxy') {
        console.log('执行清除')
        clearProxyConfig();
        sendResponse({ status: 'success' });
    }
    return true;
});

// 错误处理
chrome.webRequest.onErrorOccurred.addListener(
    function (details) {
        console.error('Request error:', details);
    },
    { urls: ["<all_urls>"] }
); 
