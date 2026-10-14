<script lang="ts">
  import { groupedAxles } from '$lib/features/axleClearance/data';
  import type { AxleConfiguration } from '$lib/features/axleClearance/types';

  let {
    axles,
    value = $bindable(),
    id,
    label,
    testId,
    sameOption
  }: {
    axles: AxleConfiguration[];
    /** Selected axle id; '' selects `sameOption` when one is offered. */
    value: string;
    id: string;
    label: string;
    testId: string;
    /** Label for an extra first option that means "no separate axle". */
    sameOption?: string;
  } = $props();

  const groups = $derived(groupedAxles(axles));

  function onChange(e: Event) {
    const t = e.currentTarget;
    if (t instanceof HTMLSelectElement) value = t.value;
  }
</script>

<div class="picker">
  <label for={id}>{label}</label>
  <select {id} {value} onchange={onChange} data-testid={testId}>
    {#if sameOption}
      <option value="">{sameOption}</option>
    {/if}
    {#each groups as g (g.group)}
      <optgroup label={g.group}>
        {#each g.axles as a (a.id)}
          <option value={a.id}>{a.name}</option>
        {/each}
      </optgroup>
    {/each}
  </select>
</div>

<style>
  .picker {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    min-width: 0;
    /* iOS WebKit lets a native select's intrinsic width spill past its box and
       widen the page, even with min-width: 0. Clip it here; the 4px padding
       and matching negative margin leave room for the focus outline. */
    overflow: hidden;
    padding: 4px;
    margin: -4px;
  }
  label {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
    white-space: nowrap;
  }
  select {
    flex: 1;
    min-width: 0;
    max-width: 100%;
    /* 16px stops iOS zooming on focus. */
    font-size: 16px;
    padding: 7px 10px;
    background: var(--input-bg);
    color: var(--input-text);
    border: 1px solid var(--input-border);
    border-radius: var(--radius-sm);
  }
  select:hover {
    border-color: var(--input-border-hover);
  }
</style>
