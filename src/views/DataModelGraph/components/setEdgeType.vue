<template>
  <a-modal
    title="编辑对应关系"
    :visible="value"
    width="60%"
    :mask-closable="false"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form :form="form" layout="inline" class="tc">
      <a-form-item label="from:">
        <lw-select
          class="field-select"
          v-decorator="[
            'fromArrow',
            { ...rules.field, initialValue: item.fromArrow },
          ]"
          :list="formList"
        />
      </a-form-item>
      <a-form-item label="to">
        <lw-select
          class="field-select"
          v-decorator="[
            'toArrow',
            { ...rules.field, initialValue: item.toArrow },
          ]"
          :list="toList"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import LwSelect from '@/component/LwSelect'
import modalMixin from './mixins/modalMixin'
const list = [
  {
    label: '1',
    value: '1'
  },
  {
    label: '0,1',
    value: '0,1'
  },
  {
    label: '0,n',
    value: '0,n'
  },
  {
    label: '1,n',
    value: '1,n'
  }
]
export default {
  components: { LwSelect },
  mixins: [modalMixin],
  data () {
    return {
      form: this.$form.createForm(this),
      formList: list,
      toList: [{ label: '0', value: '0' }, ...list],
      rules: {
        field: {
          rules: [{ required: true, message: '对应关系不能为空' }]
        }
      }

    }
  },
  computed: {
    item () {
      const model = this.obj.row.get('model')
      console.log('model', model)
      return model
    }
  },
  methods: {
    handleOk () {
      this.form.validateFields((err, values) => {
        if (err) return
        const model = this.obj.row.get('model')
        // 根据结果更改边数据
        Object.assign(model, {
          ...values
        })
        this.$emit('after-save', 'setEdgeType', this.obj.row)
        this.handleCancel()
      })
    }
  }
}
</script>

<style lang="less" scope>
.field-select{
  width: 140px !important;
}
.tc{
  text-align: center;
}
</style>
