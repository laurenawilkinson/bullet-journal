<template>
  <li :class="classes" @mouseover="hovered = true" @mouseout="hovered = false">
    <span
      class="bullet-list-item__icon bullet-list-item__icon--signifier">
      <material-icon 
        v-show="priority || hovered" 
        :icon="priority ? 'star' : 'star_outline'"
        @click="update('priority', !priority)" />
    </span>
    <span :class="{ 
        'bullet-list-item__content-container': true, 
        'bullet-list-item__content-container--focused': showEditBox 
      }">
      <list-item-icon :type="type" :state="state" @update:state="update('state', $event)" />
      <input 
        v-if="showEditBox"
        v-model="localContent" 
        class="bullet-list-item__input"
        ref="input"
        @change="update('content', localContent)"
        @blur="toggleEdit = false" />
      <span 
        v-else
        class="bullet-list-item__content" 
        tabindex="0"
        @focus="selectText"
        @click="selectText">
        {{ content }}
      </span>
    </span>
  </li>
</template>

<script>
import MaterialIcon from '@/components/MaterialIcon.vue';
import ListItemIcon from './BulletListItemIcon.vue';

export default {
  name: 'BulletListItem',
  props: {
    type: String,
    state: String,
    priority: Boolean,
    content: String
  },
  components: {
    MaterialIcon,
    ListItemIcon
  },
  data () {
    return {
      hovered: false,
      localContent: this.content,
      toggleEdit: false
    }
  },
  computed: {
    showEditBox () {
      return !this.content || this.toggleEdit;
    },
    classes () {
      return {
        [`bullet-list-item bullet-list-item--${this.type}`]: true,
        'bullet-list-item--removed': this.state === 'removed'
      };
    }
  },
  methods: {
    update (prop, value) {
      this.$emit(`update:${prop}`, value);
    },
    async selectText () {
      this.toggleEdit = true;
      await this.$nextTick();
      this.$refs.input.focus();
    }
  }
}
</script>