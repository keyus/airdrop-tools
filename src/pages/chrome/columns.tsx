import { EnvironmentOutlined, } from '@ant-design/icons'
import { Space, Button, } from 'antd'
import { ReactComponent as Chromeicon } from '@/assets/chrome.svg'
import { ReactComponent as Tgicon } from '@/assets/telegram.svg'
import dayjs from 'dayjs'

interface Props {
    openChromeOne: (name: string) => void
    closeChromeOne: (name: string) => void
    openTgOne: (name: string) => void
    closeTgOne: (name: string) => void
}

export default function columns(props: Props) {
    const { openChromeOne, closeChromeOne, openTgOne, closeTgOne } = props
    return [
        {
            title: '编号/名称',
            dataIndex: 'name',
            width: 120,
            fixed: 'left',
            render(val: string) {
                if (!val) return '-'
                const isTag = val.toLowerCase().includes('58e0')
                return (
                    <span className={isTag ? 'tag-58e0' : ''}>
                        {val}
                    </span>
                )
            }
        },
        {
            title: '最近打开',
            dataIndex: 'last_open_time',
            width: 120,
            render(val: string) {
                if (!val) return
                return dayjs(val).format('MM-DD HH:mm')
            }
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            width: 140,
            render(val: string) {
                return (
                    <Space><span style={{ color: '#1677ff' }}><EnvironmentOutlined /></span>{val}</Space>
                )
            }
        },
        {
            title: '操作',
            width: 180,
            fixed: 'right',
            align: 'center',
            render(record: any) {
                return (
                    <Space>
                        <Button
                            type='primary'
                            danger={record.openChrome}
                            ghost
                            icon={<Chromeicon width={20} height={20} />}
                            onClick={() => {
                                if (record.openChrome) {
                                    closeChromeOne(record.name)
                                } else {
                                    openChromeOne(record.name)
                                }
                            }}>
                            {record.openChrome ? '关闭' : '打开'}
                        </Button>
                        <Button
                            type='primary'
                            ghost
                            danger={record.openTg}
                            icon={<Tgicon width={20} height={20} />}
                            onClick={() => {
                                if (record.openTg) {
                                    closeTgOne(record.name)
                                } else {
                                    openTgOne(record.name)
                                }
                            }} />
                    </Space>
                )
            }
        },
    ]
}