import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

// 挂载到 window 对象上
(window as any).message = message; 