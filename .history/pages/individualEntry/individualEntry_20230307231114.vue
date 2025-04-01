<template>
	<view>
		<!-- 申请人姓名 -->
		<!-- 性别 -->
		<!-- 服务技能 -->
		<!-- 联系方式 -->
		<!-- 身份证号 -->
		<!-- 身份证正面 -->
		<!-- 身份证反面 -->
		<!-- 技能证书 -->
		<u--form labelPosition="top" :model="formData" :rules="rules" ref="form">
			<!-- 申请人姓名 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title=" 申请人姓名" type="line">
				</uni-section>
				<u-form-item labelWidth="150" prop="userInfo.username" borderBottom ref="item1">
					<u--input width="50" clearable v-model="formData.userInfo.username" border="surround"
						@clear="clearInputTitle"></u--input>
				</u-form-item>
			</uni-card>
			<!-- 性别 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="性别" type="line">
				</uni-section>
				<u-form-item labelWidth="150" prop="userInfo.gender" borderBottom @click="showGenderCategory=true"
					ref="item1">
					<u--input v-model="formData.userInfo.gender" required placeholder="请选择性别" border="surround">
					</u--input>
				</u-form-item>
			</uni-card>
			<!-- 服务技能 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="服务技能" type="line">
				</uni-section>
				<u-form-item labelWidth="150" prop="userInfo.category" borderBottom @click="showCategory=true"
					ref="item1">
					<u--input v-model="formData.userInfo.category" required placeholder="请选择分类" border="surround">
					</u--input>
				</u-form-item>
			</uni-card>
			<!-- 联系方式 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="联系方式" type="line">
				</uni-section>
				<u-form-item labelWidth="150" prop="userInfo.phone" borderBottom ref="item1">
					<u--input type="number" width="50" clearable v-model="formData.userInfo.phone" border="surround"
						@clear="clearInputTitle"></u--input>
				</u-form-item>
			</uni-card>
			<!-- 联系地址 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="联系地址" type="line">
				</uni-section>
				<u-form-item labelWidth="150" prop="userInfo.contactAddress" borderBottom ref="item1">
					<u--input type="string" width="50" clearable v-model="formData.userInfo.contactAddress" border="surround"
						@clear="clearInputTitle"></u--input>
				</u-form-item>
			</uni-card>
			<!-- 身份证号 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="身份证号" type="line">
				</uni-section>
				<u-form-item labelWidth="150" prop="userInfo.idcard" borderBottom ref="item1">
					<u--input type="idcard" width="50" clearable v-model="formData.userInfo.idcard" border="surround"
						@clear="clearInputTitle"></u--input>
				</u-form-item>
			</uni-card>
			<!-- 身份证正面 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="身份证正面" type="line">
				</uni-section>
				<view class="example-body">
					<uni-file-picker limit="1" title="最多选择1张图片" fileMediatype="image" mode="grid" @select="selectIDFront"
						@progress="progressIDFront" @success="successIDFront" @fail="fail"></uni-file-picker>
				</view>
			</uni-card>
			<!-- 身份证反面 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="身份证反面" type="line">
				</uni-section>
				<view class="example-body">
					<uni-file-picker limit="1" title="最多选择1张图片" fileMediatype="image" mode="grid" @select="selectIDReverse"
						@progress="progressIDReverse" @success="successIDReverse" @fail="fail"></uni-file-picker>
				</view>
			</uni-card>
			<!-- 服务技能证书 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="服务技能证书" type="line">
				</uni-section>
				<view class="example-body">
					<uni-file-picker limit="9" title="最多选择9张图片" fileMediatype="image" mode="grid" @select="selectSkillCertificate"
						@progress="progressSkillCertificate" @success="successSkillCertificate" @fail="fail"></uni-file-picker>
				</view>
			</uni-card>
			<!-- 备注 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="备注" type="line">
				</uni-section>
				<u-form-item labelWidth="150" prop="userInfo.mark" borderBottom ref="item1">
					<u--textarea count auto-height :maxlength="-1" border="surround" v-model="formData.userInfo.mark" placeholder="请输入">
					</u--textarea>
				</u-form-item>

			</uni-card>
		</u--form>
		<u-action-sheet :show="showGenderCategory" :actions="actionsGenderCategory" title="请选择" description="性别"
			@close="showGenderCategory" @select="genderSelect">
		</u-action-sheet>
		<u-action-sheet :show="showCategory" :actions="actionsCategory" title="请选择" description="服务技能分类"
			@close="showCategory = false" @select="categorySelect">
		</u-action-sheet>
		<u-button type="primary" text="确定" @click="submit('form')"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 表单
				formData: {
					userInfo: {
						username: '',
						gender:"",
						phone: "",
						category: "",// 服务技能分类
						idcard:"",
						contactAddress: "",
						latitude:"",
						longitude:"",
						province:"",// 省
						city:"",// 市
						area:"",// 区
						town:"",// 镇、街道
						community:"",// 村、社区
						level:1,// 登记
						imageIDFront: [],// 身份证正面图片
						imageIDReverse: [],//  身份证反面图片
						imageSkillCertificate: [],// 服务技能证书
						mark: "",//  备注
						date: Number(new Date()),
						
					},
				},
				// 性别-分类
				showGenderCategory: false,
				actionsGenderCategory: [
					{
						name: '男',
					},
					{
						name: '女',
					}
				],
				// 服务技能-分类
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
					'userInfo.username': {
						type: 'string',
						required: true,
						message: '请填写',
						trigger: ['blur', 'change']
					},
					'userInfo.gender': {
						type: 'string',
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					},
					'userInfo.category': {
						type: 'string',
						required: true,
						message: '请选择',
						trigger: ['blur', 'change']
					},
					'userInfo.phone': {
						type: 'string',
						required: true,
						message: '请填写',
						trigger: ['blur', 'change']
					},
					'userInfo.idcard': {
						type: 'string',
						required: true,
						message: '请填写',
						trigger: ['blur', 'change']
					},
					'userInfo.contactAddress': {
						type: 'string',
						required: true,
						message: '请填写',
						trigger: ['blur', 'change']
					},
					'userInfo.IDFront': {
						type: 'string',
						required: true,
						message: '请填写',
						trigger: ['blur', 'change']
					},
					'userInfo.IDReverse': {
						type: 'string',
						required: true,
						message: '请填写',
						trigger: ['blur', 'change']
					},
					'userInfo.skillCertificate': {
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
			}
		},
		created() {
			this.getClassTypeData()
		},
		methods: {
			// 性别-分类
			genderSelect(e) {
				console.log("e:", e)
			},
			// 服务技能-分类
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
						this.actionsGenderCategory=[
							{
								name: '男',
							},
							{
								name: '女',
							}
						]
					}
				})
			},
			// 提交表单
			submit(form) {
				// TODO 查询是否已申请、申请成功
				
				//
				this.$refs[form].validate().then(res => {
					console.log('success', res);
					// 请求云函数
					uniCloud.callFunction({
						name: "addIndividualEntry",
						data: {
							"username": this.formData.userInfo.username,
							"gender": this.formData.userInfo.gender,
							"phone": this.formData.userInfo.phone,
							"idcard": this.formData.userInfo.idcard,
							"username": this.formData.userInfo.username,
							"mark": this.formData.userInfo.mark,
							"images": this.formData.userInfo.images,
							"category": this.formData.userInfo.category,
							"isEnable": true
						},
						success: (res) => {
							console.log(res.result.data);
							uni.showToast({
								title: `提交成功`
							})
						}
					})

				}).catch(err => {
					console.log('err', err);
				})

			},
			// 文件上传-获取上传状态
			selectIDFront(e) {
				console.log('选择文件：', e)

			},
			// 文件上传-获取上传进度
			progressIDFront(e) {
				console.log('上传进度：', e)

			},
			// 文件上传-上传成功
			successIDFront(e) {
				console.log('上传成功', e)
				// 放进表单图片数组中
				this.formData.userInfo.imageIDFront.push(e.tempFiles[0].url)
				console.log("this.formData.userInfo.imageIDFront:", this.formData.userInfo.imageIDFront)

			},
			// 文件上传-上传失败
			failIDFront(e) {
				console.log('上传失败：', e)
			},
			
			// 文件上传-获取上传状态
			selectIDReverse(e) {
				console.log('选择文件：', e)
			
			},
			// 文件上传-获取上传进度
			progressIDReverse(e) {
				console.log('上传进度：', e)
			
			},
			// 文件上传-上传成功
			successIDReverse(e) {
				console.log('上传成功', e)
				// 放进表单图片数组中
				this.formData.userInfo.imageIDReverse.push(e.tempFiles[0].url)
				console.log("this.formData.userInfo.imageIDReverse:", this.formData.userInfo.imageIDReverse)
			
			},
			// 文件上传-上传失败
			failIDReverse(e) {
				console.log('上传失败：', e)
			},
			
			// 文件上传-获取上传状态
			selectSkillCertificate(e) {
				console.log('选择文件：', e)
			
			},
			// 文件上传-获取上传进度
			progressSkillCertificate(e) {
				console.log('上传进度：', e)
			
			},
			// 文件上传-上传成功
			successSkillCertificate(e) {
				console.log('上传成功', e)
				// 放进表单图片数组中
				this.formData.userInfo.imageSkillCertificate.push(e.tempFiles[0].url)
				console.log("this.formData.userInfo.imageSkillCertificate:", this.formData.userInfo.imageSkillCertificate)
			
			},
			// 文件上传-上传失败
			failSkillCertificate(e) {
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
		}
	}
</script>

<style>

</style>
