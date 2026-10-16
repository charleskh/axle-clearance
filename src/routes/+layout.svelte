<script lang="ts">
  // Same heading face and token set as seethespecs.
  import '@fontsource/saira-semi-condensed/latin-500.css';
  import '@fontsource/saira-semi-condensed/latin-600.css';
  import '@fontsource/saira-semi-condensed/latin-700.css';
  import '$lib/styles/sts-design-tokens.css';
  import '$lib/styles/axle-tokens.css';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  // Set only by the caliban staging build (the branch and commit), never in CI.
  const staging: unknown = import.meta.env.VITE_STAGING;
</script>

<svelte:head>
  {#if staging}<meta name="robots" content="noindex" />{/if}
</svelte:head>

{#if staging}
  <div class="staging" role="note" data-testid="staging-banner">
    Staging build · {String(staging)} · not the live site
  </div>
{/if}

{@render children()}

<style>
  .staging {
    position: sticky;
    top: 0;
    z-index: 50;
    padding: 6px 12px;
    background: repeating-linear-gradient(-45deg, #f59e0b 0 12px, #fbbf24 12px 24px);
    color: #1c1917;
    font: 600 13px/1.3 var(--font-family-mono, monospace);
    text-align: center;
    overflow-wrap: anywhere;
  }
</style>
