<template>
  <button 
    type="button"
    :class="{
      'button button--icon': true,
      'button--sm': size == 'sm',
      'active': active 
    }"
    :disabled="disabled"
    v-on="$listeners"
    >
    <icon :icon="icon" :custom="custom" />
    <span v-if="$slots.default">
      <slot></slot>
    </span>
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
    size: String,
    active: Boolean,
    custom: Boolean
  }
}
</script>