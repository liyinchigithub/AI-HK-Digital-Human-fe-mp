'use strict';
const db = uniCloud.database()
const dbCmd = db.command;
/*
 * @description 商品（列表、详情、搜索）
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 数据库对象
	const collection = db.collection('goods')
	switch (event.methods) {
		case "getGoods":
			/**
			 * 查询商品列表
			 * 排序方式：排序方式：sort 综合排序 0、favourPrice 价格 1、salesVolume 销量 2 、goodReputation 好评度 3
			 */
			var sort = "";
			// 判断排序方式 event.sortType
			switch (event.sortType) {
				case 0:
					sort = "sort";
					break;
				case 1:
					sort = "favourPrice";
					break;
				case 2:
					sort = "salesVolume";
					break;
				case 3:
					sort = "goodReputation";
					break;
				default:
					break;
			}
			//查询数据库
			var res = await collection.where({
				"isEnable": event.isEnable,
			}).skip(event.pageNum * event.pageSize - event.pageSize).limit(event.pageSize).orderBy(sort,"desc").get()
			 // 获取总数据量
			 var total = await collection.where({
				"isEnable": event.isEnable,
			}).count()
			//查询结果
			console.log('res data: ', res.data)
			return {
				code: 200,
					data: res.data,
					total: total.total, // 返回总数据量
					message: "success"
			}
			break;
		case "getBrandGoods":
			/**
			 * 查询商品列表
			 */
			
			//查询数据库
			var res = await collection.where({
				"isEnable": event.isEnable,
				"brandID": event.brandID,
			}).skip(event.pageNum * event.pageSize - event.pageSize).limit(event.pageSize).orderBy("sort","desc").get()
			//查询结果
			console.log('res data: ', res.data)
			return {
				code: 200,
					data: res.data,
					message: "success"
			}
			break;
		case "getGoodsDetail":
			/**
			 * 查询商品详情
			 */
			// 获取数据集合（分页查询）pageNum 第几页、pageSize 每页几个
			res = await collection.where(dbCmd.and([{
				"_id": event.orderGoodsID
			}, {
				"isEnable": event.isEnable
			}])).get()
			console.log(JSON.stringify(res.data))

			//返回数据给客户端
			return {
				code: 200,
					msg: "查询成功",
					data: res.data
			}
			break;

		case "getGoodsSearch":
			/**
			 * 搜索商品
			 */
			res = await collection.where(dbCmd.and(
				[{
					"isEnable": event.isEnable
				}, {
					"title": new RegExp(`[${event.title}]`)

				}]
			)).orderBy("sort", "desc").get()

			//返回数据给客户端
			return {
				code: 200,
					msg: "查询成功",
					data: res.data
			}
			break;
		case "classificationIDSearchGoods":
			/**
			 * 分类id查询商品
			 */
			res = await collection.where({"classTypeID":event.classificationID}).orderBy("sort", "desc").get()
			
			//返回数据给客户端
			return {
				code: 200,
					msg: "查询成功",
					data: res.data
			}
			
			break;
		case "brandIDSearchGoods":
			/**
			 * 品牌id查询商品
			 */
			res = await collection.where({"brandID":event.brandID}).orderBy("sort", "desc").get()
			
			//返回数据给客户端
			return {
				code: 200,
					msg: "查询成功",
					data: res.data
			}
			
			break;
		case "addGoods":
			/**
			 * 新增商品
			 */
			break;

		default:
			console.log("查询")
			/**
			 * 查询收藏列表
			 */
			break;
	}
};