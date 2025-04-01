<template>
	<view>

		<!-- mo-fab使用示例 -->
		<mo-fab :defaultY="500" type="none"/>
		<!-- mo-fab使用示例2 -->
		<moFab 
		:defaultY="300"
		@dragInit="dirinit"
		@dragmove="dirinit"
		@dragend="dirinit">
			<template #content>{{dirText}}</template>
		</moFab>
		<!-- mo-fab自定义示例3 -->
		<moFab type="left">示例3</moFab>

		<!-- mo-fab-tab 悬浮导航示例 -->
		<mo-fab-tab :tab-bar-list="tabBarList" />

	</view>
</template>

<script>
	import moFab from "@/components/mo-fab/mo-fab.vue"
	import moFabTab from "@/components/mo-fab/mo-fab-tabbar.vue"
	export default {
		components:{
			moFab,
			moFabTab
		},
		data() {
			return {
				dir: 1,
				tabBarList: [
					{
						"pagePath": "pages/tabBar/home/index",
						// "iconPath": require("./img/tabbar/icon-home-sm.png"),
						"text": "首页"
					},
					{
						"pagePath": "pages/tabBar/order/index",
						// "iconPath": require("./img/tabbar/icon-order-sm.png"),
						"text": "订单"
					},
					{
						"pagePath": "pages/tabBar/customer/index",
						// "iconPath": require("./img/tabbar/icon-customer-sm.png"),
						"text": "客户"
					}
				]
			}
		},
		computed:{
			dirText(){
				return this.dir == 1 ? '左' : '右'
			}
		},
		methods: {
			dirinit(e){
				this.dir = e.dir
			},
		}
	}
</script>
