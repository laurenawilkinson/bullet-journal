<template>
  <label for="images" class="button">
    <icon icon="image" />
    <span><slot></slot></span>
    <input 
      id="images"
      ref="images" 
      type="file" 
      accept="image/*" 
      name="images"
      multiple="true"
      @change="updateImages">
  </label>
</template>

<script>
import Icon from '@/components/MaterialIcon.vue'
import SaveableImage from '@/models/SaveableImage'
import EventBus from '../EventBus'

export default {
  name: 'ImageUploadButton',
  components: {
    Icon
  },
  data () {
    return {
      images: []
    }
  },
  methods: {
    async updateImages (event) {
      this.images = event.target.files || event.dataTransfer.files;

      // upload images

      for (const image of this.images) {
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (e) => {
          const img  = new Image();
          const src = e.target.result;
          img.src = src;

          img.addEventListener('load', (e) => {
            const width = e.path ? e.path[0].width : e.target.width;
            const height = e.path ? e.path[0].height : e.target.height;

            const fileToSave = new SaveableImage(
              { x: 0, y: 0, src, width, height });
            EventBus.$emit('dbup:add', { storeName: 'imageStore', value: fileToSave });
            this.images = [];
            this.$refs.images.value = '';
          });
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
input[type="file"] { 
  opacity: 0;
  z-index: -1;
  position: absolute;
}
</style>