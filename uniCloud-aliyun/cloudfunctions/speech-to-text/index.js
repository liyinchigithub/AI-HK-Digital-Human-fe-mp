'use strict';

const config = {
  API_KEY: 'iOXdRmCFAMVFHajQxfuPPGtU',
  SECRET_KEY: 'zzqOBWF49G0qPTwHgiLK3t8R2hvTtgtI',
  ASR_URL: 'https://vop.baidubce.com/server_api'
};

let tokenCache = {
  token: '',
  expires: 0
};

async function getAccessToken() {
  const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${config.API_KEY}&client_secret=${config.SECRET_KEY}`;

  try {
    const { status, data } = await uniCloud.httpclient.request(
      tokenUrl,
      {
        method: 'POST',
        dataType: 'json',
        timeout: 5000
      }
    );

    if (status === 200 && data.access_token) {
      return {
        token: data.access_token,
        expires: Date.now() + data.expires_in * 1000
      };
    }
    throw new Error(data.error_description || 'Token获取失败');
  } catch (error) {
    console.error('Token请求失败:', error);
    throw error;
  }
}

exports.main = async (event, context) => {
  try {
    // 获取文件内容
    const fileInfo = await uniCloud.getFileInfo({
      fileID: event.fileID
    });

    // 获取有效Token
    if (Date.now() > tokenCache.expires) {
      tokenCache = await getAccessToken();
    }

    // 调用百度语音识别接口
    const { status, data } = await uniCloud.httpclient.request(
      config.ASR_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/wav;rate=16000',
          'Authorization': `Bearer ${tokenCache.token}`
        },
        data: fileInfo.fileContent,
        dataType: 'json'
      }
    );

    if (data.err_no === 0) {
      return {
        code: 0,
        text: data.result[0]
      };
    }
    throw new Error(`语音识别失败: ${data.err_msg} (错误码: ${data.err_no})`);
  } catch (error) {
    console.error('语音识别错误:', error);
    return {
      code: 500,
      msg: error.message.replace(config.SECRET_KEY, '***')
    };
  }
};