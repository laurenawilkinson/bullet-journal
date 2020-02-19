<template>
  <canvas id="canvas"></canvas>
</template>

<script>
import { fabric } from 'fabric';
export default {
  name: 'DrawingCanvas',
  props: {
    drawingMode: Boolean
  },
  data () {
    return {
      canvas: null
    }
  },
  watch: {
    drawingMode (value) {
      this.canvas.isDrawingMode = value;
      console.log(value ? 'drawing mode!' : 'not drwaing...')
    }
  },
  mounted () {
    this.canvas = new fabric.Canvas('canvas', { isDrawingMode: this.drawingMode, setDimensions: { width: '1000px', height: '300px' } });
  }
}
</script>

<style lang="scss" scoped>
#canvas {
  background-color: white;
}
</style>