<template>
  <label>
    <slot></slot>
    <select v-model="localValue">
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </label>
</template>

<script>
export default {
  name: 'InfoBarOptionSelect',
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