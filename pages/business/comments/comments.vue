<template>
	<view class="comment-container">
		<view class="rating-section">
			<u-row customStyle="margin-bottom: 20rpx">
				<u-col span="10">
					<u-row>
						<!-- <text>服务评分</text> -->
					</u-row>
					<u-row>
						<u-rate v-model="userRating" max="5" size="100" active-color="#71d5a1"></u-rate>
					</u-row>
				</u-col>
			</u-row>
		</view>
		<view class="tags-section">
			<!-- <text>选择标签:</text> -->
			<view class="tags-list">
				<view v-for="(tag, index) in availableTags" :key="index" class="tag"
					:class="{ selected: isSelected(tag._id) }" @click="toggleTag(tag)">
					{{ tag.tagName }}
				</view>
			</view>
		</view>
		<view class="content-section">
			<!-- <text>评价内容:</text> -->
			<u--textarea v-model="userContent" placeholder="请输入您的评价" count></u--textarea>
		</view>
		<u-button customStyle="background-color: #71d5a1;color: white;" @click="submitComment">提交评价</u-button>

	</view>
</template>

<script>
export default {
	data() {
		return {
			userRating: 3,// 评分
			userContent: '',// 评价内容
			availableTags: [],// 标签
			selectedTags: [],// 选择标签
			orderID: '',// 订单ID（路由传参）
		};
	},
	methods: {
		// 获取标签
		fetchTags() {
			uniCloud.callFunction({
				name: 'commentsTag',
				data: {
					"methods": "getCommentsTag", // getCommentsTag、getCommentsTagDetail、deleteCommentsTag
					"pageNum": 1,
					"pageSize": 100,
					"isEnable": true
				},
				success: (res) => {
					this.availableTags = res.result.data;
					console.log("获取标签成功 this.availableTags", res.result.data);
				},
				fail: (err) => {
					console.error('Failed to fetch tags:', err);
				},
			});
		},
		// 选择标签
		toggleTag(tag) {
			const index = this.selectedTags.findIndex(selected => selected._id === tag._id);
			if (index > -1) {
				this.selectedTags.splice(index, 1);
			} else {
				this.selectedTags.push({ _id: tag._id, tagName: tag.tagName });
			}
			console.log(JSON.parse(JSON.stringify(this.selectedTags)));
		},
		isSelected(tagId) {
			return this.selectedTags.some(selected => selected._id === tagId);
		},
		// 提交评论
		submitComment() {
			if (this.userRating === 0) {
				uni.showToast({
					title: '请评分',
					icon: 'none',
				});
				return;
			}
			if (this.selectedTags.length === 0) {
				uni.showToast({
					title: '请选择评价标签',
					icon: 'none',
				});
				return;
			}
			const commentData = {
				rating: this.userRating,
				content: this.userContent,
				tags: this.selectedTags,
				orderID: this.orderID,// 路由传参
			};
			console.log('Submitting comment:', commentData);
			// 提交评论
			uniCloud.callFunction({
				name: 'comments',
				data: {
					"methods": "addComments",
					"data": commentData
				},
				success: (res) => {
					console.log('Comment submitted successfully:', res);
				},
				fail: (err) => {
					console.error('Failed to submit comment:', err);
				},
			});
		},
	},
	onLoad(options) {
		console.log("onLoad options", options);
		this.orderID = options.orderID;
	},
	mounted() {
		this.fetchTags();
	},
};
</script>

<style>
.comment-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.rating-section {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20px;
}

.content-section,
.tags-section {
	margin-bottom: 20px;
	width: 100%;
	max-width: 400px;
}

.tags-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.tag {
	background-color: #f0f0f0;
	border-radius: 3px;
	padding: 5px 10px;
	margin: 5px;
	cursor: pointer;
}

.tag.selected {
	background-color: #4D9FA4;
	color: white;
}
</style>