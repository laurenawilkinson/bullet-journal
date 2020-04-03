<template>
  <div class="home">
    <top-bar 
      :drawing-mode.sync="drawingMode"
      :pen-color.sync="penColor"
      :pen-width.sync="penWidth"
      :draw-tool.sync="drawTool"
      @create-list="createItem('list')"
      @create-tracker="createItem('tracker')"
      @display-image="images.push($event)" />
    <main-canvas 
      ref="canvas"
      :lists.sync="lists"
      v-bind="{
        lists,
        drawingMode,
        penColor,
        penWidth,
        canvasOffset,
        drawTool,
        images
      }"
      @resize="getCanvasOffset" />
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'
import MainCanvas from '@/components/MainCanvas.vue'

export default {
  name: 'Home',
  components: {
    TopBar,
    MainCanvas
  },
  data ()  {
    return {
      drawingMode: false,
      penColor: 'rgba(0,0,0,1)',
      penWidth: 3,
      drawTool: 'path',
      images: [],
      lists: [
        {
          position: { x: 0, y: 0 },
          items: [
            {
              id: 100,
              type: 'task',
              state: 'default',
              removed: false,
              content: 'Test task',
              priority: false
            },
            {
              id: 101,
              type: 'event',
              state: 'default',
              removed: true,
              content: 'An important event',
              priority: true
            },
            {
              id: 102,
              type: 'note',
              state: 'default',
              removed: false,
              content: "Don't forget this note!",
              priority: true
            }
          ]
        }
      ],
      canvasOffset: {}
    }
  },
  methods: {
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