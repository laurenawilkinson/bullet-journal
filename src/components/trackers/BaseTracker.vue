<template>
<draggable
  :x.sync="position.x"
  :y.sync="position.y"
  :resizable="false"
  v-on-clickaway="deactivate"
  @click="setActive">
  {{ active }}
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
            ['tracker__box tracker__box--' + options.tickType]: true,
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
        :tick-type="options.tickType" />
    </tbody>
  </table>
  <div>
    <icon-button icon="add" @click="addItem">
      Add Item
    </icon-button>
    Boxes: <input v-model="options.boxAmount" type="number" min="1" />
    Tick type: 
    <select v-model="options.tickType">
      <option value="circle">Circle</option>
      <option value="block">Block</option>
    </select>
    <label>
      Vertical layout
      <input type="checkbox" v-model="useVerticalLayout" />
    </label>
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
      active: false
    }
  },
  computed: {
    // localOptions: {
    //   boxAmount: this.active ? this.$store.activeItem.boxAmount : this.options.boxAmount,
    //   tickType: this.active ? this.$store.activeItem.tickType : this.options.boxAmount
    // },
    useVerticalLayout () {
      return this.options.layout == 'vertical';
    },
    boxes () {
      let boxes = [];
      for (let i = 0; i < this.options.boxAmount; i++) {
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
    } 
  },
  methods: {
    addItem () {
      this.localItems.push(new TrackerItem(this.items.length, {}, this.options.boxAmount))
    },
    setActive () {
      if (!this.active) this.$emit('set-active');
    },
    activate () {
      this.active = true;
      // connect to store 
      
      // this.$store.dispatch('setActiveItem', new InfoBarTracker(this.options.boxAmount, this.options.tickType, this.options.trackerLayout))
    },
    deactivate () {
      this.active = false;
    }
  }
}
</script>