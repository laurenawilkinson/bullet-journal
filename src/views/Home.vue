<template>
  <div :class="{ home: true, 'show-pages': showSidebar }">
    <!-- <transition name="slide-from-right" mode="out-in">
      <info-bar v-if="activeItem !== null" />
    </transition> -->
    <transition name="slide-from-left" mode="out-in">
      <pages-bar v-if="showSidebar" :pages="pages" @close="showSidebar = false" />
    </transition>
    <div class="page-container">
      <top-bar 
        :drawing-mode.sync="drawingMode"
        :pen-color.sync="penColor"
        :pen-width.sync="penWidth"
        :draw-tool.sync="drawTool"
        :pages="pages"
        :show-all="showFullTopbar"
        @open-pages="showSidebar = true"
        @create-list="createItem('list')"
        @create-tracker="createItem('tracker')"
        @display-image="addDbItem('imageStore', $event)" />
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
        @resize="onResize" />
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'
// import InfoBar from '@/components/InfoBar.vue'
import PagesBar from '@/components/PagesBar.vue'
import MainCanvas from '@/components/MainCanvas.vue'
import EventBus from '../EventBus'

export default {
  name: 'Home',
  components: {
    TopBar,
    MainCanvas,
    // InfoBar,
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
      canvasOffset: {},
      showSidebar: false,
      showFullTopbar: false
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
      const body = document.querySelector('body');
      const canvas = document.querySelector('#canvas');
      this.canvasOffset = {
        x: body.clientWidth - canvas.clientWidth,
        y: body.clientHeight - canvas.clientHeight
      }
    },
    onResize () {
      this.showSidebar = window.innerWidth >= 1200;
      this.showFullTopbar = window.innerWidth >= 1200;
      this.$nextTick(() => this.getCanvasOffset());
    }
  },
  mounted () {
    this.showSidebar = window.innerWidth >= 1200;
    this.$nextTick(() => this.getCanvasOffset());
    this.showFullTopbar = window.innerWidth >= 1200;
  }
}
</script>