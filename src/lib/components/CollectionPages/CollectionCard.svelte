<script lang="ts">
  import { staticUrl } from '$lib/helpers/content';
  import TagContainer from '../Tags/TagContainer.svelte';
  import type { CompletePage } from '$lib/types';

  export let page: CompletePage & {readTime: number};

  const authors = page.chapter.authors.map(a => a.name);
  const authorsString = authors.length > 1 ? authors.slice(0, -1).join(',') + ' and ' + authors.slice(-1) : authors.toString();
</script>

<div class="container">
  <div class="image">
    <img src={staticUrl(page.img)} alt="chapter" />
  </div>
  <div class="text">
    <b>{page.slug}</b>
    <h1 class="title">
      {page.title}
    </h1>
    <div class="bottom-section">
      <div class="authors"><b>{authorsString}</b></div>
      <div class="read-time">{page.readTime} min read</div>
    </div>
  </div>
  <div class="tags">
    <b>What's this about</b>
    <TagContainer tags={page.tags} color='#DADCE0' />
  </div>
</div>

<style lang="scss">
  .container {
    grid-template-columns: 12rem 40rem auto;
    column-gap: 1rem;
    display: grid;
    background: #f9f9f9;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    margin: 15px;
    padding-right: 10px;
    height: 200px;
    :global(h1) {
      font-size: 1.5rem;
      margin: 0px;
    }

  }
  image{
    height: inherit;
    overflow: hidden;
  }
  .image img {
    width:  12rem;
    height: 200px;
    object-fit: cover;
    border-radius: 12px 0px 0px 12px;
  }
  .text{
    padding: 15px;
  }
  .bottom-section {
    margin-top: 15px;
    display: inline-flex;
    color: #6C767D
  }
  .bottom-section .read-time {
    margin-left: 10px;
  }
  .tags{
    overflow: auto;
    padding: 15px;
  }

</style>
