<template>
	<view class="recruit-page">
		<!-- 理疗师招募 -->
		<image class="banner" :src="recruitBannerUrl" mode="widthFix" />
		<view class="form-container">
			<u--form labelPosition="left" :model="formData" :rules="rules" ref="uForm">
				<u-form-item label="姓名" prop="username" borderBottom class="form-item" :labelWidth="200">
					<u--input v-model="formData.username" border="none" placeholder="请输入您的姓名" />
				</u-form-item>
				<u-form-item label="性别" prop="gender" borderBottom class="form-item" @click="showSex = true"
					:labelWidth="200">
					<u--input v-model="formData.gender" disabled placeholder="请选择性别" border="none" />
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="年龄" prop="age" borderBottom class="form-item" :labelWidth="200">
					<u--input v-model="formData.age" type="number" border="none" placeholder="请输入您的年龄" />
				</u-form-item>
				<u-form-item label="手机号" prop="phone" borderBottom class="form-item" :labelWidth="200">
					<u--input v-model="formData.phone" type="number" border="none" placeholder="请输入您的手机号" />
				</u-form-item>
				<u-form-item label="合作意向城市" prop="city" borderBottom class="form-item" :labelWidth="200">
					<u--input v-model="formData.city" placeholder="请输入您的入驻城市" border="none" />
				</u-form-item>
				<u-form-item label="本人近期照片" prop="photo" borderBottom class="form-item" :labelWidth="200">
					<uni-section>
						<view class="example-body">
							<uni-file-picker limit="1" v-model="imageValue" fileMediatype="image" mode="grid"
								:cloudPath="generateCloudPath" @success="success" @fail="fail" @progress="progress"
								@select="select">
							</uni-file-picker>
						</view>
					</uni-section>
				</u-form-item>
				<u-form-item prop="agree" borderBottom class="form-item" :labelWidth="200">
					<view class="agree-container">
						<u-checkbox-group v-model="formData.agree">
							<u-checkbox label="阅读并同意" :labelSize="30" :size="30" labelColor="#000000"></u-checkbox>
						</u-checkbox-group>
						<view class="agree-text">
							<text @click="navigateTo('/pages/webView/webView?protocolType=merchantServiceAgreement')"
								class="highlight">《商家服务协议》</text>
							<text @click="navigateTo('/pages/webView/webView?protocolType=privacyPolicy')"
								class="highlight">《隐私政策》</text>
						</view>
					</view>
				</u-form-item>
				<u-button type="primary" form-type="submit" class="submit-button" @click="submitForm">提交申请</u-button>
			</u--form>
		</view>
		<u-action-sheet :show="showSex" :actions="genderOptions" title="请选择性别" @close="showSex = false"
			@select="onGenderSelect" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			showSex: false,
			showPicker: false,
			formData: {
				username: '',
				gender: '',
				age: '',
				phone: '',
				photo: "",
				city: '',
				agree: [] // 使用数组来绑定复选框
			},
			imageValue: [],
			genderOptions: [
				{ name: '女' },
				{ name: '男' }
			],
			rules: {
				username: {
					type: 'string',
					required: true,
					message: '请填写姓名',
					trigger: ['blur', 'change']
				},
				gender: {
					type: 'string',
					required: true,
					message: '请选择性别',
					trigger: ['blur', 'change']
				},
				age: {
					type: 'number',
					required: true,
					message: '请填写年龄',
					trigger: ['blur', 'change']
				},
				phone: {
					type: 'string',
					required: true,
					message: '请填写手机号',
					trigger: ['blur', 'change']
				},
				city: {
					type: 'string',
					required: true,
					message: '请填写城市',
					trigger: ['blur', 'change']
				},
				agree: {
					type: 'array',
					required: true,
					message: '请同意协议',
					trigger: ['change']
				}
			},
			loading: false
		};
	},
	computed: {
		recruitBannerUrl() {
			// 从缓存中获取图片 URL
			const basicInformation = uni.getStorageSync('basicInformation');
			return basicInformation ? basicInformation.recruitBanner.url : '';
		}
	},
	methods: {
		navigateTo(url) {
			uni.navigateTo({
				url: url
			});
		},
		// 获取上传状态
		select(e) {
			console.log('选择文件：', e)
		},
		// 获取上传进度
		progress(e) {
			console.log('上传进度：', e)
		},
		// 生成自定义的文件名
		generateCloudPath(file) {
			const timestamp = Date.now();
			const fileName = `photo-${timestamp}.${file.extname}`;
			return `photos/${fileName}`;
		},
		// 上传成功
		success(e) {
			console.log('上传成功');
			console.log("e.tempFilePaths[0]", e.tempFilePaths[0]);
			console.log("e", e);
			const fileInfo = {
				extname: e.tempFiles[0].extname,
				fileType: e.tempFiles[0].fileType,
				image: e.tempFiles[0].image, // 包含宽度和高度
				name: e.tempFiles[0].name,
				path: e.tempFiles[0].path,
				size: e.tempFiles[0].size,
				fileID: e.tempFiles[0].fileID,
				url: e.tempFiles[0].url,
				uuid: e.tempFiles[0].uuid,
				status: e.tempFiles[0].status,
				cloudPath: e.tempFiles[0].cloudPath
			};
			this.formData.registrationPhoto = [fileInfo];  // 存储为数组
			console.log("this.formData.registrationPhoto", this.formData.registrationPhoto);
		},
		// 上传失败
		fail(e) {
			console.log('上传失败：', e);
			uni.showToast({
				title: '照片上传失败，请联系客服',
				icon: 'none'
			});
		},
		submitForm() {
			this.$refs.uForm.validate().then(() => {
				uni.showLoading({ title: '提交中...' }); // 显示加载动画
				console.log('表单数据:', this.formData);
				// 请求云函数，并返回结果
				uniCloud.callFunction({
					name: 'worker',
					data: {
						methods: 'addWorkers',
						username: this.formData.username,
						gender: this.formData.gender === '男' ? 1 : 2,
						age: this.formData.age,
						phone: this.formData.phone,
						city: this.formData.city,
						agree: this.formData.agree,
						registrationPhoto: this.formData.registrationPhoto
					}
				}).then(res => {
					console.log('云函数返回结果:', res);
					console.log("formData", this.formData)
					uni.hideLoading(); // 隐藏加载动画
					if (res.result && res.result.code === 200) {
						uni.showToast({
							title: '提交成功',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: '已提交，请勿重复提交',
							icon: 'none'
						});
					}
				}).catch(err => {
					console.error('云函数调用失败:', err);
					uni.hideLoading(); // 隐藏加载动画
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
		onGenderSelect(e) {
			this.formData.gender = e.name;
			this.$refs.uForm.validateField('gender');
			this.showSex = false;
		},
	}
};
</script>

<style>
.recruit-page {
	position: relative;
	padding: 20px;
}

.banner {
	width: 100%;
	height: auto;
	display: block;
}

.form-container {
	width: 90%;
	position: relative;
	top: -40px;
	background-color: #fff;
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	margin: 0 auto;
}

.form-item {
	margin-bottom: 20px;
}

.agree-text {
	font-size: 16px;
	color: #333;
	margin-left: 10px;
	/* 增加与复选框的间距 */
	display: flex;
}

.highlight {
	color: blue;
	margin-left: 10px;
	/* 增加协议之间的间距 */
}

.submit-button {
	width: 100%;
	margin-top: 20px;
	border-radius: 25px;
}
</style>