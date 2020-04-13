<template>
  <aside class="info-sidebar" 
    @click="keepComponentAlive" 
    v-on-clickaway="stopKeepComponentAlive">
    <h2>{{ title }}</h2>
    <div v-for="opt in localOptions" :key="opt.text">
      <option-radios 
        v-if="opt.type == 'radio-list'"
        v-model="opt.value"
        :text="opt.text"
        :options="opt.options" />
      <option-select
        v-else-if="opt.type == 'select-list'"
        v-model="opt.value"
        :text="opt.text"
        :options="opt.options" />
      <option-text
        v-else
        v-model="opt.value"
        :text="opt.text"
        :binding="opt.binding" />
    </div>
  </aside>
</template>

<script>
import OptionText from '@/components/info-bar/InfoBarOptionText.vue'
import OptionRadios from '@/components/info-bar/InfoBarOptionRadios.vue'
import OptionSelect from '@/components/info-bar/InfoBarOptionSelect.vue'
import { InfoBarTracker } from '@/models/InfoBarItems'
import { mapState } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway';

export default {
  name: 'InfoBar',
  mixins: [ clickaway ],
  components: {
    OptionRadios,
    OptionText,
    OptionSelect
  },
  data () {
    return {
      localOptions: []
    }
  },
  watch: {
    localOptions: {
      handler (value) {
        this.$store.dispatch('updateActiveItemOptions', value)
      },
      deep: true
    },
    options (value) {
      this.localOptions = value;
    }
  },
  computed: {
    ...mapState({
      options: state => state.activeItem.options || [],
      title: state => state.activeItem.title
    })
  },
  methods: {
    keepComponentAlive () {
      this.$store.dispatch('keepAlive', true);
    },
    stopKeepComponentAlive () {
      this.$store.dispatch('keepAlive', false);
    }
  },
  mounted () {
    this.localOptions = this.options;
  }
}
</script>