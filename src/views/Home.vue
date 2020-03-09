<template>
  <div class="home">
    <top-bar 
      :drawing-mode.sync="drawingMode"
      :pen-color.sync="penColor"
      :pen-width.sync="penWidth"
      @create-list="createList" />
    <main-canvas 
      ref="canvas"
      :lists.sync="lists"
      v-bind="{
        lists,
        drawingMode,
        penColor,
        penWidth,
        canvasOffset
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
    createList () {
      this.$refs.canvas.openListOverlay();
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