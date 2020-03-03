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
        penWidth
      }" />
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'
import MainCanvas from '@/components/MainCanvas.vue'

let id = 0;

class List {
  constructor (list) {
    this.id = list ? list.id : id;
    this.position = list ? list.position : { x: 0, y: 0 };
    this.items = list ? list.items : [];
    id++;
  }
}

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
      penWidth: 1,
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
      ]
    }
  },
  methods: {
    createList () {
      this.lists.push(new List);
      this.$refs.canvas.setActive(this.lists.length - 1);
    }
  }
}
</script>