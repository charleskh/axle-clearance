<script lang="ts">
  import { untrack } from 'svelte';
  import { Tween, prefersReducedMotion } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import {
    approxPrefix,
    compareSetups,
    defaultSettings,
    isTrustedAbsolute
  } from '$lib/features/axleClearance/clearance';
  import { formatInches, formatSignedInches } from '$lib/features/axleClearance/format';
  import { buildScene, viewFrom, type ViewMode } from '$lib/features/axleClearance/render/scene';
  import {
    BASELINE_TIRE_DIAMETER,
    tireAtDiameter,
    tireForDiameter
  } from '$lib/features/axleClearance/tires';
  import type { AxleConfiguration } from '$lib/features/axleClearance/types';
  import AxlePicker from './AxlePicker.svelte';
  import AxleDataTable from './AxleDataTable.svelte';
  import AxleDrawing from './AxleDrawing.svelte';
  import CalibrationPanel from './CalibrationPanel.svelte';
  import MeasurementPanel from './MeasurementPanel.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import TireControls from './TireControls.svelte';

  let {
    axles,
    initialAxle
  }: {
    axles: AxleConfiguration[];
    /** Axle shown first. Read once; later selection is local state. */
    initialAxle: AxleConfiguration;
  } = $props();

  let axleId = $state(untrack(() => initialAxle.id));
  const axle = $derived(axles.find((a) => a.id === axleId) ?? initialAxle);

  let mode = $state<ViewMode>('single');
  /** Empty means the baseline uses the selected axle (a tire-only comparison). */
  let baselineAxleId = $state('');
  const baselineAxle = $derived(
    mode === 'single' ? axle : (axles.find((a) => a.id === baselineAxleId) ?? axle)
  );

  let diameter = $state(37);
  /** Measured housing drops by axle id; kept per axle so switching axles never loses one. */
  let dropOverrides = $state<Record<string, number>>({});
  let deflection = $state(0);

  const settings = $derived(defaultSettings(axle, dropOverrides[axle.id], deflection));
  const baselineSettings = $derived(
    defaultSettings(baselineAxle, dropOverrides[baselineAxle.id], deflection)
  );

  // Exact numbers come from the settled diameter; only the drawing animates.
  let baselineDiameter = $state(BASELINE_TIRE_DIAMETER);
  const baselineTire = $derived(tireForDiameter(baselineDiameter));
  const selectedTire = $derived(tireForDiameter(diameter));
  const comparison = $derived(
    compareSetups(
      { axle: baselineAxle, tire: baselineTire, settings: baselineSettings },
      { axle, tire: selectedTire, settings }
    )
  );
  const calibrationAxles = $derived(comparison.sameAxle ? [axle] : [axle, baselineAxle]);

  const drawn = new Tween(37, { duration: 380, easing: cubicOut });
  const drawnBaseline = new Tween(BASELINE_TIRE_DIAMETER, { duration: 380, easing: cubicOut });
  $effect(() => {
    const duration = prefersReducedMotion.current ? 0 : 380;
    drawn.set(diameter, { duration });
    drawnBaseline.set(baselineDiameter, { duration });
  });

  const viewLabel = $derived(
    viewFrom(axle) === 'rear'
      ? 'Rear elevation · viewed from behind the truck'
      : 'Front elevation · viewed from ahead of the truck'
  );

  const MODES: { id: ViewMode; label: string }[] = [
    { id: 'single', label: 'Single' },
    { id: 'side-by-side', label: 'Side by side' },
    { id: 'overlay', label: 'Overlay' }
  ];

  const scene = $derived.by(() => {
    const selStatus = comparison.selected.clearanceStatus;
    const prefix = approxPrefix(selStatus);
    const basePrefix = approxPrefix(comparison.baseline.clearanceStatus);
    // Name what limits the figure: a calibrated drop on a portal axle can
    // still be held back by an unmeasured portal drop.
    const statusText =
      selStatus === 'calibrated'
        ? 'diff clearance · your drop'
        : isTrustedAbsolute(selStatus)
          ? 'diff clearance'
          : settings.housingDropCalibrated
            ? 'diff clearance · portal drop unverified'
            : 'diff clearance · unverified';
    const dropStatus = settings.housingDropCalibrated
      ? 'drop · measured'
      : `drop · ${axle.housing.centerSection.dropBelowCenterline.status}`;
    return buildScene({
      axle,
      mode,
      selected: tireAtDiameter(drawn.current),
      baseline: tireAtDiameter(drawnBaseline.current),
      loadedRadiusDeflection: deflection,
      housingDrop: settings.housingDrop,
      baselineAxle,
      baselineHousingDrop: baselineSettings.housingDrop,
      labels: {
        selectedClearance: prefix + formatInches(comparison.selected.differentialClearance),
        baselineClearance: basePrefix + formatInches(comparison.baseline.differentialClearance),
        clearanceDelta:
          approxPrefix(comparison.deltaStatus) + formatSignedInches(comparison.clearanceDelta),
        selectedRadius: formatInches(comparison.selected.effectiveTireRadius),
        baselineRadius: formatInches(comparison.baseline.effectiveTireRadius),
        selectedDiameter: formatInches(diameter, 0),
        baselineDiameter: formatInches(baselineDiameter, 0),
        drop: formatInches(settings.housingDrop),
        dropStatus,
        clearanceStatus: statusText,
        selectedName: comparison.sameAxle ? undefined : axle.shortName,
        baselineName: comparison.sameAxle ? undefined : baselineAxle.shortName
      }
    });
  });
</script>

<div class="app">
  <header class="topbar">
    <div class="brand">
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
        <rect
          x="3"
          y="7"
          width="6"
          height="18"
          rx="2"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <rect
          x="23"
          y="7"
          width="6"
          height="18"
          rx="2"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <path d="M9 15h14" stroke="currentColor" stroke-width="1.5" />
        <circle
          cx="18"
          cy="16"
          r="4"
          fill="none"
          stroke="var(--accent-primary)"
          stroke-width="1.5"
        />
        <path d="M18 20v8" stroke="var(--accent-primary)" stroke-width="1.2" />
      </svg>
      <div>
        <h1>Axle Clearance</h1>
        <p class="sub">Differential ground clearance, drawn to one physical scale</p>
      </div>
    </div>
    <div class="topbar-controls">
      <div class="axle-select">
        <AxlePicker {axles} bind:value={axleId} id="axle" label="Axle" testId="axle-select" />
      </div>
      <ThemeToggle />
    </div>
  </header>

  <main class="layout">
    <section class="stage" aria-label="Axle elevation drawing">
      <div class="stage-bar">
        <div class="stage-title">
          <span class="eyebrow" data-testid="view-label">{viewLabel}</span>
          <span class="axle-name">{axle.vehicle}</span>
        </div>
        <div class="modes" role="group" aria-label="View mode">
          {#each MODES as m (m.id)}
            <button
              type="button"
              class:active={mode === m.id}
              aria-pressed={mode === m.id}
              onclick={() => (mode = m.id)}
              data-testid={`mode-${m.id}`}>{m.label}</button
            >
          {/each}
        </div>
      </div>

      <div class="canvas">
        <AxleDrawing {scene} {mode} title={`${axle.name} on ${diameter} inch tires`} />
      </div>

      <div class="legend" aria-label="Legend">
        <span><i class="sw sw-clearance"></i>Diff clearance</span>
        {#if mode !== 'single'}
          <span><i class="sw sw-baseline"></i>{baselineDiameter}" baseline</span>
        {/if}
        {#if mode === 'overlay'}
          <span><i class="sw sw-delta"></i>Change</span>
        {/if}
        <span><i class="sw sw-cl"></i>Centerlines</span>
        <span><i class="sw sw-hidden"></i>Hidden (ring gear, wheel)</span>
        <span class="scale-note">Scale fixed at {scene.scale} units/in for every tire size</span>
      </div>

      <!-- Baseline on the left, selected on the right: the same order as the
           side-by-side panels and the comparison table. -->
      <div class="tire-bar" class:split={mode !== 'single'}>
        {#if mode !== 'single'}
          <div class="baseline-col">
            <AxlePicker
              {axles}
              bind:value={baselineAxleId}
              id="baseline-axle"
              label="Baseline axle"
              testId="baseline-axle-select"
              sameOption="Same as selected axle"
            />
            <TireControls
              bind:diameter={baselineDiameter}
              idPrefix="baseline"
              label="Baseline tire"
              tone="baseline"
            />
          </div>
        {/if}
        <TireControls bind:diameter label={mode === 'single' ? 'Tire diameter' : 'Selected tire'} />
      </div>
    </section>

    <aside class="side">
      <MeasurementPanel {comparison} {deflection} selectedAxle={axle} {baselineAxle} />
      <CalibrationPanel axles={calibrationAxles} bind:dropOverrides bind:deflection />
    </aside>

    <div class="data">
      <AxleDataTable {axle} />
    </div>
  </main>
</div>

<style>
  .app {
    min-height: 100vh;
    max-width: 1680px;
    margin: 0 auto;
    padding: 0 var(--space-5) var(--space-6);
  }

  .topbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding: var(--space-4) 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: var(--space-5);
  }
  .brand {
    display: flex;
    gap: var(--space-3);
    align-items: center;
    color: var(--draw-steel-strong);
  }
  h1 {
    margin: 0;
    font-family: var(--font-family-heading);
    font-size: 21px;
    letter-spacing: 0.02em;
    font-weight: 600;
    color: var(--text-primary);
  }
  .sub {
    margin: 0;
    font-size: 12.5px;
    color: var(--text-muted);
  }
  .axle-select {
    flex: 1 1 420px;
    min-width: 0;
    max-width: 520px;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    grid-template-areas:
      'stage side'
      'data data';
    gap: var(--space-5);
    align-items: start;
  }
  .stage {
    grid-area: stage;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }
  .side {
    grid-area: side;
    display: grid;
    gap: var(--space-5);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
  }
  .data {
    grid-area: data;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    min-width: 0;
  }

  .stage-bar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--border);
  }
  .stage-title {
    display: grid;
  }
  .eyebrow {
    font-size: 10.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
  }
  .axle-name {
    font-size: 13.5px;
    color: var(--text-secondary);
  }
  .modes {
    display: inline-flex;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }
  .modes button {
    border: none;
    background: var(--surface-sunken);
    color: var(--text-secondary);
    padding: 7px 14px;
    font-size: 13px;
    min-height: 36px;
    cursor: pointer;
  }
  .modes button + button {
    border-left: 1px solid var(--border-strong);
  }
  .modes button.active {
    background: var(--accent-primary-muted);
    color: var(--accent-primary);
  }

  .canvas {
    background: var(--draw-canvas);
    padding: var(--space-2) 0;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2) var(--space-4);
    padding: var(--space-2) var(--space-4);
    font-size: 12px;
    color: var(--text-muted);
    border-top: 1px solid var(--border);
  }
  .legend span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .sw {
    display: inline-block;
    width: 18px;
    height: 0;
    border-top: 2px solid;
  }
  .sw-clearance {
    border-color: var(--measure-clearance);
  }
  .sw-baseline {
    border-top-style: dashed;
    border-color: var(--measure-baseline);
  }
  .sw-delta {
    border-color: var(--measure-delta);
  }
  .sw-cl {
    border-top: 1px dashed var(--draw-centerline);
  }
  .sw-hidden {
    border-top: 1px dashed var(--draw-hidden);
  }
  .scale-note {
    margin-left: auto;
    font-family: var(--font-family-mono);
    font-size: 11px;
  }

  .tire-bar {
    display: grid;
    gap: var(--space-5);
    padding: var(--space-4);
    border-top: 1px solid var(--border);
  }
  .tire-bar.split {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .baseline-col {
    display: grid;
    gap: var(--space-3);
    align-content: start;
  }
  .topbar-controls {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    min-width: 0;
  }

  @media (max-width: 1100px) {
    .layout {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas:
        'stage'
        'side'
        'data';
    }
  }

  @media (max-width: 760px) {
    .tire-bar.split {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 640px) {
    .topbar-controls {
      width: 100%;
    }
    .app {
      padding: 0 var(--space-3) var(--space-5);
    }
    .topbar {
      margin-bottom: var(--space-3);
    }
    .axle-select {
      max-width: none;
    }
    .modes {
      width: 100%;
    }
    .modes button {
      flex: 1;
      padding: 7px 4px;
    }
    .scale-note {
      margin-left: 0;
    }
  }
</style>
