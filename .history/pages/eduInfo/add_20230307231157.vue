<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="eduInfoType" label="教育咨询类型" required>
        <uni-data-picker v-model="formData.eduInfoType" collection="eduInfoType" field="eduInfotypeName as text,_id as value" trim="both"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="title" label="标题" required>
        <uni-easyinput placeholder="请输入" v-model="formData.title"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="contentsConsultation" label="内容">
        <textarea placeholder="请输入" @input="binddata('contentsConsultation', $event.detail.value)" class="uni-textarea-border" v-model="formData.contentsConsultation"></textarea>
      </uni-forms-item>
      <uni-forms-item name="coverImage" label="封面图片">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png,gif,bmp,jpeg" return-type="object" v-model="formData.coverImage"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="imageList" label="内容图片">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png,gif,bmp,jpeg" :limit="10" return-type="array" v-model="formData.imageList"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="videoSrc" label="视频">
        <uni-file-picker file-mediatype="video" file-extname="mp4," return-type="object" v-model="formData.videoSrc"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="dateTime" label="日期时间" required>
        <uni-datetime-picker return-type="timestamp" v-model="formData.dateTime"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="isEnable" label="是否启用" required>
        <uni-data-checkbox v-model="formData.isEnable" :localdata="formOptions.isEnable_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/eduInfo.js';

  const db = uniCloud.database();
  const dbCollectionName = 'eduInfo';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.indexOf(key) > -1) {
        result[key] = validator[key]
      }
    }
    return result
  }

  

  export default {
    data() {
      let formData = {
        "eduInfoType": "",
        "title": "",
        "contentsConsultation": "",
        "coverImage": null,
        "imageList": [],
        "videoSrc": null,
        "dateTime": null,
        "isEnable": 1
      }
      return {
        formData,
        formOptions: {
          "isEnable_localdata": [
            {
              "text": "否",
              "value": 0
            },
            {
              "text": "是",
              "value": 1
            }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            icon: 'none',
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>

<style>
  .uni-container {
    padding: 15px;
  }

  .uni-input-border,
  .uni-textarea-border {
    width: 100%;
    font-size: 14px;
    color: #666;
    border: 1px #e5e5e5 solid;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .uni-input-border {
    padding: 0 10px;
    height: 35px;

  }

  .uni-textarea-border {
    padding: 10px;
    height: 80px;
  }

  .uni-button-group {
    margin-top: 50px;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    justify-content: center;
  }

  .uni-button {
    width: 184px;
  }
</style>
