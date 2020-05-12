<template>
<div class="colour-picker" v-on-clickaway="closePicker">
  <button 
    type="button" 
    class="colour-picker button" @click="togglePicker = !togglePicker">
    <div 
      class="colour-picker__icon"
      :style="{ 'background-color': value }">
    </div>
    <span><slot></slot></span>  
  </button>
  <picker v-if="togglePicker" v-model="localValue" @input="onColourChange" />
</div>
</template>
<script>
import { Chrome } from 'vue-color';
import { mixin as clickaway } from 'vue-clickaway';

export default {
  name: 'ColourPicker',
  mixins: [ clickaway ],
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
    },
    closePicker () {
      this.togglePicker = false;
    }
  }
}
</script>