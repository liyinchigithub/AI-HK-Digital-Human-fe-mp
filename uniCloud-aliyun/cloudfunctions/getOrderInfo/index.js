'use strict';
/*
 * @description 获取微信支付订单
 */
// const unipay = require('unipay') // 会报错: MODULE_NOT_FOUND:Cannot find module 'unipay'   
const unipay = require('uni-pay')
const fs =require("fs")
// console.log(fs.readFileSync(__dirname))
const unipayIns = unipay.initWeixin({
   appId: 'wx9d6bd1da77d1287f', //小程序appid
   mchId: '1559134041', //微信商户号
   key: 'Ypjlovefzh11314520ypjlovefzh1131',// 商户号的API密钥
   pfx: fs.readFileSync('/wxpay'), 
//    pfx: fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书 p12文件路径，使用微信退款时需要，需要注意的是阿里云目前不支持以相对路径读取文件，请使用绝对路径的形式
})
exports.main = async (event, context) => {
   //event为客户端上传的参数
   let orderInfo = await unipayIns.getOrderInfo({
      openid: event.openid, //这个是客户端上传的用户的openid
      subject: event.subject, // 订单名称微信支付时不可填写此项
      body: '测试商品',
      outTradeNo: event.outTradeNo, //给他个随机号让他可以第二次发起支付
      totalFee: event.totalFee, // 金额，单位元,在上传过来的时候就已经*100了
      notifyUrl: 'https://xxxx.net/PayResult', // 支付结果通知地址
      attach: event.attach, //备注,订单号或 长者id 在下一步通知中判断长度来确定
   })
   return { orderInfo }
  
};