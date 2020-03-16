<template>
<header class="topbar">
  <nav class="topbar__buttons">
    <icon-button 
      icon="format_shapes" 
      :active="active == 'move'"
      @click="activateMove" />
    <button-dropdown
      :buttons="buttons"
      :active="active"
      @draw-active="activateDraw"
      @draw-multi-active="activateDraw(true)"
      />
    <icon-button 
      icon="format_list_bulleted" 
      @click="activateList" />
  </nav>
  <!-- <label for="draw-multi">
    <input v-model="localDrawMulti" id="draw-multi" type="checkbox" />
    Group Drawing
  </label> -->
  <stroke-width-slider v-model="localPenWidth" />
  <colour-picker v-model="localPenColor" />
</header>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import ColourPicker from '@/components/drawing/ColourPicker.vue';
import StrokeWidthSlider from '@/components/drawing/StrokeWidthSlider.vue';
import ButtonDropdown from '@/components/TopBarButtonDropdown.vue'

export default {
  name: 'TopBar',
  components: {
    IconButton,
    ColourPicker,
    StrokeWidthSlider,
    ButtonDropdown
  },
  props: {
    drawingMode: Boolean,
    penColor: String,
    penWidth: Number,
    drawMulti: Boolean
  },
  data () {
    return {
      active: 'move',
      showDropdown: false
    }
  },
  computed: {
    buttons () {
      return [
        {
          key: 'draw',
          icon: 'edit',
          text: 'Draw Path',
          active: this.active == 'draw' && !this.localDrawMulti
        },
        {
          key: 'draw-multi',
          icon: 'draw_group',
          custom: true,
          text: 'Draw Group',
          active: this.active == 'draw' && this.localDrawMulti
        }
      ]
    },
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
    },
    localDrawMulti: {
      get () {
        return this.drawMulti;
      },
      set (value) {
        this.update('draw-multi', value)
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
    activateDraw (multiDraw = false) {
      this.active = 'draw';
      this.update('drawing-mode', true);
      this.localDrawMulti = multiDraw;
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