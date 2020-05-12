<template>
  <li 
    :class="classes"
    @click="$emit('click')">
    <span
      class="bullet-list-item__icon bullet-list-item__icon--signifier">
      <i class="material-icons-round"
        v-show="priority || (listActive && !listMoving)" 
        @click="update('priority', !priority)">
        {{ priority ? 'star' : 'star_border' }}  
      </i>
    </span>
    <span :class="{ 
        'bullet-list-item__content-container': true, 
        'bullet-list-item__content-container--focused': showEditBox 
      }">
      <list-item-icon 
        :type="type" 
        :state="state"
        :removed="removed"
        @update:state="update('state', $event)"
        @update:removed="update('removed', $event)" />
      <input 
        v-if="showEditBox"
        v-model="localContent" 
        class="text-input bullet-list-item__input"
        ref="input"
        @change="update('content', localContent)"
        @keyup.enter="deselectText"
        @blur="deselectText" />
      <span 
        v-else
        class="bullet-list-item__content" 
        tabindex="0"
        @focus="selectText"
        @click="selectText">
        {{ content }}
      </span>
    </span>
    <div class="bullet-list-item__menu"> 
      <icon-button  
        v-if="listActive"
        class="bullet-list-item__menu-button"
        icon="more_vert"
        size="sm"
        @click="toggleMenu"  /> <!-- toggle menu -->
      <aside 
        v-if="menuOpen"
        class="bullet-list-item__toolbar"
        v-on-clickaway="closeMenu">
        <icon-button 
          v-if="type == 'task'"
          icon="near_me"
          @click="markAs('migrated')">Migrate</icon-button> <!-- migrate -->
        <icon-button 
          icon="strikethrough_s"
          @click="markAs('removed')">Strikeout</icon-button> <!-- irrelevant -->
        <icon-button 
          v-if="!onlyItem"
          icon="delete"
          @click="removeItem">Delete</icon-button> <!-- remove -->
      </aside>
    </div>
  </li>
</template>

<script>
import ListItemIcon from './BulletListItemIcon.vue';
import IconButton from '@/components/IconButton.vue';
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'BulletListItem',
  props: {
    type: String,
    state: String,
    priority: Boolean,
    content: String,
    listActive: Boolean,
    listMoving: Boolean,
    removed: Boolean,
    disabled: Boolean,
    onlyItem: Boolean
  },
  components: {
    ListItemIcon,
    IconButton
  },
  mixins: [ clickaway ],
  data () {
    return {
      menuOpen: false,
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
        'bullet-list-item--removed': this.removed
      };
    }
  },
  methods: {
    update (prop, value) {
      if (this.disabled) return;
      this.$emit('update')
      this.$emit(`update:${prop}`, value);
    },
    async selectText () {
      if (this.disabled) return;

      this.$emit('set-active');
      this.toggleEdit = true;
      await this.$nextTick();
      this.$refs.input.focus();
    },
    removeItem () {
      this.$emit('remove-item');
    },
    markAs (value) {
      this.closeMenu();
      if (this.disabled) return;

      if (value == 'removed') return this.update('removed', !this.removed);

      if (this.state !== value) this.update('state', value);
      else this.update('state', 'default');

    },
    closeMenu () {
      this.menuOpen = false;
    },
    async deselectText () {
      this.toggleEdit = false;
      // if (this.content.length == 0) this.removeItem();
      this.update('content', this.localContent)
    },
    toggleMenu () {
      this.menuOpen = !this.menuOpen;
      if (this.menuOpen) this.$emit('opened-menu');
    }
  }
}
</script>