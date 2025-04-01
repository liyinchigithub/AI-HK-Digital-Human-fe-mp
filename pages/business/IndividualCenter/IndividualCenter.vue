<template>
	<view>
		<!-- 个人中心 -->
		<u-row justify="space-between" gutter="2" customStyle="margin-left: 30px;margin-bottom: 10px;margin-top: 10px;">
			<u-col span="5">
				<view class="">头像</view>
			</u-col>
			<u-col span="3">
				<view class="" v-show="isShow">
					<button  open-type="chooseAvatar" @chooseavatar="onChooseAvatar" size="normal"
						type="primary">获取头像</button>
				</view>
				<view class="" v-show="!isShow">
					<u--image :src="avatarUrl" shape="circle" width="80rpx" height="80rpx"></u--image>
				</view>
			</u-col>
		</u-row>
		<u-line></u-line>
		<u-row justify="space-between" customStyle="margin-left: 30px;margin-bottom: 10px;margin-top: 10px;" @click="">
			<u-col span="6">
				<view class="">昵称</view>
			</u-col>
			<u-col span="6">
				<view class="">
					<input  v-model="nickName" type="nickname" placeholder="点击同步微信昵称"
						@blur="onNickname"></input>
				</view>
			</u-col>
		</u-row>
		<u-line></u-line>
		<u-row justify="space-between" customStyle="margin-left: 30px;margin-bottom: 10px;margin-top: 10px;"
			@click="genderShow = true">
			<u-col span="6">
				<view class="">性别</view>
			</u-col>
			<u-col span="3">
				<view class="">
					{{gender}}
				</view>
			</u-col>
		</u-row>
		<u-line></u-line>
		<u-button type="primary" text="保存" @click="saveIndividuaCenter()"></u-button>
		<!-- 性别选择器 -->
		<u-picker ref="uPicker" :show="genderShow" :columns="columns" :loading="loading" @change="changeHandler"
			@confirm="confirm" @cancel="cancel" @close="close"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 是否显示获取头像按钮
				isShow: true,
				// 头像、昵称、性别
				avatarUrl: "",
				nickName: "",
				gender: "女",
				// 选择框
				loading: false,
				genderShow: false,
				columns: [
					['男', '女']
				],
			}
		},
		methods: {
			// 设置头像
			onChooseAvatar(e) {
				console.log(e, '---onChooseAvatar');
				this.avatarUrl = e.detail.avatarUrl
				console.log('avatarUrl：', this.avatarUrl);
				// 隐藏按钮
				this.isShow = false
			},
			// 设置用户昵称
			onNickname() {
				console.log("this.nickName：", this.nickName);
			},
			// 性别选择器-确定
			confirm(e) { // 回调参数为包含columnIndex、value、values
				console.log('confirm', e)
				// 关闭选择器
				this.genderShow = false
				// 
				this.gender = e.value[0]
				console.log("this.gender:", this.gender)
				
			},
			// 性别选择器-取消
			cancel() {
				this.genderShow = false
			},
			// 性别选择器-关闭
			close() {
				this.genderShow = false
			},
			// 性别选择器
			changeHandler(e) {
				console.log("e:", e)
			},
			// 保存
			saveIndividuaCenter() {
				var that = this
				// 请求云函数-修改昵称、头像、性别
				uniCloud.callFunction({
					name: "updateUser",
					data: {
						"nickName": that.nickName,
						"avatarUrl": that.avatarUrl,
						"gender": that.gender,
						"openID": uni.getStorageSync("openID")
					},
					success(res) {
						console.log("updateUser:", res)
						
						uni.showToast({
							title:"保存成功"
						})
					}
				})
			}
		},
		onLoad() {
			//
			var that = this;
			// 请求云函数，获取个人信息  todo
			uniCloud.callFunction({
				name: "getUser",
				data: {
					"openID": uni.getStorageSync("openID")
				},
				success(res) {
					console.log("getUser res:", res.result.data[0])
					that.avatarUrl = res.result.data[0].avatarUrl
					that.nickName = res.result.data[0].nickName
					that.gender = res.result.data[0].gender
					
					//  判断是否已有头像
					if (that.avatarUrl != "" || that.avatarUrl != undefined) {
						that.isShow = false
					}
					
					
				}
			})
			
		}
	}
</script>

<style>

</style>