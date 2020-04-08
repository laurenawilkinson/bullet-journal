<template>
  <aside class="info-sidebar">
    <h2>{{ value.title }}</h2>
    <div v-for="opt in item.options" :key="opt.text">
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

export default {
  name: 'InfoBar',
  props: {
    value: Object
  },
  components: {
    OptionRadios,
    OptionText,
    OptionSelect
  },
  computed: {
    item: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('input', value)
      } 
    }
  },
  methods: {
    setValue (value, i) {
      this.item.options[i].value = value;
    }
  }
}
</script>