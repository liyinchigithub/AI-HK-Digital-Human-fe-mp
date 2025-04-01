<template>
	<!-- 平台入驻服务协议 -->
	<view>
		<!-- 遮罩层 -->
		<u-overlay :show="maskShow" @click="maskShow = false"></u-overlay>
		<view style="margin-top: 5%;margin-bottom: 5%;margin-left: 5%;margin-right: 5%;">
			<view class="" v-for="(item,index) in list">
				<!-- 标题 -->
				<text> {{item.title}}</text>
				<!-- 内容 -->
				<text> {{item.content}}</text>
			<u-divider text="分割线" :dot="true"></u-divider>	
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				maskShow: false,
				list:[],
				title: "", // 协议条款标题
				content: "", // 协议条款内容
			}
		},
		methods: {
			// 入驻说明
			getArticlesAgreementDetail() {
				var that = this;
				uniCloud.callFunction({
					name: "getArticlesAgreementDetail",
					data: {
						"method":"settleInAgreement",
						"isEnable":true
					},
					success: (res) => {
						console.log("getArticlesAgreementDetail res.result.data:", res.result.data)
						that.list=res.result.data;
						// that.title = res.result.data[0].title;
						// that.content = res.result.data[0].content;
					}
				})
			}
		},
		onLoad() {
			// 当前页面
			console.log(`当前页面:articlesAgreement`)
			// 获取协议条款内容数据
			this.getArticlesAgreementDetail()
		},
		// uniapp微信小程序分享页面到微信好友
		onShareAppMessage() {
			// TODO	读取缓存分享人ID
			return {
				title: '师傅服务平台-用户端',
				path: `/pages/business/settleInAgreement/settleInAgreement` //分享的页面路径
			}
		},
		// uniapp微信小程序分享页面到微信朋友圈
		onShareTimeline() {
			return {
				title: '师傅服务平台-用户端 ',
				path: '/pages/business/settleInAgreement/settleInAgreement', //分享的页面路径
				query: ``,
				imageUrl: 'https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/c89fedc8-0f75-4e8e-b151-ce90a17e7ce3.jpg',
			}
		},
	}
</script>

<style>

</style>