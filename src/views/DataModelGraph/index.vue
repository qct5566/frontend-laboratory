<template>
  <div :class="classPrefix">
    <div :class="`${classPrefix}-header`">
      <div :class="`${classPrefix}-header-opera`">
        <a-button
          type="primary"
          size="small"
          v-for="item in testOpera"
          :key="item.value"
          @click="opera(item.value, item)"
        >{{ item.label }}</a-button
        >
      </div>
      <div :class="`${classPrefix}-header-zoom`">放大倍数：{{ zoom }}X</div>
    </div>
    <div :class="`${classPrefix}-content`">
      <model-graph
        v-model="modelData"
        :currentGraph.sync="graph"
        @get-data="getData"
      />
    </div>
    <div :class="`${classPrefix}-footer`"></div>
  </div>
</template>

<script>
import modelGraph from './components/modelGraph'
import { modelData } from './const'
import uuid from 'uuid'
export default {
  name: 'DataModelGraphDom',
  components: { modelGraph },
  data () {
    return {
      classPrefix: 'data-model-layout',
      modelData,
      graph: {},
      testOpera: [
        {
          label: '导出',
          value: 'export'
        },
        {
          label: '新增',
          value: 'add'
        }
      ]
    }
  },
  computed: {
    zoom () {
      const zoom = Object.keys(this.graph).length ? this.graph.getZoom() : 1.0
      return zoom.toFixed(1)
    }
  },
  methods: {
    getData (data) {
      this.modelData = data
      console.log('data', data)
    },
    opera (type, item) {
      switch (type) {
        case 'add':
          const len = this.modelData.tables.length - 1
          const currentFirstPoyint =
            len < 0
              ? { x: 300, y: 300 }
              : {
                x: this.modelData.tables[len].x + 200,
                y: this.modelData.tables[len].y + 200
              }
          const addItem = {
            modelTableId: uuid(),
            dbInstanceId: 1,
            typeName: 'mysql',
            modelName: 'tablemodel3',
            modelNo: '1',
            physicalTableName: 'table2',
            desc: 'desc!!',
            order: 1,
            columns: [
              {
                id: '3',
                modelTableId: '2bb',
                columnName: 'tb2col1',
                columnDesc: 'd2',
                columnType: '0',
                comment: 'd2',
                isPk: 0,
                isFk: 0,
                isNull: 0,
                isAutoIncre: 0,
                defaultValue: '0',
                order: 1,
                isView: null
              }
            ],
            ...currentFirstPoyint
          }
          this.modelData.tables.push(addItem)
          break

        default:
          break
      }
    }
  }
}
</script>

<style lang="less" scope>
@import '~ant-design-vue/lib/style/index';
@headerHeight: 30px;
@FooterHeight: 0px;

.data-model-layout {
  width: 100%;
  height: 100vh;
  overflow: auto;
  &-header {
    background: #fff;
    box-shadow: 0 0 5px 0 #cacaca;
    height: @headerHeight;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-opera {
      padding: 0 20px;
      .ant-btn {
        &:not(:last-child) {
          margin-right: 10px;
        }
      }
    }
    &-zoom {
      padding: 0 20px;
      color: green;
    }
  }
  &-content {
    width: 100%;
    height: calc(100% - @headerHeight);
  }
}
</style>
