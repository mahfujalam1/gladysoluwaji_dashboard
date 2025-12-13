import { message } from 'antd';

const toast = {
  success: (content, duration = 3) => {
    message.success({ content, duration });
  },
  error: (content, duration = 3) => {
    message.error({ content, duration });
  },
  warning: (content, duration = 3) => {
    message.warning({ content, duration });
  },
  info: (content, duration = 3) => {
    message.info({ content, duration });
  },
  loading: (content, duration = 0) => {
    return message.loading({ content, duration });
  },
};

export default toast;
