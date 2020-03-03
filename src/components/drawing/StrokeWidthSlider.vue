<template>
<div class="stroke-width-slider">
  <input v-model="localValue" type="range" min="1" max="10" />
</div>
</template>

<script>
export default {
  name: 'StrokeWidthSlider',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Number
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
  }
}
</script>