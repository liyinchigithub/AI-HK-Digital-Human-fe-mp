<template>
	<view class="feedback-page">
		<view class="header">
			<text class="title"></text>
			<text class="record" @click="goto('/pages/business/feedback/feedbackRecord')">反馈记录</text>
		</view>
		<u--form :model="formData" :rules="rules" ref="uForm">
			<u-form-item label="描述内容" prop="description" borderBottom class="form-item" :labelWidth="200">
				<u--textarea v-model="formData.description" placeholder="请详细描述您的问题，建议添加相关问题截图我们将及时跟进解决" maxlength="200"
					count height="300" />
			</u-form-item>
			<u-form-item label="联系电话" prop="phone" borderBottom class="form-item" :labelWidth="200">
				<u--input v-model="formData.phone" type="number" border="none" placeholder="请输入您的手机号" />
			</u-form-item>
			<u-form-item label="上传凭证" prop="photos" borderBottom class="form-item" :labelWidth="200">
				<uni-section>
					<view class="example-body">
						<uni-file-picker limit="3" v-model="imageValue" fileMediatype="image" mode="grid"
							:cloudPath="generateCloudPath" @success="success" @fail="fail" @progress="progress"
							@select="select">
						</uni-file-picker>
					</view>
				</uni-section>
			</u-form-item>
			<u-button type="primary" form-type="submit" class="submit-button" @click="submitForm">提交反馈</u-button>
		</u--form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			formData: {
				description: '',
				phone: '',
				photos: []
			},
			imageValue: [],
			rules: {
				description: {
					type: 'string',
					required: true,
					message: '请填写描述内容',
					trigger: ['blur', 'change']
				},
				phone: {
					type: 'string',
					required: true,
					message: '请填写联系电话',
					trigger: ['blur', 'change'],
					pattern: /^1[3-9]\d{9}$/, // 正则表达式验证11位手机号
					message: '请输入有效的11位手机号'
				}
			},
			openID: ''
		};
	},
	onLoad() {
		this.openID = uni.getStorageSync('openID');
	},
	methods: {
		// 选择文件
		select(e) {
			console.log('选择文件：', e);
		},
		// 上传进度
		progress(e) {
			console.log('上传进度：', e);
		},
		// 生成云路径
		generateCloudPath(file) {
			const timestamp = Date.now();
			const fileName = `feedback-${timestamp}.${file.extname}`;
			return `feedback/${fileName}`;
		},
		// 上传成功
		success(e) {
			console.log('上传成功');
			const fileInfo = e.tempFiles.map(file => ({
				extname: file.extname,
				fileType: file.fileType,
				image: file.image, // 包含宽度和高度
				name: file.name,
				path: file.path,
				size: file.size,
				fileID: file.fileID,
				url: file.url,
				uuid: file.uuid,
				status: file.status,
				cloudPath: file.cloudPath
			}));
			this.formData.photos = fileInfo;  // 存储为数组
			// 判断fileInfo类型
			console.log("this.formData.photos", this.formData.photos);
		},
		// 上传失败
		fail(e) {
			console.log('上传失败：', e);
			uni.showToast({
				title: '照片上传失败，请联系客服',
				icon: 'none'
			});
		},
		// 提交表单
		submitForm() {
			this.$refs.uForm.validate().then(() => {
				uni.showLoading({ title: '提交中...' });
				console.log('表单数据:', this.formData);
				// 调用云函数
				uniCloud.callFunction({
					name: 'feedback',
					data: {
						description: this.formData.description,
						phone: this.formData.phone,
						photos: this.formData.photos, // 直接传递完整的文件信息
						openID: this.openID
					}
				}).then(res => {
					console.log('云函数调用结果:', res);
					uni.hideLoading();
					if (res.result.code === 200) {
						uni.showToast({
							title: '提交成功',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: '提交失败，请重试',
							icon: 'none'
						});
					}
				}).catch(err => {
					console.error('云函数调用失败:', err);
					uni.hideLoading();
					uni.showToast({
						title: '提交失败，请重试',
						icon: 'none'
					});
				});
			}).catch(() => {
				uni.showToast({
					title: '请检查表单输入',
					icon: 'none'
				});
			});
		},
		goto(url) {
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style>
.feedback-page {
	padding: 20px;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.title {
	font-size: 24px;
	font-weight: bold;
}

.record {
	color: #abb5bb;
}

.form-item {
	margin-bottom: 20px;
}

.submit-button {
	width: 100%;
	margin-top: 20px;
	border-radius: 25px;
}
</style>