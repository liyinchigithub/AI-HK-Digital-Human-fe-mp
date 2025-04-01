<template>
	<view class="">
		<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
		<u--form labelPosition="top" :model="formData" :rules="rules" ref="form">
			<uni-card :is-shadow="true" is-full>
				<!-- <uni-section title="发布标题" type="line"></uni-section> -->
				<u-form-item label="标题" required labelWidth="200" prop="userInfo.title" borderBottom ref="item1">
					<u--input width="50" clearable v-model="formData.userInfo.title" border="surround"
						@clear="clearInputTitle"></u--input>
				</u-form-item>
			</uni-card>
			<uni-card :is-shadow="true" is-full>
				<!-- <uni-section title="内容" type="line"></uni-section> -->
				<u-form-item label="您的需求内容" required labelWidth="200" prop="userInfo.content" borderBottom ref="item1">
					<u--textarea count autoHeight border="surround" v-model="formData.userInfo.content"
						placeholder="请输入"></u--textarea>
				</u-form-item>
			</uni-card>
			<uni-card :is-shadow="true" is-full>
				<u-form-item label="联系手机" required labelWidth="200" prop="userInfo.phone" borderBottom ref="itemPhone">
					<u--input width="50" clearable v-model="formData.userInfo.phone" border="surround"
						@clear="clearInputPhone"></u--input>
				</u-form-item>
			</uni-card>
			<uni-card :is-shadow="true" is-full>
				<uni-section title="上门服务时间" type="line"></uni-section>
				<view class="example-body">
					<uni-datetime-picker type="datetime" v-model="formData.userInfo.date" @change="changeLog" />
				</view>
			</uni-card>
			<uni-card :is-shadow="true" is-full>
				<!-- <uni-section title="分类" type="line"></uni-section> -->
				<u-form-item label="分类" required labelWidth="150" prop="userInfo.category" borderBottom
					@click="showCategory= true" ref="item1">
					<u--input v-model="formData.userInfo.category" required placeholder="请选择分类" border="surround">
					</u--input>
				</u-form-item>
			</uni-card>
			<uni-card :is-shadow="true" is-full>
				<!-- <uni-section title="拍照上传" type="line"></uni-section> -->
				<view class="example-body">
					<uni-file-picker limit="9" title="最多选择9张图片" fileMediatype="image" mode="grid" @select="select"
						@progress="progress" @success="success" @fail="fail"></uni-file-picker>
				</view>
			</uni-card>
		</u--form>
		<u-action-sheet :show="showCategory" :actions="actionsCategory" title="请选择" description="服务分类"
			@close="showCategory = false" @select="categorySelect">
		</u-action-sheet>
		<u-button type="primary" text="确定" @click="submit('form')"></u-button>
		<u-datetime-picker :show="dateShow" v-model="formData.userInfo.date" mode="datetime"></u-datetime-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 表单
				formData: {
					userInfo: {
						title: '',
						content: "",
						category: "",
						date: Number(new Date()),
						images: [],
						phone: '',
					},
				},
				// 分类
				showCategory: false,
				actionsCategory: [
					// {
					// 	name: '维修',
					// },
					// {
					// 	name: '家政',
					// }
				],
				// 表单规则
				rules: {
					'userInfo.title': {
						type: 'string',
						required: true,
						message: '请填写',
						trigger: ['blur', 'change']
					},
					'userInfo.content': {
						type: 'string',
						min: 3,
						max: 500,
						required: true,
						message: '请填写',
						trigger: ['blur', 'change']
					},
					'userInfo.category': {
						type: 'string',
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					},
					'userInfo.phone': { // 新增的联系手机校验规则
						type: 'string',
						required: true,
						message: '请填写',
						trigger: ['blur', 'change']
					},
				},
				//  日期
				dateShow: false,
				// 文件上传-样式（图片上传）
				imageStyles: {
					width: 64,
					height: 64,
					border: {
						radius: '50%'
					}
				},
				// 文件上传-样式（图片上传）
				listStyles: {
					// 是否显示边框
					border: true,
					// 是否显示分隔线
					dividline: true,
					// 线条样式
					borderStyle: {
						width: 1,
						color: 'blue',
						style: 'dashed',
						radius: 2
					}
				},
				// 文件上传
				imageValue: [],
			};
		},
		computed: {
			getDate() {
				return this.getYMDHMS(this.formData.userInfo.date)
			}
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.form.setRules(this.rules)
		},
		created() {
			this.getClassTypeData()
		},
		methods: {
			// 分类
			categorySelect(e) {
				console.log("e:", e)
				this.formData.userInfo.category = e.name
				this.$refs.form.validateField('userInfo.category')
			},
			// 请求云函数-获取分类数据
			getClassTypeData() {
				// 请求分类
				uniCloud.callFunction({
					name: "getClassType",
					data: {
						"isEnable": true
					},
					success: (res) => {
						console.log("getClassType res.result.data", res.result.data)
						this.actionsCategory = res.result.data
					}
				})
			},
			// 提交表单
			submit(form) {
				this.$refs[form].validate().then(res => {
					console.log('success', res);
					// 请求云函数
					uniCloud.callFunction({
						name: "addReleaseInfo",
						data: {
							"wechatOpenID": uni.getStorageSync("openID"),
							"title": this.formData.userInfo.title,
							"content": this.formData.userInfo.content,
							"imagesList": this.formData.userInfo.images,
							"category": this.formData.userInfo.category,
							"created": this.formData.userInfo.date,
							"isExpedited": this.formData.userInfo.isExpedited,
							"phone":this.formData.userInfo.phone,
							"isEnable": true
						},
						success: (res) => {
							console.log(res.result.data);
							uni.showToast({
								title: `发布成功`
							})
						}
					})

				}).catch(err => {
					console.log('err', err);
				})

			},
			// 文件上传-获取上传状态
			select(e) {
				console.log('选择文件：', e)

			},
			// 文件上传-获取上传进度
			progress(e) {
				console.log('上传进度：', e)

			},
			// 文件上传-上传成功
			success(e) {
				console.log('上传成功', e)
				// 放进表单图片数组中
				this.formData.userInfo.images.push(e.tempFiles[0].url)
				console.log("e.tempFiles[0].url",e.tempFiles[0].url)
				console.log("this.formData.userInfo.images:", this.formData.userInfo.images)

			},
			// 文件上传-上传失败
			fail(e) {
				console.log('上传失败：', e)
			},
			// 时间戳转年月日
			getYMDHMS(timestamp) {
				var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = date.getFullYear() + "-";
				var M =
					(date.getMonth() + 1 < 10 ?
						"0" + (date.getMonth() + 1) :
						date.getMonth() + 1) + "-";
				var D =
					(date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
				var h =
					(date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
				var m =
					(date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
					":";
				var s =
					date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

				var strDate = Y + M + D + h + m + s;
				return strDate;
			},
			// 日期时间
			change(e) {
				this.single = e
				console.log('change事件:', this.single = e);
			},
			// 日期时间
			changeLog(e) {
				console.log('change事件:', e);
			},
			// 日期时间
			maskClick(e) {
				console.log('maskClick事件:', e);
			}
		},
		// uniapp微信小程序分享页面到微信好友
		onShareAppMessage() {
			// TODO	读取缓存分享人ID
			return {
				title: '智慧其心共享平台',
				path: `/pages/business/releaseInfo/releaseInfo` //分享的页面路径
			}
		},
		// uniapp微信小程序分享页面到微信朋友圈
		onShareTimeline() {
			return {
				title: '智慧其心共享平台 ',
				path: '/pages/business/releaseInfo/releaseInfo', //分享的页面路径
				query: ``,
				imageUrl: 'https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/c89fedc8-0f75-4e8e-b151-ce90a17e7ce3.jpg',
			}
		},
	}
</script>

<style lang="scss">
	.example-body {
		padding: 10px;
		padding-top: 0;
	}

	.custom-image-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.text {
		font-size: 14px;
		color: #333;
	}
</style>