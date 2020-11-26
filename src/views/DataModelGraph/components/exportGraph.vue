<template>
  <a-modal
    title="选中图片导出类型"
    :visible="value"
    width="60%"
    :mask-closable="false"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-radio-group v-model="exportType" >
      <a-radio value="0" class="wp100">
        导出整张关系图（当关系图内容较多时可能无法保证清晰度）
      </a-radio>
      <a-radio value="1" class="wp100">
        导出当前窗口可见区域内的关系图（当关系图内容较多时可能无法保证完整度）
      </a-radio>
    </a-radio-group>
  </a-modal>
</template>

<script>
import modalMixin from './mixins/modalMixin'
export default {
  mixins: [modalMixin],
  props: {
    graph: {
      // 当前画布
      type: Object,
      default () {
        return {}
      },
      required: true
    }
  },
  data () {
    return {
      exportType: '0'
    }
  },
  methods: {
    downloadFile (content, fileName) {
      const aLink = document.createElement('a')
      const blob = this.base64ToBlob(content) // new Blob([content]);

      const evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true)// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName || '关系图'
      aLink.href = URL.createObjectURL(blob)

      // aLink.dispatchEvent(evt);
      // aLink.click()
      aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))// 兼容火狐
    },
    // base64转blob
    base64ToBlob (code) {
      const parts = code.split(';base64,')
      const contentType = parts[0].split(':')[1]
      const raw = window.atob(parts[1])
      const rawLength = raw.length

      const uInt8Array = new Uint8Array(rawLength)

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], { type: contentType })
    },
    handleOk () {
      if (this.exportType === '0') {
        this.graph.toFullDataURL(
        // 第一个参数为 callback，必须
          (res) => {
            // ... something
            this.downloadFile(res)
          }
        )
      } else {
        const dataURL = this.graph.toDataURL()
        this.downloadFile(dataURL)
      }
    }
  }
}
</script>

<style lang="less" scope>
.wp100{
    width: 100%;
}
</style>
