'use strict';
const db = uniCloud.database(); // 云数据库对象
const crypto = require('crypto');

// 微信手机号授权登录
exports.main = async (event, context) => {
	let js_code = event.code; // 客户端入参
	const appid = 'wx9d6bd1da77d1287f'; // appid
	const secret = 'd70fc8a88a953d6593bfd8a2005733bd'; // secret
	const loginUrl = 'https://api.weixin.qq.com/sns/jscode2session';
	
	let res = await uniCloud.httpclient.request(loginUrl, {
		method: 'GET',
		data: {
			appid: appid,
			secret: secret,
			js_code: js_code,
			grant_type: 'authorization_code'
		},
		contentType: 'json',
		dataType: 'json'
	});
	
	console.log('微信接口返回数据:', res.data); // 调试输出，请求结果
	
	const session_key = res.data.session_key;
	const { encryptedData, iv } = event;
	
	console.log('解密前数据:', { encryptedData, iv, session_key });
	
	const phoneNumber = decryptPhoneNumber(encryptedData, iv, session_key);
	
	return {
		openid: res.data.openid,
		session_key: session_key,
		phoneNumber: phoneNumber // 返回手机号码
	};
};

// 解密手机号码的函数
function decryptPhoneNumber(encryptedData, iv, session_key) {
	try {
		const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(session_key, 'base64'), Buffer.from(iv, 'base64'));
		decipher.setAutoPadding(true);
		let decoded = decipher.update(Buffer.from(encryptedData, 'base64'), 'binary', 'utf8');
		decoded += decipher.final('utf8');
		const decodedData = JSON.parse(decoded);
		console.log('Decoded Data:', decodedData);
		return decodedData.phoneNumber;
	} catch (err) {
		console.error('解密失败:', err);
		return null;
	}
}