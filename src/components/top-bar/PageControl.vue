<template>
  <div class="topbar__pages">
    <label class="topbar__pages-select">
      <span>Current Page</span>
      <select v-model="currentPage">
        <option v-for="page in pages" :key="page.id" :value="page.id">{{ page.name }}</option>
      </select>
    </label>
    <button-list :buttons="buttons" />
  </div>
</template>

<script>
import EventBus from '../../EventBus';
import ButtonList from './ButtonList.vue'

export default {
  name: 'PageControl',
  components: {
    ButtonList
  },
  props: {
    pages: Array
  },
  computed: {
    buttons () {
      let btns = [
        {
          key: 'add-page',
          binding: {
            icon: 'add'
          },
          text: 'Add',
          component: 'IconButton',
          events: {
            click: () => this.addPage()
          }
        },
        {
          key: 'rename-page',
          binding: {
            icon: 'edit',
            value: this.$store.getters.currentPageObj.name,
            input: {
              type: 'text'
            }
          },
          text: 'Rename',
          component: 'InfoBarOptionText',
          events: {
            input: v => this.renamePage(v)
          }
        }
      ]

      
      return this.pages.length > 1 ? [
        ...btns,
        {
          key: 'delete-page',
          binding: {
            icon: 'delete'
          },
          text: 'Delete',
          component: 'IconButton',
          events: {
            click: () => this.removePage()
          }
        }
      ] : btns;
    },
    currentPage: {
      get () {
        return this.$store.state.currentPage;
      },
      set (value) {
        this.setActivePage(parseInt(value));
      }
    }
  },
  methods: {
    renamePage (name) {
      EventBus.$emit('pages:rename', { id: this.$store.state.currentPage, value: name });
    },
    setActivePage (number) {
      EventBus.$emit('pages:activate', number);
    },
    addPage () {
      EventBus.$emit('pages:add');
    },
    removePage () {
      EventBus.$emit('pages:delete', this.currentPage);
    }
  }
}
</script>