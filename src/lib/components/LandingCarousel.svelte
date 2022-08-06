<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import {Splide, SplideSlide} from "@splidejs/svelte-splide";
  import CarouselDots from './Cards/CarouselDots.svelte';
  import LandingCarouselCard from './LandingCarouselCard.svelte';
  import { SplideOptions } from '$lib/helpers/splide';

  export let pages: SubTypes.Page.ContentCard[];
  export let title: string;

  let currentCard = 0;
  let splide: Splide;

  const options = SplideOptions({
    type: 'loop',
    perMove: 1,
    gap: '100px',
    autoWidth: true,
    width: '100%',
    focus: 'center',
    slideFocus: true,
    pagination: false,
    arrows: true,
    updateOnMove: true,
    lazyLoad: true,
    keyboard: true,
    noDrag: '.no-drag, .no-drag *',
    breakpoints: {
      1024: {
        gap: '40px',
      },
      550: {
        gap: '20px',
      },
    }
  });

  $: if (currentCard >= 0 && splide) splide.go(currentCard);

</script>

<div class="landing-carousel">
  <div class="title-container">
    <h2>{@html title}</h2>
    <CarouselDots
      bind:currentPageIndex={currentCard}
      pagesCount={pages.length}
      progress
    />
  </div>
  <div class="carousel-container">
    <Splide {options} bind:this={splide}
      on:mounted={ (e) => currentCard = e.detail.splide.index}
      on:move={(e) => currentCard = e.detail.index}
    >
      {#each pages as page}
        <SplideSlide>
          <LandingCarouselCard {page}/>
        </SplideSlide>
      {/each}
    </Splide>
  </div>
</div>

<style lang="stylus">

  .landing-carousel {

    :global(.splide__arrow--prev){
      left: 2rem;
    }

    :global(.splide__arrow--next){
      right: 2rem;
    }

    :global(.splide__arrow) {
      background-color: $colors.neutral-bg;
      opacity: 0.5;
    }

    :global(.splide__arrow:hover) {
      opacity: 0.8;
    }

    :global(.carousel-dots){
      padding: 10px 0px !important;
      margin-top: 15px;
      margin-bottom: 60px;
    }

    :global(.splide__slide){
      opacity: 50%;
      pointer-events: none;
      margin-bottom: 25px; // spacing for box shadow
    }

    :global(.splide__slide.is-active) {
      opacity: 100%;
      pointer-events: all;
    }
  }

  .title-container {
    color: $colors.neutral-black;
    max-width: 600px;
    padding: 0 var(--page-padding) 0;
    > h2 {
      typography: h2-responsive;
    }
  }

  .carousel-container {
    display: flex;
    position: relative;
  }

  @media(max-width: 1024px) {

    .title-container {
      max-width: auto;
    }

    .landing-carousel {
      :global(.splide__arrow) {
        display: none;
      }
    }
  }

  @media(max-width: 425px) {

    .landing-carousel {

      :global(.carousel-dots) {
          --dot-size: 7px;
        }
    }

  }


</style>