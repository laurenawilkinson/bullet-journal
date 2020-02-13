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

<style lang="scss" scoped>
.bullet-list-item {
  background-color: pink;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;

  + .bullet-list-item {
    margin-top: 0.5rem;
  }

  &__input {
    background-color: transparent;
    font-size: 1rem;
    box-shadow: none;
    border: 0;
    border-bottom: 2px solid transparent;
    padding-left: 0.27rem;

    &:focus {
      border-bottom-color: grey;
      outline: 0;
    }
  }

  &--removed {
    .bullet-list-item__input {
      text-decoration: line-through;
    }

    .bullet-list-item__content-container {
      position: relative;
      
      &:after {
        content: '';
        width: 100%;
        height: 1px;
        background-color: black;
        position: absolute;
        left: 4px;
      }

      &--focused {
        &:after {
          width: 14px;
        }
      }
    }
  }

  &__icon {
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    &--signifier {
      justify-content: flex-end;
      text-decoration: none !important;
      
      i {
        cursor: pointer;
        font-size: 1rem;
      }
    }
  }

  &__content-container {
    display: flex;
    align-items: center;
  }

  &__content,
  &__input {
    margin-left: 0.5rem;
  }
}
</style>