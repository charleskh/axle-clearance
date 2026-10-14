<script lang="ts">
  // Same heading face and token set as seethespecs.
  import '@fontsource/saira-semi-condensed/latin-500.css';
  import '@fontsource/saira-semi-condensed/latin-600.css';
  import '@fontsource/saira-semi-condensed/latin-700.css';
  import '$lib/styles/sts-design-tokens.css';
  import '$lib/styles/axle-tokens.css';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

{@render children()}
