<template>
  <a-select
    v-bind="bind"
    v-on="$listeners"
    :option-label-prop="optionLabelProp"
    @change="changeSelect"
  >
    <a-select-option
      v-for="(item, index) in list"
      :value="item[valueKey]"
      :key="item[valueKey]"
      :disabled="item[disabledKey]"
      :label="optionLabelProp === 'label' ?item[labelKey] : ''"
      v-bind="optionBind(item)"
    >
      <slot v-if="$slots.label || $scopedSlots.label" name="label" v-bind="{ item, index }" />
      <span v-else>{{ item[labelKey] }}</span>
    </a-select-option>
    <div v-for="slot in Object.keys($slots)" :key="slot" :slot="slot">
      <slot :name="slot" v-if="slot !== 'label'" />
    </div>
    <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="text, row, index">
      <slot :name="slot" v-bind="{ text, row, index }" v-if="slot !== 'label'"/>
    </template>
  </a-select>
</template>

<script>
// 使用change方法时候，会出发内部方法，导致两次调用，请使用change-select
// 使用扩展菜单功能插槽dropdownRender 时，出现样式错乱，如果需要使用，请不要使用本组件
export default {
  name: 'LwSelectCom',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    optionLabelProp: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Array],
      default: ''
    },
    mode: {
      type: String,
      default: 'default'
    },
    optionProps: {
      type: Object,
      default () {
        return {}
      }
    },
    list: {
      type: Array,
      default () {
        return []
      }
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    disabledKey: {
      type: String,
      default: 'disabled'
    }
  },
  data () {
    return {}
  },
  computed: {
    bind () {
      const bind = this.$attrs
      const isFormVdecorator = this.$attrs['data-__field'] && this.$attrs['data-__meta']
      bind.value = isFormVdecorator
        ? this.$attrs['data-__field'].value || this.$attrs['data-__meta'].initialValue
        : this.defaultValue
      delete bind['data-__field']
      delete bind['data-__meta']
      return bind
    },
    defaultValue: {
      get () {
        return this.value
      },
      set () {
        const isNull = this.mode !== 'default' && !this.value ? [] : ''
        this.$emit('input', this.defaultValue || isNull)
      }
    }
  },
  mounted () {
    // console.log('this.$attrs', this.$attrs)
  },
  methods: {
    optionBind (item) {
      const optionBind = {}
      Object.keys(this.optionProps).forEach(key => {
        optionBind[key] = item[this.optionProps[key]]
      })
      return optionBind
    },
    changeSelect (value, option) {
      const currentOption = this.list.find(e => e[this.valueKey] === value)
      this.$nextTick(() => {
        this.$emit('change', value, option, currentOption)
        this.$emit('change-select', value, option, currentOption) // 不想调用两次change用此方法
      })
    }
  }
}
</script>

<style></style>
