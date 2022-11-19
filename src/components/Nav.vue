<template>
  <div :id="location + '-nav'" class="nav-wrap">
    <link :src="external_style_sheet" rel="stylesheet" type="text/css">
    <slot name="nav_include"></slot>
  </div>
</template>

<script>
export default {
  name: 'NavWc',
  data() {
    return {
      displayWidth: window.innerWidth,
      bp_sm: 576,
      bp_md: 768,
      bp_lg: 992,
      bp_xl: 1200,
      maxWidth: '0',
      minWidth: '0',
      maxHeight: '0',
      minHeight: '0',
      alignment: 'left',
      timeout: null,
      cssLink: false,
      cssStyles: false
    }
  },
  props: {
    location: { default: '', type: String },
    // row or column direction
    direction: { default: 'row', type: String },
    // pull in basic style settings
    font: { default: '', type: String }, 
    color: { default: '', type: String }, 
    hover: { default: '', type: String },
    // import external styles
    stylesheet: { default: '', type: String }
  },
  computed: {
    external_style_sheet() {
      let str = this.stylesheet != '' ? this.stylesheet : null
      return str
    },
    wrap_styles() {
      let str = ''
      this.styles
      return str
    }
  }
}
</script>

<style lang="scss">



</style>
