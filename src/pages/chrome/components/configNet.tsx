import { useMemo, useState } from 'react'
import { Button, Modal, Input, Form, Tabs, } from 'antd'
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
        console.log(value)
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
    const urlConfigValue = Form.useWatch('urlConfig', form)
    const onSubmit = async ({ urlConfig }) => {
        if (urlConfig) {
            urlConfig = urlConfig.split('\n')
            urlConfig = urlConfig.map((item: string) => item.trim()).filter((item: string) => item)
        } else {
            urlConfig = []
        }
        await window.pywebview.api.app_config.set_url_config(urlConfig)
        window.message.success('浏览器启动网址配置成功');
        onOk()
    }
    useMount(async () => {
        const urlConfig = await window.pywebview.api.app_config.get_url_config();
        const value = urlConfig.join('\n')
        form.setFieldsValue({
            urlConfig: value
        })
    })

    const urlLens = useMemo(() => {
        if (Array.isArray(urlConfigValue)) {
            return urlConfigValue.length
        } else {
            return urlConfigValue?.split('\n').length || 0
        }
    }, [urlConfigValue])
    return (
        <Form
            form={form}
            layout='vertical'
            onFinish={onSubmit}
        >
            <Form.Item
                name='urlConfig'
                extra={`当前url数量：${urlLens}`}
            >
                <Input.TextArea rows={10} />
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
