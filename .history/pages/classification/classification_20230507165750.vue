<template>
	<view>
		<!-- 组件地址 https://ext.dcloud.net.cn/plugin?id=4288 -->
		<!-- 基础用法 -->
		<cp-goods-select height="100vh" :props="{label:'label',value:'value',children:'children'}" :options="list"
			@scrolltolower="handelScrolltolower" @category-change="handelCategoryChange">
			<cp-goods-item v-for="(item,index) in list" :key="index" :category="item.label">
				<view v-for="(cell,key) in item.children" :key="key" class="goods__item ">
					<view class="" @click="goto(`/pages/goodsDetail/goodsDetail?goodsID=${cell.goodsID}`)">
						<u-row>
							<!-- 商品图片 -->
							<u-col span="6">
								<u--image :src="cell.url" mode="" width="100rpx" height="100rpx"></u--image>
							</u-col>
							<!-- 商品名称 -->
							<u-col span="8">
								<text style="color:black;font-size: 30rpx;">{{cell.label}}</text>
							</u-col>
						</u-row>
						<u-row>
							<!-- 商品价格 -->
							<u-col span="8">
								<text style="color:red;font-size: 30rpx;">¥{{cell.favourPrice}}</text>
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
				//
				list: [{
					label: '分类1',
					value: '分类1value',
					classificationID: "",
					children: [{
							label: '分类1-商品1',
							value: '分类1-商品1value',
							goodsID: "6454d20ee1a35c371b6810e0",
							favourPrice: 10960,
							url: "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/d41137a3-b85d-462e-beeb-237e22c41725.jpeg",
							children: 'children'
						},
						{
							label: '分类1-商品2',
							goodsID: "6454d20ee1a35c371b6810e0",
							value: '分类1-商品2value',
							favourPrice: 10960,
							url: "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/d41137a3-b85d-462e-beeb-237e22c41725.jpeg",
							children: 'children',
						}
					]
				}, {
					label: '分类2',
					value: '分类2value',
					classificationID: "",
					children: [{
							label: '分类2-商品1',
							value: '分类2-商品1value',
							goodsID: "6454d1de09e298919848b09d",
							favourPrice: 10960,
							url: "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/d41137a3-b85d-462e-beeb-237e22c41725.jpeg",
							children: 'children'
						},
						{
							label: '分类2-商品2',
							value: 'value',
							goodsID: "6454d20ee1a35c371b6810e0",
							favourPrice: 10960,
							url: "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/d41137a3-b85d-462e-beeb-237e22c41725.jpeg",
							children: 'children',
						}
					],
				}, {
					label: '分类3',
					value: '分类3value',
					classificationID: "",
					children: [{
							label: '分类3-商品1',
							value: '分类3-商品1value',
							goodsID: "6454d1de09e298919848b09d",
							favourPrice: 10960,
							url: "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/d41137a3-b85d-462e-beeb-237e22c41725.jpeg",
							children: 'children'
						},
						{
							label: '分类3-商品2',
							value: '分类3-商品2value',
							goodsID: "6454d20ee1a35c371b6810e0",
							favourPrice: 10960,
							url: "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/d41137a3-b85d-462e-beeb-237e22c41725.jpeg",
							children: 'children',
						}
					],
				}, {
					label: '分类4',
					value: '分类4value',
					classificationID: "",
					children: [{
							label: '分类4-商品1',
							value: '分类4-商品1value',
							goodsID: "6454d1de09e298919848b09d",
							favourPrice: 10960,
							url: "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/d41137a3-b85d-462e-beeb-237e22c41725.jpeg",
							children: 'children'
						},
						{
							label: '分类4-商品2',
							value: '分类4-商品2value',
							goodsID: "6454d20ee1a35c371b6810e0",
							favourPrice: 10960,
							url: "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/d41137a3-b85d-462e-beeb-237e22c41725.jpeg",
							children: 'children',
						},
						{
							label: '分类4-商3',
							value: '分类4-商品3value',
							goodsID: "6454d20ee1a35c371b6810e0",
							favourPrice: 10960,
							url: "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/d41137a3-b85d-462e-beeb-237e22c41725.jpeg",
							children: 'children',
						}
					],
				}, ]
			}
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
			getClassficationGoodsData(){
				uniCloud.callFunction({
					name:"getClassification",
					data:{},
					success(res) {
						//
						this.list=[]
						//
						this.list=res.data
						//
						console.log(res.data)
					}
				})
			}
		}
	}
</script>

<style>
	.card {
		height: 30rpx;
		background: #ffffff;
		margin-top: 1%;
		margin-left: 1%;
		margin-right: 1%;
		border-radius: 15rpx;
		position: relative;
	}
</style>