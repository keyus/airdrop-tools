
import { useState, } from 'react'
import { Input, Form, Checkbox, Space, Table, } from 'antd'
import { useInterval, useMount, useUpdateEffect } from 'ahooks'
import { SearchOutlined, } from '@ant-design/icons'
import Open from './components/Open'
import Close from './components/Close'
import columns from './columns';
import ConfigNet from './components/configNet'
import { genWalletList } from '../../util'
import './style.css';


let originData = []
export default function Chrome(props = {}) {
    const [form] = Form.useForm();
    const open = Form.useWatch('open', form);
    const search = Form.useWatch('search', form);
    const [data, setData] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 7,
    })
    const total = data.length;

    useMount(() => {
        initWallet()
    })

    const initWallet = async () => {
        const config_wallet = await window.pywebview.api.app_config.get_wallet_config();
        const data = genWalletList(config_wallet)
        originData = data
        setData(data)
    }

    // 每3秒检查一次进程是否存在
    useInterval(async () => {
        checkProcess()
    }, 2000)

    useUpdateEffect(() => {
        if (open) {
            setData(data => {
                return data.filter(it => it.openTg || it.openChrome)
            })
        } else {
            setData(originData)
        }
    }, [open]);

    useUpdateEffect(() => {
        if (search) {
            return setData(originData.filter(it => {
                return it.name.toLowerCase().includes(search.toLowerCase())
            }))
        } else {
            setData(originData)
        }
    }, [search])

    // 检查进程是否存在
    const checkProcess = async () => {
        const res = await window.pywebview.api.get_open_all()
        const { open_chrome_process, open_telegram_process } = res;
        data.map((item: any) => {
            if (open_chrome_process.find(it => it.name === item.name)) {
                item.openChrome = true
            } else {
                item.openChrome = false
            }
            if (open_telegram_process.find(it => it.name === item.name)) {
                item.openTg = true
            } else {
                item.openTg = false
            }
        })
        setData([...data])
    }

    const onChange = (pagination: any) => {
        setPagination(pagination)
    }

    const clearSelected = () => {
        setSelectedRowKeys([])
        setSelectedRows([])
    }

    const openChromeOne = async (name: string) => {
        await window.pywebview.api.open_chrome(name)
        window.message.success('chrome,打开成功')
    }

    const openTgOne = async (name: string) => {
        await window.pywebview.api.open_tg(name)
        window.message.success('telegram,打开成功')
    }

    const closeChromeOne = async (name: string) => {
        await window.pywebview.api.close_chrome(name)
        window.message.success('chrome,关闭成功')
    }

    const closeTgOne = async (name: string) => {
        await window.pywebview.api.close_tg(name)
        window.message.success('telegram,关闭成功')
    }
    const column = columns({ openChromeOne, openTgOne, closeChromeOne, closeTgOne });
    const x = column.reduce((a, b) => { return a + b.width }, 0)

    return (
        <div style={{ height: '100%' }}>
            <div>
                <Form
                    form={form}
                    layout='inline'
                    initialValues={{
                        group: '',
                    }}
                >
                    <Form.Item
                        name='search'
                    >
                        <Input size="large" max={20} onPressEnter={form.submit} placeholder="搜索名字" prefix={<SearchOutlined />} />
                    </Form.Item>
                    <Form.Item
                        name='open'
                        valuePropName='checked'
                        className='flex-center'
                    >
                        <Checkbox>已打开(0)</Checkbox>
                    </Form.Item>
                </Form>
            </div>
            <div className='tools'>
                <div>
                    <Space>
                        <Open
                            selectedRows={selectedRows}
                            onOk={clearSelected}
                        />
                        <Close onOk={clearSelected} />
                    </Space>
                </div>
                <div>
                    <ConfigNet onConfigWallet={initWallet} />
                </div>
            </div>
            <div className='list-table'>
                <Table
                    scroll={{ y: 600, x }}
                    rowSelection={{
                        fixed: true,
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys)
                            setSelectedRows(selectedRows)
                        }
                    }}
                    locale={{ emptyText: '暂无数据' }}
                    rowKey='name'
                    columns={column as any}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: [5, 7, 10],
                        total,
                    }}
                    onChange={onChange}
                    dataSource={data}
                />
            </div>
        </div>
    )
}


