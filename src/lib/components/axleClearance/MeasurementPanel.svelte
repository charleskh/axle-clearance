<script lang="ts">
  import { approxPrefix, isTrustedAbsolute } from '$lib/features/axleClearance/clearance';
  import {
    formatInches,
    formatMillimetres,
    formatSignedInches
  } from '$lib/features/axleClearance/format';
  import type { AxleConfiguration, ClearanceComparison } from '$lib/features/axleClearance/types';
  import StatusBadge from './StatusBadge.svelte';

  let {
    comparison,
    deflection,
    selectedAxle,
    baselineAxle
  }: {
    comparison: ClearanceComparison;
    deflection: number;
    selectedAxle: AxleConfiguration;
    baselineAxle: AxleConfiguration;
  } = $props();

  const sel = $derived(comparison.selected);
  const base = $derived(comparison.baseline);
  const trusted = $derived(isTrustedAbsolute(sel.clearanceStatus));
  const bothTrusted = $derived(trusted && isTrustedAbsolute(base.clearanceStatus));
  const baseHeading = $derived(
    comparison.sameAxle
      ? `${base.tire.nominalDiameter}" base`
      : `${baselineAxle.shortName} ${base.tire.nominalDiameter}"`
  );
  const selHeading = $derived(
    comparison.sameAxle
      ? `${sel.tire.nominalDiameter}" selected`
      : `${selectedAxle.shortName} ${sel.tire.nominalDiameter}"`
  );
</script>

<section class="panel" aria-labelledby="measurements-heading">
  <h2 id="measurements-heading">Measurements</h2>

  <dl class="metrics">
    <div class="metric">
      <dt>Tire diameter</dt>
      <dd>
        <span class="value" data-testid="m-diameter"
          >{formatInches(sel.tire.nominalDiameter, 1)}</span
        >
        <span class="aux">{formatMillimetres(sel.tire.nominalDiameter)} nominal</span>
      </dd>
    </div>

    <div class="metric">
      <dt>Effective tire radius</dt>
      <dd>
        <span class="value" data-testid="m-radius">{formatInches(sel.effectiveTireRadius)}</span>
        <span class="aux"
          >{deflection > 0
            ? `nominal ${formatInches(sel.tire.nominalDiameter / 2)} − ${formatInches(deflection)} deflection`
            : 'nominal, no loaded deflection'}</span
        >
      </dd>
    </div>

    <div class="metric hero" class:untrusted={!trusted}>
      <dt>
        Differential clearance
        <StatusBadge status={sel.clearanceStatus} />
      </dt>
      <dd>
        <span class="value" data-testid="m-clearance"
          >{trusted ? '' : '≈ '}{formatInches(sel.differentialClearance)}</span
        >
        <span class="aux">
          {formatInches(sel.effectiveTireRadius)} radius
          {#if sel.axleCenterlineHeight !== sel.effectiveTireRadius}
            + {formatInches(sel.axleCenterlineHeight - sel.effectiveTireRadius)} portal drop
          {/if}
          − {formatInches(sel.housingDrop)} housing drop.
          {#if !trusted}
            The housing drop is not a published figure. Calibrate it below with a measurement.
          {/if}
        </span>
      </dd>
    </div>

    <div class="metric gain">
      <dt>
        {#if comparison.sameAxle}
          {comparison.clearanceDelta < 0 ? 'Lost versus' : 'Gained over'}
          {base.tire.nominalDiameter}"
        {:else}
          Versus {baselineAxle.shortName} on {base.tire.nominalDiameter}"
        {/if}
        {#if comparison.deltaStatus === 'exact'}
          <span class="exact" data-testid="gain-exact">Exact</span>
        {:else}
          <StatusBadge status={comparison.deltaStatus} />
        {/if}
      </dt>
      <dd>
        <span class="value" data-testid="m-gain"
          >{approxPrefix(comparison.deltaStatus)}{formatSignedInches(
            comparison.clearanceDelta
          )}</span
        >
        <span class="aux">
          {#if comparison.deltaStatus === 'exact'}
            Half of the {formatSignedInches(comparison.diameterDelta, 0)} diameter change. Holds for any
            housing drop with the same loaded deflection.
          {:else}
            Two different axles: the housing drops no longer cancel, so this is only as good as the
            weaker of the two drop figures. The tires account for {formatSignedInches(
              sel.effectiveTireRadius - base.effectiveTireRadius
            )}; the housings{sel.axleCenterlineHeight !== sel.effectiveTireRadius ||
            base.axleCenterlineHeight !== base.effectiveTireRadius
              ? ' and portal hubs'
              : ''} account for {formatSignedInches(
              comparison.clearanceDelta - (sel.effectiveTireRadius - base.effectiveTireRadius)
            )}.
          {/if}
        </span>
      </dd>
    </div>
  </dl>

  <table class="compare" data-testid="comparison-table">
    <caption>Baseline vs selected</caption>
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col" class="c-base">{baseHeading}</th>
        <th scope="col" class="c-sel">{selHeading}</th>
        <th scope="col">Change</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Diameter</th>
        <td>{formatInches(base.tire.nominalDiameter, 1)}</td>
        <td>{formatInches(sel.tire.nominalDiameter, 1)}</td>
        <td data-testid="cmp-diameter-delta">{formatSignedInches(comparison.diameterDelta, 1)}</td>
      </tr>
      <tr>
        <th scope="row">Axle CL height</th>
        <td>{formatInches(base.axleCenterlineHeight)}</td>
        <td>{formatInches(sel.axleCenterlineHeight)}</td>
        <td>{formatSignedInches(sel.axleCenterlineHeight - base.axleCenterlineHeight)}</td>
      </tr>
      {#if !comparison.sameAxle}
        <tr>
          <th scope="row">Housing drop</th>
          <td>{formatInches(base.housingDrop)}</td>
          <td>{formatInches(sel.housingDrop)}</td>
          <td>{formatSignedInches(sel.housingDrop - base.housingDrop)}</td>
        </tr>
      {/if}
      <tr>
        <th scope="row">Diff clearance{bothTrusted ? '' : ' (est.)'}</th>
        <td>{formatInches(base.differentialClearance)}</td>
        <td>{formatInches(sel.differentialClearance)}</td>
        <td class="delta" data-testid="cmp-clearance-delta"
          >{formatSignedInches(comparison.clearanceDelta)}</td
        >
      </tr>
    </tbody>
  </table>
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
  .metrics {
    display: grid;
    gap: 1px;
    margin: 0;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }
  .metric {
    background: var(--surface);
    padding: var(--space-3) var(--space-4);
  }
  dt {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
    font-size: 12px;
    color: var(--text-secondary);
  }
  dd {
    margin: 2px 0 0;
    display: grid;
    gap: 2px;
  }
  .value {
    font-family: var(--font-family-mono);
    font-size: 22px;
    font-weight: 600;
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
  }
  .aux {
    font-size: 12px;
    color: var(--text-muted);
  }
  .hero .value {
    color: var(--measure-clearance);
    font-size: 30px;
  }
  .hero.untrusted {
    background:
      linear-gradient(
        90deg,
        color-mix(in srgb, var(--measure-clearance) 7%, transparent),
        transparent 70%
      ),
      var(--surface);
  }
  .gain .value {
    color: var(--measure-delta);
    font-size: 26px;
  }
  .exact {
    font-family: var(--font-family-mono);
    font-size: 10.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--measure-delta);
    border: 1px solid currentColor;
    border-radius: var(--radius-sm);
    padding: 1px 6px;
  }

  .compare {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
  }
  caption {
    text-align: left;
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
    padding-bottom: var(--space-2);
  }
  th,
  td {
    padding: 6px 4px;
    border-bottom: 1px solid var(--border);
    text-align: right;
    font-family: var(--font-family-mono);
  }
  th[scope='row'] {
    text-align: left;
    font-family: var(--font-family-base);
    font-weight: 400;
    color: var(--text-secondary);
  }
  thead th {
    font-family: var(--font-family-base);
    font-weight: 600;
    font-size: 11px;
    color: var(--text-muted);
  }
  .c-base {
    color: var(--measure-baseline) !important;
  }
  .c-sel {
    color: var(--text-primary) !important;
  }
  .delta {
    color: var(--measure-delta);
    font-weight: 600;
  }
</style>
