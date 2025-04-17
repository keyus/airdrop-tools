import { Space, Button, Typography } from 'antd'
import { ReactComponent as Chromeicon } from '@/assets/chrome.svg'
import { ReactComponent as Tgicon } from '@/assets/telegram.svg'
import locations from './locations.json'

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
            title: 'nordVpn',
            width: 140,
            render(row:any) {
                const location = getLocation(row.name)
                if(location){
                    return <Paragraph copyable style={{color: '#999', marginBottom: 0}}>{location.nordVpn}</Paragraph>
                }
                return (
                    <span>-</span>
                )
            }
        },
        {
            title: 'protonVpn',
            width: 140,
            render(row:any) {
                const location = getLocation(row.name)
                if(location){
                    return <Paragraph copyable style={{color: '#999', marginBottom: 0}}>{location.protonVpn}</Paragraph>
                }
                return (
                    <span>-</span>
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