<template>
  <div 
    :class="{ 'bullet-list': true, 'bullet-list--active': active }" 
    ref="list"
    v-on-clickaway="deselectList"
    @click="setActive">
    <ul v-if="items.length > 0" class="bullet-list__container">
      <list-item 
        v-for="(item, index) in items" 
        :key="item.id"
        ref="items"
        :type="item.type"
        :state.sync="item.state"
        :content.sync="item.content"
        :priority.sync="item.priority"
        :list-active="active"
        :list-moving="false"
        @set-active="setActive"
        @opened-menu="closeMenus(index)"
        @remove-item="removeItem(item.id)" />
    </ul>
    <div v-if="active" class="bullet-list__add-button">
      <icon-button 
        class="button" 
        icon="add" 
        @click="addItem('task')">
        Task
      </icon-button>
      <icon-button 
        class="button" 
        icon="add" 
        @click="addItem('event')">
        Event
      </icon-button>
      <icon-button 
        class="button" 
        icon="add" 
        @click="addItem('note')">
        Note
      </icon-button>
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
    itemId++;
  }
}

import ListItem from './BulletListItem.vue'
import IconButton from '@/components/IconButton.vue'
import { mixin as clickaway } from 'vue-clickaway';

export default {
  name: 'BulletList',
  mixins: [ clickaway ],
  components: {
    ListItem,
    IconButton
  },
  props: {
    position: Object,
    items: Array
  },
  data () {
    return {
      active: false
    }
  },
  watch: {
    position () {
      console.log('position change')
    }
  },
  methods: {
    async addItem (type) {
      if (this.$refs.items) this.$refs.items.forEach(item => item.closeMenu());
      this.items.push(new BulletListItem({ type }));
      await this.$nextTick();
      this.$refs.items[this.$refs.items.length - 1].selectText();
    },
    removeItem (id) {
      let index = this.items.map(i => i.id).indexOf(id);
      if (index < 0) return;
      this.items.splice(index, 1);
    },
    closeMenus (excludedIndex) {
      if (this.$refs.items) this.$refs.items.forEach((item, index) => {
        if (index == excludedIndex) return;
        item.closeMenu()
      });
    },
    setActive () {
      this.$emit('set-active');
    },
    activateList () {
      this.active = true;
    },
    deactivateList () {
      this.active = false;
      if (this.items.length == 0) this.$emit('remove-list')
    },
    deselectList () {
      this.active = false;
      if (this.$refs.items) this.$refs.items.forEach(item => item.closeMenu());
    }
  }
}
</script>