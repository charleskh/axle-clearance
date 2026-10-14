<script lang="ts">
  import { listDimensions } from '$lib/features/axleClearance/data';
  import { formatInches } from '$lib/features/axleClearance/format';
  import type { AxleConfiguration } from '$lib/features/axleClearance/types';
  import StatusBadge from './StatusBadge.svelte';
  import { measurementIssueUrl } from '$lib/site';

  let { axle }: { axle: AxleConfiguration } = $props();

  const rows = $derived(listDimensions(axle));
  const sourceIndex = $derived(new Map(axle.sources.map((s, i) => [s.id, i + 1])));
</script>

<section class="panel" aria-labelledby="data-heading">
  <h2 id="data-heading">Axle data and verification</h2>
  <p class="axle-meta">
    <strong>{axle.name}</strong> · {axle.vehicle} · {axle.manufacturer} ·
    {axle.position === 'front' ? 'Front' : 'Rear'}
  </p>
  <p class="report">
    Measured one of these on a real axle?
    <a
      href={measurementIssueUrl(axle.name, axle.id)}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="report-measurement">Report a measurement</a
    >. It opens a prefilled GitHub issue; nothing is sent unless you submit it.
  </p>
  <ul class="notes">
    {#each axle.notes as note (note)}
      <li>{note}</li>
    {/each}
  </ul>

  <div class="table-wrap">
    <table data-testid="dimension-table">
      <thead>
        <tr>
          <th scope="col">Dimension</th>
          <th scope="col" class="num">Value</th>
          <th scope="col">Status</th>
          <th scope="col">Sources</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as row (row.key)}
          <tr data-dimension-key={row.key}>
            <th scope="row">
              {row.label}
              {#if row.dimension.note}<span class="note">{row.dimension.note}</span>{/if}
            </th>
            <td class="num">{formatInches(row.dimension.value)}</td>
            <td><StatusBadge status={row.dimension.status} /></td>
            <td class="refs">
              {#each row.dimension.sourceIds as id (id)}
                <a href={`#source-${id}`}>[{sourceIndex.get(id)}]</a>
              {/each}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if axle.facts.length > 0}
    <h3>Specifications</h3>
    <div class="table-wrap">
      <table data-testid="facts-table">
        <tbody>
          {#each axle.facts as fact (fact.label)}
            <tr>
              <th scope="row">{fact.label}</th>
              <td>{fact.value}</td>
              <td><StatusBadge status={fact.status} /></td>
              <td class="refs">
                {#each fact.sourceIds as id (id)}
                  <a href={`#source-${id}`}>[{sourceIndex.get(id)}]</a>
                {/each}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <h3>Sources</h3>
  <ol class="sources">
    {#each axle.sources as s (s.id)}
      <li id={`source-${s.id}`}>
        <span class="kind">{s.kind}</span>
        {#if s.url}
          <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a>
        {:else}
          {s.title}
        {/if}
        {#if s.excerpt}<q>{s.excerpt}</q>{/if}
      </li>
    {/each}
  </ol>
</section>

<style>
  .panel {
    display: grid;
    gap: var(--space-4);
  }
  h2,
  h3 {
    margin: 0;
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
  }
  .axle-meta {
    margin: 0;
    font-size: 13px;
    color: var(--text-secondary);
  }
  .axle-meta strong {
    font-family: var(--font-family-heading);
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }
  .report {
    margin: 0;
    font-size: 13px;
    color: var(--text-secondary);
    padding: var(--space-2) var(--space-3);
    border-left: 2px solid var(--accent-primary);
    background: var(--surface-sunken);
  }
  .notes {
    margin: 0;
    padding-left: 18px;
    display: grid;
    gap: 4px;
    font-size: 13px;
    color: var(--text-secondary);
  }
  .table-wrap {
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    min-width: 560px;
  }
  th,
  td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    text-align: left;
    vertical-align: top;
  }
  tbody tr:last-child > * {
    border-bottom: none;
  }
  thead th {
    background: var(--surface-elevated);
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.06em;
  }
  th[scope='row'] {
    font-weight: 500;
    color: var(--text-primary);
  }
  .note {
    display: block;
    font-weight: 400;
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
    max-width: 60ch;
  }
  .num {
    text-align: right;
    font-family: var(--font-family-mono);
    white-space: nowrap;
  }
  .refs a {
    font-family: var(--font-family-mono);
    font-size: 12px;
    margin-right: 4px;
    text-decoration: none;
  }
  .sources {
    margin: 0;
    padding-left: 22px;
    display: grid;
    gap: 8px;
    font-size: 13px;
    color: var(--text-secondary);
  }
  .sources li:target {
    color: var(--text-primary);
  }
  .kind {
    font-family: var(--font-family-mono);
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-right: 6px;
  }
  q {
    display: block;
    color: var(--text-muted);
    font-size: 12px;
    margin-top: 2px;
  }
</style>
