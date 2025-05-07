/// <reference types="antd/es/message/interface" />

declare module '*.svg' {
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const content: string;
  export default content;
}
declare module '*.svg?react' {
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}


declare interface Window {
  pywebview: {
    api: {
      open_chrome: (names: string[] | string) => Promise<void>
      close_chrome: (names: string[] | string) => Promise<void>
      close_chrome_all: () => Promise<void>

      open_tg: (names: string[] | string) => Promise<void>
      close_tg: (names: string[] | string) => Promise<void>
      close_tg_all: () => Promise<void>

      get_open_all: () => Promise<{
        open_chrome_process: {
          pid: number
          name: string
        }[]
        open_telegram_process: {
          pid: number
          name: string
        }[]
      }>
      chrome_extension: {
        install: (id: string) => Promise<any>
        uninstall: (id: string) => Promise<any>
        test: () => Promise<void>
      }
      app_config: {
        get_url_config: () => Promise<Record<string, any>>
        get_proxy_config: () => Promise<Record<string, any>>
        get_wallet_config: () => Promise<string[]>
        get_app_config: () => Promise<string[]>

        set_url_config: (options: Record<string, any>) => Promise<any>
        set_proxy_config: (proxy_config: Record<string, any>) => Promise<any>
        set_wallet_config: (wallet_config: string) => Promise<any>
        set_app_config: (app_config: string) => Promise<any>
      }
      clear_cache: () => Promise<void>
      webshare: {
        get_my_ip: () => Promise<any>
        get_ipauthorization: () => Promise<any>
        remove_ipauthorization: (id: number) => Promise<any>
        add_ipauthorization: (data: { ip_address: string }) => Promise<any>
      }
      testnet: {
        run_shmonad: (name: string) => Promise<void>
      }
    }
  }
  message: MessageInstance
}
