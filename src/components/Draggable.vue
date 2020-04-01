<template>
  <vue-draggable-resizable 
    v-bind="draggableBinding" 
    @dragstop="setNewPosition"
    @resizing="setNewSize">
    <slot></slot>
  </vue-draggable-resizable>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'

export default {
  name: 'Draggable',
  props: {
    component: {
      type: String,
      default: 'div'
    },
    id: Number,
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowResize: {
      type: Boolean,
      default: false
    },
    width: Number,
    height: Number
  },
  model: {
    event: 'change'
  },
  data () {
    return {
    }
  },
  computed: {
    draggableBinding () {
      return {
        w: this.width,
        h: this.height,
        x: this.x,
        y: this.y,
        'lock-aspect-ratio': true
      }
    }
  },
  watch: {
    x (val) {
    },
    y (val) {
    }
  },
  methods: {
    setNewPosition (x, y, width, height) {
      this.$emit('update:x', x);
      this.$emit('update:y', y);
    },
    setNewSize (x, y, width, height) {
      this.$emit('update:width', width);
      this.$emit('update:height', height);
    }
  }
}
</script>