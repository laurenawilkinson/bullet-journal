<template>
  <div>
    <component 
      v-for="button in buttons" 
      :key="button.key"
      :is="button.component"
      class="topbar__button"
      v-bind="button.binding"
      v-on="button.events">{{ button.text }}</component>
  </div>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import ImageUploadButton from '@/components/ImageUploadButton.vue'
import ColourPicker from '@/components/drawing/ColourPicker.vue';
import StrokeWidthSlider from '@/components/drawing/StrokeWidthSlider.vue';
import InfoBarOptionSelect from '@/components/info-bar/InfoBarOptionSelect.vue';
import InfoBarOptionText from '@/components/info-bar/InfoBarOptionText.vue';
export default {
  name: 'ButtonList',
  components: {
    IconButton,
    ImageUploadButton,
    ColourPicker,
    StrokeWidthSlider,
    InfoBarOptionSelect,
    InfoBarOptionText
  },
  props: {
    buttons: Array
  }
}
</script>