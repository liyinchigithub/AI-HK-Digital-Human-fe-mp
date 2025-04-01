<template>
	<view>
		<!-- 入驻说明 -->
		<view class="">
			<u-steps current="2" dot :iconSize="50">
				<u-steps-item title="申请" desc="填写申请表">
				</u-steps-item>
				<u-steps-item title="审核" desc="官方审核" iconSize="200">></u-steps-item>
				<u-steps-item title="入驻成功" desc="可抢单/接单/派单" iconSize="200">></u-steps-item>
			</u-steps>
		</view>
		<view class="">
			<u-row customStyle="margin-top:30rpx;margin-bottom: 10px">
				<u-col span="6">

				</u-col>
				<u-col span="6">

				</u-col>
			</u-row>
		</view>
		<view class="">
			<u-row customStyle="margin-top:30rpx;margin-bottom: 10px">
				<u-col span="6">
					<!-- 商家申请入驻 -->
					<view class="demo-layout bg-purple-light">
						<u-button type="primary" text="商家申请入驻"
							@click="goto('/pages/merchantSettlement/merchantSettlement')">
						</u-button>
					</view>
				</u-col>
				<u-col span="6">
					<!-- 个人申请入驻 -->
					<view class="demo-layout bg-purple">
						<u-button type="success" text="个人申请入驻" @click="goto('/pages/individualEntry/individualEntry')">
						</u-button>
					</view>
				</u-col>
			</u-row>
		</view>
		<!-- 入驻说明 -->
		<view class="">
			<uni-card   :is-shadow="true" is-full >
			<u-row customStyle="margin-top:30rpx;margin-bottom: 10px" gutter="20">
				<u-col span="10" offset="3">
						<u--text :text="entryInstructions[0].title"  :size="40"></u--text>
				</u-col>
				</u-row>
				<u-col span="15">
					<u--text :text="entryInstructions[0].content" :size="30"></u--text>
				</u-col>
			</u-row>
		</uni-card>
		</view>
	</view>
</template>

<script>
	export default {
		"name": "settleIn",
		data() {
			return {
				entryInstructions: "", // 入驻说明
				
			}
		},
		created() {
		this.getEntryInstructions()	;
		this.getClassTypeData();
		},
		methods: {
			// 页面跳转
			goto(url) {
				uni.navigateTo({
					url: url
				})
			},
			getEntryInstructions(){
				uniCloud.callFunction({
					name:"getEntryInstructions",
					data:{
						"isEnable":true
					},
					success: (res) => {
						console.log("getEntryInstructions res.result.data:",res.result.data)
						// 只取最新一条
						this.entryInstructions=res.result.data;
					}
				})
			},
			
	
			
		}
	}
</script>

<style>

</style>
