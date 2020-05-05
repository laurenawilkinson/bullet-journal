<template>
  <draggable 
    :class="{ 
      'bullet-list': true, 
      'bullet-list--active': active, 
      'draggable': moveMode,
      'dragging': dragActive
    }"
    ref="list"
    :resizable="false"
    :active="active"
    :x.sync="position.x"
    :y.sync="position.y"
    v-on-clickaway="deselectList"
    @click="setActive"
    @dragstop="updateDb">
    <ul v-if="items.length > 0" class="bullet-list__container">
      <list-item 
        v-for="(item, index) in localItems" 
        :key="item.id"
        ref="items"
        :disabled="!moveMode || dragActive"
        :type="item.type"
        :state.sync="item.state"
        :content.sync="item.content"
        :priority.sync="item.priority"
        :removed.sync="item.removed"
        :list-active="active"
        :list-moving="false"
        @update="updateDb"
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
  </draggable>
</template>

<script>
class BulletListItem {
  constructor ({ id, type, state, priority, content, removed }) {
    this.id = id;
    this.type = type || 'task';
    this.state = state || 'default'; // default, completed, migrated
    this.priority = priority || false;
    this.content = content || '';
    this.removed = removed || false;
  }
}

import ListItem from './BulletListItem.vue'
import IconButton from '@/components/IconButton.vue'
import { mixin as clickaway } from 'vue-clickaway';
import Draggable from '@/components/Draggable.vue';
import { StoreList } from '@/models/List';
import EventBus from '../../EventBus'
import { InfoBarList } from '@/models/InfoBarItems'

export default {
  name: 'BulletList',
  mixins: [ clickaway ],
  components: {
    ListItem,
    IconButton,
    Draggable
  },
  props: {
    id: Number,
    position: Object,
    items: Array,
    moveMode: Boolean
  },
  data () {
    return {
      isActive: false,
      dragActive: false
    }
  },
  watch: {
    '$store.state.activeItem': function () {
      if (!this.isActiveItem && this.isActive)
        this.isActive = false;
    }
  },
  computed: {
    localItems: {
      get () {
        return this.items
      },
      set (value) {
        this.$emit('update:items', value)
      }
    },
    active () {
      return this.isActive || this.$store.state.keepAlive && this.isActiveItem;
    },
    isActiveItem () {
      return  this.$store.state.activeItem !== null 
          && this.$store.state.activeItem.type == 'list'
          && this.$store.state.activeItem.id == this.id;
    }
  },
  methods: {
    updateDb () {
      this.$emit('update', { id: this.id, value: this.getListStoreItem() })
    },
    getListStoreItem () {
      return new StoreList({ id: this.id, position: this.position, items: this.items });
    },
    async addItem (type) {
      if (this.$refs.items) this.$refs.items.forEach(item => item.closeMenu());
      let lastUsedId = this.localItems[this.localItems.length - 1] 
        ? this.localItems[this.localItems.length - 1].id 
        : 0;
      this.localItems.push(new BulletListItem({ id: lastUsedId + 1, type }));
      await this.$nextTick();
      this.$refs.items[this.$refs.items.length - 1].selectText();
      this.updateDb();
    },
    removeItem (id) {
      let index = this.items.map(i => i.id).indexOf(id);
      if (index < 0) return;

      this.localItems.splice(index, 1);
      if (this.localItems.length > 0) this.updateDb();
    },
    closeMenus (excludedIndex) {
      if (this.$refs.items) this.$refs.items.forEach((item, index) => {
        if (index == excludedIndex) return;
        item.closeMenu()
      });
    },
    setActive () {
      if (!this.isActive) this.$emit('set-active');
    },
    activate () {
      setTimeout(() => {
        this.isActive = true;
        this.$store.dispatch('setActiveItem', 
          new InfoBarList(this.id))
      }, 40)
    },
    deactivate () {
      if (!this.isActive) return;
      this.removeActiveItem();
      this.isActive = false;
      if (this.items.length == 0) this.$emit('remove-list')
    },
    deselectList () {
      if (!this.isActive) return;
      this.removeActiveItem();
      this.isActive = false;
      if (this.$refs.items) this.$refs.items.forEach(item => item.closeMenu());
      if (this.items.length == 0) this.$emit('remove-list')
    },
    removeActiveItem () {
      setTimeout(() => {
        if (!this.$store.state.keepAlive){
          this.$store.dispatch('setActiveItem', null);
          this.deactivate();
        }
      }, 20)
    }
  },
  created () {
    EventBus.$on('list:add-item', ({ id, type }) => {
      if (id === this.id) this.addItem(type);
    })
    EventBus.$on('list:delete', id => {
      if (id === this.id) this.$emit('delete', id);
    })
  },
  beforeDestroy () {
    this.$store.dispatch('keepAlive', false);
    this.$store.dispatch('setActiveItem', null);
  }
}
</script>