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
      @draw-active="activateDraw('path')"
      @draw-multi-active="activateDraw('group')"
      />
    <icon-button 
      icon="format_list_bulleted" 
      @click="activateList" />
    <icon-button
      icon="line_tool"
      :custom="true"
      :active="active == 'draw' && drawTool == 'line'"
      @click="activateDraw('line')" />
    <icon-button
      icon="square_tool"
      :custom="true"
      :active="active == 'draw' && drawTool == 'rect'"
      @click="activateDraw('rect')" />
    <icon-button
      icon="circle_tool"
      :custom="true"
      :active="active == 'draw' && drawTool == 'ellipse'"
      @click="activateDraw('ellipse')" />
    <image-upload-button
      @display-image="$emit('display-image', $event)" />
  </nav>
  <stroke-width-slider v-model="localPenWidth" />
  <colour-picker v-model="localPenColor" />
</header>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import ColourPicker from '@/components/drawing/ColourPicker.vue';
import StrokeWidthSlider from '@/components/drawing/StrokeWidthSlider.vue';
import ButtonDropdown from '@/components/TopBarButtonDropdown.vue'
import ImageUploadButton from '@/components/ImageUploadButton.vue'

export default {
  name: 'TopBar',
  components: {
    IconButton,
    ColourPicker,
    StrokeWidthSlider,
    ButtonDropdown,
    ImageUploadButton
  },
  props: {
    drawingMode: Boolean,
    penColor: String,
    penWidth: Number,
    drawTool: String
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
          active: this.active == 'draw' && this.drawTool == 'path' 
        },
        {
          key: 'draw-multi',
          icon: 'draw_group',
          custom: true,
          text: 'Draw Group',
          active: this.active == 'draw' && this.drawTool == 'group'
        }
      ]
    },
    localDrawTool: {
      get () {
        return this.drawTool;
      },
      set (value) {
        this.update('draw-tool', value)
      }
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
    activateDraw (drawTool) {
      this.active = 'draw';
      this.update('drawing-mode', true);
      this.localDrawTool = drawTool;
    },
    activateList () {
      this.activateMove();
      this.$emit('create-list');
    },
    activateImage () {
      this.activateMove();
      this.$emit('create-image');
    },
    redPen () {
      this.$emit('change-pen', this.penColor);
    }
  }
}
</script>