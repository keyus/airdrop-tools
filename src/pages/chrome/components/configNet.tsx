import { useMemo, } from 'react'
import { Button, Modal, Input, Form, Tabs, Switch} from 'antd'
import { useBoolean, useMount } from 'ahooks';


export default function ConfigNet({ onConfigWallet }:
    { onConfigWallet: () => void }
) {
    const [open, { toggle }] = useBoolean();

    return (
        <>
            <Button
                size='large'
                onClick={toggle}
            >
                环境配置
            </Button>
            <Modal
                title='环境配置'
                open={open}
                destroyOnClose
                onCancel={toggle}
                footer={null}
            >
                <Tabs
                    items={[
                        {
                            key: 'url',
                            label: '浏览器启动网址',
                            children: <OpenUrlConfig onOk={toggle} />
                        },
                        {
                            key: 'wallet',
                            label: '钱包配置',
                            children: <WalletConfig onOk={() => {
                                onConfigWallet()
                                toggle()
                            }} />
                        },
                    ]}
                />


            </Modal>
        </>
    )
}

function WalletConfig({ onOk }: { onOk: () => void }) {

    const [form] = Form.useForm();
    const walletConfigValue = Form.useWatch('walletConfig', form)
    const onSubmit = async ({ walletConfig }) => {
        if (walletConfig) {
            walletConfig = walletConfig.split('\n')
            walletConfig = walletConfig.map((item: string) => item.trim()).filter((item: string) => item)
        } else {
            walletConfig = []
        }
        await window.pywebview.api.app_config.set_wallet_config(walletConfig)
        window.message.success('钱包环境配置成功');
        onOk()
    }
    useMount(async () => {
        const config_wallet = await window.pywebview.api.app_config.get_wallet_config();
        const value = config_wallet.join('\n')
        form.setFieldsValue({
            walletConfig: value
        })
    })

    const walletlens = useMemo(() => {
        if (Array.isArray(walletConfigValue)) {
            return walletConfigValue.length
        } else {
            return walletConfigValue?.split('\n').length || 0
        }
    }, [walletConfigValue])

    return (
        <Form
            form={form}
            layout='vertical'
            onFinish={onSubmit}
        >
            <Form.Item
                name='walletConfig'
                rules={[{ required: true, message: '请输入钱包配置' }]}
                extra={`当前钱包数量：${walletlens}`}
            >
                <Input.TextArea rows={10} />
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
                <Button
                    type='primary'
                    size='large'
                    onClick={() => {
                        form.submit()
                    }}
                >
                    保存钱包配置
                </Button>
            </Form.Item>
        </Form>
    )
}

function OpenUrlConfig(props: { onOk: () => void }) {
    const { onOk } = props;
    const [form] = Form.useForm();
    const urlValue = Form.useWatch('url', form)
    const onSubmit = async ({ url, use }) => {
        if (url) {
            url = url.split('\n')
            url = url.map((item: string) => item.trim()).filter((item: string) => item)
        } else {
            url = []
        }
        await window.pywebview.api.app_config.set_url_config({
            url,
            use,
        })
        window.message.success('浏览器启动网址配置成功');
        onOk()
    }
    useMount(async () => {
        const urlConfig = await window.pywebview.api.app_config.get_url_config();
        const value = urlConfig.url.join('\n')
        const use = urlConfig.use
        form.setFieldsValue({
            url: value,
            use,
        })
    })

    const urlLens = useMemo(() => {
        if (Array.isArray(urlValue)) {
            return urlValue.filter(it => it).length
        } else {
            return urlValue?.split('\n').filter((it: any) => it).length || 0
        }
    }, [urlValue])
    return (
        <Form
            form={form}
            onFinish={onSubmit}
        >
            <Form.Item
                name='url'
                extra={`当前url数量：${urlLens}`}
            >
                <Input.TextArea rows={8} />
            </Form.Item>
            <Form.Item
                label='是否启用'
                name='use'
            >
                <Switch checkedChildren='启用' unCheckedChildren='禁用' />
            </Form.Item>
            <Form.Item
                style={{ textAlign: 'right' }}
            >
                <Button
                    type='primary'
                    htmlType='submit'
                    size='large'
                >
                    保存url配置
                </Button>
            </Form.Item>
        </Form>
    )
}
