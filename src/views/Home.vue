<template>
  <div class="home">
    <top-bar 
      @create-list="createList" />
    <div class="canvas-container">
      <div class="canvas">
        <bullet-list 
          v-for="list in lists"
          :key="list.id" 
          :position="list.position"
          :items="list.items" />
      </div>
    </div>
  </div>
</template>

<script>
import BulletList from '@/components/lists/BulletList.vue'
import TopBar from '@/components/TopBar.vue'

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
    BulletList,
    TopBar
  },
  data ()  {
    return {
      lists: [
        {
          position: { x: 0, y: 0 },
          items: [
            {
              type: 'task',
              state: 'default',
              content: 'Test task',
              priority: false
            },
            {
              type: 'event',
              state: 'default',
              content: 'An important event',
              priority: true
            },
            {
              type: 'note',
              state: 'default',
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
    }
  }
}
</script>