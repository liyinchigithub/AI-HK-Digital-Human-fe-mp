'use strict';
const db = uniCloud.database()
/*
 * @description 优惠券(新增、列表、删除、详情)
 * */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 数据库对象
	const collection = db.collection('coupon');
	const dbCmd=db.command;
	var res = 0;
	switch (event.method) {
		case "addCoupon":
			console.log("新增优惠券")
			/**
			 * 新增优惠券
			 */
			break;
		case "getCoupon":
			console.log("查询用户优惠券列表")
			/**
			 * 查询用户优惠券列表
			 * 获取数据集合（分页查询）pageNum 第几页、pageSize 每页几个
			 */
			res = await collection.where({
				"isEnable": event.isEnable,
				"openID": event.openID,
			}).skip(event.pageNum * event.pageSize - event.pageSize).limit(event.pageSize).orderBy(
				"created",
				"desc").get()
			//返回数据给客户端
			return {
				code: 200,
					msg: "查询成功",
					data: res.data
			}
			break;
		case "getCouponDetail":
			console.log("查询优惠券详情")
			/**
			 * 查询优惠券详情
			 */
			// 获取数据集合（分页查询）pageNum 第几页、pageSize 每页几个
			res = await collection.where({
				"_id": event._id,
			}).get()

			//返回数据给客户端
			return {
				code: 200,
					msg: "查询成功",
					data: res.data
			}
			break;
		case "deleteCoupon":
			console.log("删除优惠券")
			/**
			 * 删除优惠券（逻辑删）
			 */
			res = await collection.doc(event._id).update({
				"isEnable": false
			});
			console.log(`res:${JSON.stringify(res)}`)
			if (res.affectedDocs == 1 && res.updated == 1) {
				return {
					code: 200,
					msg: "删除优惠券成功",
					data: {
						"result": true
					}
				}
			} else {
				return {
					code: 203,
					msg: "删除优惠券失败,券已失效",
					data: {
						"result": false
					}
				}
			}
			break;
		default:
			/**
			 * 查询用户优惠券列表
			 */
			break;
	}




};