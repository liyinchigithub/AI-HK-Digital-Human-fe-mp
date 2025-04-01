'use strict';

const config = {
  API_KEY: 'iOXdRmCFAMVFHajQxfuPPGtU',
  SECRET_KEY: 'zzqOBWF49G0qPTwHgiLK3t8R2hvTtgtI',
  APP_ID: 'ac9af420-a171-4960-91a6-7de288c54c9d',
  CREATE_SESSION_URL: 'https://qianfan.baidubce.com/v2/app/conversation',
  CHAT_API_URL: 'https://qianfan.baidubce.com/v2/app/conversation/runs',
  STATIC_TOKEN: 'bce-v3/ALTAK-tYUDRovDX32kyC8pNKBGi/1670bf2b2b5638970be88501ebec77afe98f85da'
};

exports.main = async (event, context) => {
  try {
    // 通用请求头
    const commonHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.STATIC_TOKEN}`,
      // 'Cookie': 'BAIDUID=2AA38AA58843896BED9797BB9F27C055:FG=1'
    };

    if (event.action === 'create_session') {
      // 创建新会话
      const { status, data } = await uniCloud.httpclient.request(
        config.CREATE_SESSION_URL,
        {
          method: 'POST',
          headers: commonHeaders,
          data: JSON.stringify({ app_id: config.APP_ID }),
          dataType: 'json'
        }
      );

      if (status === 200) {
        return {
          code: 0,
          data: {
            conversation_id: data.conversation_id,
            request_id: data.request_id
          }
        };
      }
      throw new Error('会话创建失败');
    } else {
      // 执行聊天请求
      const { status, data } = await uniCloud.httpclient.request(
        config.CHAT_API_URL,
        {
          method: 'POST',
          headers: commonHeaders,
          data: JSON.stringify({
            app_id: config.APP_ID,
            query: event.query,
            conversation_id: event.conversation_id,
            stream: false // 关闭流式传输
          }),
          dataType: 'json',
          timeout: 60000 // 增加超时到15秒
        }
      );
      // 调试输出
      console.log('API Response:', data);
      if (status === 200 && !data.error_code) {
        // 调试输出完整响应
        console.log('API完整响应:', JSON.stringify(data, null, 2));
        return {
          code: 0,
          data: {
            // 多层兼容：优先answer > content[3] > result
            response: data.answer ||
              (data.content && data.content.find(c => c.event_type === 'ChatAgent')?.outputs?.text) ||
              data.result,
            conversation_id: data.conversation_id
          }
        };
      }
      throw new Error(data.error_msg || '请求失败');
    }
  } catch (error) {
    return {
      code: 500,
      msg: error.message.replace(config.SECRET_KEY, '***')
    };
  }
};