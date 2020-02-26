<template>
<header class="topbar">
  <nav class="topbar__buttons">
    <icon-button 
      icon="format_shapes" 
      :active="active == 'move'"
      @click="activateMove" />
    <icon-button 
      icon="edit" 
      :active="active == 'draw'"
      @click="activateDraw" />
    <icon-button 
      icon="format_list_bulleted" 
      :active="active == 'list'"
      @click="activateList" />
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
  data () {
    return {
      active: 'move'
    }
  },
  methods: {
    update (prop, value) {
      this.$emit(`update:${prop}`, value)
    },
    activateMove () {
      this.active = 'move';
      this.update('drawing-mode', false);
    },
    activateDraw () {
      this.active = 'draw';
      this.update('drawing-mode', true);
    },
    activateList () {
      this.active = 'list';
      this.$emit('create-list');
    }
  }
}
</script>