

document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: "getProxyStatus" }, (response) => {
        updateUi(response.active);
    });

    // 获取DOM元素
    const startProxyBtn = document.getElementById('startProxy');
    const stopProxyBtn = document.getElementById('stopProxy');
    const statusContent = document.getElementById('status');
    const refreshBtn = document.getElementById('refresh');


    stopProxyBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "stopProxy" }, (response) => {
            if (response && response.success) {
                updateUi(false);
            }
        });
    })

    startProxyBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "startProxy" }, (response) => {
            updateUi(true);
        });
    })
    refreshBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "refreshAuth" });
    })

    function updateUi(active) {
        if (active) {
            statusContent.textContent = '已连接';
            statusContent.classList.add('active');
            startProxyBtn.style.display = 'none';
            stopProxyBtn.style.display = 'block';
        } else {
            statusContent.textContent = '未连接';
            statusContent.classList.remove('active');
            startProxyBtn.style.display = 'block';
            stopProxyBtn.style.display = 'none';
        }
    }

})
