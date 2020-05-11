<template>
  <div class="pages-bar" v-on-clickaway="close">
    <div class="pages-bar__title-container">
      <div class="pages-bar__title">
        <material-icon icon="book" />
        <h2>Pages</h2>
      </div>
      <icon-button class="pages-bar__btn-close" icon="close" @click="$emit('close')" />
    </div>
    <ul class="pages-bar__pages">
      <li 
        v-for="page in pages" 
        :key="page.id" 
        :class="{
          'pages-bar__page': true,
          'active': isActivePage(page.id)
        }"
        @click="setActivePage(page.id)">
          <input 
            v-if="currentRenamingId !== null && currentRenamingId == page.id"
            ref="inputs"
            type="text"
            :value="editingPageTitle"
            @change="closeRename($event)" />
          <span v-else>{{ page.name }}</span>
          <icon-button 
            icon="edit" 
            @click.stop="openRename(page)" />
          <icon-button 
            v-if="pages.length > 1" 
            icon="delete" 
            @click.stop="removePage(page.id)" />
        </li>
    </ul>
    <icon-button icon="add" class="pages-bar__add-page" @click="addPage">
      Add Page
    </icon-button>
  </div>
</template>

<script>
import EventBus from '../EventBus';
import IconButton from '@/components/IconButton.vue'
import MaterialIcon from '@/components/MaterialIcon.vue'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'PagesBar',
  components: {
    IconButton,
    MaterialIcon
  },
  mixins: [ clickaway ],
  props: {
    pages: Array
  },
  data () {
    return {
      currentRenamingId: null,
      editingPageTitle: ''
    }
  },
  methods: {
    async openRename ({ id, name }) {
      this.currentRenamingId = id;
      this.editingPageTitle = name;
      await this.$nextTick();
      this.$refs.inputs[0].focus();
    },
    closeRename (e) {
      if (e.target.value.length == 0) return;

      this.renamePage(this.currentRenamingId, e.target.value);
      this.currentRenamingId = null;
      this.editingPageTitle = '';
    },
    renamePage (id, value) {
      EventBus.$emit('pages:rename', { id, value });
    },
    isActivePage (number) {
      return this.$store.state.currentPage === number;
    },
    setActivePage (number) {
      EventBus.$emit('pages:activate', number);
      this.close();
    },
    addPage () {
      EventBus.$emit('pages:add');
    },
    removePage (number) {
      EventBus.$emit('pages:delete', number);
    },
    close () {
      if (window.innerWidth < 1200) this.$emit('close');
    }
  }
}
</script>