<template>
<draggable
  :x.sync="position.x"
  :y.sync="position.y"
  :resizable="false"
  :active="active"
  :allow-clicks="true"
  v-on-clickaway="removeActiveItem"
  @drag-start="setActive"
  @dragstop="updateDb"
  @click.stop="setActive">
  <table :class="{ 'tracker': true, 'tracker--vertical': useVerticalLayout }">
    <thead>
      <tr v-if="useVerticalLayout">
        <th class="tracker__box"></th>
        <tracker-item-title
          v-model="items[i].title"
          component="th"
          v-for="(item, i) in items" 
          :key="item.id"
          :vertical-layout="useVerticalLayout"
          @update="updateDb" />
      </tr>
      <tr v-else>
        <th class="tracker__title"></th>
        <th 
          v-for="box in boxes" 
          :key="box"
          class="tracker__box">
          {{ box }}
        </th>
      </tr>
    </thead>
    <tbody v-if="useVerticalLayout">
      <tr
        v-for="box in boxes" 
        :key="box">
        <td class="tracker__box">{{ box }}</td>
        <td 
          v-for="(item, index) in localItems" 
          :key="item.id" 
          :class="{ 
            ['tracker__box tracker__box--' + localOptions.tickType]: true,
            'tracker__box--checked': localItems[index].values[box]
          }"
          @mousedown.stop="setItemChecked(item, box)">
          <div v-if="localItems[index].values[box]" class="tracker__tickmark"></div>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <item 
        v-for="(item, i) in localItems" 
        :key="item.id"
        v-model="items[i]"
        :boxes="boxes"
        :tick-type="localOptions.tickType"
        @update="updateDb"
        @set-active="setActive" />
    </tbody>
  </table>
</draggable>
</template>

<script>
import Draggable from '@/components/Draggable.vue'
import Item from '@/components/trackers/TrackerItem.vue'
import TrackerItemTitle from '@/components/trackers/TrackerItemTitle.vue'
import { TrackerItem, StoreTracker } from '@/models/Tracker'
import { mixin as clickaway } from 'vue-clickaway';
import { InfoBarTracker } from '@/models/InfoBarItems'
import EventBus from '../../EventBus'

export default {
  name: 'BaseTracker',
  mixins: [ clickaway ],
  components: {
    Draggable,
    Item,
    TrackerItemTitle
  },
  props: {
    position: Object,
    items: Array,
    options: Object,
    id: Number
  },
  data () {
    return {
      isActive: false,
      dragDisabled: false
    }
  },
  watch: {
    localOptions (value) {
      if (!this.active) return;

      for (const opt in this.options) {
        if (this.options[opt] !== value[opt]) {
          this.$emit('update:options', value)
        }
      }
    },
    '$store.state.activeItem': function () {
      if (!this.isActiveItem && this.isActive)
        this.isActive = false;
    }
  },
  computed: {
    localOptions () {
      return {
        boxAmount: this.active && this.$store.getters.activeItemProps !== null 
          ? this.$store.getters.activeItemProps.boxAmount 
          : this.options.boxAmount,
        tickType: this.active && this.$store.getters.activeItemProps !== null 
          ? this.$store.getters.activeItemProps.tickType 
          : this.options.tickType,
        layout: this.active && this.$store.getters.activeItemProps !== null 
          ? this.$store.getters.activeItemProps.layout 
          : this.options.layout
      }
    },
    useVerticalLayout () {
      return this.localOptions.layout == 'vertical';
    },
    boxes () {
      let boxes = [];
      for (let i = 0; i < this.localOptions.boxAmount; i++) {
        boxes.push(i + 1);
      }
      return boxes;
    },
    localItems: {
      get () {
        return this.items;
      },
      set (value) {
        this.$emit('update:items', value);
      }
    },
    active () {
      return this.isActive || this.$store.state.keepAlive && this.isActiveItem;
    },
    isActiveItem () {
      return  this.$store.state.activeItem !== null 
          && this.$store.state.activeItem.type == 'tracker'
          && this.$store.state.activeItem.id == this.id;
    }
  },
  methods: {
    setItemChecked (item, box) {
      this.setActive();
      item.setChecked(box);
      this.updateDb();
    },
    getTrackerStoreItem () {
      return new StoreTracker({ id: this.id, position: this.position, items: this.items, options: this.options })
    },
    updateDb () {
      this.$emit('update', { id: this.id, value: this.getTrackerStoreItem() })
    },
    addItem () {
      this.localItems.push(new TrackerItem(this.items.length + 1, {}, this.localOptions.boxAmount))
      this.updateDb();
    },
    setActive () {
      if (!this.active) this.$emit('set-active');
    },
    removeActiveItem () {
      setTimeout(() => {
        if (!this.$store.state.keepAlive && this.isActive){
          this.$store.dispatch('setActiveItem', null);
          this.deactivate();
        }
      }, 20)
    },
    activate () {
      setTimeout(() => {
        this.isActive = true;
        this.$store.dispatch('setActiveItem', new InfoBarTracker(this.id, this.localOptions.boxAmount, this.localOptions.tickType, this.localOptions.layout))
      }, 40)
    },
    deactivate () {
      if (!this.isActive) return;
      this.isActive = false;
      // this.updateDb();
    }
  },
  created () {
    EventBus.$on('tracker:add-item', id => {
      if (id === this.id) this.addItem();
    })
    EventBus.$on('tracker:delete', id => {
      if (id === this.id) this.$emit('delete', id);
    })
  },
  beforeDestroy () {
    this.$store.dispatch('keepAlive', false);
    this.$store.dispatch('setActiveItem', null);
  }
}
</script>