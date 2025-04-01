'use strict';
const db = uniCloud.database()
/*
 * @description 地址（新增、编辑、删除、列表、搜索）
 */
var res = 0
exports.main = async (event, context) => {
	try {
		//event为客户端上传的参数
		console.log('event : ', event)
		// 数据库对象
		const collection = db.collection('address');
		// 判断请求参数方法（获取地址列表、新增地址、删除地址、修改地址）
		switch (event.method) {
			// 新增地址
			case "addAddress":
				res = await collection.add({
					"userID": event.userID,
					"openID": event.openID,
					"deliveryAddress": event.deliveryAddress,
					"addressee": event.addressee,
					"phone": event.phone,
					"isEnable": event.isEnable,
				})
				console.log("res:", res)
				console.log(JSON.stringify(res.data))
				//返回数据给客户端
				return {
					code: 200,
						msg: "新增成功",
						data: res
				}
				break;
			case "deleteAddress":
				// 删除地址(逻辑 删除)
				res = await collection.doc(event._id).update({
					isEnable: false
				})
				console.log("res:", res)
				console.log(JSON.stringify(res.data))
				//返回数据给客户端
				return {
					code: 200,
						msg: "删除成功",
						data: res
				}
				break;
			case "updateAddress":
				// 修改地址
				res = await collection.doc(
					event._id
				).update({
					"deliveryAddress": event.deliveryAddress,
					"addressee": event.addressee,
					"phone": event.phone
				})
				console.log("res:", res)
				console.log(JSON.stringify(res.data))
				//返回数据给客户端
				return {
					code: 200,
						msg: "修改成功",
						data: res
				}
				break;
			case "searchAddress":
				// 获取数据集合
				res = await collection.doc(event._id).get()
				console.log("res:", res)
				console.log(JSON.stringify(res.data))
				//返回数据给客户端
				return {
					code: 200,
						msg: "查询成功",
						data: res.data
				}
				break;
			case "getAddress":
				// 获取数据集合
				res = await collection.where({
						"openID": event.openID,
						// "userID": event.userID,
						"isEnable": event.isEnable
					}).skip(event.pageNum * event.pageSize - event.pageSize)
					.limit(event.pageSize).get()
				console.log("res:", res)
				console.log(JSON.stringify(res.data))
				//返回数据给客户端
				return {
					code: 200,
						msg: "查询成功",
						data: res.data
				}
				break;
			default:
				// 获取数据集合
				res = await collection.where({
					"openID": event.openID,
					// "userID": event.userID,
					"isEnable": event.isEnable,
				}).get()
				console.log("res:", res)
				console.log(JSON.stringify(res.data))
				//返回数据给客户端
				return {
					code: 200,
						msg: "查询成功",
						data: res.data
				}
				break;
		}


	} catch (e) {
		//TODO handle the exception
		console.log(e)
		return {
			code: 203,
			msg: "失败",
			data: e
		}
	}

};