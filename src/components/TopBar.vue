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
      @click="activateList" />
  </nav>
  <stroke-width-slider v-model="localPenWidth" />
  <colour-picker v-model="localPenColor" />
</header>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import ColourPicker from '@/components/drawing/ColourPicker.vue';
import StrokeWidthSlider from '@/components/drawing/StrokeWidthSlider.vue';
export default {
  name: 'TopBar',
  components: {
    IconButton,
    ColourPicker,
    StrokeWidthSlider
  },
  props: {
    drawingMode: Boolean,
    penColor: String,
    penWidth: Number
  },
  data () {
    return {
      active: 'move',
    }
  },
  computed: {
    localPenColor: {
      get () {
        return this.penColor;
      },
      set (value) {
        this.update('pen-color', value)
      }
    },
    localPenWidth: {
      get () {
        return this.penWidth;
      },
      set (value) {
        this.update('pen-width', value)
      }
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
      this.activateMove();
      this.$emit('create-list');
    },
    redPen () {
      this.$emit('change-pen', this.penColor);
    }
  }
}
</script>