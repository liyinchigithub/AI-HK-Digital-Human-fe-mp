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
	console.log('event : ', event);
	// 数据库对象 商品
	const goodsCollection = db.collection('goods');
	// 数据格式化
	classificationData.forEach(async (c) => {
		// 遍历每个分类的商品
		const goodsData = await goodsCollection
			.where({
				classificationID: c.classificationID
			})
			.get();
		// 遍历商品数据，放入goodsRes
		goodsData.forEach((g) => {
			goodsRes.push({
				label: g.goodsName,
				value: g.goodsName,
				goodsID: g._id,
				favourPrice: g.favourPrice,
				originalPrice: g.originalPrice,
				url: g.url,
				children: 'children' // 第三层暂不做，如：第一层品牌》第二层分类》第三层商品
			});
		});
	});

	console.log('classificationData forEach goodsRes', goodsRes);

	//返回数据给客户端
	return {
		code: 200,
		msg: '查询成功',
		data: {
			classificationData: classificationData
		}
	};
};
