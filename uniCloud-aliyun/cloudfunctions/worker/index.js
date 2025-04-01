'use strict';
const db = uniCloud.database()
const dbCmd = db.command;
/*
 * @description 师傅
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 数据库对象
	const collection = db.collection('worker')
	switch (event.methods) {
		case "getWorkers":
			/**
			 * 查询师傅列表
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
					sort = "created";
					break;
			}
			//查询数据库
			var res = await collection.where({
				"cityID":event.cityID,
				"auditStatus":2,// 审核通过
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

		case "getWorkersDetail":
			/**
			 * 查询师傅详情
			 */
			// 获取数据集合（分页查询）pageNum 第几页、pageSize 每页几个
			res = await collection.where(dbCmd.and([{
				"_id": event.workerID
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

		case "getWorkersSearch":
			/**
			 * 搜索师傅
			 */
			res = await collection.where(dbCmd.and(
				[{
					"isEnable": event.isEnable
				  }, {
					"auditStatus": 2 // 只搜索审核通过的师傅
				  }, {
					"username": new RegExp(`[${event.username}]`)
				  }]
			)).orderBy("sort", "desc").get()

			//返回数据给客户端
			return {
				code: 200,
					msg: "查询成功",
					data: res.data
			}
			break;
		case "workersIDSearch":
			/**
			 * 工号查询师傅
			 */
			res = await collection.where({"workerID":event.workerID}).orderBy("sort", "desc").get()
			
			//返回数据给客户端
			return {
				code: 200,
					msg: "查询成功",
					data: res.data
			}
			
			break;
		case "addWorkers":
			/**
			 * 新增师傅
			 */
			res = await collection.where({
				"phone": event.phone
			}).get()
			// 判断数据库是否存在该师傅
			if (res.data.length > 0) {
				return {
					code: 500,
						msg: "该师傅已存在",
						data: res.data
				}
			}
			res = await collection.add({
				username: event.username,
				phone: event.phone,
				age: event.age,
				gender: event.gender=="男"?1:2,// 判断如果性别为男值1，女值2
				city: event.city,
				avatarUrl:"",// 头像（职业照）
				balance: 0,// 余额
				contactAddress:"",// 联系地址
				residentAddress:"",// 居住地址
				latitude:"",// 纬度
				longitude:"",// 经度
				IDFront:"",// 身份证正面
				IDReverse:"",// 身份证反面
				IDReverse:"",// 身份证反面
				skillCertificate:[],// 技能证书
				workPhoto:[],// 工作照片（职业照）
				lifePhoto:[],// 生活照片
				registrationPhoto:event.registrationPhoto,// 报名时所用照片
				auditStatus:1,// 1审核中 2审核通过 3审核不通过
				businessID:"",// 所属商家 0为非商家下的师傅
				updated: Date.now(),// 当前时间戳
				created: Date.now(),// 当前时间戳
			})
			console.log('res: ', res)
			// 判断是否新增成功
			if (res.id) {
				return {
					code: 200,
						msg: "新增成功",
						data: res.data
				}
			}else{
				return {
					code: 500,
						msg: "新增失败",
						data: res.data
				}
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