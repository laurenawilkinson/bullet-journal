<template>
<header class="topbar">
  <nav class="topbar__tabs">
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
        Components
      </button>
    </div>
    <div class="topbar__tab">
      <button 
        :class="{ 'button topbar__tab-button': true, active: activeTab == 'pages' }" 
        @click="setActiveTab('pages')">
        Pages
      </button>
    </div>
  </nav>
  <div
    class="topbar__tab-content" 
    v-on-clickaway="closeMenu" 
    @click="keepActiveComponentAlive">
    <template v-if="activeTab == 'pages'">
      Page stuff
    </template>
    <button-list
      v-else 
      :buttons="topbarButtons" />
  </div>
</header>
</template>

<script>
import ButtonList from '@/components/top-bar/ButtonList.vue'
import EventBus from '../EventBus'
import { mapState } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'TopBar',
  components: {
    ButtonList
  },
  mixins: [ clickaway ],
  props: {
    drawingMode: Boolean,
    penColor: String,
    penWidth: Number,
    drawTool: String
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
    buttons () {
      return [
        {
          key: 'draw',
          icon: 'edit',
          text: 'Draw Path',
          active: this.active == 'draw' && this.drawTool == 'path' 
        },
        {
          key: 'draw-multi',
          icon: 'draw_group',
          custom: true,
          text: 'Draw Group',
          active: this.active == 'draw' && this.drawTool == 'group'
        }
      ]
    },
    secondaryMenuButtonsTools () {
      return [
        {
          key: 'line',
          tab: 'tools',
          menu: ['draw-line'],
          binding: {
            active: this.active == 'draw' && this.drawTool == 'line',
            custom: true,
            icon: 'line_tool'
          },
          text: 'Line',
          component: 'IconButton'
        },
        {
          key: 'rect',
          tab: 'tools',
          menu: ['draw-rect'],
          binding: {
            active: this.active == 'draw' && this.drawTool == 'rect',
            custom: true,
            icon: 'square_tool'
          },
          text: 'Square',
          component: 'IconButton'
        },
        {
          key: 'ellipse',
          tab: 'tools',
          menu: [ 'draw-ellipse' ],
          binding: {
            active: this.active == 'draw' && this.drawTool == 'ellipse',
            custom: true,
            icon: 'circle_tool'
          },
          text: 'Circle',
          component: 'IconButton'
        },
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
    secondaryMenuButtonsComponents () {
      return [
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
            value: this.activeItem.options.tickType,
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
    secondaryMenuButtons () {
      return [
        {
          key: 'back',
          binding: {
            icon: 'keyboard_backspace'
          },
          text: 'Back',
          component: 'IconButton',
          events: {
            click: () => this.backButton()
          }
        },
        ...this.secondaryMenuButtonsTools,
        ...this.secondaryMenuButtonsComponents
      ]
    },
    mainButtons () {
      return [
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
        },
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
    topbarButtons () {
      return this.showSecondaryMenu 
        ? this.secondaryMenuButtons
          .filter(x => 
          x.key == 'back' ||
            (x.menu.includes(this.secondaryMenuName)) )
        : this.mainButtons.filter(x => x.tab === this.activeTab);
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
      this.update('drawing-mode', true);
      this.localDrawTool = drawTool;
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
    backButton () {
      this.$store.dispatch('setActiveItem', null);
    },
    closeMenu () {
      if (this.activeItem !== null) return;
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