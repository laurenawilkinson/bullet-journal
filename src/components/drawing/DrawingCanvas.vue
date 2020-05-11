<template>
  <canvas 
    :width="width"
    :height="height"
    ref="canvas" 
    class="drawing-canvas"
    @mousedown="onMouseDown"
    @touchstart="onMouseDown"
    @mousemove="onMouseMove"
    @touchmove="onMouseMove"
    @mouseout="onMouseUp"
    @mouseup="onMouseUp"
    @touchend="onMouseUp"></canvas>
</template>

<script>
import { Path, Circle, Rectangle, Line } from '@/models/Drawables'
import EventBus from '../../EventBus';
// CARE: I have edited canvas2svg to include a PR
// that adds support for the ellipse method.
import C2S from '@/assets/canvas2svg'
// const C2S = require('canvas2svg');

export default {
  name: 'DrawingCanvas',
  props: {
    drawingMode: Boolean,
    drawTool: String,
    width: Number,
    height: Number,
    color: String,
    strokeWidth: Number,
    canvasOffset: Object
  },
  data () {
    return {
      context: null,
      paths: [],
      lines: [],
      rects: [],
      ellipses: [],
      isDrawing: false
    }
  },
  methods: {
    updatePaths () {
      this.$emit('update:paths', this.paths);
    },
    onMouseDown (event) {
      if (!this.drawingMode) return;

      let pathX = event.type == 'touchstart' 
        ? event.touches[0].clientX - this.canvasOffset.x
        : event.offsetX;
      let pathY = event.type == 'touchstart' 
        ? event.touches[0].clientY - this.canvasOffset.y
        : event.offsetY;

      this.isDrawing = true;

      switch (this.drawTool) {
        case 'line':
          this.lines.push(new Line (pathX, pathY, this.strokeWidth, this.color))
          break;
        case 'rect':
          this.rects.push(new Rectangle (pathX, pathY, this.strokeWidth, this.color))
          break;
        case 'ellipse':
          this.ellipses.push(new Circle (pathX, pathY, this.strokeWidth, this.color))
          break;
        default:
          this.paths.push(new Path (pathX, pathY, this.strokeWidth, this.color))    
      }
    },
    onMouseMove (event) {
      if (!this.isDrawing || !this.drawingMode) return;

      let pathX = event.type == 'touchmove' 
        ? event.touches[0].clientX - this.canvasOffset.x
        : event.offsetX;
      let pathY = event.type == 'touchmove' 
        ? event.touches[0].clientY - this.canvasOffset.y
        : event.offsetY;

      switch (this.drawTool) {
        case 'line':
          this.lines[this.lines.length - 1].draw(this.context, pathX, pathY);
          break;
        case 'rect':
          this.rects[this.rects.length - 1].draw(this.context, pathX, pathY);
          break;
        case 'ellipse':
          this.ellipses[this.ellipses.length - 1].draw(this.context, pathX, pathY);
          break;
        default:
          this.paths[this.paths.length - 1].draw(this.context, pathX, pathY);    
      }
    },
    onMouseUp () {
      if (!this.drawingMode) return;

      this.isDrawing = false;
      this.updatePaths();
      if (this.lines.length > 0){
        this.lines[this.lines.length - 1].finish(this.context)
        this.completeLineDrawing()
      }
      if (this.rects.length > 0) {
        this.rects[this.rects.length - 1].finish(this.context)
        this.completeRectDrawing()
      }
      if (this.ellipses.length > 0){
        this.ellipses[this.ellipses.length - 1].finish(this.context)
        this.completeEllipseDrawing()
      }
      if (this.drawTool == 'path') this.completePathDrawing();
    },
    completeRectDrawing () {
      if (this.rects.length === 0) return;

      this.rects.forEach(rect => {
        let width = rect.width + rect.svgPadding;
        let height = rect.height + rect.svgPadding;
        let ctx = new C2S(width, height);

        rect.createMock(ctx);

        const svgEl = ctx.getSvg();
        
        this.$emit('draw-rect', { 
          el: svgEl, 
          x: rect.startX, 
          y: rect.startY,
          width,
          height });
      })
      this.clearCanvas();
    },
    completeEllipseDrawing () {
      if (this.ellipses.length === 0) return;

      this.ellipses.forEach(ellipse => {
        let width = ellipse.radiusX * 2 + ellipse.svgPadding;
        let height = ellipse.radiusY * 2 + ellipse.svgPadding;
        let x = ellipse.radiusX * 2 + ellipse.svgPathPadding;
        let y = ellipse.radiusY * 2 + ellipse.svgPathPadding;

        const ctx = new C2S(width, height);
        ellipse.createMock(ctx, x, y);
        
        const svgEl = ctx.getSvg();

        this.$emit('draw-path', { 
          el: svgEl, 
          x: ellipse.startX - ellipse.radiusX, 
          y: ellipse.startY - ellipse.radiusY,
          width,
          height });
      })

      this.clearCanvas();
    },
    completeLineDrawing () {
      if (this.lines.length === 0) return;

      this.lines.forEach(line => {
        let w = line.endX - line.startX;
        let h = line.endY - line.startY;

        let width = Math.abs(w) + line.svgPadding;
        let height = Math.abs(h) + line.svgPadding;
        let endX = line.endX - line.startX + line.svgPathPadding;
        let endY = line.endY - line.startY + line.svgPathPadding;
  
        const ctx = new C2S(width, height);
        line.createMock(ctx, endX, endY);

        const svgEl = ctx.getSvg();

        this.$emit('draw-path', { 
          el: svgEl, 
          x: line.startX, 
          y: line.startY,
          width,
          height });

      })

      this.clearCanvas();
    },
    completePathDrawing () {
      if (this.paths.length === 0) return;

      let smallestX = this.paths[0].smallestX;
      let smallestY = this.paths[0].smallestY;
      let largestX = this.paths[0].largestX;
      let largestY = this.paths[0].largestY;

      this.paths.forEach(p => {
        smallestX = p.smallestX < smallestX ? p.smallestX : smallestX;
        smallestY = p.smallestY < smallestY ? p.smallestY : smallestY;
        largestX = p.largestX > largestX ? p.largestX : largestX;
        largestY = p.largestY > largestY ? p.largestY : largestY;
      })

      /* resize paths canvas */

      let svgPadding = this.paths[0].svgPadding;
      let svgPathPadding = this.paths[0].svgPathPadding;

      let width = largestX - smallestX + svgPadding;
      let height = largestY - smallestY + svgPadding;

      /* redraw on mock canvas */

      const ctx = new C2S(width, height);

      this.paths.forEach(p => 
        p.createMock(ctx, smallestX, smallestY))

      const svgEl = ctx.getSvg();

      this.$emit('draw-path', { 
        el: svgEl,
        x: smallestX - svgPathPadding, 
        y: smallestY - svgPathPadding,
        width,
        height });
      this.clearCanvas();
      this.updatePaths();
    },
    clearCanvas () {
      this.paths = [];
      this.lines = [];
      this.ellipses = [];
      this.rects = [];
      this.context.clearRect(0, 0, this.width, this.height); // clear canvas
    }
  },
  created () {
    EventBus.$on('draw:finish-path', () => this.completePathDrawing());
  },
  mounted () {
    this.context = this.$refs.canvas.getContext('2d');
  },
  beforeDestroy () {
    if (this.paths.length > 0) this.completePathDrawing();
  }
}
</script>