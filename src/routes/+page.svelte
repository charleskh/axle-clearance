<script lang="ts">
  import { base } from '$app/paths';
  import ClearanceVisualizer from '$lib/components/axleClearance/ClearanceVisualizer.svelte';
  import { axles, defaultAxle } from '$lib/features/axleClearance/data';
  import { SITE_URL } from '$lib/site';

  const title = 'Axle Clearance';
  const description = `Differential ground clearance for ${axles.length} off-road axles on 31 to 44 in tires, drawn to one physical scale, with every dimension's source and verification status.`;
  // Unfurlers need an absolute image URL; the relative form covers local builds.
  const image = SITE_URL ? `${SITE_URL}/og.png` : `${base}/og.png`;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if SITE_URL}<link rel="canonical" href={`${SITE_URL}/`} />{/if}
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  {#if SITE_URL}<meta property="og:url" content={`${SITE_URL}/`} />{/if}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
</svelte:head>

<ClearanceVisualizer {axles} initialAxle={defaultAxle} />
