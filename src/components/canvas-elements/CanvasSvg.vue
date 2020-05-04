<template>
  <draggable 
    :x.sync="svg.x"
    :y.sync="svg.y"
    :width.sync="svg.width"
    :height.sync="svg.height"
    @dragstop="convertToSvgStoreObject"
    @resizestop="convertToSvgStoreObject">
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
  },
  methods: {
    convertToSvgStoreObject () {
      const obj = {
        x: this.value.x,
        y: this.value.y,
        width: this.value.width,
        height: this.value.height,
        html: this.value.html,
        initialWidth: this.value.initialWidth,
        initialHeight: this.value.initialHeight
      };
      this.$emit('update', { id: this.value.id, value: obj });
    }
  }
}
</script>