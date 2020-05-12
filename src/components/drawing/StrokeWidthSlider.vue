<template>
<div class="stroke-width-slider" v-on-clickaway="closeSlider">
  <icon-button
    icon="adjust"
    @click="showSlider = !showSlider">
    <slot></slot>
  </icon-button>
  <div v-if="showSlider" class="stroke-width-slider__slider">
    <input v-model="localValue" type="range" min="1" max="10" />
    <div class="stroke-width-slider__preview-container">
      <span class="stroke-width-slider__preview" :style="{ width: localValue * 1.5 + 'px', height: localValue * 1.5 + 'px' }"></span>
    </div>
  </div>
</div>
</template>

<script>
import IconButton from '@/components/IconButton.vue'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'StrokeWidthSlider',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Number
  },
  mixins: [ clickaway ],
  components: {
    IconButton
  },
  data () {
    return {
      showSlider: false
    }
  },
  computed: {
    localValue: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('change', parseInt(value));
      }
    }
  },
  methods: {
    closeSlider () {
      this.showSlider = false;
    }
  }
}
</script>


<style lang="scss">
.stroke-width-slider {
  display: inline-flex;
  position: relative;

  &__slider {
    position: absolute;
    background-color: pink;
    left: 0;
    bottom: -30px;
    z-index: 2;
  }
}
</style>