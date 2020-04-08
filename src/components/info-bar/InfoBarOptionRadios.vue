<template>
  <div>
    <label>{{ text }}</label>
    <label v-for="option in options" :key="option.value">
      {{ option.text }}
      <input 
        type="radio"
        :value="option.value"
        v-model="localValue" />
    </label>
  </div>
</template>

<script>
export default {
  name: 'InfoBarOptionRadios',
  props: {
    text: String,
    value: String,
    options: Array
  },
  model: {
    event: 'change'
  },
  computed: {
    localValue: {
      get () {
        return this.value;
      },
      set (val) {
        this.$emit('change', val)
      }
    }
  }
}
</script>

<style>
label {
  display: block;
}
</style>