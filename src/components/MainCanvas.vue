<template>
<main class="canvas-container">
  <div 
    id="canvas" 
    :class="{ canvas: true, 'canvas--drawing': drawingMode }" 
    ref="canvas" 
    @mousemove="trackMouse" 
    @touchmove="trackMouse">
    <bullet-list 
      v-for="(list, index) in localLists"
      ref="lists"
      :key="'list-' + list.id" 
      :id="list.id"
      :position="list.position"
      :items.sync="list.items"
      :move-mode="!drawingMode"
      @remove-list="removeList(list.id)"
      @set-active="setActive(index, 'lists')"
      @update="updateDbItem('listStore', $event)"
      @delete="deleteDbItem('listStore', $event)" />
    <base-tracker 
      v-for="(tracker, index) in localTrackers" 
      ref="trackers"
      :key="'tracker-' + tracker.id"
      :id="tracker.id"
      :position="tracker.position"
      :items="tracker.items"
      :options="tracker.options"
      @set-active="setActive(index, 'trackers')"
      @update="updateDbItem('trackerStore', $event)"
      @delete="deleteDbItem('trackerStore', $event)" />
    <canvas-svg 
      v-for="(svg, i) in localSvgs" 
      :key="'svg-' + svg.id"
      v-model="localSvgs[i]"
      @update="updateDbItem('svgStore', $event)"
      @delete="deleteDbItem('svgStore', $event)" />
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
      v-for="(image, i) in localImages" 
      :key="'image-' + image.id"
      :value="localImages[i]"
      :canvas-width="canvasWidth"
      :canvas-height="canvasHeight"
      @update="updateDbItem('imageStore', $event)"
      @delete="deleteDbItem('imageStore', $event)" />
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
import { List, StoreList } from '@/models/List';
import { Tracker, StoreTracker } from '@/models/Tracker';
import EventBus from '../EventBus';

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
    images: Array,
    lists: Array,
    trackers: Array,
    svgs: Array
  },
  data () {
    return {
      canvasWidth: 0,
      canvasHeight: 0,
      showOverlay: false,
      overlayType: 'list',
      mouse: { x: 0, y: 0 },
      paths: [],
      localTrackers: [],
      localLists: [],
      localSvgs: []
    }
  },
  computed: {
    localImages: {
      get () {
        return this.images
      },
      set (val) {
        this.$emit('update:images', val)
      }
    },
    showDrawMultiOverlay () {
      return this.drawTool == 'group' && this.drawingMode && this.paths.length > 0;
    },
    layers () {
      const svgs = this.localSvgs.map(x => {
        return {
          ...x,
          component: 'draggable'
        }
      })
      const lists = this.localLists.map(x => {
        return { ...x, component: 'bullet-list'}
      })

      return [ ...svgs, ...lists ].sort((a, b) => a.order - b.order);
    }
  },
  methods: {
    addDbItem (storeName, value) {
      EventBus.$emit('dbup:add', { storeName, value })
    },
    updateDbItem (storeName, { id, value }) {
      EventBus.$emit('dbup:update', { storeName, id, value })
    },
    deleteDbItem (storeName, id) {
      EventBus.$emit('dbup:delete', { storeName, id })
    },
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
      let store = null;
      let item = null;

      if (this.overlayType == 'list') {
        item = new StoreList({ position: { x: this.mouse.x, y: this.mouse.y }})
        store = 'listStore';
      } else if (this.overlayType == 'tracker') {
        item = new StoreTracker({ position: { x: this.mouse.x, y: this.mouse.y }});
        store = 'trackerStore';
      }

      if (store !== null && item !== null) this.addDbItem(store, item);
    },
    removeList (id) {
      let index = this.localLists.map(i => i.id).indexOf(id);
      if (index < 0) return;

      this.localLists.splice(index, 1);
      // UPDATE DB
      this.deleteDbItem('listStore', id)
    },
    async setActive (activeIndex, ref) {
      await this.$nextTick();
      // this.$store.dispatch('setActiveItem', null);

      for (let i = 0; i < this.$refs[ref].length; i++) {
        if (i !== activeIndex)
          this.$refs[ref][i].deactivate();
      }

      this.$refs[ref][activeIndex].activate();
    },
    drawPath (svg) {
      const theSvg = new SaveableSvg({ ...svg, initialWidth: svg.width, initialHeight: svg.height });
      let item = {
        x: theSvg.x,
        y: theSvg.y,
        width: theSvg.width,
        initialWidth: theSvg.width,
        height: theSvg.height,
        initialHeight: theSvg.height,
        html: theSvg.html
      }
      this.addDbItem('svgStore', item)
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
    },
    lists (lists) {
      this.localLists = lists;
    },
    trackers (trackers) {
      this.localTrackers = trackers;
    },
    svgs (svgs) {
      this.localSvgs = svgs;
    } 
  },
  async created () {
    EventBus.$on('set-active-item', async ({ storeName, id }) => {
      this.$nextTick(() => {
        if (storeName === 'listStore') {
          let found = this.localLists.findIndex(x => x.id == id);
          if (found > -1) {
            this.setActive(found, 'lists')
            EventBus.$emit('topbar:open-menu', 'list');
          }
        } else if (storeName === 'trackerStore') {
          let found = this.localTrackers.findIndex(x => x.id == id);
          if (found > -1) this.setActive(found, 'trackers')
        }
      });
    })
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