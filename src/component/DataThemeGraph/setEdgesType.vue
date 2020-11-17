<template>
  <a-modal
    title="关联配置"
    :visible="value"
    width="530px"
    :mask-closable="false"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form :form="form" layout="vertical">
      <a-form-item label="关联方式：">
        <a-radio-group
          class="relation-type-group"
          v-decorator="['op', { initialValue: obj.row.op }]"
        >
          <a-radio
            :value="item.value"
            v-for="item in relationTypes"
            :key="item.value"
          >
            <div class="relation-type-box">
              <div
                class="relation-type-img"
                :style="{ background: `url(${item.image}) no-repeat center` }"
              ></div>
              <span class="relation-type-label">{{ item.label }}</span>
            </div>
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="两表字段关联：">
        <div
          class="relation-form"
          v-for="(item, index) in condition"
          :key="index"
        >
          <a-form-item class="relation-form-left">
            <a-cascader
              v-decorator="[
                `condition[${index}].fromField`,
                { ...rules.field, initialValue: item.fromField },
              ]"
              expand-trigger="hover"
              :options="item.leftSelectList"
              :show-search="{ filter }"
              :title="item.leftLabels"
              :displayRender="displayRender"
              placeholder="请选择"
              @change="changeField(arguments, 'left', item, index)"
            />
          </a-form-item>
          <div class="relation-form-center">
            <a-icon type="pause" :rotate="90" />
          </div>
          <a-form-item class="relation-form-right">
            <a-cascader
              v-decorator="[
                `condition[${index}].toField`,
                { ...rules.field, initialValue: item.toField },
              ]"
              expand-trigger="hover"
              :options="item.rightSelectList"
              :show-search="{ filter }"
              :title="item.rightLabels"
              :displayRender="displayRender"
              placeholder="请选择"
              @change="changeField(arguments, 'right', item, index)"
            />
          </a-form-item>
          <div class="relation-form-btn">
            <a-button
              type="link"
              v-if="condition.length > 1"
              @click="btnOpera('del', index)"
            ><a-icon
              type="minus"
            /></a-button>
            <a-button
              type="link"
              v-if="index === condition.length - 1"
              @click="btnOpera('add')"
            ><a-icon
              type="plus"
            /></a-button>
          </div>
        </div>
        <!-- <a-table
          rowKey="id"
          :pagination="false"
          bordered
          :data-source="condition"
          :columns="columns"
        ></a-table> -->
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { dataThemeType } from './G6/G6-edges'
import { jsonDeepClone } from './utils'
export default {
  props: {
    graph: {
      // 当前画布
      type: Object,
      default () {
        return {}
      },
      required: true
    },
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
        return {
          row: {},
          source: {},
          target: {},
          data: {}
        }
      },
      required: true
    }
  },
  data () {
    const fieldValid = (rule, value, callback) => {
      const field = rule.field
      const hasIndex = field.indexOf('[')
      const index = +field.substring(hasIndex)[1]
      const isLeft = field.indexOf('fromField') !== -1
      const currentKey = isLeft ? 'fromField' : 'toField'
      const otherKey = isLeft ? 'toField' : 'fromField'
      const currentRelation = {
        [currentKey]: value,
        [otherKey]: this.condition[index][otherKey]
      }

      let isHas = 0
      this.condition.forEach((e, i) => {
        if (i === index) {
          isHas += 0
        } else {
          const fromSame =
            currentRelation.fromField &&
            JSON.stringify(e.fromField) ===
              JSON.stringify(currentRelation.fromField)
          const toSame =
            currentRelation.toField &&
            JSON.stringify(e.toField) ===
              JSON.stringify(currentRelation.toField)
          isHas = fromSame && toSame ? isHas + 1 : isHas
        }
      })
      if (!value || !value[0] || !value[1]) {
        callback(Error('请选择字段'))
      }
      if (isHas) {
        callback(Error('已存在相同的关联'))
      }
      callback()
    }
    return {
      relationTypes: dataThemeType,
      form: this.$form.createForm(this),
      condition: [],
      rules: {
        field: {
          rules: [{ required: true, validator: fieldValid }]
        }
      },
      leftSelectList: [],
      rightSelectList: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // 这里处理外部传进来的回填值
      const source = this.obj.source.model || {}
      const target = this.obj.target.model || {}
      // 左侧选项是除target点以外的其他节点数据
      const nodes = this.obj.data.nodes.filter((e) => e.id !== target.id) || []
      const condition = this.obj.row.condition || []
      const leftSelectList = this.getSelectList(nodes)
      const rightSelectList = this.getSelectList([target])
      this.leftSelectList = jsonDeepClone(leftSelectList)
      this.rightSelectList = jsonDeepClone(rightSelectList)
      this.condition = condition.map((e, index) => {
        const item = {
          ...e,
          fromField: source.id && e.fromField ? [source.id, e.fromField] : [],
          toField: target.id && e.toField ? [target.id, e.toField] : [],
          leftSelectList: jsonDeepClone(leftSelectList),
          rightSelectList: jsonDeepClone(rightSelectList)
        }
        // 回填时，默认选择左边
        const leftArg = [item.fromField, item.leftSelectList]
        this.changeField(leftArg, 'left', item, index)
        const rightArg = [item.toField, item.rightSelectList]
        this.changeField(rightArg, 'right', item, index)
        // item.rightLabels = item.toField.join('.')
        return item
      })
      this.changeLeftSelectDisabled()
    },
    changeLeftSelectDisabled () {
      const values = this.form.getFieldValue(`condition[${0}].fromField`) || []
      this.leftSelectSetDisabled(values)
    },
    getSelectList (data) {
      // 处理格式具体见mock的tables
      const newData =
        data && data.length
          ? data.map((e) => {
            const item = {
              ...e,
              value: e.id,
              label: e.name,
              children:
                  e.columns && e.columns.length
                    ? e.columns.map((col) => {
                      return {
                        ...col,
                        label: col.name,
                        value: col.name
                      }
                    })
                    : []
            }
            return item
          })
          : []
      return newData
    },
    filter (inputValue, path) {
      return path.some(
        (option) =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    },
    displayRender (params) {
      const { labels } = params
      return labels ? labels.join(' . ') : ''
    },
    changeField (arg, type, item, index) {
      const values = arg[0] || []
      const list = arg[1] || []
      const isLeft = type === 'left'
      const otherField = isLeft ? 'toField' : 'fromField'
      const currentField = !isLeft ? 'toField' : 'fromField'
      const otherSelectList = isLeft ? 'rightSelectList' : 'leftSelectList'
      this.$set(item, `${type}Labels`, values.join('.'))
      this.$set(item, currentField, values)
      const currentColumn = this.getColumn(values, list)
      const currentFieldType = currentColumn.type
      // 选择一边时，根据选择的数据类型禁用另一边的选项
      if (isLeft) {
        this.leftSelectSetDisabled(values)
      }
      // 为另一边选项设置禁用项
      this.setDisabled(currentFieldType, item[otherSelectList])

      // 获取当前选项对应的边的数据
      const otherColumn = this.getColumn(
        item[otherField],
        item[otherSelectList]
      )

      //  如果对应选项被禁用，则把已有的值清空
      if (otherColumn.disabled) {
        item[otherField] = []
        this.form.setFieldsValue({
          [`condition[${index}].${otherField}`]: []
        })
      }
      this.form.validateFields((err, values) => {
        if (err) return false
      })
    },
    getColumn (value, selectList) {
      const hasValue = value && value.length
      const nodeValue = hasValue ? value[0] : ''
      const fieldValue = hasValue ? value[1] : ''
      // 获取到当前项
      const currentNode = selectList.find((e) => e.id === nodeValue) || {
        children: []
      }
      const currentColumn =
        currentNode.children.find((e) => e.name === fieldValue) || {}
      return currentColumn
    },
    leftSelectSetDisabled (values) {
      // 根据第一个选项禁用其他节点选项
      if (this.condition && this.condition.length) {
        const firstValues = values || this.condition[0].fromField
        const hasFirstValue = firstValues && firstValues.length
        const firstNodeValue = hasFirstValue ? values[0] : ''
        this.condition = this.condition.map((e, index) => {
          const item = {
            ...e,
            leftSelectList: e.leftSelectList.map((list) => {
              return {
                ...list,
                disabled:
                  index > 0
                    ? Boolean(firstNodeValue && list.value !== firstNodeValue)
                    : false
              }
            })
          }

          const currentNodeValue =
            item.fromField && item.fromField.length ? item.fromField[0] : ''
          const currentDisabled =
            item.leftSelectList.findIndex(
              (e) => e.disabled && e.value === currentNodeValue
            ) !== -1
          if (currentDisabled) {
            item.fromField = []
            this.form.setFieldsValue({
              [`condition[${index}].fromField`]: []
            })
          }
          return item
        })
      }
    },
    setDisabled (dataType, selectList) {
      // 为选项添加禁用项
      selectList &&
        selectList.length &&
        selectList.forEach((select) => {
          if (select.children && select.children.length) {
            select.children = select.children.map((child) => {
              return {
                ...child,
                disabled: Boolean(dataType && dataType !== child.type)
              }
            })
          }
        })
    },
    handleCancel () {
      this.$emit('input', false)
      const edge = this.graph.findById(this.obj.row.id)
      this.graph.setItemState(edge, 'click', false)
    },
    btnOpera (type, index) {
      const item = {
        fromField: [],
        compareOp: '=',
        toField: [],
        leftSelectList: jsonDeepClone(this.leftSelectList),
        rightSelectList: jsonDeepClone(this.rightSelectList)
      }
      switch (type) {
        case 'add':
          this.form.validateFields((err, values) => {
            if (err) {
              this.$message.error('请先完善链接条件后再添加新的链接语句')
            } else {
              this.condition.push(item)
              this.$nextTick(() => {
                this.changeLeftSelectDisabled()
              })
            }
          })
          break
        case 'del':
          this.condition.splice(index, 1)
          // 如果删除的是第一项，按照第二项重新初始化禁用项
          if (index === 0) {
            this.$nextTick(() => {
              this.changeLeftSelectDisabled()
            })
          }
          this.form.validateFields((err, values) => {
            if (err) return false
          })
          break
      }
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (err) {
          this.$message.warning('请完善链接语句后再进行保存！')
          return
        }
        const fromId = values.condition[0].fromField[0]
        // 根据结果更改边数据
        Object.assign(this.obj.row, {
          ...this.obj.row,
          from: fromId,
          source: fromId,
          op: values.op,
          isError: false,
          condition: values.condition.map((e) => {
            return {
              fromField: e.fromField[1],
              toField: e.toField[1],
              compareOp: '='
            }
          })
        })
        console.log('this.obj.row', this.obj.row)
        this.$emit('after-save')
        this.handleCancel()
      })
    }
  }
}
</script>

<style lang="less" scope>
@import './G6/G6.less';
.relation-type-group {
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  /deep/ .ant-radio-wrapper {
    display: flex;
    padding: 5px 0;
    .ant-radio {
      bottom: 2px;
      position: absolute;
      left: -15px;
      display: none;
    }
    &.ant-radio-wrapper-checked {
      color: @primary-color;
      background: #f3f3ff;
    }
  }
  .relation-type-box {
    text-align: center;
    &:hover {
      color: @primary-color;
    }
    .relation-type-img {
      width: 60px;
      height: 40px;
      text-align: center;
    }
  }
}
.relation-form {
  display: flex;
  justify-content: space-between;
  &-left,
  &-right {
    width: 200px;
    margin-bottom: 10px;
    flex: 1;
  }
  &-center {
    margin-top: 4px;
    padding: 0 10px;
    font-size: 16px;
    color: @fontColor;
  }
  &-btn {
    margin-top: -20px;
    display: flex;
    width: 60px;
    margin-left: 5px;
    margin-top: 0;
    .ant-btn-link {
      font-size: 16px;
      color: @fontColor;
      padding: 0;
      &:not(:last-child) {
        margin-right: 5px;
      }
      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
