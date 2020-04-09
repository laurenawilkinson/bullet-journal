<template>
  <label>
    {{ text }} 
    <input
      v-model.lazy="localValue"
      v-bind="binding"
       />
  </label>
</template>

<script>
export default {
  name: 'InfoBarOptionText',
  props: {
    text: String,
    value: [ String, Number ],
    binding: Object
  },
  computed: {
    localValue: {
      get () {
        return this.value;
      },
      set (val) {
        if (!this.invalid) this.$emit('input', this.binding.type == 'number' ? parseInt(val) : val)
      }
    },
    invalid () {
      return this.value == null || this.typeInvalid;
    },
    typeInvalid () {
      const type = this.binding.type || null;
      return type 
        ? type == 'number' && isNaN(this.value)
        || type == 'number' && this.binding.min && this.binding.min > this.value
        || type == 'number' && this.binding.max && this.binding.max < this.value
        : false;
    }
  }
}
</script>