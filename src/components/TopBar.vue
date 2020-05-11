<template>
<header class="topbar">
  <nav class="topbar__tabs">
    <div class="topbar__tab topbar__tab--pages">
      <icon-button 
        :class="{ 'button topbar__tab-button pages-icon': true, active: activeTab == 'pages' }"
        icon="note" 
        @click="$emit('open-pages')" />
    </div>
    <div class="topbar__tab">
      <button 
        :class="{ 'button topbar__tab-button': true, active: activeTab == 'tools' }" 
        @click="setActiveTab('tools')">
        Tools
      </button>
    </div>
    <div class="topbar__tab">
      <button 
        :class="{ 'button topbar__tab-button': true, active: activeTab == 'components' }" 
        @click="setActiveTab('components')">
        Widgets
      </button>
    </div>
  </nav>
  <div class="topbar__main-container">
    <div class="topbar__tablet-pages" @click="$emit('open-pages')">
      <icon-button 
        :class="{ 'button topbar__button pages-icon': true, active: activeTab == 'pages' }"
        icon="note" />
    </div>
    <div
      class="topbar__tab-content" 
      v-on-clickaway="closeMenu" 
      @click="keepActiveComponentAlive">
      <div 
        v-if="activeTab === 'tools' || showAll"
        class="topbar__content topbar__content--tools" >
        <div class="topbar__content-title">
          Tools
        </div>
        <button-list
          :buttons="topbarButtonsTools" />
      </div>
      <div 
        v-if="activeTab === 'components' || showAll"
        class="topbar__content topbar__content--components">
        <div class="topbar__content-title">
          Widgets
        </div>
        <button-list
          :buttons="topbarButtonsComponents" />
      </div>
    </div>
  </div>
</header>
</template>

<script>
import ButtonList from '@/components/top-bar/ButtonList.vue'
import IconButton from '@/components/IconButton.vue'
import EventBus from '../EventBus'
import { mapState } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'TopBar',
  components: {
    ButtonList,
    IconButton
  },
  mixins: [ clickaway ],
  props: {
    drawingMode: Boolean,
    penColor: String,
    penWidth: Number,
    drawTool: String,
    pages: Array,
    showAll: Boolean
  },
  data () {
    return {
      active: 'move',
      showDropdown: false,
      activeTab: 'tools',
      secondaryMenuName: null,
      showSecondaryMenu: false,
      localOptions: []
    }
  },
  watch: {
    '$store.state.activeItem': {
      handler (value, oldValue) {
        if (value === null) {
          this.closeMenu();
        } else {
          this.openMenu(value.type);
          this.justSetTab(value.tab)
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      activeItem: state => state.activeItem || null,
      activeItemId: state => state.activeItem.id || null
    }),
    topbarButtonsTools () {
      return (
        this.showSecondaryMenu &&
        ['draw', 'draw-line', 'draw-ellipse', 'draw-rect']
          .includes(this.secondaryMenuName)) ?
          this.secondaryMenuButtonsTools
            .filter(x => x.key == 'back' || x.menu.includes(this.secondaryMenuName)) :
          [
            {
              key: 'move',
              tab: 'tools',
              binding: {
                active: this.active == 'move',
                icon: 'format_shapes'
              },
              text: 'Move',
              component: 'IconButton',
              events: {
                click: () => this.activateMove()
              }
            },
            {
              key: 'path',
              tab: 'tools',
              binding: {
                active: this.active == 'draw' && this.drawTool == 'path',
                icon: 'edit'
              },
              text: 'Draw',
              component: 'IconButton',
              events: {
                click: () => this.openMenu('draw', this.activateDraw('path'))
              }
            },
            {
              key: 'line',
              tab: 'tools',
              binding: {
                active: this.active == 'draw' && this.drawTool == 'line',
                custom: true,
                icon: 'line_tool'
              },
              text: 'Line',
              component: 'IconButton',
              events: {
                click: () => this.openMenu('draw-line', this.activateDraw('line'))
              }
            },
            {
              key: 'rect',
              tab: 'tools',
              binding: {
                active: this.active == 'draw' && this.drawTool == 'rect',
                custom: true,
                icon: 'square_tool'
              },
              text: 'Square',
              component: 'IconButton',
              events: {
                click: () => this.openMenu('draw-rect', this.activateDraw('rect'))
              }
            },
            {
              key: 'ellipse',
              tab: 'tools',
              binding: {
                active: this.active == 'draw' && this.drawTool == 'ellipse',
                custom: true,
                icon: 'circle_tool'
              },
              text: 'Circle',
              component: 'IconButton',
              events: {
                click: () => this.openMenu('draw-ellipse', this.activateDraw('ellipse'))
              }
            }
          ]
    },
    secondaryMenuButtonsTools () {
      return [
        this.secondaryMenuBackButton,
        {
          key: 'path',
          tab: 'tools',
          menu: [ 'draw' ],
          binding: {
            active: this.active == 'draw' && this.drawTool == 'path',
            icon: 'edit'
          },
          text: 'Draw',
          component: 'IconButton',
          events: {
            click: () => this.activateDraw('path')
          }
        },
        {
          key: 'draw-multi',
          tab: 'tools',
          menu: [ 'draw' ],
          binding: {
            active: this.active == 'draw' && this.drawTool == 'group',
            icon: 'draw_group',
            custom: true
          },
          text: 'Group',
          component: 'IconButton',
          events: {
            click: () => this.activateDraw('group')
          }
        },
        {
          key: 'stroke-colour-picker',
          tab: 'tools',
          menu: [ 'draw', 'draw-line', 'draw-rect', 'draw-ellipse' ],
          binding: {
            value: this.localPenColor
          },
          text: 'Stroke',
          component: 'ColourPicker',
          events: {
            change: v => this.setPenColour(v)
          }
        },
        {
          key: 'stroke-size',
          tab: 'tools',
          menu: [ 'draw', 'draw-line', 'draw-rect', 'draw-ellipse' ],
          binding: {
            value: this.localPenWidth
          },
          text: 'Size',
          component: 'StrokeWidthSlider',
          events: {
            change: v => this.setPenWidth(v)
          }
        }
      ]
    },
    topbarButtonsComponents () {
      return (
        this.showSecondaryMenu && 
        this.activeItem !== null && 
        this.activeItem.tab == 'components') ?
          this.secondaryMenuButtonsComponents
            .filter(x => x.key == 'back' || x.menu.includes(this.secondaryMenuName)) :
          [
            {
              key: 'list',
              tab: 'components',
              binding: {
                icon: 'format_list_bulleted'
              },
              text: 'List',
              component: 'IconButton',
              events: {
                click: () => this.activateList()
              }
            },
            {
              key: 'tracker',
              tab: 'components',
              binding: {
                icon: 'alarm'
              },
              text: 'Tracker',
              component: 'IconButton',
              events: {
                click: () => this.activateTracker()
              }
            },
            {
              key: 'image',
              tab: 'components',
              text: 'Image',
              component: 'ImageUploadButton',
              events: {
                'display-image': e => this.$emit('display-image', e)
              }
            }
          ]
    },
    secondaryMenuButtonsComponents () {
      return [
        this.secondaryMenuBackButton,
        {
          key: 'task',
          menu: [ 'list' ],
          binding: {
            icon: 'add'
          },
          text: 'Task',
          component: 'IconButton',
          events: {
            click: () => this.raiseEvent(
                'list:add-item', 
                { id: this.activeItemId, type: 'task' })
          }
        },
        {
          key: 'event',
          menu: [ 'list' ],
          binding: {
            icon: 'add'
          },
          text: 'Event',
          component: 'IconButton',
          events: {
            click: () => this.raiseEvent(
                'list:add-item', 
                { id: this.activeItemId, type: 'event' })
          }
        },
        {
          key: 'note',
          menu: [ 'list' ],
          binding: {
            icon: 'add'
          },
          text: 'Note',
          component: 'IconButton',
          events: {
            click: () => this.raiseEvent(
                'list:add-item', 
                { id: this.activeItemId, type: 'note' })
          }
        },
        {
          key: 'delete-list',
          menu: [ 'list' ],
          binding: {
            icon: 'delete'
          },
          text: 'Delete',
          component: 'IconButton',
          events: {
            click: () => this.raiseEvent('list:delete', this.activeItemId)
          }
        },
        {
          key: 'add-tracker-item',
          menu: [ 'tracker' ],
          binding: {
            icon: 'add'
          },
          text: 'Add Item',
          component: 'IconButton',
          events: {
            click: () => this.raiseEvent('tracker:add-item', this.activeItemId)
          }
        },
        {
          key: 'tick-type',
          menu: [ 'tracker' ],
          binding: {
            value: this.getOptionValue('tickType'),
            options: [
              {
                text: 'Circle',
                value: 'circle'
              },
              { 
                text: 'Block',
                value: 'block'
              }
            ]
          },
          text: 'Tick Type',
          component: 'InfoBarOptionSelect',
          events: {
            change: v => this.$store.dispatch('updateActiveItemOption', { prop: 'tickType', value: v })
          }
        },
        {
          key: 'delete-tracker',
          menu: [ 'tracker' ],
          binding: {
            icon: 'delete'
          },
          text: 'Delete',
          component: 'IconButton',
          events: {
            click: () => this.raiseEvent('tracker:delete', this.activeItemId)
          }
        }
      ]
    },
    secondaryMenuBackButton () {
      return {
          key: 'back',
          binding: {
            icon: 'keyboard_backspace'
          },
          text: 'Back',
          component: 'IconButton',
          events: {
            click: () => this.backButton()
          }
        }
    },
    localDrawTool: {
      get () {
        return this.drawTool;
      },
      set (value) {
        this.update('draw-tool', value)
      }
    },
    localPenColor: {
      get () {
        return this.penColor;
      },
      set (value) {
        this.update('pen-color', value)
      }
    },
    localPenWidth: {
      get () {
        return this.penWidth;
      },
      set (value) {
        this.update('pen-width', value)
      }
    }
  },
  methods: {
    getOptionValue (prop) {
      return this.activeItem !== null && this.activeItem.options
        ? this.activeItem.options[prop]
        : null;
    },
    setActiveTab (tab) {
      if (tab == this.activeTab) return;
      this.activeTab = tab;
      this.showSecondaryMenu = false;
      this.$store.dispatch('setActiveItem', null);
      this.stopKeepActiveComponentAlive();
      this.activateMove();
    },
    update (prop, value) {
      this.$emit(`update:${prop}`, value)
    },
    activateMove () {
      this.active = 'move';
      this.update('drawing-mode', false);
    },
    activateDraw (drawTool) {
      this.active = 'draw';
      this.$store.dispatch('setActiveItem', null);
      this.update('drawing-mode', true);
      this.localDrawTool = drawTool;
      EventBus.$emit('draw:finish-path');
    },
    activateList () {
      this.activateMove();
      this.$emit('create-list');
    },
    activateTracker () {
      this.activateMove();
      this.$emit('create-tracker');
    },
    setPenColour (colour) {
      this.localPenColor = colour;
    },
    setPenWidth (width) {
      this.localPenWidth = width;
    },
    keepActiveComponentAlive (handler = null) {
      if (this.showSecondaryMenu) this.$store.dispatch('keepAlive', true);
    },
    stopKeepActiveComponentAlive () {
      this.$store.dispatch('keepAlive', false);
    },
    raiseEvent (name, payload) {
      this.keepActiveComponentAlive();
      EventBus.$emit(name, payload)
    },
    openMenu (menuName, handler = null) {
      this.showSecondaryMenu = true;
      this.secondaryMenuName = menuName;
      if (handler !== null) handler();
    },
    justSetTab (tabName) {
      if (tabName == this.activeTab) return;
      this.activeTab = tabName;
    },
    backButton () {
      this.$store.dispatch('setActiveItem', null);
      this.stopKeepActiveComponentAlive();
      this.showSecondaryMenu = false;
      this.secondaryMenuName = null;
      this.activateMove();
    },
    closeMenu () {
      if (this.activeItem !== null 
        || this.secondaryMenuName == 'draw' 
        || this.secondaryMenuName == 'draw-rect'
        || this.secondaryMenuName == 'draw-ellipse'
        || this.secondaryMenuName == 'draw-line' ) return;
      this.stopKeepActiveComponentAlive();
      this.showSecondaryMenu = false;
      this.secondaryMenuName = null;
      this.activateMove();
    }
  },
  created () {
    EventBus.$on('topbar:open-menu', type => this.openMenu(type))
    EventBus.$on('topbar:close-menu', () => this.closeMenu())
  }
}
</script>