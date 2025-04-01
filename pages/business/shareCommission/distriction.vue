<template>
	<view class="recruit-page">
		<!-- 申请分销（弃用）改为分享好友购买就有佣金，无需申请 -->
		<image class="banner" src="https://mp-dd83b993-208c-425c-ac98-4edc7f22b3c8.cdn.bspapp.com/商家入驻-banner.png"
			mode="widthFix" />
		<view class="form-container">
			<u--form labelPosition="left" :model="formData" :rules="rules" ref="uForm">
				<u-form-item label="姓名" prop="name" borderBottom class="form-item" :labelWidth="200">
					<u--input v-model="formData.name" border="none" placeholder="请输入您的姓名" clearable />
				</u-form-item>
				<u-form-item label="手机号" prop="phone" borderBottom class="form-item" :labelWidth="200">
					<u--input v-model="formData.phone" type="number" placeholder="请输入手机号" border="none" clearable />
				</u-form-item>
				<u-form-item label="所属类型" prop="type" borderBottom class="form-item" :labelWidth="200"
					@click="showTypePicker = true">
					<u--input v-model="formData.type" disabled placeholder="请选择类型" border="none" />
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="选择地区" prop="region" borderBottom class="form-item" :labelWidth="200">
					<u--input v-model="formData.region" placeholder="请选择城市" border="none" clearable />
				</u-form-item>
				<u-form-item label="所在地址" prop="address" borderBottom class="form-item" :labelWidth="200">
					<u--input v-model="formData.address" placeholder="请输入您的具体地址" border="none" clearable />
				</u-form-item>
				<u-button type="primary" form-type="submit" class="submit-button" @click="submitForm">提交申请</u-button>
			</u--form>
		</view>
		<u-action-sheet :show="showTypePicker" :actions="typeOptions" title="请选择类型" @close="showTypePicker = false"
			@select="onTypeSelect" :closeOnClickOverlay="true" :closeOnClickAction="true" />
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			showTypePicker: false,
			formData: {
				name: '',
				phone: '',
				type: '',
				region: '',
				address: ''
			},
			typeOptions: [
				{ name: '酒店/民宿' },
				{ name: '娱乐场所' },
				{ name: '餐饮' },
				{ name: '网约/出租车' },
				{ name: '其他' }
			],
			rules: {
				name: {
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
				type: {
					type: 'string',
					required: true,
					message: '请选择类型',
					trigger: ['blur', 'change']
				},
				region: {
					type: 'string',
					required: true,
					message: '请选择入驻城市',
					trigger: ['blur', 'change']
				},
				address: {
					type: 'string',
					required: true,
					message: '请输入具体地址',
					trigger: ['blur', 'change']
				}
			}
		};
	},
	methods: {
		submitForm() {
			this.$refs.uForm.validate().then(() => {
				console.log('表单数据:', this.formData);
				// 提交表单逻辑
				// 调用云函数提交表单

				uni.showToast({
					title: '提交成功',
					icon: 'none'
				});
			}).catch(() => {
				uni.showToast({
					title: '请检查表单输入',
					icon: 'none'
				});
			});
		},
		// 
		onConfirm(event) {
			this.formData.type = this.typeOptions[event.detail.value];
			this.showPicker = false;
			console.log("this.formData.type",this.formData.type)
		},
		// 弹出选择类型
		onTypeSelect(e) {
			this.formData.type = e.name;
			this.$refs.uForm.validateField('type');
			this.showTypePicker = false;
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

.submit-button {
	width: 100%;
	margin-top: 50px !important;
	border-radius: 25px;
}
</style>