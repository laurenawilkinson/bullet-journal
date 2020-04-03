<template>
<draggable
  :x.sync="position.x"
  :y.sync="position.y">
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
            ['tracker__box tracker__box--' + tickType]: true,
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
        :tick-type="tickType" />
    </tbody>
  </table>
  <div>
    <icon-button icon="add" @click="addItem">
      Add Row
    </icon-button>
    Boxes: <input v-model="boxAmount" type="number" min="1" />
    Tick type: 
    <select v-model="tickType">
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
import { Tracker, TrackerItem } from '@/models/Tracker'

export default {
  name: 'BaseTracker',
  components: {
    Draggable,
    Item,
    IconButton,
    TrackerItemTitle
  },
  props: {
    position: Object,
    items: Array
  },
  data () {
    return {
      boxAmount: 7,
      tickType: 'circle',
      useVerticalLayout: false
    }
  },
  computed: {
    boxes () {
      let boxes = [];
      for (let i = 0; i < this.boxAmount; i++) {
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
      this.localItems.push(new TrackerItem(this.items.length, {}, this.boxAmount))
    }
  }
}
</script>