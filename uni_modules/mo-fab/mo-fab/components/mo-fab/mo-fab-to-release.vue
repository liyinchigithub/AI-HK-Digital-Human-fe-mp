<template>
	<view class="mo-fab"
	:animation="animationData"
	@touchstart="drag_start" 
	@touchmove.stop.prevent="drag_move" 
	@touchend.stop="drag_end" 
	@touchcancel.stop="drag_end"
	>
		<view>
			<slot
			<!-- #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO || MP-BAIDU  -->
			v-if="zScopedSlots.default||zSlots.default"
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN || MP-QQ || MP-TOUTIAO || MP-BAIDU -->
			v-if="$scopedSlots.default||$slots.default"
			<!-- #endif -->
			></slot>

			<template v-else>
				<view class="mo-fab--wrap" @click="goto('/pages/business/releaseInfo/releaseInfo')">
					<u-row gutter="10">
						<!-- <u-icon name="account" color="#409EFF" size="30"></u-icon> -->
					</u-row>
					<br/>
					<u-row gutter="10">
						<text style="text-algin:center;font-size:45rpx ;">发布</text>
					</u-row>
					
				</view>
			</template>
		</view>
	</view>
</template>

<script>
/**
 * 一个悬浮拖拽框
 使用示例1：<moFab />
 使用示例2：<moFab>内容</moFab>
 使用示例3：<moFab><template #content>示例3</template></moFab>
 * 
 */
	export default {
		name: 'moFabQrCode',
		props: {
			type: { // 悬停类型 left-right || left || right || none
				type: String,
				default: 'left-right'
			},
			defaultPost: {  // 初始化位置 left || right
				type: String,
				default: 'left' 
			},
			defaultY: {  // 初始化位置距离底部的距离
				type: Number,
				default: 120
			},
			xGap: {  // 距离左右两边最小间距
				type: Number,
				default: 30
			},
			topGap: { // 距离顶部最小间距
				type: Number,
				default: 200
			},
			bottomGap: { // 距离底部最小间距
				type: Number,
				default: 80
			},
			defer: { // 是否开启惯性位移
				type: Boolean,
				default: true
			},
			deferVal: { // 惯性位移量
				type: Number,
				default: 150
			},
		},
		data() {
			return {
				fabWidth: 50,
				fabHeight: 50,
				start: [0,0],
				move: [0,0],
				pages: [0,0],
				animationData: {},
				times: [0,0],
			}
		},
		computed:{
			zScopedSlots() {
				return this.$scopedSlots;
			},
			zSlots() {
				return this.$slots;
			}
		},
        mounted() {
			this.initmove()
        },
		methods: {
			// button页面跳转
			goto(url) {
				uni.navigateTo({
					url: url
				})
			},
			getPageHeight(){
				// px转换到rpx的比例
				const { windowWidth, windowHeight } = uni.getSystemInfoSync();
				const pxToRpxScale = 750 / windowWidth;
				this.pages = [windowWidth, windowHeight]
				return { pxToRpxScale }
			},
			initmove(){
				const { pxToRpxScale } = this.getPageHeight()
				const defaultY = this.defaultY / pxToRpxScale
				const bottomGap = this.bottomGap / pxToRpxScale
				const query = uni.createSelectorQuery().in(this);
				query.select('.mo-fab').boundingClientRect(res=>{
					if(!res) return
					this.fabWidth = res.width
					this.fabHeight = res.height
					let moveX = this.pages[0] - this.fabWidth - this.xGap / pxToRpxScale
					let moveY = this.pages[1] - this.fabHeight - (bottomGap > defaultY ? bottomGap : defaultY )

					if(this.defaultPost == 'left'){
						moveX = this.xGap / pxToRpxScale
					}
					const dir = moveX > (this.pages[0] - this.fabWidth) / 2 ? -1 : 1
					this.move = [moveX,moveY]
					this.setmove({
						duration: 0,
						timingFunction: 'linear',
						x: this.move[0],
						y: this.move[1]
					})
					this.$emit('dragInit',{dir, grid: this.move})
				}).exec();
			},
			setmove(ops){
				const { duration, timingFunction, x, y } = Object.assign({
					duration: 0,
					timingFunction: 'linear',
					x: 0,
					y: 0
				}, ops)
				let animation = uni.createAnimation({
					duration,
					timingFunction,
					delay: 0,
				})
				animation.translate(x,y).step()
				this.animation = animation
				this.animationData = this.animation.export()
			},
			drag_start(event){
				const touches = event.touches[0] || event.changedTouches[0]
				this.start = [touches.clientX, touches.clientY ]
				this.times[0] = event.timeStamp
				this.$emit('dragstart',event)
            },
            drag_move(event){
				const touches = event.touches[0] || event.changedTouches[0];
				const moveX = this.move[0] - this.start[0] + touches.clientX
				const moveY = this.move[1] - this.start[1] + touches.clientY
				const dir =moveX > (this.pages[0] - this.fabWidth) / 2 ? -1 : 1

				this.setmove({
					duration: 0,
					timingFunction: 'linear',
					x: moveX,
					y: moveY
				})
				this.$emit('dragmove',{...event, dir, grid: this.move})
            },
			drag_end(event){
				const touches = event.touches[0] || event.changedTouches[0];
				this.times[1] = event.timeStamp
				const timeDiff = this.times.reduce((a,b)=>b-a, 0)
				
				const { pxToRpxScale } = this.getPageHeight()
				const xGap = this.xGap / pxToRpxScale
				const topGap = this.topGap / pxToRpxScale
				const bottomGap = this.bottomGap / pxToRpxScale

				const endX = this.pages[0] - this.fabWidth - xGap
				const endY = this.pages[1] - this.fabHeight - bottomGap
				
				const offx = touches.clientX - this.start[0]
				const offy = touches.clientY - this.start[1]

				let moveX = this.move[0] + offx
				let moveY = this.move[1] + offy
				
				if(this.defer){
					moveX = moveX + this.getEndPost(offx,timeDiff) 
					moveY = moveY + this.getEndPost(offy,timeDiff) 
				}
				
				moveY = moveY < topGap ? topGap : (moveY > endY ? endY : moveY)
				
				if(this.type == 'left'){
					moveX = xGap
				}
				if(this.type == 'right'){
					moveX = endX
				}
				if(this.type == 'left-right'){
					moveX = moveX > (this.pages[0] - this.fabWidth) / 2 ? endX : xGap
				}
				if(this.type == 'none'){
					moveX = moveX < xGap ? xGap : (moveX > endX ? endX : moveX)
				}

				const dir = moveX > (this.pages[0] - this.fabWidth) / 2 ? -1 : 1
				this.move = [moveX, moveY]
				this.setmove({
					duration: 250,
					timingFunction: 'ease-out',
					x: this.move[0],
					y: this.move[1]
				})
				this.$emit('dragend',{...event, dir, grid: this.move})
			},
			getEndPost(offset, timeDiff){
				let g = 2 * offset / Math.pow(timeDiff, 2)
				const abs = Math.abs(+ (g * 10).toFixed(4))
				g = abs < 0.01 ? 0 : g
				return g * Math.pow(this.deferVal, 2) / 2
			}
		}
	}
</script>
<style lang="scss" scoped>
	.mo-fab {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		color: #000;
		z-index: 1000;
		user-select: none;
		&--wrap{
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			border-radius: 20%;
			height: 100rpx;
			width: 100rpx;
			color: #ffffff;
			box-shadow: 0px 7rpx 18rpx 0px rgba(150, 162, 215, 0.4);
  			border: 4rpx solid #409EFF;
  			background: linear-gradient(90deg, #409EFF, #409EFF);
		}
	}
</style>
