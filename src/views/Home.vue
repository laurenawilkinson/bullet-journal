<template>
  <div class="home">
    <button @click="createList">Create List</button>
    <bullet-list 
      v-for="list in lists"
      :key="list.id" 
      :position="list.position"
      :items="list.items" />
  </div>
</template>

<script>
import BulletList from '@/components/lists/BulletList.vue'

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
    BulletList
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
              content: '',
              priority: false
            },
            {
              type: 'event',
              state: 'default',
              content: '',
              priority: true
            },
            {
              type: 'note',
              state: 'default',
              content: '',
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

<style lang="scss" scoped>
.home {
  max-width: 1000px;
  padding: 0 5rem;
}
</style>