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
	for (var i = 0; i < classificationData.length; i++) {
		// 查询分类的所有的商品
		var goodsResData = await goodsCollection
			.where({
				classificationID: classificationData[i].classificationID
			})
			.get();
		//  遍历每个分类的商品，放入数组中
		for (var j = 0; j < goodsResData.data.length; j++) {
			goodsRes.push({
				label: goodsResData.data[j].goodsName,
				value: goodsResData.data[j].goodsName,
				goodsID: goodsResData.data[j]._id,
				favourPrice: goodsResData.data[j].favourPrice,
				originalPrice: goodsResData.data[j].originalPrice,
				url: goodsResData.data[j].url,
				children: []
			});
		}
	}

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
