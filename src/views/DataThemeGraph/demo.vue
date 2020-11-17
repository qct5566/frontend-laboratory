<template>
  <div>
    <a-button
      :class="$prefix('m10')"
      type="primary"
      v-for="item in buttonList"
      :key="item.label"
      @click="fun(item.label)"
    >{{ item.label }}</a-button
    >
    <data-theme-graph
      v-model="relationship"
      v-if="showGraph"
      @get-relationship="getRelationship"
    />
  </div>
</template>

<script>
import uuid from 'uuid'
import DataThemeGraph from '@/component/DataThemeGraph'
import { relationship } from '@/component/DataThemeGraph/mock'
export default {
  components: { DataThemeGraph },
  data () {
    return {
      showGraph: relationship.tables.length !== 0,
      relationship: relationship,
      buttonList: [
        {
          label: 'add'
        },
        {
          label: 'del'
        },
        {
          label: 'toggleShow'
        }
      ],
      addSum: 0
    }
  },
  // watch: {
  //   relationship: {
  //     handler (val, oldVal) {
  //       console.log('relationship', val, oldVal)
  //     }
  //   },
  //   deep: true
  // },
  methods: {
    getRelationship (msg) {
      // 通过方法获取 relationship，无需则删除
      console.log('getRelationship', msg)
    },
    fun (type) {
      const item = {
        id: uuid(),
        name: `tbl_user_group-${uuid()}`,
        columns: [
          { name: 'id', pKey: '1', type: 'int' },
          {
            name: 'userId',
            type: 'int',
            fKey: {
              name: 'pk_user_id',
              refTable: !this.addSum ? 'tbl_user' : '123',
              refColumnName: 'id'
            }
          },
          { name: 'groupName', type: 'string' }
        ]
      }
      switch (type) {
        case 'add':
          this.relationship.tables.push(item)
          this.addSum += 1
          this.showGraph = this.relationship.tables.length !== 0
          break
        case 'del':
          this.relationship.tables.pop()
          this.showGraph = this.relationship.tables.length !== 0
          break
        case 'toggleShow':
          this.showGraph = !this.showGraph
      }
    }
  }
}
</script>

<style></style>
