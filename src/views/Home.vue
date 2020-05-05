<template>
  <div class="home">
    <top-bar 
      :drawing-mode.sync="drawingMode"
      :pen-color.sync="penColor"
      :pen-width.sync="penWidth"
      :draw-tool.sync="drawTool"
      @create-list="createItem('list')"
      @create-tracker="createItem('tracker')"
      @display-image="addDbItem('imageStore', $event)" />
    <transition name="slide-from-right" mode="out-in">
      <info-bar v-if="activeItem !== null" />
    </transition>
    <pages-bar :pages="pages" />
    <main-canvas 
      ref="canvas"
      v-bind="{
        drawingMode,
        penColor,
        penWidth,
        canvasOffset,
        drawTool,
        lists: filterByCurrentPage(lists),
        images: filterByCurrentPage(images),
        trackers: filterByCurrentPage(trackers),
        svgs: filterByCurrentPage(svgs)
      }"
      @resize="getCanvasOffset" />
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'
import InfoBar from '@/components/InfoBar.vue'
import PagesBar from '@/components/PagesBar.vue'
import MainCanvas from '@/components/MainCanvas.vue'
import EventBus from '../EventBus'

export default {
  name: 'Home',
  components: {
    TopBar,
    MainCanvas,
    InfoBar,
    PagesBar
  },
  props: {
    images: Array,
    lists: Array,
    trackers: Array,
    svgs: Array,
    pages: Array
  },
  data ()  {
    return {
      drawingMode: false,
      penColor: 'rgba(0,0,0,1)',
      penWidth: 3,
      drawTool: 'path',
      canvasOffset: {}
    }
  },
  computed: {
    activeItem () {
      return this.$store.state.activeItem;
    }
  },
  methods: {
    filterByCurrentPage (array) {
      return array 
        ? array.filter(x => x.page === this.$store.state.currentPage)
        : [];
    },
    addDbItem (storeName, value) {
      EventBus.$emit('dbup:add', { storeName, value })
    },
    createItem (type) {
      this.$refs.canvas.openOverlay(type);
    },
    getCanvasOffset () {
      this.canvasOffset = {
        x: document.querySelector('body').clientWidth - document.querySelector('#canvas').clientWidth,
        y: document.querySelector('body').clientHeight - document.querySelector('#canvas').clientHeight
      }
    }
  },
  mounted () {
    this.getCanvasOffset();
  }
}
</script>