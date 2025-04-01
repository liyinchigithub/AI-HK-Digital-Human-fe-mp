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
				<uni-section title=" 申请人姓名" type="line"> </uni-section>
				<u-form-item labelWidth="150" prop="userInfo.username" ref="item1">
					<u--input placeholder="请输入" width="50" clearable v-model="formData.userInfo.username" border="bottom"
						@clear="clearInputTitle"></u--input>
				</u-form-item>
			</uni-card>
			<!-- 性别 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="性别" type="line"> </uni-section>
				<u-form-item labelWidth="150" prop="userInfo.gender" ref="item1">
					<u-radio-group :labelSize="40" :iconSize="40" shape="square" v-model="formData.userInfo.gender"
						placement="column" @change="genderGroupChange">
						<u-radio placement="row" :labelSize="40" :iconSize="40" :customStyle="{ marginBottom: '8px' }"
							v-for="(item, index) in genderRadiolist" :key="index" :label="item.name" :name="item.name"
							@change="genderRadioChange">
						</u-radio>
					</u-radio-group>
				</u-form-item>
			</uni-card>
			<!-- 服务技能 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="服务技能" type="line"> </uni-section>
				<u-form-item labelWidth="150" prop="userInfo.category" ref="item1">
					<u--input holdKeyboard="true" @focus="showCategory = true" v-model="formData.userInfo.category"
						required placeholder="请选择分类" border="bottom">
					</u--input>
				</u-form-item>
			</uni-card>
			<!-- 联系方式 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="联系方式" type="line"> </uni-section>
				<u-form-item labelWidth="150" prop="userInfo.phone" ref="item1">
					<u--input  placeholder="请输入" type="number" width="50" clearable v-model="formData.userInfo.phone" border="bottom"
						@clear="clearInputTitle"></u--input>
				</u-form-item>
			</uni-card>
			<!-- 联系地址 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="联系地址" type="line"> </uni-section>
				<u-form-item labelWidth="150" prop="userInfo.contactAddress" ref="item1">
					<u--input  placeholder="请输入" type="string" width="50" clearable v-model="formData.userInfo.contactAddress"
						border="bottom" @clear="clearInputTitle" @focus="selectMap('contactAddress')"></u--input>
				</u-form-item>
			</uni-card>
			<!-- 常驻地址 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="常驻地址" type="line"> </uni-section>
				<u-form-item labelWidth="150" prop="userInfo.residentAddress" ref="item1">
					<u--input  placeholder="请输入" type="string" width="50" clearable v-model="formData.userInfo.residentAddress"
						border="bottom" @clear="clearInputTitle" @focus="selectMap('residentAddress')"></u--input>
				</u-form-item>
			</uni-card>
			<!-- 身份证号 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="身份证号" type="line"> </uni-section>
				<u-form-item labelWidth="150" prop="userInfo.idcard" ref="item1">
					<u--input  placeholder="请输入" type="idcard" width="50" clearable v-model="formData.userInfo.idcard" border="bottom"
						@clear="clearInputTitle"></u--input>
				</u-form-item>
			</uni-card>
			<!-- 身份证正面 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="上传身份证正面" type="line"> </uni-section>
				<view class="example-body">
					<uni-file-picker limit="1" title="仅1张" fileMediatype="image" mode="grid"
						@select="selectIDFront" @progress="progressIDFront" @success="successIDFront" @fail="fail">
					</uni-file-picker>
				</view>
			</uni-card>
			<!-- 身份证反面 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="上传身份证反面" type="line"> </uni-section>
				<view class="example-body">
					<uni-file-picker limit="1" title="仅1张" fileMediatype="image" mode="grid"
						@select="selectIDReverse" @progress="progressIDReverse" @success="successIDReverse"
						@fail="fail"></uni-file-picker>
				</view>
			</uni-card>
			<!-- 服务技能证书 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="上传服务技能证书" type="line"> </uni-section>
				<view class="example-body">
					<uni-file-picker limit="9" title="可传多张" fileMediatype="image" mode="grid"
						@select="selectSkillCertificate" @progress="progressSkillCertificate"
						@success="successSkillCertificate" @fail="fail"></uni-file-picker>
				</view>
			</uni-card>
			<!-- 备注 -->
			<uni-card :is-shadow="true" is-full>
				<uni-section title="备注" type="line"> </uni-section>
				<u-form-item labelWidth="150" prop="userInfo.mark" ref="item1">
					<u--textarea count autoHeight border="bottom" v-model="formData.userInfo.mark" placeholder="请输入">
					</u--textarea>
				</u-form-item>
			</uni-card>
		</u--form>
		<u-action-sheet :show="showCategory" :actions="actionsCategory" title="请选择" description="服务技能分类"
			@close="showCategory = false" @select="categorySelect">
		</u-action-sheet>
		<u-button type="primary" text="确定" @click="submit('form')" size="large"></u-button>
		<!-- uview toast -->
		<u-toast ref="uToast"></u-toast>
		<!-- 遮罩 -->
		<u-overlay :show="overlayShow" @click="overlayShow = false"></u-overlay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 遮罩
				overlayShow: false,
				// 表单
				formData: {
					userInfo: {
						username: "",
						gender: "",
						phone: "",
						category: "", // 服务技能分类
						idcard: "",
						contactAddress: "", // 联系地址
						residentAddress: "", // 常驻地址
						latitude: "",
						longitude: "",
						province: "福建省", // 省
						city: "泉州市", // 市
						area: "X", // 区
						town: "X", // 镇、街道
						community: "X", // 村、社区
						level: 1, // 等级
						IDFront: [], // 身份证正面图片
						IDReverse: [], //  身份证反面图片
						skillCertificate: [], // 服务技能证书
						mark: "", //  备注
						date: Number(new Date()),
					},
				},
				// 基本案列数据
				genderRadiolist: [{
						name: "男",
						// disabled: false
					},
					{
						name: "女",
						// disabled: false
					},
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				radiovalue1: "男",
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
					"userInfo.username": {
						type: "string",
						required: true,
						message: "请填写",
						trigger: ["blur", "change"],
					},
					"userInfo.gender": {
						type: "string",
						required: true,
						message: "请选择",
						trigger: ["blur", "change"],
					},
					"userInfo.category": {
						type: "string",
						required: true,
						message: "请选择",
						trigger: ["blur", "change"],
					},
					"userInfo.phone": {
						type: "string",
						required: true,
						message: "请填写",
						trigger: ["blur", "change"],
					},
					"userInfo.idcard": {
						type: "string",
						required: true,
						message: "请填写",
						trigger: ["blur", "change"],
					},
					"userInfo.contactAddress": {
						type: "string",
						required: true,
						message: "请填写",
						trigger: ["blur", "change"],
					},
					"userInfo.IDFront": {
						type: "string",
						required: true,
						message: "请填写",
						trigger: ["blur", "change"],
					},
					"userInfo.IDReverse": {
						type: "string",
						required: true,
						message: "请填写",
						trigger: ["blur", "change"],
					},
					"userInfo.skillCertificate": {
						type: "string",
						required: true,
						message: "请填写",
						trigger: ["blur", "change"],
					},
				},
				//  日期
				dateShow: false,
				// 文件上传-样式（图片上传）
				imageStyles: {
					width: 64,
					height: 64,
					border: {
						radius: "50%",
					},
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
						color: "blue",
						style: "dashed",
						radius: 2,
					},
				},
			};
		},
		created() {
			this.getClassTypeData();
		},
		methods: {
			// 
			selectMap(addressType) {
				uni.chooseLocation({
					success: (res) => {
						console.log("chooseLocation success res", res);
						if (addressType == "contactAddress") {
							this.formData.userInfo.contactAddress = res.address;
							this.formData.userInfo.latitude = res.latitude;
							this.formData.userInfo.longitude = res.longitude;
						} else if (addressType == "residentAddress") {
							this.formData.userInfo.residentAddress = res.address;
							this.formData.userInfo.latitude = res.latitude;
							this.formData.userInfo.longitude = res.longitude;
						}
						// this.getRegionFn(res);
					},
					fail: () => {
						// 如果用uni.chooseLocation没有获取到地理位置，则需要获取当前的授权信息，判断是否有地理授权信息
						uni.getSetting({
							success: (res) => {
								console.log(res);
								var status = res.authSetting;
								if (!status['scope.userLocation']) {
									// 如果授权信息中没有地理位置的授权，则需要弹窗提示用户需要授权地理信息
									uni.showModal({
										title: "是否授权当前位置",
										content: "需要获取您的地理位置，请确认授权，否则地图功能将无法使用",
										success: (tip) => {
											if (tip.confirm) {
												// 如果用户同意授权地理信息，则打开授权设置页面，判断用户的操作
												uni.openSetting({
													success: (data) => {
														// 如果用户授权了地理信息在，则提示授权成功
														if (data
															.authSetting[
																'scope.userLocation'
															] === true
														) {
															uni.showToast({
																title: "授权成功",
																icon: "success",
																duration: 1000
															})
															// 授权成功后，然后再次chooseLocation获取信息
															uni.chooseLocation({
																success: (
																	res
																) => {
																	console
																		.log(
																			"详细地址",
																			res
																		);
																	// this.getRegionFn(res);
																}
															})
														} else {
															uni.showToast({
																title: "授权失败",
																icon: "none",
																duration: 1000
															})
														}
													}
												})
											}
										}
									})
								}
							},
							fail: (res) => {
								uni.showToast({
									title: "调用授权窗口失败",
									icon: "none",
									duration: 1000
								})
							}
						})
					}
				});
			},
			// 性别-分类
			genderGroupChange(n) {
				console.log("groupChange", n);
			},
			genderRadioChange(n) {
				console.log("radioChange", n);
			},
			// 服务技能-分类
			categorySelect(e) {
				console.log("e:", e);
				this.formData.userInfo.category = e.name;
				this.$refs.form.validateField("userInfo.category");
			},
			// 请求云函数-获取分类数据
			getClassTypeData() {
				// 请求分类
				uniCloud.callFunction({
					name: "getClassType",
					data: {
						isEnable: true,
					},
					success: (res) => {
						console.log("getClassType res.result.data", res.result.data);
						this.actionsCategory = res.result.data;
					},
				});
			},
			//
			showToast(isTrue, msg) {
				var params = {};
				if (isTrue) {
					params = {
						type: "success",
						icon: false,
						//   title: "失败主题",
						message: msg,
					};
				} else {
					params = {
						type: "error",
						icon: false,
						//   title: "失败主题",
						message: msg,
					};
				}
				this.$refs.uToast.show(params);
			},
			// 提交表单
			submit(form) {
				this.$refs[form]
					.validate()
					.then((res) => {
						console.log("validate success", res);
						// 显示遮罩
						this.overlayShow = true;
						// 请求云函数
						uniCloud.callFunction({
							name: "addIndividualEntry",
							data: {
								username: this.formData.userInfo.username,
								gender: this.formData.userInfo.gender=="男"?1:2,
								phone: this.formData.userInfo.phone,
								idcard: this.formData.userInfo.idcard,
								username: this.formData.userInfo.username,
								level: this.formData.userInfo.level,
								mark: this.formData.userInfo.mark,
								IDFront: this.formData.userInfo.IDFront,
								IDReverse: this.formData.userInfo.IDReverse,
								skillCertificate: this.formData.userInfo.skillCertificate,
								category: this.formData.userInfo.category,
								contactAddress: this.formData.userInfo.contactAddress,
								residentAddress: this.formData.userInfo.residentAddress,
								latitude: this.formData.userInfo.latitude,
								longitude: this.formData.userInfo.longitude,
								province:this.formData.userInfo.province,
								city:this.formData.userInfo.city,
								area:this.formData.userInfo.area,
								town:this.formData.userInfo.town,
								community:this.formData.userInfo.community,
								isEnable: true,
							},
							success: (res) => {
								console.log("addIndividualEntry success", res.result);
								if (res.result.code == 200) {
									this.showToast(true, `提交成功,审核中`)
									// 清空表单
									// this.$refs[form].resetFields();
									// 隐藏遮罩
									this.overlayShow = false;
								} else {
									// 非200
									this.showToast(false, res.result.msg)
									// 隐藏遮罩
									this.overlayShow = false;

								}
							},
							fail: (err) => {
								console.log("addIndividualEntry err", err);
								this.showToast(false, err)
								// 隐藏遮罩
								this.overlayShow = false;

							},
						});
					})
					.catch((err) => {
						console.log("err", err);
					});
			},
			// 文件上传-获取上传状态
			selectIDFront(e) {
				console.log("选择文件：", e);
			},
			// 文件上传-获取上传进度
			progressIDFront(e) {
				console.log("上传进度：", e);
			},
			// 文件上传-上传成功
			successIDFront(e) {
				console.log("上传成功", e);
				// 放进表单图片数组中
				this.formData.userInfo.IDFront.push({
					"extname": "jpg",
					"fileID": e.tempFiles[0].url,
					"fileType": "image",
					"image": {
						"height": 150,
						"location": "",
						"width": 150
					},
					"name": "",
					"path": e.tempFiles[0].url,
					"size": 12299,
					"url": e.tempFiles[0].url
				});
				console.log(
					"this.formData.userInfo.IDFront:",
					this.formData.userInfo.IDFront
				);
			},
			// 文件上传-上传失败
			failIDFront(e) {
				console.log("上传失败：", e);
			},

			// 文件上传-获取上传状态
			selectIDReverse(e) {
				console.log("选择文件：", e);
			},
			// 文件上传-获取上传进度
			progressIDReverse(e) {
				console.log("上传进度：", e);
			},
			// 文件上传-上传成功
			successIDReverse(e) {
				console.log("上传成功", e);
				// 放进表单图片数组中
				this.formData.userInfo.IDReverse.push({
					"extname": "jpg",
					"fileID": e.tempFiles[0].url,
					"fileType": "image",
					"image": {
						"height": 150,
						"location": "",
						"width": 150
					},
					"name": "",
					"path": e.tempFiles[0].url,
					"size": 12299,
					"url": e.tempFiles[0].url
				});
				console.log(
					"this.formData.userInfo.IDReverse:",
					this.formData.userInfo.IDReverse
				);
			},
			// 文件上传-上传失败
			failIDReverse(e) {
				console.log("上传失败：", e);
			},

			// 文件上传-获取上传状态
			selectSkillCertificate(e) {
				console.log("选择文件：", e);
			},
			// 文件上传-获取上传进度
			progressSkillCertificate(e) {
				console.log("上传进度：", e);
			},
			// 文件上传-上传成功
			successSkillCertificate(e) {
				console.log("上传成功", e);
				// 放进表单图片数组中
				this.formData.userInfo.skillCertificate.push({
					"extname": "jpg",
					"fileID": e.tempFiles[0].url,
					"fileType": "image",
					"image": {
						"height": 150,
						"location": "",
						"width": 150
					},
					"name": "",
					"path": e.tempFiles[0].url,
					"size": 12299,
					"url": e.tempFiles[0].url
				});
				console.log(
					"this.formData.userInfo.skillCertificate:",
					this.formData.userInfo.skillCertificate
				);
			},
			// 文件上传-上传失败
			failSkillCertificate(e) {
				console.log("上传失败：", e);
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
		},
	};
</script>

<style>
</style>
