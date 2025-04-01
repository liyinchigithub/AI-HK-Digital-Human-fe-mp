'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
/*
 * @description 地址列表数据
 */
var res = 0;
var isExist = 0;
exports.main = async (event, context) => {
	try {
		//event为客户端上传的参数
		console.log('event : ', event);
		// 数据库对象
		const collection = db.collection('collect');

		// 判断请求方法
		switch (event.method) {
			case 'addCollect':
				console.log('新增');
				/**
				 * 新增收藏
				 */
				// 查询用户是否收藏过，收藏过则不执行插入
				isExist = await collection
					.where(
						dbCmd.and([
							{
								goodsID: event.goodsID
							},
							{
								openID: event.openID
							},
							{
								userID: event.userID
							}
						])
					)
					.get();
				console.log(`isExist:${isExist}`);
				// 如果查询不到数据，则执行插入
				if (isExist.data.length == 0) {
					console.log('未收藏过，执行收藏');
					res = await collection.add({
						isEnable: true,
						openID: event.openID,
						userID: event.userID,
						goodsID: event.goodsID,
						goodsName: event.goodsName,
						goodsImage: event.goodsImage,
						created: Date.parse(new Date()),
						updated: Date.parse(new Date())
					});
					return {
						code: 200,
						msg: '收藏成功',
						data: {
							isCollected: true
						}
					};
				} else {
					return {
						code: 200,
						msg: '收藏失败，已收藏过',
						data: {
							isCollected: false
						}
					};
				}

				break;
			case 'deleteCollect':
				console.log('删除');
				/**
				 * 删除收藏
				 */
				//event为客户端上传的参数
				console.log('event : ', event);
				// 数据库对象

				res = await collection
					.doc(event._id).updated({
						isEnable: false,
                        updated: Date.parse(new Date())
					})
				console.log(`res:${res}`);
				if (res.affectedDocs == 1 && res.updated == 1) {
					return {
						code: 200,
						msg: '移除收藏成功',
						data: {
							isCollected: false
						}
					};
				} else {
					return {
						code: 203,
						msg: '移除收藏失败',
						data: {
							isCollected: true
						} // 保持不变
					};
				}

				break;
			case 'getMyCollect':
				console.log('查询');
				/**
                 * 查询我的收藏列表
                 */
				res = await collection
					.where({
						openID: event.openID,
						userID: event.userID,
						isEnable: event.isEnable,

					})
					.skip(event.pageNum * event.pageSize - event.pageSize)
					.limit(event.pageSize)
					.get();
				// 返回数据给客户端

				return {
					code: 200,
					msg: '查询成功',
					data: res.data
				};
				break;
				
			default:
				console.log('查询');
				/**
				 * 查询收藏列表
				 */
				break;
		}
	} catch (e) {
		console.log(e);
		return {
			code: 203,
			msg: '失败',
			data: e
		};
	}
};
