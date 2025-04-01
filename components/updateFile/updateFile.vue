<template>
	<view>
		<!-- 文件上传 -->
		<uni-file-picker v-model="imageValue" :title="title" :fileMediatype="fileMediatype" :mode="mode"
			:auto-upload="true" :file-extname="['png','jpg','jpeg']" :limit="limit" @select="select" @progress="progress"
			@success="success" @fail="fail"></uni-file-picker>
	</view>
</template>

<script>
	export default {
		name: "updateFile",
		props: {

		},
		data() {
			return {
				fileMediatype: "image", // 选择文件类型,all 只支持 H5 和微信小程序平台（image/video/all）
				mode: "grid", // 选择文件后的文件列表样式（list/grid）
				imageValue: [], // 存放上传云存储返回存储路径url
				limit: 2, // 限制数量
				title: "这是title", // 组件标题，右侧显示上传计数
			};
		},
		methods: {
			// 获取上传状态
			select(e) {
				console.log('选择文件：', e)
				// 无需再调用云存储（客户端文件上传）
				this.imageValue.push(e.tempFiles[0].url);
				console.log('this.imageValue：', JSON.parse(JSON.stringify(this.imageValue)))
			},
			// 获取上传进度
			progress(e) {
				console.log('上传进度：', e)
			},
			// 上传成功
			success(e) {
				console.log('上传成功')
			},

			// 上传失败
			fail(e) {
				console.log('上传失败：', e)
			}
		}
	}
</script>

<style>

</style>
