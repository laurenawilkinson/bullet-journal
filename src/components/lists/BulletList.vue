<template>
  <div class="bullet-list" ref="list">
    <ul class="bullet-list__container">
      <list-item 
        v-for="item in items" 
        :key="item.id"
        :type="item.type"
        :state.sync="item.state"
        :content.sync="item.content"
        :priority.sync="item.priority" />
    </ul>
    <button 
      class="bullet-list__add-button" 
      @click="toggleDropdown">
      Add new item
      <material-icon icon="keyboard_arrow_down" />
    </button>
    <div v-show="showItemDropdown">
      <button class="dropdown__item" @click="addItem('task')">Task</button>
      <button class="dropdown__item" @click="addItem('event')">Event</button>
      <button class="dropdown__item" @click="addItem('note')">Note</button>
    </div>
  </div>
</template>

<script>
let itemId = 0;
class BulletListItem {
  constructor ({ id, type, state, priority, content }) {
    this.id = id || itemId;
    this.type = type || 'task';
    this.state = state || 'default'; // default, completed, removed
    this.priority = priority || false;
    this.content = content || '';
    id++;
  }
}

import ListItem from './BulletListItem.vue'
import MaterialIcon from '@/components/MaterialIcon.vue'

export default {
  name: 'BulletList',
  components: {
    ListItem,
    MaterialIcon
  },
  props: {
    position: Object,
    items: Array
  },
  data () {
    return {
      showItemDropdown: false
    }
  },
  watch: {
    position () {
      console.log('position change')
    }
  },
  methods: {
    toggleDropdown () {
      this.showItemDropdown = !this.showItemDropdown;
    },
    addItem (type) {
      this.items.push(new BulletListItem(type));
    }
  }
}
</script>

<style lang="scss" scoped>
.bullet-list {

  &__container {
    text-align: left;
    list-style-type: none;
  }

  &__add-button {
    padding: 0.8rem;
    border: 2px dashed grey;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.dropdown__item {
  background-color: pink;
}
</style>