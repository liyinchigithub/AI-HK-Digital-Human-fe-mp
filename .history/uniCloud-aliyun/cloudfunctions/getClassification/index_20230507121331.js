'use strict';
const db = uniCloud.database();

/*
 * @description 获取分类、分类所属商品
 */
exports.main = async (event, context) => {
	var goodsRes = [];
	var classificationData = [];
	//event为客户端上传的参数
	console.log('event : ', event);
	// 数据库对象 分类
	const classTypeCollection = db.collection('classType');
	// 数据库对象 商品
	const goodsCollection = db.collection('goods');
	// 分类
	const classTypeRes = await classTypeCollection
		.where({
			isEnable: event.isEnable
		})
		.get();
	//
	console.log("classTypeRes.data:",JSON.stringify(classTypeRes.data));
	var classTypeResData=classTypeRes.data
	classTypeResData.forEach(async (c) => {
		classificationData.push({
			label: c.classTypeName,
			value: c.classTypeName,
			classificationID: c._id,
			children: []
		});
		console.log("classTypeResData forEach classTypeName：",c.classTypeName)
		console.log("classTypeResData forEach c._id：",c._id)
		// 根据ID请求商品数据
		goodsRes =await goodsCollection
			.where({
				"classTypeID": c._id,
				"isEnable": event.isEnable
			})
			.get();
		// 注意这边需要使用await
		await console.log('goodsRes.data：', JSON.stringify(goodsRes.data));
		// 判断是否没有该分类的商品
		if (goodsRes.data.length != 0) {
		// 遍历每个分类中所有商品
		for (let i = 0; i < goodsRes.data.length; i++) {
			classificationData.forEach(async(item) => {
				if (item.classificationID == goodsRes.data[i].classificationID) {
					// 注意这边需要使用await
					// 商品数据放入数组元素对象中
					await item.children.push({
						label: goodsRes.data[i].goodsName,
						value: goodsRes.data[i].goodsName,
						goodsID: goodsRes.data[i]._id,
						favourPrice: goodsRes.data[i].favourPrice,
						originalPrice: goodsRes.data[i].originalPrice,
						url: goodsRes.data[i].url,
						children: 'children'
					});
				}
				await console.log("item.classificationID:",item.classificationID)
				await console.log("goodsRes.data[i].classificationID:",goodsRes.data[i].classificationID)
			});
		}
		//返回数据给客户端
		return {
			code: 200,
			msg: '查询成功',
			data: {
				classificationData: classificationData
			}
		};
	} else {
		
	}
	});
	// 查询分类的所有的商品
	// var classificationData = [{
	// 	label: '分类1',
	// 	value: '分类1',
	// 	classificationID: "",
	// 	children: [{
	// 		label: '',
	// 		value: '',
	// 		goodsID: "",
	// 		favourPrice: 0,
	// 		originalPrice: 0,
	// 		url: "",
	// 		children: 'children'
	// 	}]
	// }]
};
