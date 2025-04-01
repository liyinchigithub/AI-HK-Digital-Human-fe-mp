'use strict';
const db = uniCloud.database()
var res1 = "";
var res2 = "";
var res3 = "";
/*
 * @description 更改用户信息
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event.avatarUrl);
	console.log('event : ', event.nickName);
	console.log('event : ', event.gender);
	// 数据库对象
	const collection = db.collection('user');

	if (event.avatarUrl != undefined || event.avatarUrl != "") {
		res1 = await collection
			.where({
				openID: event.openID
			}).update({
				avatarUrl: event.avatarUrl,
			})
	}

	if (event.nickName != undefined || event.nickName != "") {
		res2 = await collection
			.where({
				openID: event.openID
			}).update({
				nickName: event.nickName,
			})
	}

	if (event.gender != undefined || event.gender != "") {
		res3 = await collection
			.where({
				openID: event.openID
			}).update({
				gender: event.gender,
			})
	}

	//返回数据给客户端
	return {
		code: 200,
		msg: '更新成功',
		data: {
			updateAvatar: res1,
			updateNickname: res2,
			updateGender: res3
		}
	};
};