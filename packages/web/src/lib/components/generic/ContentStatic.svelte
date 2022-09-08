<script lang="ts">

export let content: string;

</script>

<div class="page-content">
  <div class="body-column">
    {@html content}
  </div>
</div>

<style lang="stylus">

  .page-content {
    background-color: #F9F9F9;
    grid-config(page, content);
    position: relative;
    min-height: 800px;
    grid-auto-rows: min-content;
    padding-bottom: 2rem;
  }

  .body-column {
    display: contents;
    > :global(*) {
      grid-column: body;
    }
  }

  :global(h1){
    typography: h2-responsive;
  }

  :global(p){
    typography: p-responsive;
  }

  :global(img[alt="UNEP logo"]) {
    max-width: 125px;
  }

  :global(img[alt="World Wildlife Foundation logo"]) {
    max-width: 65px;
  }

  :global(img[alt="Italian Agency for Development Cooperation logo"]) {
    max-width: 115px;
  }

  :global(img[alt="University of Queensland logo"]) {
    max-width: 188px;
  }

  :global(img[alt="The Nature Conservancy logo"]) {
    max-width: 188px;
  }

</style>