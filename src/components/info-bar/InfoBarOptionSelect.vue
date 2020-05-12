<template>
  <div v-on-clickaway="closeSelect">
    <button 
      type="button" 
      class="button" 
      @click="toggleSelect = !toggleSelect">
      <div :class="{ 'tick-type-preview': true, 'circle': value === 'circle' }"></div>
      <span><slot></slot></span>
    </button>
    <div class="topbar__window" v-if="toggleSelect">
      <select v-model="localValue" @change="closeSelect">
        <option 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
export default {
  name: 'InfoBarOptionSelect',
  props: {
    text: String,
    value: String,
    options: Array
  },
  mixins: [ clickaway ],
  model: {
    event: 'change'
  },
  data () {
    return {
      toggleSelect: false
    }
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
  },
  methods: {
    closeSelect () {
      this.toggleSelect = false;
    }
  }
}
</script>