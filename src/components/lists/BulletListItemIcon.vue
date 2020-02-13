<template>
<span class="bullet-list-item__icon" @click="changeState">
  {{ icon }}
</span>
</template>

<script>
export default {
  name: 'BulletListItemIcon',
  props: {
    type: String,
    state: String
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

      let state = this.state;

      switch (this.type) {
        case 'task':
          state = state === 'default' ? 'completed' : 'default';
          break;
        case 'event':
          state = state === 'default' ? 'removed' : 'default';
          break;
        case 'note':
          state = state === 'default' ? 'removed' : 'default';
          break;
      }

      console.log('getting state:', state);

      this.$emit('update:state', state);

    },
    getIconFor (state) {
      this[`${this.type}State`](state);
    },
    taskState (state) {
      console.log('task called', state)
      switch (state) {
        case 'default':
          this.icon = '•';
          break;
        case 'completed':
      console.log('completed')
      this.icon = 'aaaaaaaaaaaaaa'
          this.icon = '✅';
          break;
      }
    },
    eventState () {
      console.log('event called')
      this.icon = '○';
    },
    noteState () {
      console.log('note called')
      this.icon = '-';
    }
  },
  mounted () {
    this.getIconFor(this.state);
  }
}
</script>