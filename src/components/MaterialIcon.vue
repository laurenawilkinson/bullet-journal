<template>
  <i class="material-icons" v-on="$listeners">{{ icon }}</i>
</template>
<script>
export default {
  name: 'MaterialIcon',
  props: {
    icon: String
  }
}
</script>