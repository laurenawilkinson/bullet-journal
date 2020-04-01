<template>
  <draggable 
    :x.sync="svg.x"
    :y.sync="svg.y"
    :width.sync="svg.width"
    :height.sync="svg.height">
    <div 
      class="path-container" 
      v-html="svg.html"
      :style="{
        width: svg.width,
        height: svg.height  
      }"></div>
  </draggable>
</template>

<script>
import Draggable from '@/components/Draggable.vue';
import SaveableSvg from '@/models/SaveableSvg';

export default {
  name: 'CanvasSvg',
  components: {
    Draggable
  },
  model: {
    event: 'change'
  },
  props: {
    value: SaveableSvg
  },
  watch: {
    value: {
      handler () {
        this.value.updateHtml();
      },
      deep: true
    }
  },
  computed: {
    svg: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('change', value);
      }
    }
  }
}
</script>