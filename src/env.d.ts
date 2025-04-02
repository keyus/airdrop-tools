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
        set_wallet_config: (wallet_config: string) => Promise<any>
        get_wallet_config: () => Promise<string[]>
        set_url_config: (url_config: string) => Promise<any>
        get_url_config: () => Promise<string[]>
        set_app_config: (app_config: string) => Promise<any>
        get_app_config: () => Promise<string[]>
      }
    }
  }
  message: MessageInstance
}
