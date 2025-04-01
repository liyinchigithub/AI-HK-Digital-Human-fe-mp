// 云函数入口文件
'use strict';
const db = uniCloud.database();
/**
 * 意见反馈
*/

exports.main = async (event, context) => {
	const { description, phone, photos, openID } = event;

	try {
		const res = await db.collection('feedback').add({
			phone,
			content: description,
			feedbackImage: photos,
			openID: openID,
			feedbackStatus: 1,
			created: new Date(),
			updated: new Date(),
			isEnable: true
		});
		return {
			code: 200,
			message: '提交成功',
			data: res
		};
	} catch (error) {
		return {
			code: 500,
			message: '提交失败',
			error
		};
	}
};