<script lang="ts">
  import { InlineSvgLink } from '$lib/components/generic';
</script>

<div class="footer">
  <div class="footer-content">
    <h5>A partnership between</h5>

    <div class="partners-grid">
      <InlineSvgLink href="https://www.unep.org" svg="UNEP" newTab />
      <InlineSvgLink href="https://www.aics.gov.it/language/en/" svg="IAFDC" newTab />
      <InlineSvgLink href="https://wwf.panda.org" svg="WWF" newTab />
      <div class="partners-grid-2">
        <InlineSvgLink href="https://www.uq.edu.au" svg="UoQ" newTab />
        <InlineSvgLink href="https://www.nature.org/" svg="TNC" newTab />
      </div>
    </div>

    <div class="links">
      <div>
        <a href="/team" rel="external">Contact us</a>
        <a href="/cms" rel="external">Follow us</a>
      </div>

      <div>
        <a href="/partners" rel="external">Partners</a>
        <a href="/team" rel="external">Team</a>
        <a href="/privacy-policy" rel="external">Privacy policy</a>
        <a href="/terms-of-use" rel="external">Terms of use</a>
        <a href="/sitemap" rel="external">Sitemap</a>
      </div>
    </div>
  </div>
</div>

<style lang="stylus">

  .footer {
    grid-config(page, footer);
    background: $colors.neutral-bg;
  }

  .footer-content {
    grid-area: footer;
    > h5 {
      typography: h5-responsive;
    }
  }

  .partners-grid {
    display: grid;
    grid-template-columns: 102px 87px 39px 1fr;
    align-items: center;
    gap: 45px;
    color: $colors.neutral-dark;
  }

  .partners-grid-2 {
    display: inherit;
    grid-template-columns: 148px 135px;
    align-items: inherit;
    gap: inherit;
    color: inherit;
  }

  .links {
    typography: ui-small;
    margin: 40px 0px;
    display: flex;
    flex-direction: column;
    gap: 0.55em;

    > div:first-child {
      font-weight: 700;
    }

    a {
      color: $colors.neutral-dark;
      margin-right: 15px;
    }
  }

  @media(max-width: 1024px) {

    .partners-grid {
      grid-template-columns: 126px 87px 39px;
      grid-template-rows: auto;
      margin-top: 1rem;
    }

    .partners-grid-2 {
      grid-template-columns: 148px 135px;
    }
  }

</style>
