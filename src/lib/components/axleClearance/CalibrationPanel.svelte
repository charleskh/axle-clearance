<script lang="ts">
  import { formatInches } from '$lib/features/axleClearance/format';
  import type { AxleConfiguration } from '$lib/features/axleClearance/types';
  import StatusBadge from './StatusBadge.svelte';

  let {
    axles,
    dropOverrides = $bindable(),
    deflection = $bindable()
  }: {
    /** The distinct axles on screen, selected first. Each gets its own drop input. */
    axles: AxleConfiguration[];
    /** Measured housing drops by axle id. Absent means the stored value is used. */
    dropOverrides: Record<string, number>;
    /** Loaded-radius deflection, shared by every tire on screen. */
    deflection: number;
  } = $props();

  // Ford's own example: LT245/75R17E is 32.0 in tall with a 14.6 in static loaded radius.
  const FORD_SLR_EXAMPLE = 32.0 / 2 - 14.6;

  /** Field text: empty, a finite number, or something unusable. */
  function read(e: Event): { kind: 'empty' } | { kind: 'number'; value: number } | { kind: 'bad' } {
    const t = e.currentTarget;
    if (!(t instanceof HTMLInputElement)) return { kind: 'bad' };
    if (t.value.trim() === '') return { kind: 'empty' };
    const v = Number(t.value);
    return Number.isFinite(v) ? { kind: 'number', value: v } : { kind: 'bad' };
  }

  /**
   * Plausible drop range. On an IFS front the drop is measured from the wheel
   * centerline and the diff can sit near or above it, so small and negative
   * values are real.
   */
  function dropRange(axle: AxleConfiguration): [number, number] {
    return axle.kind === 'ifs' ? [-10, 20] : [1, 20];
  }

  let dropErrors = $state<Record<string, string>>({});
  let deflectionError = $state('');

  function setDropError(axle: AxleConfiguration, message: string) {
    dropErrors = { ...dropErrors, [axle.id]: message };
  }

  function setDrop(axle: AxleConfiguration, e: Event) {
    const r = read(e);
    if (r.kind === 'empty') {
      // Clearing the field returns to the stored figure.
      dropOverrides = withoutDrop(axle);
      setDropError(axle, '');
      return;
    }
    const [lo, hi] = dropRange(axle);
    if (r.kind === 'bad' || r.value < lo || r.value > hi) {
      setDropError(axle, `Enter a number from ${lo} to ${hi} in. Not applied.`);
      return;
    }
    setDropError(axle, '');
    // Any value typed here is the user's measurement, even one that matches
    // the stored estimate: a match confirms it. Reset returns to the estimate.
    dropOverrides = { ...withoutDrop(axle), [axle.id]: r.value };
  }

  function withoutDrop(axle: AxleConfiguration): Record<string, number> {
    return Object.fromEntries(Object.entries(dropOverrides).filter(([id]) => id !== axle.id));
  }

  function onDeflection(e: Event) {
    const r = read(e);
    if (r.kind === 'empty') {
      deflection = 0;
      deflectionError = '';
      return;
    }
    if (r.kind === 'bad' || r.value < 0 || r.value > 4) {
      deflectionError = 'Enter a number from 0 to 4 in. Not applied.';
      return;
    }
    deflectionError = '';
    deflection = r.value;
  }
</script>

<section class="panel" aria-labelledby="calibration-heading">
  <h2 id="calibration-heading">Calibration</h2>

  {#each axles as axle, i (axle.id)}
    {@const stored = axle.housing.centerSection.dropBelowCenterline}
    {@const measured = dropOverrides[axle.id]}
    {@const inputId = `housing-drop-${axle.id}`}
    <div class="field">
      <div class="field-head">
        <label for={inputId}>
          {#if axles.length > 1}<span class="axle-tag"
              >{i === 0 ? 'Selected' : 'Baseline'} · {axle.shortName}</span
            >{/if}
          {axle.kind === 'ifs'
            ? 'Wheel centerline to diff low point'
            : 'Axle centerline to housing low point'}
        </label>
        <StatusBadge status={measured === undefined ? stored.status : 'calibrated'} />
      </div>
      <div class="input-row">
        <input
          id={inputId}
          type="number"
          inputmode="decimal"
          min={dropRange(axle)[0]}
          max={dropRange(axle)[1]}
          step="0.0625"
          value={measured ?? stored.value}
          oninput={(e) => setDrop(axle, e)}
          data-testid={i === 0 ? 'drop-input' : 'drop-input-baseline'}
          aria-invalid={dropErrors[axle.id] ? 'true' : undefined}
        />
        <span class="unit">in</span>
        {#if measured !== undefined}
          <button type="button" class="link" onclick={() => (dropOverrides = withoutDrop(axle))}
            >Reset to {formatInches(stored.value)} {stored.status}</button
          >
        {/if}
      </div>
      {#if dropErrors[axle.id]}
        <p class="error" role="alert" data-testid={i === 0 ? 'drop-error' : 'drop-error-baseline'}>
          {dropErrors[axle.id]}
        </p>
      {/if}
      {#if i === 0}
        <p class="help">
          Measure vertically from the center of the axle tube down to the lowest point of the
          housing, usually under the ring gear. Not the cover height, and not the ring gear
          diameter. On one axle this moves the absolute clearance only; the gain from bigger tires
          stays the same.
        </p>
      {/if}
    </div>
  {/each}

  <div class="field">
    <div class="field-head">
      <label for="deflection">Loaded-radius deflection</label>
    </div>
    <div class="input-row">
      <input
        id="deflection"
        type="number"
        inputmode="decimal"
        min="0"
        max="4"
        step="0.05"
        value={deflection}
        oninput={onDeflection}
        data-testid="deflection-input"
      />
      <span class="unit">in</span>
      <button type="button" class="link" onclick={() => (deflection = FORD_SLR_EXAMPLE)}
        >Use Ford's stock-tire figure ({formatInches(FORD_SLR_EXAMPLE)})</button
      >
      {#if deflection !== 0}
        <button type="button" class="link" onclick={() => (deflection = 0)}>Nominal (0)</button>
      {/if}
    </div>
    {#if deflectionError}
      <p class="error" role="alert" data-testid="deflection-error">{deflectionError}</p>
    {/if}
    <p class="help">
      0 gives the theoretical nominal-diameter result. A tire under load squats below half its
      advertised diameter, by an amount that depends on the tire maker, inflation pressure, wheel
      width and load. Ford lists the stock LT245/75R17E at 32.0 in tall with a 14.6 in static loaded
      radius. The same deflection is applied to every tire being compared.
    </p>
  </div>
</section>

<style>
  .panel {
    display: grid;
    gap: var(--space-4);
  }
  h2 {
    margin: 0;
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
  }
  .axle-tag {
    display: block;
    font-family: var(--font-family-mono);
    font-size: 10.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .field {
    display: grid;
    gap: var(--space-2);
  }
  .field-head {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    align-items: center;
    justify-content: space-between;
  }
  label {
    font-size: 13px;
    color: var(--text-secondary);
  }
  .input-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
  }
  input[type='number'] {
    width: 104px;
    font-family: var(--font-family-mono);
    /* 16px stops iOS zooming on focus. */
    font-size: 16px;
    padding: 6px 8px;
    background: var(--surface-sunken);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
  }
  input[type='number'][aria-invalid='true'] {
    border-color: var(--status-danger);
  }
  input[type='number']:focus {
    border-color: var(--accent-primary);
  }
  .unit {
    color: var(--text-muted);
    font-size: 13px;
  }
  .link {
    background: none;
    border: none;
    padding: 4px 2px;
    color: var(--measure-baseline);
    font-size: 12.5px;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .error {
    margin: 0;
    font-size: 12.5px;
    color: var(--status-danger-text);
  }
  .help {
    margin: 0;
    font-size: 12px;
    color: var(--text-muted);
  }
</style>
