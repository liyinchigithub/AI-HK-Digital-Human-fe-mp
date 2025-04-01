//pagePath以自己项目的实际路径为准，这里是为了代码聚合在一起
const tabbar = {
	"tabItems":[
		{
			"pagePath": "/uni_modules/niceui-tabBar/pages/index/index",
			"icon": '/static/images/tabbar/index.png', 
			"selectedIcon":'/static/images/tabbar/index-action.png', 
			"text": '首页',
		},
		{
			"pagePath": "/uni_modules/niceui-tabBar/pages/add/add",
			"icon": '/static/images/tabbar/add.png', 
			"selectedIcon":'/static/images/tabbar/add-action.png', 
			"text": '新建',
			"up":true
		},
		{ 
			"pagePath": "/uni_modules/niceui-tabBar/pages/user/user",
			"icon": '/static/images/tabbar/me.png', 
			"selectedIcon":'/static/images/tabbar/me-action.png', 
			"text": '我的',
		}
	],
	"color":"#333",
	"selectedColor":"green",
}
export default tabbar