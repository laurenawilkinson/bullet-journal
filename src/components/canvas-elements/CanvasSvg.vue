<template>
  <draggable 
    :x.sync="svg.x"
    :y.sync="svg.y"
    :width.sync="svg.width"
    :height.sync="svg.height"
    :buttons="svgButtons"
    @dragstop="convertToSvgStoreObject"
    @resizestop="convertToSvgStoreObject"
    @click:delete="removeSvg">
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
    },
    svgButtons () {
      return [
        {
          icon: 'delete',
          key: 'delete'
        }
      ]
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
    },
    removeSvg () {
      this.$emit('delete', this.value.id);
    }
  }
}
</script>