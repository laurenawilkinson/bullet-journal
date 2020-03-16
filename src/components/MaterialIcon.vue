<template>
  <svgicon 
    v-if="custom" 
    :name="icon"
    class="material-icons" />
  <i v-else class="material-icons" v-on="$listeners">{{ icon }}</i>
</template>

<script>
import '../assets/svgicons';

export default {
  name: 'MaterialIcon',
  props: {
    icon: String,
    custom: {
      type: Boolean,
      default: false
    }
  }
}
</script>