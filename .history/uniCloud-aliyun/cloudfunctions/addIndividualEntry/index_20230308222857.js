'use strict';
const db = uniCloud.database();
/*
 * @description 新增一条用户登录记录（微信授权成功后）
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event);
	// 数据库对象
	const collection = db.collection('individualEntry');
	// 获取当前时间戳
	var timestamp = Date.parse(new Date());
	// 查询是否已入驻、入驻审核中
	const dbCmd = db.command;
	const isExisit = await collection.where({
		phone: dbCmd.eq(event.phone),
		idcard: dbCmd.eq(event.idcard)
	});

	if (isExisit.data.length > 0) {
		return {
			code: 500,
			msg: '已入驻或入驻审核中'
		};
	} else {
		// 插入数据
		const res = await collection.add({
			username: event.username,
			gender: event.gender,
			phone: event.phone,
			idcard: event.idcard,
			username: event.username,
			mark: event.mark,
			images: event.images,
			category: event.category,
			isEnable: event.isEnable
		});
		console.log(JSON.stringify(res.data));
		//返回数据给客户端
		if (res.id) {
			return {
				code: 200,
				msg: '插入成功',
				data: res
			};
		} else {
			return {
				code: 203,
				msg: '插入失败',
				data: res
			};
		}
	}
};
