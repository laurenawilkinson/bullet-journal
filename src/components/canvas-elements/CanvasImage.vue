<template>
  <draggable 
    :x.sync="image.x" 
    :y.sync="image.y"
    :width.sync="image.width"
    :height.sync="image.height">
    <img 
      :src="image.src" 
      :width="image.width" 
      :height="image.height" 
      draggable="false" />
  </draggable>
</template>

<script>
import Draggable from '@/components/Draggable.vue';
import SaveableImage from '@/models/SaveableImage';

export default {
  name: 'CanvasImage',
  components: {
    Draggable
  },
  model: {
    event: 'change'
  },
  props: {
    value: SaveableImage
  },
  computed: {
    image: {
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