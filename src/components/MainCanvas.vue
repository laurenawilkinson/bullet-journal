<template>
<main class="canvas-container">
  <div id="canvas" class="canvas" ref="canvas" @mousemove="trackMouse" @touchmove="trackMouse">
    <bullet-list 
      v-for="(list, index) in lists"
      ref="lists"
      :key="list.id" 
      :position="list.position"
      :items="list.items"
      :move-mode="!drawingMode"
      @remove-list="removeList(list.id)"
      @set-active="setActive(index)" />
    <draggable 
      v-for="(svg, i) in svgs" 
      :key="i" 
      v-html="svg.svg"
      class="path-container"
      :x.sync="svg.x"
      :y.sync="svg.y" />
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
    <div v-if="showListOverlay" class="overlay" @click="createList"></div>
    <div 
      v-if="showListOverlay"
      class="tooltip"
      :style="{ position: 'absolute', top: mouse.y + 'px', left: mouse.x + 'px', pointer: 'crosshair' }"
       @click="createList">
      Click to place list
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
import DrawingCanvas from '@/components/drawing/DrawingCanvas.vue'
import Draggable from '@/components/Draggable.vue'

let lid = 0;

class List {
  constructor ({ id, position, items }) {
    this.id = id ? id : 'list--' + lid;
    this.position = position ? position : { x: 0, y: 0 };
    this.items = items ? items : [];
    lid++;
  }
}

export default {
  name: 'MainCanvas',
  components: {
    BulletList,
    DrawingCanvas,
    Draggable
  },
  props: {
    drawingMode: Boolean,
    drawTool: String,
    penColor: String,
    penWidth: Number,
    canvasOffset: Object
  },
  data () {
    return {
      svgs: [],
      canvasWidth: 0,
      canvasHeight: 0,
      showListOverlay: false,
      lists: [],
      mouse: { x: 0, y: 0 },
      paths: []
    }
  },
  computed: {
    showDrawMultiOverlay () {
      return this.drawTool == 'group' && this.drawingMode && this.paths.length > 0;
    }
  },
  methods: {
    trackMouse (event) {
      if (!this.showListOverlay) return;

      this.mouse.x = event.clientX - this.canvasOffset.x / 2;
      this.mouse.y = event.clientY - this.canvasOffset.y / 2;
    },
    openListOverlay () {
      this.showListOverlay = true;
    },
    createList () {
      this.showListOverlay = false;
      this.lists.push(new List({ position: { x: this.mouse.x, y: this.mouse.y }}));
      this.setActive(this.lists.length - 1);
    },
    removeList (id) {
      let index = this.lists.map(i => i.id).indexOf(id);
      if (index < 0) return;
      this.$emit('update:lists', this.lists.splice(index, 1));
    },
    async setActive (activeIndex) {
      await this.$nextTick();

      this.$refs.lists.forEach((list, index) => {
        if (index == activeIndex) list.activateList();
        else list.deactivateList();
      })
    },
    drawPath (svg) {
      this.svgs.push(svg);
    },
    onWindowResize () {
      this.canvasWidth = this.$refs.canvas.offsetWidth;
      this.canvasHeight = this.$refs.canvas.offsetHeight;
      this.$emit('resize');
    },
    completeDrawing () {
      this.$nextTick(() => {
        console.log(this.$refs);
        this.$refs.drawingCanvas.completeDrawing()
      })
    }
  },
  watch: {
    drawingMode () {
      if (this.drawingMode) this.showListOverlay = false;
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