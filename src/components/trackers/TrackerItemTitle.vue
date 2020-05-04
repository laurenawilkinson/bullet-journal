<template>
  <component :is="component" class="tracker__item-title" @click="editTitle">
    <input 
      v-if="editingTitle"
      v-model="title"
      class="text-input"
      ref="title" 
      @blur="finishEditing"
      @keyup.enter="finishEditing" />
    <span v-else>{{ title }}</span>
  </component>
</template>

<script>
export default {
  name: 'TrackerItemTitle',
  data () {
    return {
      editingTitle: false
    }
  },
  props: {
    value: String,
    verticalLayout: {
      type: Boolean,
      default: false
    },
    component: {
      type: String,
      default: 'td'
    }
  },
  computed: {
    title: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    editTitle () {
      this.editingTitle = true;
      this.$nextTick(() => this.$refs.title.focus())
    },
    finishEditing () {
      this.editingTitle = false;
      this.$emit('update');
    }
  }
}
</script>