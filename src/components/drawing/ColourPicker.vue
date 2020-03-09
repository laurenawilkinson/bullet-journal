<template>
  <div class="colour-picker button--icon">
    <button 
      type="button" 
      class="button colour-picker__icon"
      :style="{ 'background-color': value }"
      @click="togglePicker = !togglePicker"></button>
    <picker v-if="togglePicker" v-model="localValue" @input="onColourChange" />
  </div>
</template>
<script>
import { Chrome } from 'vue-color';

export default {
  name: 'ColourPicker',
  components: {
    picker: Chrome
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: String
  },
  data () {
    return {
      togglePicker: false
    }
  },
  computed: {
    localValue: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('change', value);
      }
    }
  },
  methods: {
    onColourChange (color) {
      this.localValue = color.hex8;
    }
  }
}
</script>

<style lang="scss">
.colour-picker {
  display: inline-flex;
  position: relative;

  &__icon {
    width: 24px;
    height: 24px;
    border-radius: 50px;
    display: inline-block;
    justify-self: flex-end;
  }
  
  .vc-chrome {
    position: absolute;
    right: 5px;
    top: 35px;
    z-index: 2;
  }
}
</style>