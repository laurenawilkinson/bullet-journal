<template>
<span class="bullet-list-item__icon" @click="changeState">
  <i 
    v-if="type === 'task'" 
    class="material-icons">{{ icon }}</i>
  <template v-else>{{ icon }}</template>
</span>
</template>

<script>
export default {
  name: 'BulletListItemIcon',
  props: {
    type: String,
    state: String,
    removed: Boolean
  },
  data () {
    return {
      icon: '•'
    }
  },
  watch: {
    state (val) {
      this.getIconFor(val);
    }
  },
  methods: {
    changeState () {
      if (
        this.type != 'task' &&
        this.type != 'event' && 
        this.type != 'note'
      ) return;

      if (this.type == 'task') {
        this.$emit('update:state', this.state === 'default' ? 'completed' : 'default');
      }
      else {
        this.$emit('update:removed', !this.removed);
      }
    },
    getIconFor (state) {
      this[`${this.type}State`](state);
    },
    taskState (state) {
      switch (state) {
        case 'default':
          this.icon = 'check_box_outline_blank';
          break;
        case 'completed':
          this.icon = 'check_box';
          break;
        case 'migrated':
          this.icon = 'keyboard_arrow_right';
      }
    },
    eventState () {
      this.icon = '○';
    },
    noteState () {
      this.icon = '-';
    }
  },
  mounted () {
    this.getIconFor(this.state);
  }
}
</script>