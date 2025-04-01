<template>
	<view>
		<!-- 遮罩 -->
		<u-overlay :show="overlayShow">
			<view class="warp">
				<u-loading-icon size="45" mode="semicircle" text="半圆"></u-loading-icon>
			</view>
		</u-overlay>
		<!-- 组件地址 https://ext.dcloud.net.cn/plugin?id=4288 -->
		<!-- 基础用法 -->
		<cp-goods-select height="100vh" :props="{label:'label',value:'value',children:'children'}" :options="list"
			@scrolltolower="handelScrolltolower" @category-change="handelCategoryChange">
			<cp-goods-item v-for="(item,index) in list" :key="index" :category="item.label">
				<view v-for="(cell,key) in item.children" :key="key" class="goods__item ">
					<view class="" @click="goto(`/pages/business/goodsDetail/goodsDetail?goodsID=${cell.goodsID}`)">
						<u-row>
							<!-- 商品图片 -->
							<u-col span="4">
								<u--image :src="cell.url" mode="" width="100rpx" height="100rpx"></u--image>
							</u-col>
							<!-- 商品名称 -->
							<u-col span="10">
								<text style="color:black;font-size: 30rpx;">{{cell.label}}</text>
							</u-col>
						</u-row>
						<u-row>
							<!-- 商品现格 -->
							<u-col span="8">
								现价：<text style="color:red;font-size: 30rpx;">¥{{cell.favourPrice}}</text>
							</u-col>
						</u-row>
						<u-row>
							<!-- 商品原格 -->
							<u-col span="8">
								原价：<text class="shanchu">¥{{cell.originalPrice}}</text>
							</u-col>
						</u-row>
					</view>
				</view>
			</cp-goods-item>
		</cp-goods-select>
		<!-- 独立商品列表  -->
		<!-- <cp-goods-select 
		    height="50vh" 
		    :options="list3" 
		    :props="{label:'label',value:'value',children:'children'}" 
		    @scrolltolower="handelScrolltolower" 
		    @category-change="handelCategoryChange"
		>
		    <view v-for="(item,index) in goods" :key="index" :category="item.label">
		            <view class="goods__item ">
		                {{ item.label}}
		            </view>
		    </view>
		</cp-goods-select> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 分类数据格式
				list: [
					// {
					// 	"label": "家电维修",
					// 	"value": "家电维修",
					// 	"classificationID": "63e5e3e7f5cf3a42a2324c64",
					// 	"children": []
					// }, {
					// 	"label": "购买配件",
					// 	"value": "购买配件",
					// 	"classificationID": "63e5e3f009e2987cee0efa2f",
					// 	"children": []
					// }, {
					// 	"label": "家用电器",
					// 	"value": "家用电器",
					// 	"classificationID": "644772b528064a7587ea0c7c",
					// 	"children": [{
					// 		"label": "美大天牛T7蒸烤一体",
					// 		"value": "美大天牛T7蒸烤一体",
					// 		"goodsID": "6454d1de09e298919848b09d",
					// 		"favourPrice": 14602,
					// 		"originalPrice": 20860,
					// 		"url": "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/5bc2306a-2ac5-4613-9d3e-ee7731a67845.png",
					// 		"children": []
					// 	}, {
					// 		"label": "美大天牛T36蒸箱",
					// 		"value": "美大天牛T36蒸箱",
					// 		"goodsID": "6454d20ee1a35c371b6810e0",
					// 		"favourPrice": 13762,
					// 		"originalPrice": 19660,
					// 		"url": "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/1f9cf027-ca0d-4c9e-9183-5104205e6bfb.jpg",
					// 		"children": []
					// 	}, {
					// 		"label": "美大天牛T38蒸烤一体【MD3SZK】",
					// 		"value": "美大天牛T38蒸烤一体【MD3SZK】",
					// 		"goodsID": "6454d22de766bb0085a0672d",
					// 		"favourPrice": 12362,
					// 		"originalPrice": 17660,
					// 		"url": "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/cc92b46a-a04d-43fa-b22c-7ad81267c17f.jpeg",
					// 		"children": []
					// 	}, {
					// 		"label": "美大天牛T5蒸烤一体",
					// 		"value": "美大天牛T5蒸烤一体",
					// 		"goodsID": "6454d25f0c801ca87857a50f",
					// 		"favourPrice": 10960,
					// 		"originalPrice": 15660,
					// 		"url": "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/6b4b8b7a-89ae-43a4-b614-a5f50def95ba.jpg",
					// 		"children": []
					// 	}]
					// }, {
					// 	"label": "家电清洗",
					// 	"value": "家电清洗",
					// 	"classificationID": "6447732a819ce8deee27d577",
					// 	"children": []
					// },
				],
				// 遮罩
				overlayShow: true,
				// 
				classficationData: []
			}
		},
		onLoad() {
			this.getClassficationData()
		},
		created() {

		},
		methods: {
			handelScrolltolower(e) {
				console.log(e)
			},
			handelCategoryChange(e) {
				console.log(e)
			},
			// 页面跳转
			goto(url) {
				uni.navigateTo({
					url: url,
				});
			},
			getClassificationGoodsInfo(classificationData) {
				// 重写this，重要 否则会导致 created数据出来！！！！
				var that = this
				uniCloud.callFunction({
					name: "getClassificationGoodsInfo",
					data: {
						classificationData: that.classficationData
					},
					success(res) {
						// 初始化
						// this.list = []

						that.list = res.result.data.goodsRes
						//
						console.log("getClassificationGoodsInfo res:", res.result.data.goodsRes)
						// 隐藏遮罩
						that.overlayShow = false;
					}
				})
			},
			getClassficationData() {
				// 函数调用函数，重写this
				var that = this;
				uniCloud.callFunction({
					name: "getClassification",
					data: {
						"isEnable": true
					},
					success(res) {
						// 
						that.classficationData = res.result.data.classificationData
						//
						console.log("getClassification res.result.data:", res.result.data.classificationData)
						// 调用分类查询商品数据
						that.getClassificationGoodsInfo(that.classficationData)
					}
				})
			}
		}
	}
</script>

<style>
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	.card {
		height: 30rpx;
		background: #ffffff;
		margin-top: 1%;
		margin-left: 1%;
		margin-right: 1%;
		border-radius: 15rpx;
		position: relative;
	}

	.shanchu {
		font-size: 30rpx;
		color: #82848a;
		text-decoration: line-through;
	}
</style>