<template>
  <button 
    type="button"
    :class="{
      'button button--icon': true,
      'button--sm': size == 'sm'
    }"
    :disabled="disabled"
    v-on="$listeners"
    >
    <icon :icon="icon" />
    <slot></slot>
  </button>
</template>
<script>
import Icon from '@/components/MaterialIcon.vue';

export default {
  name: 'IconButton',
  components: {
    Icon
  },
  props: {
    icon: String,
    disabled: Boolean,
    size: String
  }
}
</script>