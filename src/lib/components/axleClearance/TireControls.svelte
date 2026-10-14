<script lang="ts">
  import {
    MAX_TIRE_DIAMETER,
    MIN_TIRE_DIAMETER,
    TIRE_PRESETS,
    tireForDiameter
  } from '$lib/features/axleClearance/tires';

  let {
    diameter = $bindable(),
    idPrefix = 'tire',
    label = 'Tire diameter',
    tone = 'selected'
  }: {
    diameter: number;
    /** Prefix for element ids and test ids, so two controls can share a page. */
    idPrefix?: string;
    label?: string;
    tone?: 'selected' | 'baseline';
  } = $props();

  const tire = $derived(tireForDiameter(diameter));
  const inputId = $derived(`${idPrefix}-diameter`);
  const presetPrefix = $derived(idPrefix === 'tire' ? 'preset' : `${idPrefix}-preset`);

  function onInput(e: Event) {
    const t = e.currentTarget;
    if (t instanceof HTMLInputElement) {
      const v = Number(t.value);
      if (Number.isInteger(v)) diameter = v;
    }
  }
</script>

<div class="tire-controls" class:baseline={tone === 'baseline'}>
  <div class="slider-row">
    <label for={inputId} class="label">{label}</label>
    <output for={inputId} class="readout" data-testid={`${idPrefix}-readout`}
      >{diameter}<span class="unit">in</span></output
    >
  </div>
  <input
    id={inputId}
    type="range"
    min={MIN_TIRE_DIAMETER}
    max={MAX_TIRE_DIAMETER}
    step="1"
    value={diameter}
    oninput={onInput}
    aria-valuetext={`${diameter} inch tire`}
    data-testid={`${idPrefix}-slider`}
  />
  <div class="ticks" aria-hidden="true">
    {#each Array.from({ length: MAX_TIRE_DIAMETER - MIN_TIRE_DIAMETER + 1 }, (_, i) => MIN_TIRE_DIAMETER + i) as d (d)}
      <span class:major={d % 2 === 1} class:active={d === diameter}>{d % 2 === 1 ? d : ''}</span>
    {/each}
  </div>
  <div class="presets" role="group" aria-label={`${label} presets`}>
    {#each TIRE_PRESETS as p (p)}
      <button
        type="button"
        class:active={p === diameter}
        aria-pressed={p === diameter}
        onclick={() => (diameter = p)}
        data-testid={`${presetPrefix}-${p}`}>{p}"</button
      >
    {/each}
  </div>
  <p class="hint">
    Drawn as a typical {tire.label} flotation size. Section width affects the drawing only, not clearance.
  </p>
</div>

<style>
  .tire-controls {
    display: grid;
    gap: var(--space-2);
  }
  .slider-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  .label {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
  }
  .readout {
    font-family: var(--font-family-mono);
    font-size: 28px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1;
  }
  .unit {
    font-size: 13px;
    color: var(--text-muted);
    margin-left: 4px;
  }

  input[type='range'] {
    width: 100%;
    appearance: none;
    background: transparent;
    height: 28px;
    margin: 0;
    cursor: pointer;
  }
  input[type='range']::-webkit-slider-runnable-track {
    height: 4px;
    background: linear-gradient(90deg, var(--border-strong), var(--accent-primary));
    border-radius: 2px;
  }
  input[type='range']::-moz-range-track {
    height: 4px;
    background: linear-gradient(90deg, var(--border-strong), var(--accent-primary));
    border-radius: 2px;
  }
  input[type='range']::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    margin-top: -8px;
    border-radius: 50%;
    background: var(--background);
    border: 2px solid var(--accent-primary);
    box-shadow: 0 0 0 4px var(--accent-primary-muted);
  }
  input[type='range']::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--background);
    border: 2px solid var(--accent-primary);
    box-shadow: 0 0 0 4px var(--accent-primary-muted);
  }

  .ticks {
    display: grid;
    grid-template-columns: repeat(14, 1fr);
    font-family: var(--font-family-mono);
    font-size: 10px;
    color: var(--text-muted);
    margin: -4px 9px 0;
  }
  .ticks span {
    text-align: center;
    border-left: 1px solid var(--border-strong);
    height: 14px;
    line-height: 22px;
    transform: translateX(-50%);
    margin-left: 50%;
    width: 0;
    overflow: visible;
    white-space: nowrap;
    display: flex;
    justify-content: center;
  }
  .ticks span:not(.major) {
    height: 6px;
  }
  .ticks span.active {
    color: var(--accent-primary);
    border-color: var(--accent-primary);
  }

  .presets {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 6px;
    margin-top: var(--space-2);
  }
  .presets button {
    font-family: var(--font-family-mono);
    font-size: 13px;
    font-weight: 600;
    padding: 8px 0;
    min-height: 40px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-strong);
    background: var(--surface-sunken);
    color: var(--text-secondary);
    cursor: pointer;
    transition:
      border-color 120ms,
      color 120ms,
      background 120ms;
  }
  .presets button:hover {
    border-color: var(--text-muted);
    color: var(--text-primary);
  }
  .presets button.active {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    background: var(--accent-primary-muted);
  }
  /* The comparison tire takes the baseline color everywhere the accent appears. */
  .baseline {
    --accent-primary: var(--measure-baseline);
    --accent-primary-muted: color-mix(in srgb, var(--measure-baseline) 14%, transparent);
  }
  .hint {
    margin: 0;
    font-size: 12px;
    color: var(--text-muted);
  }
</style>
