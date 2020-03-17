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
        ? event.touches[0].clientX - (this.canvasOffset.x / 2)
        : event.offsetX;
      let pathY = event.type == 'touchstart' 
        ? event.touches[0].clientY - (this.canvasOffset.y / 2)
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
        ? event.touches[0].clientX - (this.canvasOffset.x / 2)
        : event.offsetX;
      let pathY = event.type == 'touchmove' 
        ? event.touches[0].clientY - (this.canvasOffset.y / 2)
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

        let myRect = ctx.getSerializedSvg(true);
        this.$emit('draw-rect', { 
          svg: myRect, 
          x: rect.startX, 
          y: rect.startY });
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

        var ctx = new C2S(width, height);
        ellipse.createMock(ctx, x, y);
        
        const myEllipse = ctx.getSerializedSvg(true);
        this.$emit('draw-path', { 
          svg: myEllipse, 
          x: ellipse.startX - ellipse.radiusX, 
          y: ellipse.startY - ellipse.radiusY });
      })

      this.clearCanvas();
    },
    completeLineDrawing () {
      if (this.lines.length === 0) return;

      this.lines.forEach(line => {
        let width = line.endX - line.startX + line.svgPadding;
        let height = line.endY - line.startY + line.svgPadding;
        let endX = line.endX - line.startX + line.svgPathPadding;
        let endY = line.endY - line.startY + line.svgPathPadding;
  
        const ctx = new C2S(width, height);
        line.createMock(ctx, endX, endY);
        
        var myLine = ctx.getSerializedSvg(true);
        this.$emit('draw-path', { 
          svg: myLine, 
          x: line.startX, 
          y: line.startY });

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

      var ctx = new C2S(width, height);

      this.paths.forEach(p => 
        p.createMock(ctx, smallestX, smallestY))

      var myPath = ctx.getSerializedSvg(true);

      this.$emit('draw-path', { 
        svg: myPath, 
        x: smallestX - svgPathPadding, 
        y: smallestY - svgPathPadding });
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
  mounted () {
    this.context = this.$refs.canvas.getContext('2d');
  },
  beforeDestroy () {
    if (this.paths.length > 0) this.completePathDrawing();
  }
}
</script>