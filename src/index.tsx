import { createRoot } from "react-dom/client";
import App from "./App";
import { ConfigProvider, App as AntdApp, message } from 'antd'
import zhCN from 'antd/locale/zh_CN';
import { createHashRouter, RouterProvider, } from 'react-router'
import Chrome from './pages/chrome'
import ChromeApp from './pages/chrome_app'
import Setting from './pages/setting'
import '@ant-design/v5-patch-for-react-19';

message.config({
    maxCount: 1,
});
createRoot(document.getElementById("root")).render(
    <ConfigProvider
        locale={zhCN}
        theme={{
            components: {
                Table: {
                    headerBg: '#fff',
                    headerColor: '#bcbec5',
                    cellFontSize: 13,
                    footerBg: '#fff',
                    rowHoverBg: '#e9edfd',
                }
            }
        }}
    >
        <AntdApp>
            <RouterProvider
                router={createHashRouter([
                    {
                        path: '/',
                        element: <App />,
                        children: [
                            {
                                index: true,
                                element: <Chrome />,
                                handle: {
                                    title: '环境管理'
                                }
                            },
                            {
                                path: 'chrome_app',
                                element: <ChromeApp />,
                                handle: {
                                    title: '浏览器应用'
                                }
                            },
                            {
                                path: 'setting',
                                element: <Setting />,
                                handle: {
                                    title: 'app设置'
                                }
                            }
                        ]
                    },
                ])}
            />
        </AntdApp>
    </ConfigProvider>
);

