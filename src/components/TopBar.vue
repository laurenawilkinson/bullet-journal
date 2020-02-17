<template>
<header class="topbar">
  <nav class="topbar__buttons">
    <button 
      class="button button--icon"
      type="button"
      @click="$emit('create-list')">
      <icon icon="format_list_bulleted" />
    </button>
  </nav>
</header>
</template>

<script>
import Icon from '@/components/MaterialIcon.vue';
export default {
  name: 'TopBar',
  components: {
    Icon
  }
}
</script>