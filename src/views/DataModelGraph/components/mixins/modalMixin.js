export default {
  props: {
    value: {
      // 开关弹窗
      type: Boolean,
      default: false,
      required: true
    },
    obj: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    handleCancel () {
      this.$emit('input', false)
      // 销毁弹窗组件
      setTimeout(() => {
        if (this.obj.showModal) this.$emit('update:obj', { ...this.obj, showModal: false })
      }, 400)
    }
  }
}
