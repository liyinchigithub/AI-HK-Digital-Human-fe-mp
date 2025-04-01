<template>
	<view class="recruit-page">
		<image class="banner" :src="cityJoinBannerUrl" mode="widthFix" />
		<view class="form-container">
			<u--form labelPosition="left" :model="formData" :rules="rules" ref="uForm">
				<u-form-item label="姓名" prop="merchantName" borderBottom class="form-item" :labelWidth="200">
					<u--input v-model="formData.merchantName" border="none" placeholder="请输入您的姓名" clearable />
				</u-form-item>
				<!-- 性别选择更换为手机号输入框 -->
				<u-form-item label="手机号" prop="phone" borderBottom class="form-item" :labelWidth="200">
					<u--input v-model="formData.phone" type="number" placeholder="请输入手机号" border="none" clearable />
				</u-form-item>
				<!-- 合作意向城市更换为文本输入框 -->
				<u-form-item label="合作城市" prop="city" borderBottom class="form-item" :labelWidth="200">
					<u--input v-model="formData.city" placeholder="请填写合作意向城市" border="none" clearable />
				</u-form-item>
				<!-- 备注文本框 -->
				<u-form-item label="备注" prop="remark" borderBottom class="form-item" :labelWidth="100"></u-form-item>
				<u--textarea class="remark-textarea" v-model="formData.remark" placeholder="请输入备注" clearable />
				<!-- 入驻协议说明 必须同意才可以提交表单 -->
				<!-- <u-form-item prop="agree" borderBottom class="form-item" :labelWidth="100" >
					<view style="margin-left: 30%;margin-top: 5%">
						<u-checkbox-group v-model="formData.agree" placement="column" @change="checkboxChange">
							<u-checkbox iconSize="35" size="35" labelSize="40" :customStyle="{ marginBottom: '8upx' }"
								v-for="(item, index) in checkboxList" :key="index" :label="item.name" :name="item.name">
							</u-checkbox>
						</u-checkbox-group>
						<view style="margin-top: 5%;margin-bottom: 5%">
							<text style="color: blue;"
								@click="goto('/pages/business/settleInAgreement/settleInAgreement')">《加盟申请服务协议》</text>
						</view>
					</view>
				</u-form-item> -->
				<u-button type="primary" form-type="submit" class="submit-button" @click="submitForm">提交申请</u-button>
			</u--form>
		</view>
	</view>
</template>


<script>
export default {
	data() {
		return {
			showSex: false,
			showPicker: false,
			formData: {
				merchantName: '',
				phone: '',
				city: '',
				remark: '',
				agree: []
			},
			servicePhone: "",
			// 勾选弹窗（是否同意入驻协议说明）
			showModal: false,
			// 复选框（入驻协议说明）
			checkboxList: [{
				name: '同意并遵守',
				disabled: false
			}],
			rules: {
				merchantName: {
					type: 'string',
					required: true,
					message: '请填写姓名',
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
					message: '请输入合作城市',
					trigger: ['blur', 'change']
				},
				agree: {
					type: 'array',
					required: true,
					message: '请同意协议',
					trigger: ['change']
				}
			},
			loading: false, // 添加loading状态
		};
	},
	onLoad() {
		// this.fetchImageUrl();
	},
	computed: {
		cityJoinBannerUrl() {
			// 从缓存中获取图片 URL
			const basicInformation = uni.getStorageSync('basicInformation');
			return basicInformation ? basicInformation.cityJoinBanner.url : '';
		}
	},
	methods: {
		// 获取城市加盟介绍图片
		fetchImageUrl() {
			uniCloud.callFunction({
				name: 'getBasicInformation',
				data: {
					isEnable: true
				},
				success: (res) => {
					console.log('res: ', res.result.data[0].cityJoin.url)
					this.imageUrl = res.result.data[0].cityJoin.url;
					// this.servicePhone = res.result.phone;
				},
				fail: (err) => {
					console.error('获取图片URL失败:', err);
				},
			});
		},
		submitForm() {
			this.$refs.uForm.validate().then(() => {
				uni.showLoading({ title: '提交中...' }); // 显示加载动画
				console.log('表单数据:', this.formData);
				// 调用云函数
				uniCloud.callFunction({
					name: 'cityJoin',
					data: {
						methods: "addMerchant",
						merchantName: this.formData.merchantName,
						phone: this.formData.phone,
						city: this.formData.city,
						workerNumber: this.formData.workerNumber,
						classType: "",
						navigationAddress: "",
						latitude: "",
						longitude: "",
						province: "",
						level: 0,
						remark: this.formData.remark,
						isEnable: true
					}
				}).then(res => {
					console.log('云函数返回结果:', res);
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
		//  复选框
		checkboxChange(n) {
			console.log('change', n);
			this.formData.agree = n;
			console.log('formData.agree:', JSON.parse(JSON.stringify(this.formData.agree)))
		},
		// 关闭弹窗+确认
		confirm() {
			// 勾选入驻协议说明
			this.formData.agree = ["同意并遵守"];
			this.formData.agree = JSON.parse(JSON.stringify(this.formData.agree))
			console.log("confirm formData.agree:", JSON.parse(JSON.stringify(this.formData.agree)))
			// 关闭弹窗
			this.showModal = false;
		},
		// 关闭弹窗
		cancel() {
			// 关闭弹窗
			this.showModal = false;
		},
		// 页面跳转
		goto(url) {
			uni.navigateTo({
				url: url,
			});
		},
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
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
}

.form-container {
	position: relative;
	top: -40px;
	background-color: #fff;
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-item {
	margin-bottom: 20px;
}

.agree-text {
	font-size: 16px;
	color: #333;
	/* 确保字体颜色可见 */
	margin-bottom: 20rpx;
	/* 增加与按钮的间距 */
}

.highlight {
	color: blue;
	/* 高亮颜色 */
	/* 下划线 */
	/* text-decoration: underline;  */
}

.remark-textarea {
	margin-bottom: 50px;
	/* 增加与submit-button的间距 */
}

.submit-button {
	width: 100%;
	margin-top: 50px !important;
	/* 使用!important确保样式生效 */
	border-radius: 25px;
}
</style>