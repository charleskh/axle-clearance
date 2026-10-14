import type { AxleConfiguration, Dimension } from '../types';
import { danaSuper60Ford } from './danaSuper60Ford';
import { dodgeDana60KingpinFront } from './dodgeDana60KingpinFront';
import { earlyBroncoDana30Front } from './earlyBroncoDana30Front';
import { fordBroncoDana44HpFront } from './fordBroncoDana44HpFront';
import { fordDana60KingpinFront } from './fordDana60KingpinFront';
import { fordF250Dana44HpFront } from './fordF250Dana44HpFront';
import { fordSterling1025Rear } from './fordSterling1025Rear';
import { fordSterling105Rear } from './fordSterling105Rear';
import { earlyBroncoDana44Front } from './earlyBroncoDana44Front';
import { gmDana60KingpinFront } from './gmDana60KingpinFront';
import { hmmwvFront } from './hmmwvFront';
import { jeepJkDana44Rear } from './jeepJkDana44Rear';
import { jeepJlRubicon2024Dana44HdRear } from './jeepJlRubicon2024Dana44HdRear';
import { jeepJkRubiconDana44Front } from './jeepJkRubiconDana44Front';
import { jeepJlRubiconDana44Front } from './jeepJlRubiconDana44Front';
import { jeepJlRubiconDana44Rear } from './jeepJlRubiconDana44Rear';
import { jeepTjRubiconDana44Front } from './jeepTjRubiconDana44Front';
import { jeepTjRubiconDana44Rear } from './jeepTjRubiconDana44Rear';
import { suzukiSamuraiFront } from './suzukiSamuraiFront';
import { suzukiSamuraiRear } from './suzukiSamuraiRear';
import { toyotaFj40Fj60Front } from './toyotaFj40Fj60Front';
import { unimogFront } from './unimogFront';
import { unimogRear } from './unimogRear';
import { weld74PortalFront } from './weld74PortalFront';
import { weld74PortalRear } from './weld74PortalRear';
import { toyotaFzj80Front } from './toyotaFzj80Front';
import { toyotaFzj80Rear } from './toyotaFzj80Rear';
import { toyotaIfs75Front } from './toyotaIfs75Front';
import { toyotaTacomaIfsFront } from './toyotaTacomaIfsFront';
import { toyotaPickup8Front } from './toyotaPickup8Front';
import { toyotaPickup8Rear } from './toyotaPickup8Rear';

/**
 * Every axle the app can draw, in picker order. Add a configuration here to
 * add an axle; groups appear in the order their first member does.
 */
export const axles: AxleConfiguration[] = [
  danaSuper60Ford,
  fordDana60KingpinFront,
  fordF250Dana44HpFront,
  fordBroncoDana44HpFront,
  earlyBroncoDana30Front,
  earlyBroncoDana44Front,
  fordSterling1025Rear,
  fordSterling105Rear,
  dodgeDana60KingpinFront,
  gmDana60KingpinFront,
  jeepTjRubiconDana44Front,
  jeepTjRubiconDana44Rear,
  jeepJkRubiconDana44Front,
  jeepJkDana44Rear,
  jeepJlRubiconDana44Front,
  jeepJlRubiconDana44Rear,
  jeepJlRubicon2024Dana44HdRear,
  toyotaPickup8Front,
  toyotaPickup8Rear,
  toyotaFzj80Front,
  toyotaFzj80Rear,
  toyotaFj40Fj60Front,
  toyotaIfs75Front,
  toyotaTacomaIfsFront,
  suzukiSamuraiFront,
  suzukiSamuraiRear,
  hmmwvFront,
  unimogFront,
  unimogRear,
  weld74PortalFront,
  weld74PortalRear
];

export const defaultAxle = danaSuper60Ford;

export function findAxle(id: string): AxleConfiguration | undefined {
  return axles.find((a) => a.id === id);
}

/** Axles grouped for the picker, groups and members in display order. */
export function groupedAxles(
  list: AxleConfiguration[]
): { group: string; axles: AxleConfiguration[] }[] {
  const groups = new Map<string, AxleConfiguration[]>();
  for (const a of list) {
    const g = groups.get(a.group);
    if (g) g.push(a);
    else groups.set(a.group, [a]);
  }
  return [...groups.entries()].map(([group, members]) => ({ group, axles: members }));
}

export interface NamedDimension {
  key: string;
  label: string;
  dimension: Dimension;
}

/** Flat, labelled list of an axle's dimensions for the data table and validation. */
export function listDimensions(axle: AxleConfiguration): NamedDimension[] {
  const cs = axle.housing.centerSection;
  const we = axle.housing.wheelEnds;
  const coverLabel = cs.style === 'integral' ? 'Cover' : 'Rear dome';
  const rows: NamedDimension[] = [
    {
      key: 'dropBelowCenterline',
      label:
        axle.kind === 'ifs'
          ? 'Wheel centerline to diff housing low point'
          : 'Axle centerline to housing low point',
      dimension: cs.dropBelowCenterline
    },
    {
      key: 'trackWidth',
      label: 'Track (wheel center to wheel center)',
      dimension: axle.wheel.trackWidth
    },
    { key: 'wmsWidth', label: 'Wheel mounting surface width', dimension: we.wmsWidth },
    {
      key: 'offsetFromVehicleCenter',
      label: `Differential offset (${cs.offsetFromVehicleCenter.value >= 0 ? 'driver' : 'passenger'} side)`,
      dimension: cs.offsetFromVehicleCenter
    },
    { key: 'ringGearDiameter', label: 'Ring gear diameter', dimension: cs.ringGearDiameter },
    { key: 'coverHeight', label: `${coverLabel} height`, dimension: cs.cover.height },
    { key: 'coverWidth', label: `${coverLabel} width`, dimension: cs.cover.width },
    { key: 'width', label: 'Center section width', dimension: cs.width },
    {
      key: 'tubeOuterDiameter',
      label:
        axle.kind === 'ifs'
          ? 'Carrier stub tube or half-shaft diameter'
          : 'Axle tube outer diameter',
      dimension: axle.housing.tubes.outerDiameter
    },
    { key: 'wheelOffset', label: 'Reference wheel offset', dimension: axle.wheel.offset },
    { key: 'wheelDiameter', label: 'Reference wheel diameter', dimension: axle.wheel.diameter },
    {
      key: 'riseAboveCenterline',
      label: 'Housing top above centerline',
      dimension: cs.riseAboveCenterline
    },
    {
      key: 'coverCenterHeight',
      label: `${coverLabel} center above centerline`,
      dimension: cs.coverCenterHeight
    }
  ];
  if (cs.cover.boltCount > 0) {
    rows.push({ key: 'coverBoltCircle', label: 'Cover bolt path', dimension: cs.cover.boltCircle });
  }
  if (we.kind === 'steer') {
    const pivot =
      we.knuckle === 'kingpin'
        ? 'Kingpin span'
        : we.knuckle === 'ball-joint'
          ? 'Ball joint span'
          : 'Steering pivot span';
    rows.push(
      {
        key: 'cEndWidth',
        label: we.knuckle === 'closed-knuckle' ? 'Knuckle flange width' : 'Inner C-end width',
        dimension: we.cEndWidth
      },
      { key: 'pivotSpan', label: pivot, dimension: we.pivotSpan },
      {
        key: 'knuckleWidth',
        label: we.knuckle === 'closed-knuckle' ? 'Knuckle ball diameter' : 'Knuckle width',
        dimension: we.knuckleWidth
      }
    );
  } else {
    rows.push(
      { key: 'brakeDiameter', label: 'Brake drum or rotor diameter', dimension: we.brakeDiameter },
      { key: 'flangeDiameter', label: 'Housing end flange diameter', dimension: we.flangeDiameter }
    );
  }
  if (axle.ifs) {
    const ifs = axle.ifs;
    rows.push(
      {
        key: 'carrierHeight',
        label: 'Diff carrier center above wheel centerline',
        dimension: ifs.carrierHeight
      },
      {
        key: 'lowerBallJointHeight',
        label: 'Lower ball joint height',
        dimension: ifs.lowerBallJointHeight
      },
      {
        key: 'upperBallJointHeight',
        label: 'Upper ball joint height',
        dimension: ifs.upperBallJointHeight
      },
      {
        key: 'lowerArmPivotX',
        label: 'Lower arm inner pivot, from centerline',
        dimension: ifs.lowerArmInnerPivot.x
      },
      {
        key: 'lowerArmPivotY',
        label: 'Lower arm inner pivot height',
        dimension: ifs.lowerArmInnerPivot.y
      },
      {
        key: 'upperArmPivotX',
        label: 'Upper arm inner pivot, from centerline',
        dimension: ifs.upperArmInnerPivot.x
      },
      {
        key: 'upperArmPivotY',
        label: 'Upper arm inner pivot height',
        dimension: ifs.upperArmInnerPivot.y
      },
      {
        key: 'halfShaftDiameter',
        label: 'CV half-shaft diameter',
        dimension: ifs.halfShaftDiameter
      }
    );
    if (ifs.lowerArmLowPoint) {
      rows.push({
        key: 'lowerArmLowPoint',
        label: 'Lower control arm low point',
        dimension: ifs.lowerArmLowPoint
      });
    }
  }
  if (axle.portal) {
    rows.push(
      {
        key: 'portalDrop',
        label: 'Portal drop (shaft centerline to wheel centerline)',
        dimension: axle.portal.drop
      },
      { key: 'portalBoxHeight', label: 'Portal box height', dimension: axle.portal.boxHeight },
      { key: 'portalBoxWidth', label: 'Portal box thickness', dimension: axle.portal.boxWidth }
    );
  }
  rows.push(
    { key: 'hubDiameter', label: 'Hub diameter', dimension: we.hubDiameter },
    { key: 'hubLength', label: 'Hub length', dimension: we.hubLength },
    { key: 'wheelWidth', label: 'Reference wheel width', dimension: axle.wheel.width }
  );
  return rows;
}

const AUTHORITATIVE = new Set(['manufacturer', 'supplier']);

/** Structural problems with an axle definition. Empty means it is usable. */
export function validateAxle(axle: AxleConfiguration): string[] {
  const issues: string[] = [];
  const sources = new Map(axle.sources.map((s) => [s.id, s]));
  if (sources.size !== axle.sources.length) issues.push('duplicate source ids');

  const checkRefs = (key: string, status: Dimension['status'], ids: string[]) => {
    if (ids.length === 0) issues.push(`${key} cites no source`);
    for (const id of ids) {
      if (!sources.has(id)) issues.push(`${key} cites unknown source ${id}`);
    }
    if (
      status === 'verified' &&
      !ids.some((id) => AUTHORITATIVE.has(sources.get(id)?.kind ?? ''))
    ) {
      issues.push(`${key} is marked verified without a manufacturer or supplier source`);
    }
  };

  for (const { key, dimension } of listDimensions(axle)) {
    if (!Number.isFinite(dimension.value)) issues.push(`${key} is not a finite number`);
    checkRefs(key, dimension.status, dimension.sourceIds);
  }
  for (const fact of axle.facts) checkRefs(`fact "${fact.label}"`, fact.status, fact.sourceIds);

  const cs = axle.housing.centerSection;
  const we = axle.housing.wheelEnds;
  const tubeR = axle.housing.tubes.outerDiameter.value / 2;
  const positive: [string, number][] = [
    ['ring gear', cs.ringGearDiameter.value],
    ['drop', cs.dropBelowCenterline.value],
    ['rise', cs.riseAboveCenterline.value],
    ['center width', cs.width.value],
    ['cover width', cs.cover.width.value],
    ['cover height', cs.cover.height.value],
    ['tube', axle.housing.tubes.outerDiameter.value],
    ['track', axle.wheel.trackWidth.value],
    ['WMS', we.wmsWidth.value],
    ['hub length', we.hubLength.value],
    ['wheel diameter', axle.wheel.diameter.value]
  ];
  for (const [name, v] of positive) if (!(v > 0)) issues.push(`${name} must be positive`);

  // On an IFS front the carrier can sit above or below the wheel centerline,
  // so housing checks are made relative to the carrier center.
  const carrierY = axle.ifs?.carrierHeight.value ?? 0;
  const dropBelowCarrier = cs.dropBelowCenterline.value + carrierY;
  if (axle.kind !== 'ifs' && cs.dropBelowCenterline.value <= tubeR) {
    issues.push('housing drop must clear the tube');
  }
  if (dropBelowCarrier < cs.ringGearDiameter.value / 2) {
    issues.push('housing drop is smaller than the ring gear radius');
  }
  if (cs.cover.height.value / 2 - cs.coverCenterHeight.value > dropBelowCarrier) {
    issues.push('cover hangs below the housing low point');
  }
  if (cs.cover.width.value > cs.width.value) issues.push('cover is wider than the center section');
  if (we.wmsWidth.value <= cs.width.value + 2 * Math.abs(cs.offsetFromVehicleCenter.value)) {
    issues.push('center section does not fit between the wheel mounting surfaces');
  }
  if (
    Math.abs(we.wmsWidth.value - 2 * axle.wheel.offset.value - axle.wheel.trackWidth.value) > 0.5
  ) {
    issues.push(
      'track, WMS width and wheel offset disagree by more than 0.5 in (track = WMS - 2 x offset)'
    );
  }
  if (axle.position === 'front' && we.kind !== 'steer')
    issues.push('front axle needs steering wheel ends');
  if (axle.position === 'rear' && we.kind !== 'rear')
    issues.push('rear axle needs rear wheel ends');
  if (cs.style === 'third-member' && cs.cover.boltCount !== 0) {
    issues.push('a third-member housing has a welded dome, so boltCount must be 0');
  }
  if (axle.years.from > axle.years.to) issues.push('years are reversed');
  if (axle.kind === 'ifs') {
    const ifs = axle.ifs;
    if (!ifs) issues.push('an IFS axle needs ifs geometry');
    else {
      for (const [key, d] of [
        ['carrierHeight', ifs.carrierHeight],
        ['lowerArmInnerPivot.x', ifs.lowerArmInnerPivot.x],
        ['lowerArmInnerPivot.y', ifs.lowerArmInnerPivot.y],
        ['upperArmInnerPivot.x', ifs.upperArmInnerPivot.x],
        ['upperArmInnerPivot.y', ifs.upperArmInnerPivot.y],
        ['lowerBallJointHeight', ifs.lowerBallJointHeight],
        ['upperBallJointHeight', ifs.upperBallJointHeight],
        ['halfShaftDiameter', ifs.halfShaftDiameter]
      ] satisfies [string, Dimension][]) {
        if (!Number.isFinite(d.value)) issues.push(`ifs.${key} is not a finite number`);
        checkRefs(`ifs.${key}`, d.status, d.sourceIds);
      }
      if (ifs.upperBallJointHeight.value <= ifs.lowerBallJointHeight.value) {
        issues.push('upper ball joint must sit above the lower ball joint');
      }
      if (ifs.lowerArmInnerPivot.x.value >= we.wmsWidth.value / 2) {
        issues.push('lower arm pivot must be inboard of the wheel mounting surface');
      }
      if (cs.dropBelowCenterline.value <= -ifs.carrierHeight.value) {
        issues.push('housing low point must sit below the carrier center');
      }
    }
  } else if (axle.ifs) {
    issues.push('ifs geometry is only valid on an IFS axle');
  }
  if (axle.portal) {
    const portal = axle.portal;
    if (!(portal.drop.value > 0))
      issues.push('portal drop must be positive (wheel below the shaft)');
    if (portal.boxHeight.value <= portal.drop.value) {
      issues.push('portal box must be taller than the portal drop');
    }
    if (portal.boxWidth.value >= we.hubLength.value + 2) {
      issues.push(
        'portal box is thicker than the space between knuckle and wheel mounting surface'
      );
    }
  }
  return issues;
}
