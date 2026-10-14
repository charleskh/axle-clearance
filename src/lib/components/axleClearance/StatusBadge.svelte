<script lang="ts">
  import type { VerificationStatus } from '$lib/features/axleClearance/types';

  let { status }: { status: VerificationStatus | 'calibrated' } = $props();

  const LABELS: Record<VerificationStatus | 'calibrated', string> = {
    verified: 'Verified',
    derived: 'Derived',
    community: 'Owner-reported',
    estimated: 'Unverified estimate',
    schematic: 'Schematic',
    calibrated: 'Your measurement'
  };
</script>

<span class={`badge status-${status}`} data-status={status}>{LABELS[status]}</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-family-mono);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 2px 7px;
    border-radius: var(--radius-sm);
    border: 1px solid currentColor;
    white-space: nowrap;
    line-height: 1.5;
  }
  .badge::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
  .status-verified {
    color: var(--status-verified);
  }
  .status-derived {
    color: var(--status-derived);
  }
  .status-community {
    color: var(--status-community);
  }
  .status-estimated {
    color: var(--status-estimated);
  }
  .status-schematic {
    color: var(--status-schematic);
  }
  .status-calibrated {
    color: var(--status-calibrated);
  }
</style>
