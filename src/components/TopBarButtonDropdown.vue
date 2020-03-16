<template>
  <div class="dropdown-button">
    <icon-button 
      :icon="currentIcon.icon" 
      :active="currentIcon.active"
      :custom="currentIcon.custom"
      @click="activate(currentIcon)" />
    <icon-button
      icon="arrow_drop_down"
      class="dropdown-button__caret"
      @click="toggleDropdown" />
    <div v-if="showDropdown" v-on-clickaway="closeDropdown" class="dropdown-button__dropdown">
      <icon-button 
        v-for="button in buttons"
        :key="button.key"
        :icon="button.icon" 
        :active="currentIcon.active"
        :custom="button.custom"
        @click="activate(button)">
        {{ button.text }}
      </icon-button>
    </div>
  </div>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import { mixin as clickaway } from 'vue-clickaway';
export default {
  name: 'TopBarButtonDropdown',
  props: {
    buttons: Array,
    active: String
  },
  mixins: [ clickaway ],
  components: {
    IconButton
  },
  data () {
    return {
      showDropdown: false,
      currentIcon: {}
    }
  },
  methods: {
    activate (button) {
      this.$emit(button.key + '-active');
      this.currentIcon = button;
      this.closeDropdown();
    },
    toggleDropdown () {
      this.showDropdown = !this.showDropdown;
    },
    closeDropdown () {
      this.showDropdown = false;
    }
  },
  created () {
    this.currentIcon = this.buttons[0];
  }
}
</script>