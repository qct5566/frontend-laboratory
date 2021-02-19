<template>
  <component
    :is="name"
    :backgroundAlpha="0"
    src="../example/obj/male02/male02.obj"
    mtl="../example/obj/male02/male02_dds.mtl"
  ></component>
</template>

<script>
import { ModelThree, ModelObj } from 'vue-3d-model'
export default {
  components: { ModelThree, ModelObj },
  data () {
    return {
      name: ModelObj
    }
  }
}
</script>
</script>

<style>
</style>
