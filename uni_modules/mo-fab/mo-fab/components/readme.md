## 悬浮拖拽框
基于uniapp的一种悬浮拖拽试验方法（手机上的效果会卡顿）,附一份悬浮导航示例

#### 使用 (先引入组件)  

``` js
	import moFab from "@/components/mo-fab/mo-fab.vue"
	import moFabTab from "@/components/mo-fab/mo-fab-tabbar.vue"
```

``` html
    <!-- 使用示例 -->
    <mo-fab />
    <!-- 使用示例2 -->
    <moFab><template #content>示例2</template></moFab>
    <!-- 自定义示例3 -->
    <moFab @dragmove="drag_move">示例3</moFab>

    <!-- mo-fab-tab 使用mo-fab构建的 悬浮导航 demo示例 -->
    <mo-fab-tab :tab-bar-list="tabBarList"/>
```

> 注意：图片没有上传，使用悬浮导航示例demo的时候将tabBarList列表里图片注释掉  

``` js
    drag_move(e){
        console.log('dir 移动方向', e.dir, 'grid 移动坐标', e.grid)
    },
```

#### 属性和事件  
|  属性/事件   |  说明  |  类型  |  默认值  |  
|  ----  | :-----  |  ----  | ----  |  
| type   | 悬停类型 left=左悬停、 right=右悬停、 none=悬停、 left-right=左右悬停  | String  | left-right |  
| defaultPost  | 初始化位置 (left/right) | String  | left |  
| defaultY  | 初始化位置距离底部的距离 | Number  | 120 |  
| xGap   | 距离左右两边最小间距 | Number  | 30 |  
| topGap  | 距离顶部最小间距 | Number  | 200 |  
| bottomGap  | 距离底部最小间距 | Number  | 80 |  
| defer  | 是否开启惯性位移 | Boolean  | true |  
| @dragInit  | 获取初始化值 | Function  | (ops)=>{ const {dir, grid: this.move} = ops }  |  
| @dragstart  | 拖拽开始事件 | Function  | (event)=>{} |  
| @dragmove  | 拖拽事件 | Function  | (event)=>{} (增加了dir方向判断字段，grid移动坐标字段) |  
| @dragend  | 拖拽结束事件 | Function  | (event)=>{} (增加了dir方向判断字段，grid移动坐标字段) |  

