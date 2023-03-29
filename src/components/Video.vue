<template>
  <div class="video-wrapper" :style="vid_styles"></div>
</template>

<script>

export default {
  name: 'VideoWc',

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
      provider: '',
      containerAspect: null,
      aspect: null,
      timeout: null
    }
  },

  props: {
    title: { default: 'Video Iframe', type: String },
    src: { default: '', type: String },
    fit: { default: 'contain', type: String },
    maxw: { default: '', type: String },
    minw: { default: '', type: String },
    maxh: { default: '', type: String },
    minh: { default: '', type: String }
  },

  computed: {
    vid_styles() {
      let pointer_events = this.fit == 'cover' ? 'pointer-events: none;' : ''
      let str = ''
      str += this.maxWidth !== '0' ? `max-width: ${this.maxWidth}; ` : ''
      str += this.minWidth !== '0' ? `min-width: ${this.minWidth}; ` : ''
      str += this.maxHeight !== '0' ? `max-height: ${this.maxHeight}; ` : ''
      str += this.minHeight !== '0' ? `min-height: ${this.minHeight};` : ''
      str += pointer_events
      return str
    }
  },

  mounted() {
    this.getBreakPointValues()
    this.buildVideo()
    this.onResize()
    window.addEventListener('resize', this.onResize)
  },

  beforeDestroy() { 
    window.removeEventListener('resize', this.onResize)
  },

  methods: {  

    onResize() {
      // methods ran on resize with debounce
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => { 
        this.getContainerAspect()
        this.displayWidth = window.innerWidth 
        this.getVideoSize()
      }, 150)
    },
    buildVideo() {
      // provided a video source, determine the provider and requisite markup
      if (this.src != '') {
        let vid_id, vid_src
        switch(true) { 
          case this.src.indexOf('youtube') > 0: 
            this.provider = 'youtube'
            vid_id = this.src.split('v=')[1]
            vid_src = `//www.youtube.com/embed/${vid_id}?version=3&enablejsapi=1&playlist=${vid_id}&loop=1&mute=1&autoplay=1`
            fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${vid_id}&format=json`).then((response) => response.json()).then((data) => this.getVideoAspect('youtube', data));
            break
          case this.src.indexOf('vimeo') > 0: 
            this.provider = 'vimeo'
            vid_id = this.src.split('vimeo.com/')[1]
            vid_src = `//player.vimeo.com/video/${vid_id}?autoplay=1&loop=1&muted=1&background=1&title=0&byline=0&portrait=0&sidedock=0`
            fetch(`https://vimeo.com/api/oembed.json?url=https://www.vimeo.com/${vid_id}`).then((response) => response.json()).then((data) => this.getVideoAspect('vimeo', data));
            break
          default: 
            this.provider = 'html5'
            vid_src = this.src
          }
        let vid_el = this.provider == 'html5' ? document.createElement('video') : document.createElement('iframe')
        if (this.provider == 'html5') {
          let src_el = document.createElement('source')
          let attribs = { 'class': this.fit, 'autoplay': true, 'loop': true, 'playsinline': true, 'muted': true }
          for(var key in attribs) { vid_el.setAttribute(key, attribs[key]); }
          src_el.src = vid_src
          vid_el.appendChild(src_el)
        } else { 
          vid_el.src = vid_src 
          vid_el.title = this.title
        }
        this.$el.appendChild(vid_el)
      }
    },
    getVideoAspect(type, data) {
      // since youtube and vimeo load iframes, we calculate the aspect and supply minimal dimensions to the wrapper
      if (type == 'youtube' || type == 'vimeo') this.aspect = data.height/data.width
    },
    getContainerAspect() {
      // get the wrapper aspect so we know how to size the video for "cover"
      this.containerAspect = this.$el.offsetHeight/this.$el.offsetWidth
    },
    getVideoSize() {
      // use the video and wrapper aspect to correctly size the iframe for "contain" or "cover"
      if (this.aspect) {
        if (this.fit == 'contain') {
          this.$el.style.minHeight = (this.$el.offsetWidth * this.aspect) +'px'
          this.$el.querySelector('iframe').style.height = ((this.$el.offsetWidth * this.aspect) +2) +'px'
        }
        if (this.fit == 'cover') 
          if (this.containerAspect >= this.aspect) { 
            this.$el.querySelector('iframe').style.height = '102%'
            this.$el.querySelector('iframe').style.width = (this.$el.offsetHeight / this.aspect) +'px' 
          }
          if (this.containerAspect < this.aspect) { 
            this.$el.querySelector('iframe').style.width = '102%'
            this.$el.querySelector('iframe').style.height = (this.$el.offsetWidth * this.aspect) +'px' 
          }
      }
    },
    getBreakPointValues() {
      // set user input property values by breakpoint
      let theMaxw = this.maxw.split(',')
      let theMinw = this.minw.split(',')
      let theMaxh = this.maxh.split(',')
      let theMinh = this.minh.split(',')
      let theFit = this.fit.split(',') 
      this.maxWidth = theMaxw[0]
      this.minWidth = theMinw[0]
      this.maxHeight = theMaxh[0]
      this.minHeight = theMinh[0]
      this.fitment = theFit[0]
      switch (true) {
        case this.displayWidth >= this.bp_sm && this.displayWidth < this.bp_md:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 2 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 2 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 2 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 2 ? theMinh[i] : this.minHeight
          for (let i in theFit) this.fitment = theFit[i] != undefined && theFit[i] != '' && i < 2 ? theFit[i] : this.fitment
          break
        case this.displayWidth >= this.bp_md && this.displayWidth < this.bp_lg:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 3 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 3 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 3 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 3 ? theMinh[i] : this.minHeight
          for (let i in theFit) this.fitment = theFit[i] != undefined && theFit[i] != '' && i < 3 ? theFit[i] : this.fitment
          break
        case this.displayWidth >= this.bp_lg && this.displayWidth < this.bp_xl:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' && i < 4 ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' && i < 4 ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' && i < 4 ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' && i < 4 ? theMinh[i] : this.minHeight
          for (let i in theFit) this.fitment = theFit[i] != undefined && theFit[i] != '' && i < 4 ? theFit[i] : this.fitment
          break
        case this.displayWidth >= this.bp_xl:
          for (let i in theMaxw) this.maxWidth = theMaxw[i] != undefined && theMaxw[i] != '' ? theMaxw[i] : this.maxWidth
          for (let i in theMinw) this.minWidth = theMinw[i] != undefined && theMinw[i] != '' ? theMinw[i] : this.minWidth
          for (let i in theMaxh) this.maxHeight = theMaxh[i] != undefined && theMaxh[i] != '' ? theMaxh[i] : this.maxHeight
          for (let i in theMinh) this.minHeight = theMinh[i] != undefined && theMinh[i] != '' ? theMinh[i] : this.minHeight
          for (let i in theFit) this.fitment = theFit[i] != undefined && theFit[i] != '' ? theFit[i] : this.fitment
          break
      }
    }
  },

  watch: {
    displayWidth() { this.getBreakPointValues() },
    aspect() { this.getVideoSize() }
  }
}
</script>

<style lang="scss">

  @keyframes gradient {
    0% { background-position: 0% }
    100% { background-position: 100%; }
  }

  .video-wrapper {
    width: 100%;
    height: 100%;
    border-radius: 2.5rem;
    position: relative;
    background: linear-gradient(100deg,#b3b3b3, #555454, #b3b3b3 , #515252,#b3b3b3, #555554);
    background-size: 600% 100%;
    background-blend-mode:luminosity;
    background-clip: border-box;
    animation: gradient 5s linear infinite;
    animation-direction: alternate;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    opacity: 0.15;
    z-index: 1;

    &:not(:empty) {
      border-radius: 0;
      background: none;
      opacity: 1;
    }

    iframe { 
      width: 100%;
      height: 100%;
      border: none; 
      position: absolute;
    }

    video {
      width: 100%;
      height: 100%;
      position: relative;
      object-fit: contain;

      &.cover { object-fit: cover; }
    }
  }

</style>
