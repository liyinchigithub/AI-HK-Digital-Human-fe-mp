'use strict';
const db = uniCloud.database();

/*
 * @description 获取分类、分类所属商品
 */
exports.main = async (event, context) => {
	// 最终返回的数据
	var goodsRes = [];
	//
	var classificationData = event.classificationData;
	//event为客户端上传的参数
	console.log('classificationData event : ', event);
	// 数据库对象 商品
	const goodsCollection = db.collection('goods');
	// 数据格式化
	// 遍历分类数据

	console.log('classificationData forEach goodsRes', goodsRes);

	//返回数据给客户端
	return {
		code: 200,
		msg: '查询成功',
		data: {
			goodsRes: goodsRes
		}
	};
};
