'use strict';
const db = uniCloud.database()
/*
 * @description 评价
 * */
exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log('event : ', event)
  // 数据库对象
  const collection = db.collection('comments');
  const dbCmd=db.command;
  var res = 0;
  switch (event.methods) {
    case "addComments":
      console.log("新增评价")
      /**
       * 新增评价（管理页面操作）
       */
      break;
    case "getComments":
      console.log("评价列表")
      /**
       * 查询评价列表
       * 获取数据集合（分页查询）pageNum 第几页、pageSize 每页几个
       */
      res = await collection.where({
        "isEnable": event.isEnable,
      }).skip(event.pageNum * event.pageSize - event.pageSize).limit(event.pageSize).orderBy(
        "created",// created
        "desc").get()
      //返回数据给客户端
      return {
        code: 200,
          msg: "查询成功",
          data: res.data
      }
      break;
    case "getCommentsDetail":
      console.log("查询评价详情")
      /**
       * 查询评价详情
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
	case "getCommentsWorkerDetail":
	  console.log("查询师傅详情的评价")
	  /**
	   * 查询师傅详情的评价数据
	   */
	  // 获取数据集合（分页查询）pageNum 第几页、pageSize 每页几个
	  res = await collection.where({
	    "workerID": event.workerID,
	  }).skip(event.pageNum * event.pageSize - event.pageSize).limit(event.pageSize).orderBy(
        "created",// created
        "desc").get()
	
	  //返回数据给客户端
	  return {
	    code: 200,
	      msg: "查询成功",
	      data: res.data
	  }
	  break;
    case "deleteComments":
      console.log("删除评价")
      /**
       * 删除评价（逻辑删除）
       */
      res = await collection.doc(event._id).update({
        "isEnable": false
      });
      console.log(`res:${JSON.stringify(res)}`)
      if (res.affectedDocs == 1 && res.updated == 1) {
        return {
          code: 200,
          msg: "删除评价成功",
          data: {
            "result": true
          }
        }
      } else {
        return {
          code: 203,
          msg: "删除评价失败",
          data: {
            "result": false
          }
        }
      }
      break;
    default:
      /**
       * 其他
       */
      break;
  }




};