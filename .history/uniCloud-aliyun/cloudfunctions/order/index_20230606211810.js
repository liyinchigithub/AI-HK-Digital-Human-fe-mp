'use strict';


const db = uniCloud.database()
/*
 * @description 订单列表数据
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	var res = 0;
	// 数据库对象
	const collectionOrder = db.collection('order')
	const collectionGoods = db.collection('goods')
	// 获取当前时间戳
	var timestamp = Date.parse(new Date());
	switch (event.method) {
		case "getOrderList":
			/**
			 * 个人订单列表
			 * @@param openID {string}
			 * @param userID {string}
			 * @param 分页查询 pageNum 第几页
			 * @param 分页查询 pageSize 每页几个
			 */
			if (event.isAllStatus == true) { // 判断是否查询所有状态的订单数据
				res = await collectionOrder.where({
					"openID": event.openID,
					"userID": event.userID
				}).skip(event.pageNum * event.pageSize - event.pageSize).limit(event.pageSize).orderBy("created","desc").get()
				// 返回数据给客户端

				return {
					code: 200,
					msg: "查询成功",
					data: res.data
				}
			} else {
				// 根据订单状态查询
				res = await collectionOrder.where({
					"openID": event.openID,
					"userID": event.userID,
					"orderStatus": event.orderStatus, // 订单状态：0-全部、1-已付款、2-退款中、3-已退款、4-已完成、5-待评价、6-待付款
				}).skip(event.pageNum * event.pageSize - event.pageSize).limit(event.pageSize).orderBy("created","desc").get()
				console.log(JSON.stringify(res.data))
				//返回数据给客户端
				return {
					code: 200,
					msg: "查询成功",
					data: res.data
				}
			}

			break;
		case "createOrder":
			/**
			 * 创建订单
			 */
			// 获取当前时间戳
			var timestamp = Date.parse(new Date());
			// 后端根据商品ID，查询商品数据库，获取商品信息（不取前端传入参数）
			var goodsInfoRes = await collectionGoods.doc(event.orderGoodsID).get()
			console.log("createOrder 客户端申请创建订单的商品ID：", goodsInfoRes.data)
			// todo 查询用户可用优惠方式

			// todo 用户选择使用的优惠方式

			// todo 优惠方式是否一致（是否可用）

			// 根据后端查询商品数据来创建订单
			res = await collectionOrder.add({
				"orderGoodsID": goodsInfoRes.data[0]._id, // 商品ID(订单编号)
				"orderGoodsName": goodsInfoRes.data[0].title, // 商品名称
				"orderGoodsCount": event.orderGoodsCount, // 商品数量
				"orderType": event.orderType, // 订单类型（1-普通商品订单、2-服务商品订单）
				"orderStatus": 6, // 订单状态：0-全部、1-已付款、2-退款中、3-已退款、4-已完成、5-待评价、6-未付款（默认）
				"orderOriginalAmount": goodsInfoRes.data[0].originalPrice, // 原价
				"orderCurrentAmount": goodsInfoRes.data[0].favourPrice, // 现价
				"orderDiscountAmount":goodsInfoRes.data[0].originalPrice-goodsInfoRes.data[0].favourPrice, // 优惠金额(原价-现价)
				"amountPayable": (goodsInfoRes.data[0].favourPrice) * event
					.orderGoodsCount, // 应付金额（现价*商品数量）
				"actualAmountPaid": event.actualAmountPaid, // 实际支付金额
				"orderPayType": 1, // 支付方式（1-微信）
				"discountMethod": 0, // 优惠方式：0-无、1-优惠券、2-积分、3-会员卡打折
				"isAssociatedBookingSheet": event.orderType == 1 ? false :
				true, // 是否关联预约单
				"reservationID": goodsInfoRes.data[0].isAssociatedBookingSheet == false ? 0 : event
					.reservationID, // 预约记录ID(isAssociatedBookingSheet为false时，reservationID为0)
				// "useCouponID":event.useCouponID,// 使用优惠券ID（为空则表示没有使用优惠券）
				"openID": event.openID, // 微信用户ID
				"userID": event.userID, // 用户ID
				"created": (new Date()).valueOf(), // 创建订单时间
				// "expectedAppointmentDateTime": event.expectedAppointmentDateTime, // 期望预约日期时间-关联预约单
				// "actualAppointmentDateTime": event.actualAppointmentDateTime, // 实际上门服务日期时间-关联预约单
				"isPaid": false, // 是否已支付（微信支付成功后recharge.js才会更改订单编号的订单支付状态）
				"isEnable": true,
				"orderNo":event.orderNo,// 微信支付订单编号
				// todo 佣金方案
			})
			console.log(JSON.stringify(res.data))
			//返回数据给客户端
			// 判断插入结果
			if (res !== {}) {
				return {
					code: 200,
					msg: "插入成功",
					data: res
				}

			} else {
				//返回数据给客户端
				return {
					code: 203,
					msg: "插入失败",
					data: res
				}

				// }
			}
			break;
		case "getOrderDetail":
			/**
			 * 订单号查询订单详情
			 */
			res = await collectionOrder.where({
				"_id": event.orderID
			}).get()
			console.log(JSON.stringify(res.data))

			//返回数据给客户端
			return {
				code: 200,
					msg: "查询成功",
					data: res.data
			}
			break;
		default:
			/**
			 * 
			 */
			break;
	}

};