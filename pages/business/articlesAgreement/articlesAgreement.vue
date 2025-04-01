<template>
	<!-- 协议条款页 -->
	<view>
		<!-- 遮罩层 -->
		<u-overlay :show="maskShow" @click="maskShow = false"></u-overlay>
		<!-- 标题 -->
		<text> {{title}}</text>
		<!-- 内容 -->
		<text> {{content}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				maskShow:false,
				title:"",// 协议条款标题
				content:"",// 协议条款内容
			}
		},
		methods: {
			getArticlesAgreementDetail(){
				var that=this;
				uniCloud.callFunction({
					name:"getArticlesAgreementDetail",
					data:{
						isEnable:true
					},
					success: (res) => {
						console.log("res.result.data:",res.result.data)
						that.title=res.result.data[0].title;
						that.content=res.result.data[0].content;
					}
				})
			}
		},
		onLoad() {
			// 当前页面
			console.log(`当前页面:articlesAgreement`)
			// 获取协议条款内容数据
			this.getArticlesAgreementDetail()
		}
	}
</script>

<style>

</style>
