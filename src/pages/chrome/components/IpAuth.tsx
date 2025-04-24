import { Table, Modal, Button, Typography, Form, Input, } from 'antd'
import { useBoolean, useRequest, useUpdateEffect } from 'ahooks'
import { webshareHeaders } from '@/util'
import { useState } from 'react';

const { Text } = Typography
export default function IpAuth() {
    const [form] = Form.useForm()
    const [open, { setTrue, setFalse }] = useBoolean();
    const [ip, setIp] = useState([]);
    const [myip, setMyip] = useState();
    //获取我的ip
    const { run: runMyip } = useRequest(async () => {
        return window.fetch('https://proxy.webshare.io/api/v2/proxy/ipauthorization/whatsmyip/', {
            headers: webshareHeaders,
        }).then(res => res.json())
    }, {
        manual: true,
        onSuccess(data) {
            if (data && data.ip_address) {
                setMyip(data.ip_address)
            }
        }
    })
    //获取已授权Ip
    const { loading, run: runCheckIpauth } = useRequest(async () => {
        return window.fetch('https://proxy.webshare.io/api/v2/proxy/ipauthorization/', {
            headers: webshareHeaders,
        }).then(res => res.json());
    }, {
        manual: true,
        onSuccess(data) {
            setIp(data.results)
        }
    })
    //移除已授权Ip
    const { run: runRemove } = useRequest(async (id) => {
        return window.fetch(`https://proxy.webshare.io/api/v2/proxy/ipauthorization/${id}`, {
            method: 'DELETE',
            headers: webshareHeaders,
        }).then(res => res.json());
    }, {
        manual: true,
        onSuccess() {
            runCheckIpauth()
        }
    })
    //添加授权Ip
    const { run: runAdd, loading: loadingAdd } = useRequest(async (data) => {
        const headers = new Headers(webshareHeaders)
        headers.append('Content-Type', 'application/json')
        return window.fetch('https://proxy.webshare.io/api/v2/proxy/ipauthorization/', {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        }).then(res => res.json())
    }, {
        manual: true,
        onSuccess() {
            runCheckIpauth()
            form.resetFields()
        }
    })

    const onRemove = (row) => () => {
        Modal.confirm({
            title: '确定要移除吗？',
            onOk: async () => {
                return runRemove(row.id)
            }
        })
    }

    useUpdateEffect(() => {
        if (open) {
            runCheckIpauth()
            runMyip()
        }
    }, [open])

    return (
        <>
            <Button
                type='link'
                onClick={setTrue}>
                Ip授权
            </Button>
            <Modal
                title={<div>Ip授权<span style={{ fontSize: 12, marginLeft: 15 }}>(我的ip: <Text copyable title={myip}>{myip}</Text>)</span></div>}
                open={open}
                onCancel={setFalse}
                footer={null}
                loading={loading}
                destroyOnClose
            >
                <Form
                    style={{ marginTop: 30 }}
                    form={form}
                    layout='inline'
                    onFinish={(values) => {
                        runAdd(values)
                    }}>
                    <Form.Item label='添加授权IP' name='ip_address' rules={[{ required: true, message: '请输入授权IP' }]}>
                        <Input placeholder='请输入授权IP' maxLength={50} />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            loading={loadingAdd}
                            type='primary'
                            onClick={form.submit}>添加</Button>
                    </Form.Item>
                </Form>
                <Table
                    columns={[
                        {
                            title: '已授权的IP',
                            dataIndex: 'ip_address',
                        },
                        {
                            title: '操作',
                            align: 'center',
                            render: (row) => {
                                return (
                                    <Button type='link' onClick={onRemove(row)}>移除</Button>
                                )
                            }
                        },
                    ]}
                    dataSource={ip}
                />
            </Modal>
        </>
    );
}