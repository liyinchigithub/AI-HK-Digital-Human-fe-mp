'use strict';
const db = uniCloud.database();

/*
 * @description 获取分类、分类所属商品
 */
exports.main = async (event, context) => {
	// 最终返回的数据
	var goodsRes = [];
	// 
	var classificationData=event.classificationData
	//event为客户端上传的参数
	console.log('event : ', event);
	// 数据库对象 商品
	const goodsCollection = db.collection('goods');
	// 数据格式化
	classTypeResData.forEach(async (c) => {
		// 遍历每个分类的商品
		const goodsRes = await goodsCollection
			.where({
				classificationID: c._id
			}).get();
		// 第一层
		goodsRes.push({
			label: c.classTypeName,
			value: c.classTypeName,
			classificationID: c._id,
			children: []
		});
		console.log("classTypeResData forEach classTypeName：", c.classTypeName)
		console.log("classTypeResData forEach c._id：", c._id)

	});
	//返回数据给客户端
	return {
		code: 200,
		msg: '查询成功',
		data: {
			classificationData: classificationData
		}
	};
	
};