<template>
  <label v-on-clickaway="closeInput">
    <icon-button :icon="icon" @click="toggleInput">
      <slot></slot>
    </icon-button>
    <div class="topbar__window" v-if="showInput">
      <input
        ref="input"
        v-model.lazy="localValue"
        v-bind="input"
        />
    </div>
  </label>
</template>

<script>
import IconButton from '@/components/IconButton.vue';
import { mixin as clickaway } from 'vue-clickaway'
export default {
  name: 'InfoBarOptionText',
  mixins: [ clickaway ],
  props: {
    text: String,
    value: [ String, Number ],
    input: Object,
    icon: String
  },
  components: {
    IconButton
  },
  data () {
    return {
      showInput: false
    }
  },
  computed: {
    localValue: {
      get () {
        return this.value;
      },
      set (val) {
        if (!this.invalid) this.$emit('input', this.input.type == 'number' ? parseInt(val) : val)
      }
    },
    invalid () {
      return this.value == null || this.typeInvalid;
    },
    typeInvalid () {
      const type = this.input.type || null;
      return type 
        ? type == 'number' && isNaN(this.value)
        || type == 'number' && this.input.min && this.input.min > this.value
        || type == 'number' && this.input.max && this.input.max < this.value
        : false;
    }
  },
  methods: {
    closeInput () {
      this.showInput = false;
    },
    toggleInput () {
      if (this.showInput) {
        this.showInput = false;
      } else {
        this.showInput = true;
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      }
    }
  }
}
</script>