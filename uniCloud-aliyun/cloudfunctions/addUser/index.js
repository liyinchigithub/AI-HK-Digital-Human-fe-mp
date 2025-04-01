'use strict';
const db = uniCloud.database()
const timestamp = Date.now();
console.log(timestamp);

/*
 * @description 新增一条用户记录（微信授权成功后）
 */
var res = 0
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 数据库对象
	const collection = db.collection('user')
	// 获取当前时间戳
	var timestamp = Date.parse(new Date());
	// 判断是否已存在
	var isExisit = await collection.where({
		"openID": eent.openID, // 微信openID
	}).get()
	console.log('isExisit : ', isExisit)

	if (isExisit.affectedDocs==0) {
		// 随机生成用户ID
		
		// 获取数据集合
		 res = await collection.add({
			"userID":`${timestamp}-${event.openID}`,// 用户ID（当前时间戳+微信openid）
			"openID": event.openID, // 微信openID
			"nickName": event.nickName, // 微信昵称
			"avatarUrl": event.avatarUrl, // 微信头像
			"phone": event.phone, // 添加手机号字段
			"pushClientid":event.pushClientid,// uni psuh 客户端标识
			"username": event.username,
			"level": event.level,
			"is_block_user": event.is_block_user,
			"isEnable": event.isEnable
			// "gender": event.userInfo.gender, // 微信性别
			// "language": event.userInfo.language, // 微信语言
			// "city": event.userInfo.city, // 微信城市
			// "province": event.userInfo.province, // 微信省份
			// "country": event.userInfo.country, // 微信国家
		})
		console.log("新用户，执行插入user表：", JSON.stringify(res))
		return {
			code: 200,
			msg: "插入成功",
			data: res
		}
	} else {
		console.log("用户已存在，不执行插入user表：")
		return {
			code: 203,
			msg: "失败",
			data: "已存在该用户"
		}
	}
};
