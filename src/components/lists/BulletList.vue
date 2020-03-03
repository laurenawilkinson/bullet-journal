<template>
  <div 
    v-draggable:[moveMode]="draggableData"
    :class="{ 
      'bullet-list': true, 
      'bullet-list--active': active, 
      'draggable': moveMode,
      'dragging': draggableData.active
    }" 
    ref="list"
    v-on-clickaway="deselectList"
    @click="setActive">
    <ul v-if="items.length > 0" class="bullet-list__container">
      <list-item 
        v-for="(item, index) in items" 
        :key="item.id"
        ref="items"
        :disabled="!moveMode || draggableData.active"
        :type="item.type"
        :state.sync="item.state"
        :content.sync="item.content"
        :priority.sync="item.priority"
        :removed.sync="item.removed"
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
  constructor ({ id, type, state, priority, content, removed }) {
    this.id = id || itemId;
    this.type = type || 'task';
    this.state = state || 'default'; // default, completed, migrated
    this.priority = priority || false;
    this.content = content || '';
    this.removed = removed || false;

    itemId++;
  }
}

import ListItem from './BulletListItem.vue'
import IconButton from '@/components/IconButton.vue'
import { mixin as clickaway } from 'vue-clickaway';
import draggableDirective from '@/directives/Draggable';
import Draggable from '@/models/Draggable';

export default {
  name: 'BulletList',
  mixins: [ clickaway ],
  directives: {
    draggable: draggableDirective
  },
  components: {
    ListItem,
    IconButton
  },
  props: {
    position: Object,
    items: Array,
    moveMode: Boolean
  },
  data () {
    return {
      active: false,
      draggableData: new Draggable(this.position.x, this.position.y, this.moveMode)
    }
  },
  computed: {
    localPos: {
      get () {
        return { 
          ...this.position, 
          draggable: this.moveMode
        };
      },
      set (val) {
        this.$emit('update:position', { x: val.x, y: val.y })
      }
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
      if (this.draggableData.active) return console.log('returning');
      console.log('setting active!')
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