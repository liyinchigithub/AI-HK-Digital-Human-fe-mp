<template>
	<view class="root-wrap">
		<scroll-view ref='scrollview' class="scroll-wrap" :style="{'padding-bottom':showBar?gapBottom+'px':''}" scroll-x
			:show-scrollbar="false" @scroll="scroll">
			<view class="test-wrap">
				<slot></slot>
			</view>

		</scroll-view>
		<view v-if="showBar" class="view-wrap" :style="{'background':lineColor,'width':lineWidth2+'px'}">
			<view class="block" :style="{'transform':translateX,'background':barColor,'width':barWidth2+'px'}"></view>
		</view>

	</view>
</template>

<script>
	/**
	 * 
	 * @prop lineColor:导航条背景色
	 * @prop lineWidth:导航条宽度
	 * @prop barColor:滑块背景色
	 * @prop barWidth:滑块长度
	 * @prop showBar:是否显示导航条
	 * 
	 * !!!注意:没有处理在无法滑动的情况下自动隐藏底部的导航条，
	 * 请用户自己判断是否显示(隐藏)导航条
	 * 
	 */
	export default {
		name: "neo-scrollist",
		data() {
			return {
				scrollWidth: '',
				translateX: '0px',
				windowWith: 0,

			};
		},
		props: {
			lineColor: {
				type: String,
				default: '#efefef'

			},
			lineWidth: {
				type: [Number, String],
				default: 50
			},
			barColor: {
				type: String,
				default: '#9acafc'
			},
			barWidth: {
				type: [Number, String],
				default: 20
			},
			showBar: {
				type: Boolean,
				default: true
			},
			gapBottom: {
				type: [Number, String],
				default: 12
			}
		},
		computed: {
			barWidth2: function() {
				if(this.barWidth>=this.lineWidth){
					throw Error('[neo-scrollist]:滑块长度不能大于导航条长度')
				}
				return this.barWidth
			},
			lineWidth2:function(){
				if(this.barWidth>=this.lineWidth){
					throw Error('[neo-scrollist]:导航条长度不能小于滑块长度')
				}
				return this.lineWidth
			},

		},
	
		mounted() {
			// this.windowWith = uni.getSystemInfoSync().windowWidth
			this.getComponentWidth()


		},

		methods: {
			scroll(event) {
				this.translateX = 'translateX(' + ((event.detail.scrollLeft / (event.detail.scrollWidth - this
					.windowWith)) * (this.lineWidth2 - this.barWidth2)) + 'px)'

			},

			// 获取组件的宽度
			getComponentWidth() {
				this.$uGetRect('.scroll-wrap').then(size => {
					this.scrollWidth = size.width + 'px'
					this.windowWith = size.width

				})
			},
			$uGetRect(selector, all) {
				return new Promise((resolve) => {
					uni.createSelectorQuery()
						.in(this)[all ? 'selectAll' : 'select'](selector)
						.boundingClientRect((rect) => {
							if (all && Array.isArray(rect) && rect.length) {
								resolve(rect)
							}
							if (!all && rect) {
								resolve(rect)
							}
						})
						.exec()
				})
			},

		}
	}
</script>

<style scoped lang="scss">
	// 隐藏scroll-view的滚动条
	scroll-view ::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		background-color: transparent;
	}

	.root-wrap {
		position: relative;
		display: flex;
		// width: 100%;
		align-items: center;
		justify-content: center;

		.scroll-wrap {
			display: flex;
			// height: 100rpx;
			white-space: nowrap;
			width: 100%;

			.test-wrap {
				position: relative;
				width: 100%;
				display: flex;


				.texte {
					position: absolute;
					right: 0;
				}
			}
		}

		.view-wrap {
			// width: 150px;
			height: 4px;
			position: absolute;
			bottom: 3px;
			border-radius: 100px;
			padding: 1px;

			.block {
				width: 30px;
				height: 100%;
				border-radius: 100px;
				background: #4CD964;
				transform: translateX(0px);
			}
		}
	}
</style>
