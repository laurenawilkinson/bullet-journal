<template>
  <div class="home">
    <top-bar 
      @create-list="createList" />
    <div class="canvas-container">
      <div class="canvas">
        <bullet-list 
          v-for="(list, index) in lists"
          ref="lists"
          :key="list.id" 
          :position="list.position"
          :items="list.items"
          @set-active="setActive(index)" />
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
              id: 100,
              type: 'task',
              state: 'default',
              content: 'Test task',
              priority: false
            },
            {
              id: 101,
              type: 'event',
              state: 'default',
              content: 'An important event',
              priority: true
            },
            {
              id: 102,
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
      this.setActive(this.lists.length - 1);
    },
    async setActive (activeIndex) {
      await this.$nextTick();

      this.$refs.lists.forEach((list, index) => {
        if (index == activeIndex) list.activateList();
        else list.deactivateList();
      })
    }
  }
}
</script>