import type {
  AxleConfiguration,
  ClearanceComparison,
  ClearanceResult,
  ClearanceSettings,
  TireSpec,
  VerificationStatus
} from './types';

/** effectiveTireRadius = nominalDiameter / 2 - loadedRadiusDeflection */
export function effectiveTireRadius(
  nominalDiameter: number,
  loadedRadiusDeflection: number
): number {
  if (!(nominalDiameter > 0)) throw new RangeError('Tire diameter must be positive');
  if (!(loadedRadiusDeflection >= 0)) throw new RangeError('Deflection cannot be negative');
  const radius = nominalDiameter / 2 - loadedRadiusDeflection;
  if (!(radius > 0)) throw new RangeError('Deflection exceeds tire radius');
  return radius;
}

/**
 * differentialClearance = axleCenterlineHeight - differentialHousingDrop.
 * On a conventional axle the axle centerline height is the effective tire
 * radius; a solid portal axle adds its portal drop.
 */
export function differentialClearance(axleCenterlineHeight: number, housingDrop: number): number {
  return axleCenterlineHeight - housingDrop;
}

/**
 * Settings for one axle: the stored housing drop unless the user measured
 * one, and a shared loaded-radius deflection.
 */
export function defaultSettings(
  axle: AxleConfiguration,
  measuredDrop?: number,
  loadedRadiusDeflection = 0
): ClearanceSettings {
  return {
    loadedRadiusDeflection,
    housingDrop: measuredDrop ?? axle.housing.centerSection.dropBelowCenterline.value,
    housingDropCalibrated: measuredDrop !== undefined
  };
}

/**
 * How far the housing's reference centerline sits above the wheel centerline.
 * Only a solid portal axle has one: its tubes ride above the wheel by the
 * portal drop. IFS drops are already measured from the wheel centerline.
 */
export function portalLift(axle: AxleConfiguration): number {
  return axle.kind === 'solid' && axle.portal ? axle.portal.drop.value : 0;
}

/**
 * An absolute clearance is only as trustworthy as the housing drop it
 * subtracts, and on a solid portal axle the portal drop it adds.
 */
function clearanceStatus(
  axle: AxleConfiguration,
  settings: ClearanceSettings
): VerificationStatus | 'calibrated' {
  const drop = settings.housingDropCalibrated
    ? 'calibrated'
    : axle.housing.centerSection.dropBelowCenterline.status;
  if (axle.kind === 'solid' && axle.portal) return weakerStatus(drop, axle.portal.drop.status);
  return drop;
}

export function calculateClearance(
  axle: AxleConfiguration,
  tire: TireSpec,
  settings: ClearanceSettings
): ClearanceResult {
  const radius = effectiveTireRadius(tire.nominalDiameter, settings.loadedRadiusDeflection);
  const axleCenterlineHeight = radius + portalLift(axle);
  return {
    tire,
    effectiveTireRadius: radius,
    axleCenterlineHeight,
    differentialClearance: differentialClearance(axleCenterlineHeight, settings.housingDrop),
    housingDrop: settings.housingDrop,
    clearanceStatus: clearanceStatus(axle, settings)
  };
}

/** One side of a comparison: an axle on a tire with its calibration. */
export interface Setup {
  axle: AxleConfiguration;
  tire: TireSpec;
  settings: ClearanceSettings;
}

/** Trust order, strongest first. A user measurement ranks with a derived value. */
const TRUST: ClearanceResult['clearanceStatus'][] = [
  'verified',
  'derived',
  'calibrated',
  'community',
  'estimated',
  'schematic'
];

/** The less trustworthy of two statuses. */
export function weakerStatus(
  a: ClearanceResult['clearanceStatus'],
  b: ClearanceResult['clearanceStatus']
): ClearanceResult['clearanceStatus'] {
  return TRUST.indexOf(a) >= TRUST.indexOf(b) ? a : b;
}

/**
 * Compare two setups. With the same axle and the same housing drop the drops
 * cancel, so the clearance change is exactly half the diameter change no
 * matter how uncertain the drop is. Across two axles the drops no longer
 * cancel, and the change is only as trustworthy as the weaker of the two.
 */
export function compareSetups(baselineSetup: Setup, selectedSetup: Setup): ClearanceComparison {
  const baseline = calculateClearance(
    baselineSetup.axle,
    baselineSetup.tire,
    baselineSetup.settings
  );
  const selected = calculateClearance(
    selectedSetup.axle,
    selectedSetup.tire,
    selectedSetup.settings
  );
  const sameAxle = baselineSetup.axle.id === selectedSetup.axle.id;
  const deltaExact =
    sameAxle &&
    baseline.housingDrop === selected.housingDrop &&
    baselineSetup.settings.loadedRadiusDeflection === selectedSetup.settings.loadedRadiusDeflection;
  return {
    baseline,
    selected,
    sameAxle,
    diameterDelta: selectedSetup.tire.nominalDiameter - baselineSetup.tire.nominalDiameter,
    clearanceDelta: selected.differentialClearance - baseline.differentialClearance,
    deltaStatus: deltaExact
      ? 'exact'
      : weakerStatus(baseline.clearanceStatus, selected.clearanceStatus)
  };
}

/** Same axle, two tires: the original single-axle comparison. */
export function compareClearance(
  axle: AxleConfiguration,
  baselineTire: TireSpec,
  selectedTire: TireSpec,
  settings: ClearanceSettings
): ClearanceComparison {
  return compareSetups(
    { axle, tire: baselineTire, settings },
    { axle, tire: selectedTire, settings }
  );
}

/** True when an absolute clearance may be shown without a caveat. */
export function isTrustedAbsolute(status: ClearanceResult['clearanceStatus']): boolean {
  return status === 'verified' || status === 'derived' || status === 'calibrated';
}

/** "≈ " for a figure that is not trustworthy as an absolute number, else "". */
export function approxPrefix(status: ClearanceComparison['deltaStatus']): string {
  return status === 'exact' || isTrustedAbsolute(status) ? '' : '\u2248 ';
}
