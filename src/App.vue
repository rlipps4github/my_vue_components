<template>
  <div id="app">

    <header id="header">
      <div class="logo">
        <anchor-wc class="logo-link" sps="true" url="#hero" atitle="Home">
          <span slot="prefix">
            <logo-wc src="/assets/logo.png" alt="Ruby Trails" maxw="6rem,,8rem" minh="6rem,,8rem" align="center,,left"></logo-wc>
          </span>
        </anchor-wc>
      </div>

      <nav>

        <anchor-wc aid="page1Nav" class="nav-link" sps="true" url="#page1" lbl="Images">
          <span slot="prefix"><i class="fa-sharp fa-solid fa-star"></i></span>
        </anchor-wc>

        <anchor-wc aid="page2Nav" class="nav-link" sps="true" url="#page2" lbl="Vimeo">
          <span slot="prefix"><i class="fa-sharp fa-solid fa-star"></i></span>
        </anchor-wc>

        <anchor-wc aid="page3Nav" class="nav-link" sps="true" url="#page3" lbl="Youtube">
          <span slot="prefix"><i class="fa-sharp fa-solid fa-star"></i></span>
        </anchor-wc>

        <anchor-wc aid="page4Nav" class="nav-link" sps="true" url="#page4" lbl="Parallax">
          <span slot="prefix"><i class="fa-sharp fa-solid fa-star"></i></span>
        </anchor-wc>

        <anchor-wc aid="page5Nav" class="nav-link" sps="true" url="#page5" lbl="SVG Animation">
          <span slot="prefix"><i class="fa-sharp fa-solid fa-star"></i></span>
        </anchor-wc>

        <anchor-wc aid="page6Nav" class="nav-link" sps="true" url="#page6" lbl="Carousel">
          <span slot="prefix"><i class="fa-sharp fa-solid fa-star"></i></span>
        </anchor-wc>

        
      </nav>

      <div class="ctas">
        <anchor-wc aid="external" classes="btn" url="https://google.com#location3" lbl="(external)"></anchor-wc>
        <anchor-wc aid="internal" class="nav-link" sps="true" url="#location1" lbl="(internal)">
          <span slot="suffix"><i class="fa-solid fa-circle-chevron-right"></i></span>
        </anchor-wc>
      </div>
    </header>

    <div id="wrapper">

      <div id="hero" style="width: 100%; height: 100vh; background: lightgray">
        <image-wc fit="cover" src="https://picsum.photos/1200/800,,,https://picsum.photos/1920/1080" alt="banner image"></image-wc>
        <div class="fillParent center-all"><h1>My Vue<br>Components<br>Library</h1></div>
      </div>

      <div id="page1" class="block-area" style=" background: lightskyblue; ">
        <h1>Page 1</h1>
        <div class="side-by-side">
          <hello-world></hello-world>
          <image-wc maxw="50rem" src="https://picsum.photos/800/600" alt="banner image"></image-wc>
        </div>
      </div>

      <div id="page2" class="block-area" style=" background: lightcyan; ">
        <h1>Page 2</h1>
        <div class="side-by-side reverse">
          <hello-world></hello-world>
          <video-wc fit="contain" maxw="32rem,,50rem" src="https://www.vimeo.com/194553881"></video-wc>
        </div>
        <div id="location1" style="width: 100%; height: 25vh; background: lightskyblue; display: flex; justify-content: center; align-items: center;">
          <h1>Internal Location</h1>
        </div>
      </div>

      <div id="page3" class="block-area" style=" background: lightsteelblue; ">
        <h1>Page 3</h1>
        <div class="side-by-side">
          <hello-world></hello-world>
          <video-wc maxw="20rem,,50rem" src="https://www.youtube.com/watch?v=C0DPdy98e4c"></video-wc>
        </div>
      </div>

      <div style="width: 100%; height: 20vh; background: lightcoral"></div>


  
      <div  id="page4" class="block-area center" style="width: 100%; height: 50vw; background: lightblue">
        <parallax-wc src="https://picsum.photos/900/1200" ></parallax-wc>

        <parallax-wc maxw="30rem, 40rem,,60rem" maxh="20vh, 30rem,,40rem" src="https://picsum.photos/800/600" inline="true" style="position: absolute;"></parallax-wc>
      </div>

      <div id="page5" class="block-area center" style="width: 100%; height: 80vh; background: lightgray">
        <parallax-wc src="slot" minh="20vw" dasharray="1250" attribute="stroke-dashoffset" inline="true">
          <span slot="svg">
            <svg viewBox="0 0 1202.25 229.55" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="currentColor" d="m49.5 172.5 36-21v95h-21v-189l72 32v157h-35v-126h68v126h-23v-101h66v101h-23v-122l48-29v151h-17v-124h55v124h-22v-49l41 26v41h24v-149c.56-18.37 17-30 29-30l2-30 2 30c15 1 27.14 10.68 28 29v122h-22v-91l50-49v117h-20v-17h26v-118h50v162h-41v-21h47v-180h50v171h-34v-109h44v-27c0-11 7-19 18-19l2-20 2 20c11 0 17.87 8.36 18 21v117h-40v-22h50l46-47 47.5 47.5v45.5h-19.5v-109l33 31v59h13v66h24v-109h53v92h-25v-114h56v114h-19v-135h67v135h-19v-93h58v93h-20v-151h73v151h-36v-127h69v127h-24v-103h67v103h-23v-151h47v151h-17v-125h55v125h-22v-48h41v65h-15v-76h14v-36h22v38h7v51h8v-103h25v15h20v79h8v-91h24v91h-14v-47h27v-54h21" stroke-miterlimit="10" transform="translate(-49.25 -35.45)"></path>
            </svg>
          </span>
        </parallax-wc>

        <parallax-wc src="slot" maxw="20rem" dasharray="365" attribute="stroke-dashoffset" inline="true">
          <span slot="svg">
            <svg viewBox="0 0 51 48">
              <path fill="none" stroke="currentColor" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
            </svg>
          </span>
        </parallax-wc>
      </div>

      <div id="page6" class="block-area center"  style="width: 100%; height: 100vh; background: lightgray">
        <div style="width: 100%; height: 15vh; background: lightgreen"></div>

        <div class="center-all">
          <carousel-wc maxw="80rem" maxh="45rem" infinite="true">
            <span slot="slides">
              <image-wc src="https://picsum.photos/600/390" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/600/410" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/605/400" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/600/408" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/610/400" alt="carousel image"></image-wc>
            </span>
          </carousel-wc>
        </div>

        <div style="width: 100%; height: 15vh; background: lightgreen"></div>

        <div class="center-all">
          <carousel-wc maxw="80rem" maxh="45rem" infinite="true">
            <span slot="slides">
              <image-wc src="https://picsum.photos/600/390" alt="carousel image"></image-wc>
              <hello-world></hello-world>
              <image-wc src="https://picsum.photos/605/400" alt="carousel image"></image-wc>
              <hello-world></hello-world>
              <image-wc src="https://picsum.photos/610/400" alt="carousel image"></image-wc>
            </span>
          </carousel-wc>
        </div>

        <div style="width: 100%; height: 15vh; background: lightgreen"></div>
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import LogoWc from './components/Logo.vue'
import AnchorWc from './components/Anchor.vue'
import ImageWc from './components/Image.vue'
import VideoWc from './components/Video.vue'
import ParallaxWc from './components/Parallax.vue'
import CarouselWc from './components/Carousel.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    LogoWc,
    AnchorWc,
    ImageWc,
    VideoWc,
    ParallaxWc,
    CarouselWc
  }
}
</script>

<style lang="scss">

:root {
  --cms-nav-color: #41B883;
  --cms-nav-active-color: #35495E;
}

html {
  font-size: 62.5%;
}

body {
  padding: 0;
  margin: 0;
  font-size: 1.5rem;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
}

.fillParent {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.center-all {
  display: grid;
  align-items: center;
  justify-content: center;
}

#header {
  width: 100%;
  height: 8rem;
  position: fixed;
  top: 0;
  background-color: rgba(255,255,255,0.9);
  display: grid;
  grid-template-columns: 1fr 3fr;
  z-index: 200;

  > * { margin: auto 0; }

  .nav-link { 
    margin: 1rem; 
    white-space: nowrap;
    color: var(--cms-nav-color);

    &:hover,
    &.active { color: var(--cms-nav-active-color); }
  }

  .ctas { display: none; }
}

#hero h1 {     
  mix-blend-mode: difference;
  font-size: 15vmin; 
}

#inner-para {
  width: 40rem;
  max-width: 100%;
  height: 30rem;
}

.center,
.block-area {
  width: 100%; 
  min-height: 25vh; 
  position: relative;
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  align-items: center;
}

.side-by-side {
  padding: 2rem;
  display: grid;
  grid-template-rows: minmax(50rem, auto);

  > * {
    margin: auto;
  }
}

@media screen and (min-width: 768px) {

  #header { 
    height: 12rem; 
    grid-template-columns: 1fr 3fr 1fr;

    .ctas { display: block; }
  }

  .side-by-side {
    grid-template-columns: 1fr 1fr;
    grid-gap: 4rem;

    > * { margin: auto; }

    &.reverse {

      > *:nth-child(2) {
        grid-row: 1/1;
      }
    }
  }
}

</style>
