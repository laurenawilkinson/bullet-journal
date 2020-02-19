<template>
<header class="topbar">
  <nav class="topbar__buttons">
    <icon-button icon="format_shapes" @click="update('drawing-mode', false)" />
    <icon-button icon="edit" @click="update('drawing-mode', true)" />
    <icon-button 
      icon="format_list_bulleted" 
      @click="$emit('create-list')" />
  </nav>
</header>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
export default {
  name: 'TopBar',
  components: {
    IconButton
  },
  props: {
    drawingMode: Boolean
  },
  methods: {
    update (prop, value) {
      this.$emit(`update:${prop}`, value)
    }
  }
}
</script>