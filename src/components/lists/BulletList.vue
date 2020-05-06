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
    @click="setActive('draggable')"
    @dragstart="setActive"
    @dragstop="dragStop">
    <ul v-if="items.length > 0" class="bullet-list__container">
      <list-item 
        v-for="(item, index) in localItems" 
        :key="item.id"
        :only-item="localItems.length < 2"
        ref="items"
        :disabled="!moveMode || dragActive"
        :type="item.type"
        :state.sync="item.state"
        :content.sync="item.content"
        :priority.sync="item.priority"
        :removed.sync="item.removed"
        :list-active="active"
        :list-moving="false"
        @click="setActive"
        @update="updateDb"
        @set-active="setActive('list-item')"
        @opened-menu="closeMenus(index)"
        @remove-item="removeItem(item.id)" />
    </ul>
  </draggable>
</template>

<script>
import ListItem from './BulletListItem.vue'
import { mixin as clickaway } from 'vue-clickaway';
import Draggable from '@/components/Draggable.vue';
import { StoreList, BulletListItem } from '@/models/List';
import EventBus from '../../EventBus'
import { InfoBarList } from '@/models/InfoBarItems'

export default {
  name: 'BulletList',
  mixins: [ clickaway ],
  components: {
    ListItem,
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
      dragActive: false,
      localKeepAlive: false
    }
  },
  watch: {
    '$store.state.activeItem': function () {
      if (!this.isActiveItem && this.isActive){
        this.isActive = false;
        console.log('deactivating in watch')
      }
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
      let lastItemIndex = this.localItems.length - 1;
      let lastUsedId = this.localItems[lastItemIndex] 
        ? this.localItems[lastItemIndex].id 
        : 0;
      if (this.localItems[lastItemIndex].content.length === 0) {
        this.localItems[lastItemIndex] = new BulletListItem({ id: lastUsedId, type })
      } else {
        this.localItems.push(new BulletListItem({ id: lastUsedId + 1, type }));
      }

      await this.$nextTick();
      await this.$nextTick();
      await this.$nextTick();
      // this.$refs.items[this.$refs.items.length - 1].selectText();
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
      console.log('deactivating?!')
      this.removeActiveItem();
      this.isActive = false;
      if (this.items.length == 0) this.$emit('remove-list')
    },
    deselectList () {
      console.log(`deselecting... active: ${this.isActive}, keepAlive ${this.localKeepAlive}`)
      if (!this.isActive || this.localKeepAlive || this.$store.state.keepAlive) return;
      this.removeActiveItem();
      this.isActive = false;
      if (this.$refs.items) this.$refs.items.forEach(item => item.closeMenu());
      if (this.items.length == 0) this.$emit('remove-list')
    },
    removeActiveItem () {
      setTimeout(() => {
        if (!this.$store.state.keepAlive && !this.localKeepAlive){
          this.$store.dispatch('setActiveItem', null);
          this.deactivate();
        }
      }, 20)
    },
    async dragStop () {
      this.localKeepAlive = true;
      this.updateDb();

      setTimeout(() => {
        this.localKeepAlive = false;
      }, 30)
    }
  },
  created () {
    EventBus.$on('list:add-item', ({ id, type }) => {
      if (id === this.id) {
        this.addItem(type);
      }
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