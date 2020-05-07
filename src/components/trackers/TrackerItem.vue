<template>
  <tr>
    <tracker-item-title v-model="item.title" @update="$emit('update')" />
    <td 
      v-for="box in boxes" 
      :key="box"
      :class="{ 
        ['tracker__box tracker__box--' + tickType]: true,
        'tracker__box--checked': item.values[box]
      }"
      @mousedown.stop="setItemChecked(item, box)">
      <div v-if="item.values[box]" class="tracker__tickmark"></div>
    </td>
  </tr>
</template>

<script>
import { TrackerItem } from '@/models/Tracker'
import TrackerItemTitle from './TrackerItemTitle.vue';

export default {
  name: 'TrackerItem',
  model: {
    event: 'change'
  },
  components: {
    TrackerItemTitle
  },
  props: {
    value: TrackerItem,
    boxes: Array,
    tickType: String
  },
  data () {
    return {
      editingTitle: false
    }
  },
  computed: {
    item: {
      get () {
        return this.value;
      },
      set (value) {
        return this.$emit('change', value)
      }
    }
  },
  watch: {
    boxes (amount) {
      this.item.updateValues(amount.length);
    }
  },
  methods: {
    setItemChecked (item, box) {
      item.setChecked(box);
      this.$emit('set-active')
      this.$emit('update');
    }
  },
  mounted () {
    this.item.updateValues(this.boxes.length);
  }
}
</script>