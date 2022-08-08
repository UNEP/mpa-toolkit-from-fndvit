<script lang="ts">
  import { staticUrl } from "$lib/helpers/content";

  export let title: string;
  export let desc: string;
  export let type: string;
  export let slug: string = "";
  export let image: string = "";

  $: metatitle = `MPAth - ${title}`;
  $: metaurl = `https://mpath.help/` + slug;
  $: metaimg = staticUrl(image);

  $: schema = {
    "@context": "http://www.schema.org",
    "@type": type === "website" ? "WebSite" : "Article",
    "name": metatitle,
    "url": metaurl,
    "logo": "favicon.ico",
    "image": metaimg,
    "description": desc
  };

  $: jsonld = `<script type="application/ld+json">${JSON.stringify(schema) + "<"}/script>`;

</script>


<link rel="canonical" href={metaurl}>
<link rel="icon" href="favicon.ico" />

<title>{metatitle}</title>
<meta name="title" content={metatitle}>
<meta name="description" content={desc} />

<meta property="og:type" content={type}>
<meta property="og:site_name" content="MPAth">
<meta property="og:url" content={metaurl}>
<meta property="og:title" content={metatitle}>
<meta property="og:description" content={desc}>
<meta property="og:image" content={metaimg}>

<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content={metaurl}>
<meta property="twitter:title" content={metatitle}>
<meta property="twitter:description" content={desc}>
<meta property="twitter:image" content={metaimg}>

{@html jsonld}





