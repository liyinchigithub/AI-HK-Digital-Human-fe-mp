<template>  
  <view>  
		<view>我的</view>
		<custom-tab-bar :items="tabItems" :currentIndex="currentTab" @item-click="onTabClick"
		:color="color" :selectedColor="selectedColor"></custom-tab-bar>
  </view>  
</template>  
  
<script>  
import CustomTabBar from '@/uni_modules/niceui-tabBar/components/niceui-tabBar/niceui-tabBar.vue';  
import tabbar from '@/uni_modules/niceui-tabBar/common/tabbar.js'
export default {  
  components: {  
    CustomTabBar  
  },  
  data() {  
    return {  
		currentTab: 2, // 当前选中的tab索引  
		tabItems:tabbar.tabItems,
		color:tabbar.color,
		selectedColor:tabbar.selectedColor
    }
  },
  methods: {  
	 onTabClick(index) { // 切换tab的函数，当选中某个tab时触发  
	   //this.currentTab = index;
	   if(index!=this.currentTab){
			uni.redirectTo({
				url:this.tabItems[index].pagePath
			})
	   }
	 }  
   }  
};  
</script>