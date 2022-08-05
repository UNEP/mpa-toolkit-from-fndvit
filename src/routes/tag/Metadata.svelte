<script lang="ts">

  export let title: string = "";
  export let desc: string = "Description";
  export let type: string = "";
  export let slug: string = "";

  const schema = {
    "@context": "http://www.schema.org",
    "@type": type === "website" ? "WebSite" : "Article",
    "name": "MPAth",
    "url": "https://mpath.help/",
    "logo": "favicon.ico",
    "image": "assets/fishing-xl.7d30c137.jpg",
    "description": desc
  };

  const jsonld = `<script type="application/ld+json">${JSON.stringify(schema) + "<"}/script>`;

</script>


  <link rel="canonical" href="https://mpath.help/">
  <link rel="icon" href="favicon.ico" />

  <title>MPAth - {title}</title>
  <meta name="title" content="caca">
  <meta name="description" content={desc} />

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="MPAth">
  <meta property="og:url" content="https://mpath.help/">
  <meta property="og:title" content="MPAth - {title}">
  <meta property="og:description" content={desc}>

  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://mpath.help/">
  <meta property="twitter:title" content="caca">
  <meta property="twitter:description" content="caca">

  {@html jsonld}





