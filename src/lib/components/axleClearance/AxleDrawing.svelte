<script lang="ts">
  import type { Scene, SceneDimension, ViewMode } from '$lib/features/axleClearance/render/scene';

  let {
    scene,
    mode,
    title
  }: {
    scene: Scene;
    mode: ViewMode;
    title: string;
  } = $props();

  let clientWidth = $state(0);

  // Text, arrowheads and line weights are sized in screen pixels, then
  // converted to drawing units, so labels stay legible at any display width
  // without touching the physical geometry.
  const unitsPerPx = $derived(clientWidth > 0 ? scene.viewBox.width / clientWidth : 1);
  const fontSize = $derived(Math.min(12 * unitsPerPx, 2.8 * scene.scale));
  const subFontSize = $derived(fontSize * 0.82);
  const gap = $derived(fontSize * 0.55);

  const vb = $derived(
    `${scene.viewBox.x} ${scene.viewBox.y} ${scene.viewBox.width} ${scene.viewBox.height}`
  );

  // Minor grid every inch, major grid every foot, registered to the ground line
  // and the left edge so the grid itself is a ruler.
  const minor = $derived(scene.scale);
  const major = $derived(scene.scale * 12);
  const gridOffsetY = $derived(scene.groundY % major);

  function labelX(d: SceneDimension): number {
    if (d.labelSide === 'right') return d.label.x + gap;
    if (d.labelSide === 'left') return d.label.x - gap;
    return d.label.x;
  }

  function labelY(d: SceneDimension): number {
    return d.labelSide === 'above' ? d.label.y - gap : d.label.y;
  }

  function anchor(d: SceneDimension): 'start' | 'end' | 'middle' {
    if (d.labelSide === 'right') return 'start';
    if (d.labelSide === 'left') return 'end';
    return 'middle';
  }
</script>

<div class="drawing" bind:clientWidth>
  <svg
    viewBox={vb}
    role="img"
    aria-label={title}
    style:--u={unitsPerPx}
    data-testid="axle-drawing"
    data-mode={mode}
  >
    <defs>
      <pattern
        id="grid-minor"
        width={minor}
        height={minor}
        patternUnits="userSpaceOnUse"
        y={gridOffsetY}
      >
        <path d={`M${minor} 0H0V${minor}`} class="grid-minor" />
      </pattern>
      <pattern
        id="grid-major"
        width={major}
        height={major}
        patternUnits="userSpaceOnUse"
        y={gridOffsetY}
      >
        <rect width={major} height={major} fill="url(#grid-minor)" />
        <path d={`M${major} 0H0V${major}`} class="grid-major" />
      </pattern>
      <pattern
        id="ground-hatch"
        width={scene.scale * 1.6}
        height={scene.scale * 1.6}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="0" y2={scene.scale * 1.6} class="hatch" />
      </pattern>
      {#each ['clearance', 'reference', 'baseline', 'delta'] as tone (tone)}
        <marker
          id={`arrow-${tone}`}
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
          markerUnits="strokeWidth"
        >
          <path d="M0 1.5L10 5L0 8.5z" class={`arrowhead tone-${tone}`} />
        </marker>
      {/each}
    </defs>

    <rect width={scene.viewBox.width} height={scene.viewBox.height} fill="url(#grid-major)" />
    <rect
      x="0"
      y={scene.groundY}
      width={scene.viewBox.width}
      height={scene.viewBox.height - scene.groundY}
      fill="url(#ground-hatch)"
      class="ground-fill"
    />

    {#each scene.centerlines as cl (cl.id)}
      <path d={cl.d} class={`centerline cl-${cl.kind} variant-${cl.variant}`} />
    {/each}

    {#each scene.layers as layer (layer.id)}
      <g
        class="layer"
        class:ghost={mode === 'overlay' && layer.variant === 'baseline'}
        data-variant={layer.variant}
      >
        {#each layer.paths as p (p.id)}
          <path
            d={p.d}
            class={`part role-${p.role}`}
            class:schematic={p.schematic}
            data-part={p.id}
          />
        {/each}
      </g>
    {/each}

    <line
      x1={scene.groundX[0]}
      x2={scene.groundX[1]}
      y1={scene.groundY}
      y2={scene.groundY}
      class="ground"
    />
    <text
      x={scene.viewBox.width - gap}
      y={scene.groundY + fontSize * 1.3}
      class="ground-label"
      font-size={subFontSize}
      text-anchor="end">GROUND</text
    >

    {#each scene.dimensions as d (d.id)}
      <g class={`dimension tone-${d.tone}`} data-dimension={d.id}>
        {#each d.witness as w, i (i)}
          <line x1={w.from.x} y1={w.from.y} x2={w.to.x} y2={w.to.y} class="witness" />
        {/each}
        <line
          x1={d.a.x}
          y1={d.a.y}
          x2={d.b.x}
          y2={d.b.y}
          class="dim-line"
          marker-start={`url(#arrow-${d.tone})`}
          marker-end={`url(#arrow-${d.tone})`}
        />
        <text
          x={labelX(d)}
          y={labelY(d)}
          text-anchor={anchor(d)}
          font-size={fontSize}
          class="dim-text"
          data-testid={`dim-${d.id}`}
        >
          <tspan dy={d.labelSide === 'above' ? -fontSize * 0.9 : 0}>{d.text}</tspan>
          {#if d.subtext}
            <tspan x={labelX(d)} dy={fontSize * 1.1} font-size={subFontSize} class="dim-sub"
              >{d.subtext}</tspan
            >
          {/if}
        </text>
      </g>
    {/each}

    {#each scene.tags as tag, i (i)}
      <text
        x={tag.x}
        y={tag.y}
        text-anchor={tag.anchor}
        font-size={subFontSize}
        class={`tag variant-${tag.variant}`}>{tag.text}</text
      >
    {/each}
  </svg>
</div>

<style>
  .drawing {
    width: 100%;
    line-height: 0;
  }

  svg {
    width: 100%;
    height: auto;
    display: block;
    font-family: var(--font-family-mono);
    /* --u is drawing units per CSS pixel; stroke widths below are in px. */
  }

  .grid-minor {
    fill: none;
    stroke: var(--draw-grid);
    stroke-width: calc(var(--u) * 0.5);
  }
  .grid-major {
    fill: none;
    stroke: var(--draw-grid-major);
    stroke-width: calc(var(--u) * 0.75);
  }
  .hatch {
    stroke: var(--draw-ground);
    stroke-opacity: 0.22;
    stroke-width: calc(var(--u) * 0.75);
  }
  .ground-fill {
    opacity: 1;
  }
  .ground {
    stroke: var(--draw-ground);
    stroke-width: calc(var(--u) * 1.5);
  }
  .ground-label {
    fill: var(--text-muted);
    letter-spacing: 0.12em;
  }

  .centerline {
    fill: none;
    stroke: var(--draw-centerline);
    stroke-width: calc(var(--u) * 0.75);
    stroke-dasharray: calc(var(--u) * 14) calc(var(--u) * 3) calc(var(--u) * 3) calc(var(--u) * 3);
  }
  .cl-wheel {
    stroke-opacity: 0.55;
  }
  .centerline.variant-baseline {
    stroke: var(--measure-baseline);
    stroke-opacity: 0.5;
  }

  .part {
    fill: none;
    stroke: var(--draw-steel);
    stroke-width: calc(var(--u) * 1.1);
    stroke-linejoin: round;
    stroke-linecap: round;
    transition: stroke 160ms ease;
  }
  .role-casting {
    fill: var(--draw-fill-casting);
    stroke: var(--draw-steel-strong);
    stroke-width: calc(var(--u) * 1.25);
  }
  .role-tube {
    fill: var(--draw-fill-tube);
    stroke: var(--draw-steel);
  }
  .role-cover {
    fill: var(--draw-fill-cover);
    stroke: var(--draw-steel-strong);
    stroke-width: calc(var(--u) * 1.25);
  }
  .role-bolt {
    fill: var(--draw-fill-cover);
    stroke: var(--draw-steel-strong);
    stroke-width: calc(var(--u) * 0.8);
  }
  .role-knuckle {
    fill: var(--draw-fill-casting);
    stroke: var(--draw-steel);
  }
  .role-hub {
    fill: var(--draw-fill-hub);
    stroke: var(--draw-steel-dim);
  }
  .role-detail {
    stroke: var(--draw-steel-dim);
    stroke-width: calc(var(--u) * 0.85);
  }
  .role-hidden {
    stroke: var(--draw-hidden);
    stroke-width: calc(var(--u) * 0.8);
    stroke-dasharray: calc(var(--u) * 5) calc(var(--u) * 3);
  }
  .role-tire {
    fill: var(--draw-fill-tire);
    stroke: var(--draw-tire);
    stroke-width: calc(var(--u) * 1.4);
  }
  .role-tread {
    stroke: var(--draw-steel-dim);
    stroke-width: calc(var(--u) * 0.7);
    stroke-opacity: 0.7;
  }

  /* Overlay baseline: outline only, dashed, in the baseline color. */
  .ghost .part {
    fill: none;
    stroke: var(--measure-baseline);
    stroke-opacity: 0.6;
    stroke-dasharray: calc(var(--u) * 4) calc(var(--u) * 3);
    stroke-width: calc(var(--u) * 1);
  }
  .ghost .role-tread,
  .ghost .role-hidden,
  .ghost .role-detail,
  .ghost .role-bolt {
    display: none;
  }

  .witness {
    stroke-width: calc(var(--u) * 0.6);
    stroke-opacity: 0.6;
  }
  .dim-line {
    stroke-width: calc(var(--u) * 1.1);
  }
  .dim-text {
    font-weight: 600;
    paint-order: stroke;
    stroke: var(--draw-label-halo);
    stroke-width: calc(var(--u) * 4);
    stroke-linejoin: round;
  }
  .dim-sub {
    font-weight: 400;
    fill-opacity: 0.75;
    letter-spacing: 0.04em;
  }

  .tone-clearance {
    stroke: var(--measure-clearance);
    fill: var(--measure-clearance);
  }
  .tone-clearance .dim-line {
    stroke-width: calc(var(--u) * 1.6);
  }
  .tone-reference {
    stroke: var(--measure-reference);
    fill: var(--measure-reference);
  }
  .tone-baseline {
    stroke: var(--measure-baseline);
    fill: var(--measure-baseline);
  }
  .tone-delta {
    stroke: var(--measure-delta);
    fill: var(--measure-delta);
  }
  .dimension .witness,
  .dimension .dim-line {
    fill: none;
  }
  .dimension .dim-text {
    stroke: var(--draw-label-halo);
  }
  .arrowhead {
    stroke: none;
  }

  .tag {
    fill: var(--text-muted);
    letter-spacing: 0.18em;
    font-weight: 600;
  }
  .tag.variant-baseline {
    fill: var(--measure-baseline);
  }
  .tag.variant-selected {
    fill: var(--text-secondary);
  }
</style>
