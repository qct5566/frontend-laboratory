<template>
  <model-graph v-model="modelData"/>
</template>

<script>
import modelGraph from './components/modelGraph'
import { modelData } from './const'
export default {
  name: 'DataModelGraphDom',
  components: { modelGraph },
  data () {
    return {
      modelData
    }
  }
}
</script>

<style>

</style>
