<template>
<main class="canvas-container">
  <div id="canvas" class="canvas" ref="canvas">
    <bullet-list 
      v-for="(list, index) in lists"
      ref="lists"
      :key="list.id" 
      :position="list.position"
      :items="list.items"
      :move-mode="!drawingMode"
      @remove-list="removeList(list.id)"
      @set-active="setActive(index)" />
    <div 
      v-for="(svg, i) in svgs" 
      :key="i" 
      v-html="svg.svg"
      class="path-container"
      :style="{ left: svg.x + 'px', top: svg.y + 'px' }"></div>
    <drawing-canvas 
      v-if="drawingMode"
      :width="canvasWidth" 
      :height="canvasHeight" 
      :drawing-mode="drawingMode"
      :color="penColor"
      :stroke-width="penWidth"
      @draw-path="drawPath" />
  </div>
</main>
</template>

<script>
import BulletList from '@/components/lists/BulletList.vue'
import DrawingCanvas from '@/components/drawing/DrawingCanvas.vue'

export default {
  name: 'MainCanvas',
  components: {
    BulletList,
    DrawingCanvas
  },
  props: {
    lists: Array,
    drawingMode: Boolean,
    penColor: String,
    penWidth: Number
  },
  data () {
    return {
      svgs: [],
      canvasWidth: 0,
      canvasHeight: 0,
    }
  },
  methods: {
    removeList (id) {
      let index = this.lists.map(i => i.id).indexOf(id);
      if (index < 0) return;
      this.$emit('update:lists', this.lists.splice(index, 1));
    },
    async setActive (activeIndex) {
      await this.$nextTick();

      this.$refs.lists.forEach((list, index) => {
        if (index == activeIndex) list.activateList();
        else list.deactivateList();
      })
    },
    drawPath (svg) {
      this.svgs.push(svg);
    },
    onWindowResize () {
      this.canvasWidth = this.$refs.canvas.offsetWidth;
      this.canvasHeight = this.$refs.canvas.offsetHeight;
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  }
}
</script>