import { useState } from 'react'
import { NavLink, Outlet, useMatches } from 'react-router-dom'
import { useMount } from 'ahooks'
import { Avatar, Skeleton, App as AntdApp } from 'antd'
import { GlobalOutlined, OneToOneOutlined, DesktopOutlined, CloudServerOutlined } from '@ant-design/icons'
import LogoSvg from './assets/logo.svg?react'
import "./App.css";


function App() {
  const useapp = AntdApp.useApp();
  window.message = useapp.message;
  const matches = useMatches();
  const currentRoute: any = matches.at(-1);
  const title = currentRoute?.handle?.title;

  const [ready, setReady] = useState(false);
  useMount(async () => {
    window.addEventListener('pywebviewready', () => {
      setReady(true)
    })
  })

  return (
    <AntdApp className='root-app'>
      <aside className="side">
        <h1><LogoSvg />Airdrop</h1>
        <ul>
          <li>
            <NavLink
              to='/'><GlobalOutlined />环境管理</NavLink>
          </li>
          <li>
            <NavLink to='/chrome_app'><CloudServerOutlined />浏览器应用</NavLink>
          </li>

        </ul>
        <div className='space-line' />
        <ul>
          <li>
            <NavLink to='/sync' data-disabled><DesktopOutlined />窗口同步</NavLink>
          </li>
          <li>
            <NavLink to='/setting'><OneToOneOutlined />app设置</NavLink>
          </li>
        </ul>
      </aside>
      <div className="main">
        <header className='main-header'>
          <h2>{title}</h2>
          <div className='set'>
            <Avatar size={40}>USER</Avatar>
          </div>
        </header>
        <div className='main-body'>
          {ready ? <Outlet /> : <Skeleton avatar paragraph={{ rows: 4 }} />}
        </div>
      </div>
    </AntdApp>
  );
}

export default App;
