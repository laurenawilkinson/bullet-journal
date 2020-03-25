<template>
  <label for="images" class="button button--icon">
    <icon icon="image" />
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
          const fileToSave = new SaveableImage(0, 0, e.target.result);

          this.$emit('display-image', fileToSave);
          this.images = [];
          this.$refs.images.value = '';
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