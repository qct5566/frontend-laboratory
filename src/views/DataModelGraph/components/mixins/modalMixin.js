export default {
  props: {
    value: {
      // 开关弹窗
      type: Boolean,
      default: false,
      required: true
    },
    obj: {
      // 必须包含当前边，左右节点，全部节点和边数据
      type: Object,
      default () {
        return { }
      },
      required: true
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
