<script lang="ts">
  import { staticUrl } from "$lib/helpers/content";

  export let title: string;
  export let desc: string;
  export let type: string;
  export let slug: string = "";
  export let image: string = "img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg";

  const metaurl = `https://mpath.help/` + slug;
  image = staticUrl(image);

  const schema = {
    "@context": "http://www.schema.org",
    "@type": type === "website" ? "WebSite" : "Article",
    "name": title,
    "url": metaurl,
    "logo": "favicon.ico",
    "image": image,
    "description": desc
  };

  const jsonld = `<script type="application/ld+json">${JSON.stringify(schema) + "<"}/script>`;

</script>


<link rel="canonical" href={metaurl}>
<link rel="icon" href="favicon.ico" />

<title>{title}</title>
<meta name="title" content={title}>
<meta name="description" content={desc} />

<meta property="og:type" content={type}>
<meta property="og:site_name" content="MPAth">
<meta property="og:url" content={metaurl}>
<meta property="og:title" content={title}>
<meta property="og:description" content={desc}>
<meta property="og:image" content={image}>

<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content={metaurl}>
<meta property="twitter:title" content={title}>
<meta property="twitter:description" content={desc}>
<meta property="twitter:image" content={image}>

{@html jsonld}
