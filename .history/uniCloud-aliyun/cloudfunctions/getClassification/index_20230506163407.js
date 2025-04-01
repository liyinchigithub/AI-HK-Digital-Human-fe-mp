'use strict';
const db = uniCloud.database()
/*
 * @description 获取分类、分类所属商品
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 数据库对象
	const classTypeCollection = db.collection('classType')
	// 分类
	const classTypeRes = await classTypeCollection.where({
		"isEnable": event.isEnable
	}).get()
	//
	console.log(JSON.stringify(classTypeRes.data))
	// 查询分类的所有的商品
	var classificationData = [{
		label: '分类1',
		value: '分类1',
		classificationID: "",
		children: [{
			label: '',
			value: '',
			goodsID: "",
			favourPrice: 0,
			originalPrice: 0,
			url: "",
			children: 'children'
		}]
	}]

	// 数据库对象
	const goodsCollection = db.collection('goods')
	// 遍历每个分类中所有商品
	classTypeData.forEach(element => {
		var goodsRes =  goodsCollection.where({
			"classTypeID": element._id,
			"isEnable": event.isEnable
		}).get()
		//  
		console.log(JSON.stringify(goodsRes.data))
	});
	classificationData.push({

	})
	

	// 格式化为前端分类页数据格式




	//返回数据给客户端
	return {
		code: 200,
		msg: "查询成功",
		data: {
			"classTypeData": classTypeRes.data,
			"goodsData": goodsRes.data
		}
	}


};