'use strict';
/**
 * 此处建议只改下订单状态，保证能及时返回给第三方支付服务器成功状态
 * 限制4秒内必须执行完全部的异步回调逻辑，建议将消息发送、返佣、业绩结算等业务逻辑异步处理（如用定时任务去处理这些异步逻辑）
 * 特别注意：因为金额是前端传的，需要再判断下金额和你业务系统订单中的金额是否一致，如果不一致，直接返回 return false;
 * 特别注意：因为金额是前端传的，需要再判断下金额和你业务系统订单中的金额是否一致，如果不一致，直接返回 return false;
 * 特别注意：因为金额是前端传的，需要再判断下金额和你业务系统订单中的金额是否一致，如果不一致，直接返回 return false;
 */
module.exports = async (obj) => {
	let user_order_success = true;
	let { data = {} } = obj;
	let {
		order_no,
		out_trade_no,
		total_fee,
		custom = {}
	} = data; // uni-pay-orders 表内的数据均可获取到

	// 此处写你自己的支付成功逻辑开始-----------------------------------------------------------
	// 方式一：直接写数据库操作
	// 此处只是简单演示下，实际数据库语句会更复杂一点。
	const db = uniCloud.database();
	const _ = db.command;
	// 获取你的业务订单信息
	let orderRes = await db.collection("order").where({ "orderNo":order_no }).get();
	let orderInfo = orderRes.data[0];
	// 给用户充值余额（此处没有判断total_fee是否和你业务订单的金额一致，正常需要判断下，不过如果是充值余额，则直接按用户付款的金额充值也没问题）
	let res = await db.collection("uni-id-users").doc(orderInfo.user_id).update({
	  balance: _.inc(total_fee)
	});
	if (res && res.updated) {
		user_order_success = true; // 通知插件我的自定义回调逻辑执行成功
	} else {
		user_order_success = false; // 通知插件我的自定义回调逻辑执行失败
	}
	// 方式二：使用 await uniCloud.callFunction 调用其他云函数
	// 方式三：使用 await uniCloud.httpclient.request 调用http接口地址
	
	// 此处写你自己的支付成功逻辑结束-----------------------------------------------------------
	return user_order_success;
};
