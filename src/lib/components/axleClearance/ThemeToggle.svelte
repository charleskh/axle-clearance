<script lang="ts">
  import { onMount } from 'svelte';

  type Theme = 'light' | 'dark';
  let theme = $state<Theme>('light');

  onMount(() => {
    theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  });

  function toggle() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Storage blocked: the choice lasts for this page view only.
    }
  }

  const label = $derived(theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
</script>

<button
  type="button"
  class="toggle"
  onclick={toggle}
  aria-label={label}
  title={label}
  data-testid="theme-toggle"
>
  {#if theme === 'light'}
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  {:else}
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  {/if}
</button>

<style>
  .toggle {
    display: inline-grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    border: 1px solid transparent;
    background: transparent;
    color: var(--nav-text);
    cursor: pointer;
    transition: background var(--transition-default);
  }
  .toggle:hover {
    background: var(--nav-hover-bg);
  }
</style>
