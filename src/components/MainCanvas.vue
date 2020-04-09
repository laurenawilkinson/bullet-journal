<template>
<main class="canvas-container">
  <div 
    id="canvas" 
    :class="{ canvas: true, 'canvas--drawing': drawingMode }" 
    ref="canvas" 
    @mousemove="trackMouse" 
    @touchmove="trackMouse">
    <bullet-list 
      v-for="(list, index) in lists"
      ref="lists"
      :key="list.id" 
      :position="list.position"
      :items.sync="list.items"
      :move-mode="!drawingMode"
      @remove-list="removeList(list.id)"
      @set-active="setActive(index, 'lists')" />
    <base-tracker 
      v-for="(tracker, index) in trackers" 
      ref="trackers"
      :key="tracker.id"
      :position="tracker.position"
      :items="tracker.items"
      :options.sync="tracker.options"
      @set-active="setActive(index, 'trackers')" />
    <canvas-svg 
      v-for="(svg, i) in svgs" 
      :key="i"
      v-model="svgs[i]" />
    <drawing-canvas 
      v-if="drawingMode"
      ref="drawingCanvas"
      :width="canvasWidth" 
      :height="canvasHeight" 
      :drawing-mode="drawingMode"
      :color="penColor"
      :stroke-width="penWidth"
      :canvas-offset="canvasOffset"
      :draw-tool="drawTool"
      :paths.sync="paths"
      @draw-path="drawPath"
      @draw-rect="drawPath" />
    <canvas-image 
      v-for="(image, i) in images" 
      :key="image.src + i"
      v-model="images[i]" />
    <div v-if="showOverlay" class="overlay" @click="createItem"></div>
    <div 
      v-if="showOverlay"
      class="tooltip"
      :style="{ position: 'absolute', top: mouse.y + 'px', left: mouse.x + 'px', pointer: 'crosshair' }"
      @click="createItem">
      Click to place {{ overlayType }}
    </div>
  </div>
    <aside 
      v-if="showDrawMultiOverlay"
      class="multi-draw-overlay"
      @click="completeDrawing">
      Finish group drawing
    </aside>
</main>
</template>

<script>
import BulletList from '@/components/lists/BulletList.vue'
import BaseTracker from '@/components/trackers/BaseTracker.vue'
import DrawingCanvas from '@/components/drawing/DrawingCanvas.vue'
import CanvasImage from '@/components/canvas-elements/CanvasImage.vue'
import CanvasSvg from '@/components/canvas-elements/CanvasSvg.vue'
import SaveableSvg from '@/models/SaveableSvg';
import List from '@/models/List';
import Tracker from '@/models/Tracker';

export default {
  name: 'MainCanvas',
  components: {
    BulletList,
    DrawingCanvas,
    CanvasImage,
    CanvasSvg,
    BaseTracker
  },
  props: {
    drawingMode: Boolean,
    drawTool: String,
    penColor: String,
    penWidth: Number,
    canvasOffset: Object,
    images: Array
  },
  data () {
    return {
      svgs: [],
      canvasWidth: 0,
      canvasHeight: 0,
      showOverlay: false,
      overlayType: 'list',
      lists: [],
      mouse: { x: 0, y: 0 },
      paths: [],
      trackers: []
    }
  },
  computed: {
    showDrawMultiOverlay () {
      return this.drawTool == 'group' && this.drawingMode && this.paths.length > 0;
    },
    layers () {
      const svgs = this.svgs.map(x => {
        return {
          ...x,
          component: 'draggable'
        }
      })
      const lists = this.lists.map(x => {
        return { ...x, component: 'bullet-list'}
      })

      return [ ...svgs, ...lists ].sort((a, b) => a.order - b.order);
    }
  },
  methods: {
    trackMouse (event) {
      if (!this.showOverlay) return;

      this.mouse.x = event.clientX - this.canvasOffset.x / 2;
      this.mouse.y = event.clientY - this.canvasOffset.y / 2;
    },
    openOverlay (overlay) {
      this.overlayType = overlay;
      this.showOverlay = true;
    },
    createItem () {
      this.showOverlay = false;
      if (this.overlayType == 'list') {
        this.lists.push(new List({ position: { x: this.mouse.x, y: this.mouse.y }}));
        this.setActive(this.lists.length - 1, 'lists');
      } else if (this.overlayType == 'tracker') {
        this.trackers.push(new Tracker({ position: { x: this.mouse.x, y: this.mouse.y }}));
        this.setActive(this.trackers.length - 1, 'trackers');
      }
    },
    removeList (id) {
      let index = this.lists.map(i => i.id).indexOf(id);
      if (index < 0) return;
      this.$emit('update:lists', this.lists.splice(index, 1));
    },
    async setActive (activeIndex, ref) {
      await this.$nextTick();

      this.$refs[ref].forEach((item, index) => {
        if (index == activeIndex) item.activate();
        else item.deactivate();
      })
    },
    drawPath (svg) {
      this.svgs.push(new SaveableSvg (svg));
    },
    onWindowResize () {
      this.canvasWidth = this.$refs.canvas.offsetWidth;
      this.canvasHeight = this.$refs.canvas.offsetHeight;
      this.$emit('resize');
    },
    completeDrawing () {
      this.$nextTick(() => {
        this.$refs.drawingCanvas.completePathDrawing()
      })
    }
  },
  watch: {
    drawingMode () {
      if (this.drawingMode) this.showOverlay = false;
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  position: absolute;
  top: 0;
  left: 0;
  cursor: crosshair;
}
</style>