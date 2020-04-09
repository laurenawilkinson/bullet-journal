<template>
<draggable
  :x.sync="position.x"
  :y.sync="position.y"
  :resizable="false"
  v-on-clickaway="deactivate"
  @click="setActive">
  <table :class="{ 'tracker': true, 'tracker--vertical': useVerticalLayout }">
    <thead>
      <tr v-if="useVerticalLayout">
        <th class="tracker__box"></th>
        <tracker-item-title
          v-model="items[i].title"
          component="th"
          v-for="(item, i) in items" 
          :key="item.id"
          :vertical-layout="useVerticalLayout" />
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
          v-for="item in items" 
          :key="item.id" 
          :class="{ 
            ['tracker__box tracker__box--' + localOptions.tickType]: true,
            'tracker__box--checked': item.values[box]
          }"
          @click="item.setChecked(box)">
          <div v-if="item.values[box]" class="tracker__tickmark"></div>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <item 
        v-for="(item, i) in items" 
        :key="item.id"
        v-model="items[i]"
        :boxes="boxes"
        :tick-type="localOptions.tickType" />
    </tbody>
  </table>
  <div>
    <icon-button icon="add" @click="addItem">
      Add Item
    </icon-button>
  </div>
</draggable>
</template>

<script>
import Draggable from '@/components/Draggable.vue'
import Item from '@/components/trackers/TrackerItem.vue'
import TrackerItemTitle from '@/components/trackers/TrackerItemTitle.vue'
import IconButton from '@/components/IconButton.vue'
import { TrackerItem } from '@/models/Tracker'
import { mixin as clickaway } from 'vue-clickaway';
import { InfoBarTracker } from '@/models/InfoBarItems'
import { mapState } from 'vuex' 

export default {
  name: 'BaseTracker',
  mixins: [ clickaway ],
  components: {
    Draggable,
    Item,
    IconButton,
    TrackerItemTitle
  },
  props: {
    position: Object,
    items: Array,
    options: Object
  },
  data () {
    return {
      isActive: false
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
      return this.isActive || this.$store.state.keepAlive;
    }
  },
  methods: {
    addItem () {
      this.localItems.push(new TrackerItem(this.items.length, {}, this.localOptions.boxAmount))
    },
    setActive () {
      if (!this.active) this.$emit('set-active');
    },
    activate () {
      this.isActive = true;
      // connect to store 
      
      this.$store.dispatch('setActiveItem', new InfoBarTracker(this.localOptions.boxAmount, this.localOptions.tickType, this.localOptions.trackerLayout))
    },
    deactivate () {
      this.isActive = false;
      if (!this.active)
        this.$store.dispatch('setActiveItem', null);
    }
  }
}
</script>