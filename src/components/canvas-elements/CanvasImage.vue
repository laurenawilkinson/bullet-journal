<template>
  <draggable 
    :x.sync="image.x" 
    :y.sync="image.y"
    :width.sync="image.width"
    :height.sync="image.height"
    :max-width="canvasWidth"
    :max-height="canvasHeight"
    :buttons="imageButtons"
    @dragstop="convertToImageStoreObject"
    @resizestop="convertToImageStoreObject"
    @click:delete="removeImage">
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
    value: SaveableImage,
    canvasWidth: Number,
    canvasHeight: Number
  },
  data () {
    return {
      image: this.value
    }
  },
  computed: {
    imageButtons () {
      return [
        {
          icon: 'delete',
          key: 'delete'
        }
      ]
    }
  },
  watch: {
    image: {
      handler (value) {
        this.$emit('change', value);
      },
      deep: true
    }
  },
  methods: {
    convertToImageStoreObject () {
      const obj = {
        x: this.image.x,
        y: this.image.y,
        width: this.image.width,
        height: this.image.height,
        src: this.image.src,
      };
      this.$emit('update', { id: this.image.id, value: obj });
    },
    removeImage () {
      this.$emit('delete', this.image.id);
    }
  },
  mounted () {
    this.image = this.value;
  }
}
</script>