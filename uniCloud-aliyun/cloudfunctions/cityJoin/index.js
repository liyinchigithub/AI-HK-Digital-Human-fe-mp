'use strict';
const db = uniCloud.database()
const dbCmd = db.command;
/*
 * @description 城市加盟（商家）
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 数据库对象
	const collection = db.collection('merchant')
	switch (event.methods) {
		case "getMerchants":
			/**
			 * 查询商家列表
			 * 排序方式：sort 综合排序 0、orderNumber 订单量 1、favorited 被收藏  2、accumulatedIncome 累计收入 3
			 */
			var sort = "";
			// 判断排序方式 event.sortType
			switch (event.sortType) {
				case 0:
					sort = "sort";
					break;
				case 1:
					sort = "orderNumber";
					break;
				case 2:
					sort = "favorited";
					break;
				case 3:
					sort = "accumulatedIncome";
					break;
				default:
					break;
			}
			//查询数据库
			var res = await collection.where({
				"isEnable": event.isEnable,
			}).skip(event.pageNum * event.pageSize - event.pageSize).limit(event.pageSize).orderBy(sort,"desc").get()
			//查询结果
			console.log('res data: ', res.data)
			return {
				code: 200,
					data: res.data,
					message: "success"
			}
			break;

		case "getMerchantDetail":
			/**
			 * 查询商家详情
			 */
			// 获取数据集合（分页查询）pageNum 第几页、pageSize 每页几个
			res = await collection.where(dbCmd.and([{
				"_id": event.merchantID
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

		case "getMerchantSearch":
			/**
			 * 搜索商家
			 */
			res = await collection.where(dbCmd.and(
				[{
					"isEnable": event.isEnable
				}, {
					"merchantName": new RegExp(`[${event.merchantName}]`)

				}]
			)).orderBy("sort", "desc").get()

			//返回数据给客户端
			return {
				code: 200,
					msg: "查询成功",
					data: res.data
			}
			break;
		case "merchantIDSearch":
			/**
			 * ID查询商家
			 */
			res = await collection.where({"merchantID":event.merchantID}).orderBy("sort", "desc").get()
			
			//返回数据给客户端
			return {
				code: 200,
					msg: "查询成功",
					data: res.data
			}
			
			break;
		case "addMerchant":
			/**
			 * 新增商家
			 */
			case "addMerchant":
				// 检查手机号码是否已存在
				const existingMerchant = await collection.where({
					phone: event.phone
				}).get();
	
				if (existingMerchant.data.length > 0) {
					return {
						code: 400,
						msg: "该手机号已提交，请勿重复提交"
					};
				}
	
				// 新增商家
				res = await collection.add({
					city: event.city,
					phone: event.phone,
					merchantName: event.merchantName,
					username: event.merchantName,
					workerNumber: event.workerNumber,
					classType: event.classType,
					navigationAddress: event.navigationAddress,
					latitude: event.latitude,
					longitude: event.longitude,
					province: event.province,
					level: event.level,
					updated: Date.now(),// 当前时间戳
					created: Date.now(),// 当前时间戳
					remark:event.remark,
					isEnable: event.isEnable
				});
	
				console.log('res: ', res);
				if (res.id) {
					return {
						code: 200,
						msg: "新增成功",
						data: res
					};
				} else {
					return {
						code: 500,
						msg: "新增失败",
						data: res
					};
				}
				break;

		default:
			console.log("查询")
			/**
			 * 查询收藏列表
			 */
			break;
	}
};