<template>
  <div id="app">

    <!-- HEADER -->
    <header id="header">
    <!-- logo -->
      <div class="logo">
        <anchor-wc class="logo-link" sps="true" url="#hero" atitle="Home">
          <span slot="prefix">
            <logo-wc src="/assets/logo.png" alt="Ruby Trails" maxw="6rem,,8rem" minh="6rem,,8rem" align="center,,left"></logo-wc>
          </span>
        </anchor-wc>
      </div>
    <!-- navigation -->
      <nav>
        <anchor-wc aid="page1Nav" class="nav-link" sps="true" url="#page1" lbl="Images" slot_pad="5px">
          <span slot="prefix"><i class="fa-sharp fa-solid fa-star"></i></span>
        </anchor-wc>

        <anchor-wc aid="page2Nav" class="nav-link" sps="true" url="#page2" lbl="Vimeo" slot_pad="5px">
          <span slot="prefix"><i class="fa-sharp fa-solid fa-star"></i></span>
        </anchor-wc>

        <anchor-wc aid="page3Nav" class="nav-link" sps="true" url="#page3" lbl="Youtube" slot_pad="5px">
          <span slot="prefix"><i class="fa-sharp fa-solid fa-star"></i></span>
        </anchor-wc>

        <anchor-wc aid="page4Nav" class="nav-link" sps="true" url="#page4" lbl="Parallax" slot_pad="5px">
          <span slot="prefix"><i class="fa-sharp fa-solid fa-star"></i></span>
        </anchor-wc>

        <anchor-wc aid="page5Nav" class="nav-link" sps="true" url="#page5" lbl="SVG Animation" slot_pad="5px">
          <span slot="prefix"><i class="fa-sharp fa-solid fa-star"></i></span>
        </anchor-wc>

        <anchor-wc aid="page6Nav" class="nav-link" sps="true" url="#page6" lbl="Carousel" slot_pad="5px">
          <span slot="prefix"><i class="fa-sharp fa-solid fa-mobile"></i></span>
        </anchor-wc>        
      </nav>
    <!-- cta and info -->
      <div class="ctas">
        <anchor-wc aid="external" class="btn" url="https://google.com#location3" lbl="(external)" pad="1rem 2rem,,,1.5rem 3rem"></anchor-wc>
        <anchor-wc aid="internal" class="nav-link" sps="true" url="#location1" lbl="(internal)" slot_pad="2px,5px,1rem,1.5rem">
          <span slot="suffix"><i class="fa-solid fa-circle-chevron-right"></i></span>
        </anchor-wc>
      </div>
    </header>
    <!-- WRAPPER -->
    <div id="wrapper">
      <!-- hero banner -->
      <div id="hero" style="width: 100%; height: 100vh; background: lightgray">
        <image-wc fit="cover" src="https://picsum.photos/1200/800,,,https://picsum.photos/1920/1080" alt="banner image"></image-wc>
        <div class="fillParent center-all"><h1>My Vue<br>Components<br>Library</h1></div>
      </div>

      <div id="page1" class="block-area" style=" background: lightskyblue; ">
        <h1>1 - Photo widget</h1>
        <div class="side-by-side">
          <hello-world></hello-world>
          <image-wc maxw="50rem" src="https://picsum.photos/800/600" alt="banner image"></image-wc>
        </div>
      </div>

      <div id="page2" class="block-area" style=" background: lightcyan; ">
        <h1>2 - Video Widget</h1>
        <div class="side-by-side reverse">
          <hello-world></hello-world>
          <video-wc fit="contain" src="https://www.vimeo.com/194553881"></video-wc>
        </div>
        <div id="location1" style="width: 100%; height: 25vh; background: lightskyblue; display: flex; justify-content: center; align-items: center;">
          <h1>Internal Location</h1>
        </div>
      </div>

      <div id="page3" class="block-area" style=" background: lightsteelblue; ">
        <h1>3 - Video Widget</h1>
        <div class="side-by-side">
          <hello-world></hello-world>
          <video-wc fit="contain" src="https://www.youtube.com/watch?v=C0DPdy98e4c"></video-wc>
        </div>
      </div>
  
      <div  id="page4" class="block-area center" style="width: 100%; height: 50vw; background: lightblue">
        <h1 style="color: white;">4 - Parallax Widget</h1>

        <parallax-wc src="https://picsum.photos/900/1200" ></parallax-wc>

        <parallax-wc maxw="30rem, 40rem,,60rem" maxh="20vh, 30rem,,40rem" src="https://picsum.photos/800/600" inline="true" style="position: absolute;"></parallax-wc>
      </div>

      <div id="page5" class="block-area center" style="width: 100%; height: 80vh; background: lightgray">
        <div style="width: 100%; height: 10vh; background: lightcoral">
          <h1>5 - Parallax Widget SVG Animation</h1>
        </div>

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

      <div id="page6" class="block-area center"  style="width: 100%; background: lightgray">
        <div style="width: 100%; height: 15vh; background: lightgreen">
          <h1>6 - Carousel Widget</h1>
        </div> 

        <div class="center-all">
          <carousel-wc maxw="80rem" minh="25rem" maxh="45rem" auto-advance="10" infinite="true" transition="fade">
            <span slot="slides">
              <image-wc src="https://picsum.photos/600/390" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/600/410" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/605/400" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/600/408" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/610/400" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/599/391" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/609/402" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/600/394" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/600/411" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/605/402" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/600/408" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/610/418" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/599/390" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/609/402" alt="carousel image"></image-wc>
            </span>
          </carousel-wc>
        </div>

        <div style="width: 100%; height: 15vh; background: lightgreen"></div>

        <div class="center-all">
          <carousel-wc maxw="120rem" minh="25rem" maxh="45rem" infinite="true" slide-view-rows="1,2,2" slide-view-columns="1,2,3" slide-view-gap="15px" arrows-wrap="#top-arrows" dots-wrap="#top-dots" dots-type="dots" carousel-popup="true">
            <span slot="slides">
              <image-wc src="https://picsum.photos/600/390" alt="carousel image" title="sup sup" data-pop="https://www.youtube.com/watch?v=0TPwQZ8r8Q0"></image-wc>
              <image-wc src="https://picsum.photos/600/410" alt="carousel image" title="sup dawg" data-pop="https://picsum.photos/1200/810"></image-wc>
              <image-wc src="https://picsum.photos/600/397" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/600/411" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/605/401" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/600/408" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/610/402" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/599/396" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/609/403" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/600/393" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/600/413" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/605/404" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/600/406" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/610/405" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/599/399" alt="carousel image"></image-wc>
              <image-wc src="https://picsum.photos/609/407" alt="carousel image"></image-wc>
              <!-- <image-wc src="https://picsum.photos/609/402" alt="carousel image"></image-wc> -->
            </span>
          </carousel-wc>
        </div>

        <div style="width: 100%; height: 15vh; background: lightgreen">
          <div id="top-arrows">
            &nbsp;
            <a class="prev"> &lt; </a>
            &nbsp;
            <span id="top-dots"></span>
            &nbsp;
            <a class="next"> &gt; </a>
            &nbsp;
          </div>
          
        </div>

        <div class="center-all">
          <carousel-wc card-width="300px,360px" infinite="true" slides-wrap="#html-slides" carousel-popup="true" pop-class="enlarge" arrows-wrap="#dope-arrows" align="center" fit="cover">
            <span slot="slides">
              <!-- <hello-world data-pop="https://my.matterport.com/show/?m=kNZhyafGRzB&brand=0"></hello-world> -->
              <span>
                <image-wc src="https://picsum.photos/605/400" alt="carousel image" fit="cover"></image-wc>
                <a class="enlarge"> &times; </a>
              </span>
              <!-- <hello-world></hello-world> -->
              <span>
                <image-wc src="https://picsum.photos/610/400" alt="carousel image" fit="cover"></image-wc>
                <a class="enlarge"> &times; </a>
              </span>
              <!-- <hello-world></hello-world> -->
              <span>
                <image-wc src="https://picsum.photos/612/400" alt="carousel image" fit="cover"></image-wc>
                <a class="enlarge"> &times; </a>
              </span>
            </span>
          </carousel-wc>
          <div id="html-slides"></div>
        </div>

        <div style="width: 100%; height: 15vh; background: lightgreen">
          <div id="dope-arrows">
            &nbsp;
            <a class="prev"> &lt; </a>
            &nbsp;
            <span id="top-dots"></span>
            &nbsp;
            <a class="next"> &gt; </a>
            &nbsp;
          </div>
        </div>
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

  * { box-sizing: border-box; }
}

.fillParent {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.center-all {
  width: 100%;
  min-height: 40rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

#header {
  width: 100%;
  height: 8rem;
  position: fixed;
  top: 0;
  background-color: rgba(255,255,255,0.8);
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
  color: white;
  font-size: 15vmin; 
}

#inner-para {
  width: 40rem;
  max-width: 100%;
  height: 30rem;
}

#html-slides {
  width: 100%;
  height: 40rem;
}

.center,
.block-area {
  width: 100%; 
  position: relative;
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  align-items: center;
}

.side-by-side {
  padding: 2rem;
  position: relative;
  display: grid;
  grid-template-rows: minmax(50rem, 1fr);

  > * {
    max-height: 100%;
    margin: auto;
  }
}

.enlarge {
  width: 5rem;
  height: 5rem;
  padding: 1rem;
  position: absolute;
  top: 2rem;
  left: 2rem;
  background-color: #41B883;
  color: white;
  cursor: pointer;
}

#top-arrows,
#dope-arrows {
  font-size: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .next,
  .prev { cursor: pointer; }
}

#top-dots {
  display: block;
  position: relative;
}

.btn {
  background-color: aquamarine;
}

.dots {
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  list-style: none;

  .dot {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin: 15px;
    background-color: #2c3e50;
    cursor: pointer;
    transform: scale(1);
    transform-origin: center;
    transition: 0.3s;

    &.active {
      background-color: #41B883;
      transform: scale(1.5);
    }
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
