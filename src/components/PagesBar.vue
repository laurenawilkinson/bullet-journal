<template>
  <div class="pages-bar">
    <ul class="pages-bar__pages">
      <li 
        v-for="page in pages" 
        :key="page" 
        :class="{
          'pages-bar__page': true,
          'active': isActivePage(page)
        }"
        @click="setActivePage(page)">
          <span>{{ page }}</span>
          <icon-button v-if="pages.length > 1" icon="delete" @click.stop="removePage(page)" />
        </li>
    </ul>
    <div class="pages-bar__add-page" @click="addPage">
      <i class="material-icons">add</i>
    </div>
  </div>
</template>

<script>
import EventBus from '../EventBus';
import IconButton from '@/components/IconButton.vue'

export default {
  name: 'PagesBar',
  components: {
    IconButton
  },
  props: {
    pages: Array
  },
  methods: {
    isActivePage (number) {
      return this.$store.state.currentPage === number;
    },
    setActivePage (number) {
      EventBus.$emit('pages:activate', number);
    },
    addPage () {
      EventBus.$emit('pages:add');
    },
    removePage (number) {
      EventBus.$emit('pages:delete', number);
    }
  }
}
</script>