import { Space, Button, Typography, message } from 'antd'
import { ReactComponent as Chromeicon } from '@/assets/chrome.svg'
import { ReactComponent as Tgicon } from '@/assets/telegram.svg'
import locations from './locations.json'
import copy from 'copy-to-clipboard'

interface Props {
    openChromeOne: (name: string) => void
    closeChromeOne: (name: string) => void
    openTgOne: (name: string) => void
    closeTgOne: (name: string) => void
}

const { Paragraph } = Typography
const getLocation = (name: string) => {
    return locations.find((item) => item.name === name)
}
export default function columns(props: Props) {
    const { openChromeOne, closeChromeOne, openTgOne, closeTgOne } = props
    return [
        {
            title: '编号/名称',
            dataIndex: 'name',
            width: 140,
            fixed: 'left',
            render(val: string) {
                if (!val) return '-'
                const isTag = val.toLowerCase().includes('58e0')
                return (
                    <span className={isTag ? 'tag-58e0' : ''} onClick={() => {
                        copy(val)
                        message.success('复制成功')
                    }}>
                        {val}
                    </span>
                )
            }
        },
        {
            title: 'nordVpn',
            width: 140,
            render(row: any) {
                const location = getLocation(row.name)
                if (location) {
                    return (
                        <span onClick={() => {
                            copy(location.nordVpn)
                            message.success('复制成功')
                        }}>{location.nordVpn}</span>
                    )
                }
                return '-'
            }
        },
        {
            title: 'protonVpn',
            width: 140,
            render(row: any) {
                const location = getLocation(row.name)
                if (location) {
                    return (
                        <span onClick={() => {
                            copy(location.protonVpn)
                            message.success('复制成功')
                        }}>{location.protonVpn}</span>
                    )
                }
                return '-'
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