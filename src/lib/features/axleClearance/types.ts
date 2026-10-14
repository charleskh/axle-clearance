/**
 * Domain model for axle ground-clearance comparison.
 *
 * Every length is in inches. Nothing in this module knows about SVG or Svelte;
 * the renderer consumes these types and converts inches to drawing units.
 *
 * Coordinate convention for stored data, independent of how it is drawn:
 *   x: inches from the vehicle centerline, positive toward the vehicle's
 *      DRIVER side (left-hand-drive vehicle).
 *   y: inches relative to the axle centerline, positive up.
 *
 * The renderer draws each axle from the side its cover faces: a front axle
 * from ahead of the vehicle (driver side on the viewer's right) and a rear
 * axle from behind (driver side on the viewer's left).
 */

/**
 * How much a stored number can be trusted.
 *
 *  verified   published by the manufacturer or a reputable drivetrain supplier
 *  derived    computed from verified numbers (the math is shown in `note`)
 *  community  measured by owners and reported publicly, not a manufacturer value
 *  estimated  engineering estimate; must be measured before it is trusted
 *  schematic  drawing-only shape; never used in a clearance calculation
 */
export type VerificationStatus = 'verified' | 'derived' | 'community' | 'estimated' | 'schematic';

export type SourceKind = 'manufacturer' | 'supplier' | 'community' | 'engineering';

export interface MeasurementSource {
  id: string;
  title: string;
  kind: SourceKind;
  url?: string;
  /** What the source actually says, quoted or closely paraphrased. */
  excerpt?: string;
}

/** A single physical dimension with its provenance. */
export interface Dimension {
  /** Inches. */
  value: number;
  status: VerificationStatus;
  /** Ids into the configuration's `sources` list. */
  sourceIds: string[];
  note?: string;
}

/** A non-dimensional specification, such as spline count or pinion position. */
export interface AxleFact {
  label: string;
  value: string;
  status: VerificationStatus;
  sourceIds: string[];
}

/**
 * solid  beam axle: housing and tubes move with the wheels
 * ifs    independent front: the diff hangs from the frame
 * Either can add portal (geared) hubs with `portal`.
 */
export type AxleKind = 'solid' | 'ifs';

/**
 * integral      carrier is part of the housing; a bolt-on cover closes the back
 *               (Dana, Sterling, AAM).
 * third-member  drop-out carrier bolts in from the pinion side; the back of the
 *               housing is a closed, welded dome (Toyota, Suzuki, Ford 9 in).
 */
export type HousingStyle = 'integral' | 'third-member';

/**
 * The face seen from the cover side. On an integral housing it is the bolt-on
 * cover. On a third-member housing it is the welded rear dome, with no bolts.
 */
export interface CoverGeometry {
  width: Dimension;
  height: Dimension;
  /** 0 for a welded dome. */
  boltCount: number;
  /** Bolt path width, inset from the cover edge. Ignored when boltCount is 0. */
  boltCircle: Dimension;
}

/** The differential center section, as seen from the cover side. */
export interface CenterSectionGeometry {
  style: HousingStyle;
  /** Ring gear diameter. NOT the drop below centerline; kept for reference only. */
  ringGearDiameter: Dimension;
  /**
   * x of the ring gear / cover center from the vehicle centerline.
   * Positive = driver side, negative = passenger side.
   */
  offsetFromVehicleCenter: Dimension;
  /** Vertical distance from axle centerline down to the lowest point of the housing. */
  dropBelowCenterline: Dimension;
  /** Highest point of the center section above axle centerline. */
  riseAboveCenterline: Dimension;
  /** Overall width of the center section casting. */
  width: Dimension;
  cover: CoverGeometry;
  /** Cover (or dome) center height relative to the axle centerline. */
  coverCenterHeight: Dimension;
}

export interface TubeGeometry {
  outerDiameter: Dimension;
}

/**
 * Steering wheel end on a front axle.
 *
 * ball-joint      open knuckle on upper and lower ball joints (most Dana 30/44/60 since the 1970s)
 * kingpin         open knuckle on tapered-bearing kingpins (kingpin Dana 60)
 * closed-knuckle  sealed spherical knuckle ball around a Birfield joint (Toyota, Suzuki, early Dana)
 */
export interface SteerWheelEnd {
  kind: 'steer';
  knuckle: 'ball-joint' | 'kingpin' | 'closed-knuckle';
  /** Wheel mounting surface to wheel mounting surface. */
  wmsWidth: Dimension;
  /** Inner C-end width, measured from the tube end outward. For a closed knuckle, the tube flange. */
  cEndWidth: Dimension;
  /** Vertical span between the steering pivots (ball joints or kingpins). */
  pivotSpan: Dimension;
  /** Knuckle body width. For a closed knuckle, the knuckle ball diameter. */
  knuckleWidth: Dimension;
  /** Hub or unit bearing outer diameter. */
  hubDiameter: Dimension;
  /** Distance from the knuckle face out to the wheel mounting surface. */
  hubLength: Dimension;
  boltPattern: string;
}

/**
 * Non-steering wheel end on a rear axle.
 *
 * semi-float  axle shaft carries the wheel; flange at the shaft end
 * full-float  hub rides on bearings on the housing spindle; shaft only drives
 */
export interface RearWheelEnd {
  kind: 'rear';
  floating: 'semi-float' | 'full-float';
  wmsWidth: Dimension;
  /** Brake drum or rotor diameter. */
  brakeDiameter: Dimension;
  /** Housing end flange (backing plate mount) diameter. */
  flangeDiameter: Dimension;
  /** Hub or axle flange outer diameter. */
  hubDiameter: Dimension;
  /** Distance from the housing end flange out to the wheel mounting surface. */
  hubLength: Dimension;
  boltPattern: string;
}

export type WheelEndGeometry = SteerWheelEnd | RearWheelEnd;

/** Wheel used to place the tire relative to the wheel mounting surface. */
export interface WheelSpec {
  diameter: Dimension;
  width: Dimension;
  /**
   * Wheel offset: distance from the wheel's centerline to its mounting surface.
   * Positive puts the mounting surface outboard of the wheel centerline, which
   * pulls the tire inboard.
   */
  offset: Dimension;
  /** Track width (wheel centerline to wheel centerline) with this wheel. */
  trackWidth: Dimension;
}

export interface HousingGeometry {
  centerSection: CenterSectionGeometry;
  /**
   * Axle tubes on a solid axle. On an IFS front this is the stub tube or
   * carrier extension that holds the passenger-side output, if any; set
   * `outerDiameter` to the CV half-shaft diameter when there is none.
   */
  tubes: TubeGeometry;
  wheelEnds: WheelEndGeometry;
}

/**
 * Portal (geared) hub at each wheel end: a drop box whose input gear sits on
 * the axle shaft and whose output gear drives the wheel, lower down.
 *
 * On a solid axle the wheel centerline sits `drop` below the axle tube
 * centerline, so the whole housing rides `drop` higher than on a conventional
 * axle with the same tire:
 *
 *   axleCenterlineHeight = effectiveTireRadius + drop
 *   differentialClearance = axleCenterlineHeight - dropBelowCenterline
 *
 * On an IFS front with portal hubs (Humvee), the diff hangs from the frame and
 * its drop is already measured from the wheel centerline, so `drop` only
 * positions the half-shaft and box in the drawing; the clearance math is
 * unchanged.
 */
export interface PortalGeometry {
  /** Input (axle shaft) centerline to output (wheel) centerline, positive = wheel below. */
  drop: Dimension;
  /** Portal box thickness along the axle, as seen in elevation. */
  boxWidth: Dimension;
  /** Portal box height; must exceed `drop`. */
  boxHeight: Dimension;
  /** Hub reduction ratio, e.g. 1.92, if known. Display only. */
  reductionRatio?: number;
}

/**
 * Independent front suspension linkage, present when `kind` is 'ifs'.
 *
 * The differential is bolted to the frame, not carried on the wheels, so its
 * height is fixed relative to the wheel centerline at stock ride height. That
 * is why `centerSection.dropBelowCenterline` is still measured from the wheel
 * centerline: on an IFS front it is "wheel centerline to lowest point of the
 * diff housing at ride height". A lift kit that drops the diff changes it.
 *
 * The other center-section fields (riseAboveCenterline, coverCenterHeight)
 * are relative to the carrier center on an IFS front, since the housing is
 * drawn around it.
 *
 * Pivot x values are magnitudes from the vehicle centerline (both sides
 * mirror); y values are relative to the wheel centerline, positive up.
 */
export interface IfsGeometry {
  /** Diff carrier center (ring gear axis) height relative to the wheel centerline. */
  carrierHeight: Dimension;
  lowerArmInnerPivot: { x: Dimension; y: Dimension };
  upperArmInnerPivot: { x: Dimension; y: Dimension };
  /** Lower ball joint height relative to the wheel centerline (negative = below). */
  lowerBallJointHeight: Dimension;
  /** Upper ball joint height relative to the wheel centerline. */
  upperBallJointHeight: Dimension;
  /** CV half-shaft outer diameter, drawn between the carrier and the hub. */
  halfShaftDiameter: Dimension;
  /** Lowest point of the lower control arm relative to the wheel centerline, if known. */
  lowerArmLowPoint?: Dimension;
}

export interface AxleConfiguration {
  id: string;
  name: string;
  shortName: string;
  /** Grouping for the axle picker, e.g. "Ford", "Jeep", "Toyota". */
  group: string;
  manufacturer: string;
  vehicle: string;
  years: { from: number; to: number };
  kind: AxleKind;
  position: 'front' | 'rear';
  housing: HousingGeometry;
  /** Reference wheel used to position tires. */
  wheel: WheelSpec;
  /** Present only on an IFS front. */
  ifs?: IfsGeometry;
  /** Present when the wheel ends are portal (geared) hubs. */
  portal?: PortalGeometry;
  /** Non-dimensional specifications: splines, ring gear bolts, pinion position. */
  facts: AxleFact[];
  sources: MeasurementSource[];
  /** Plain-language caveats shown with the data. */
  notes: string[];
}

export interface TireSpec {
  /** Nominal (advertised) overall diameter. */
  nominalDiameter: number;
  /** Nominal section width, used for drawing only. */
  sectionWidth: number;
  /** Label such as 37x12.50. */
  label: string;
}

/** User-adjustable inputs that change the calculation. */
export interface ClearanceSettings {
  /** Inches the loaded radius sits below the nominal radius. 0 = nominal theory. */
  loadedRadiusDeflection: number;
  /** Axle centerline to lowest housing point, in inches. */
  housingDrop: number;
  /** True when `housingDrop` came from the user rather than the axle data. */
  housingDropCalibrated: boolean;
}

export interface ClearanceResult {
  tire: TireSpec;
  /** Nominal diameter / 2 - loaded deflection: the wheel centerline height above ground. */
  effectiveTireRadius: number;
  /** Height of the housing's reference centerline: the radius, plus the portal drop on a solid portal axle. */
  axleCenterlineHeight: number;
  /** Axle centerline height minus housing drop. */
  differentialClearance: number;
  housingDrop: number;
  /** Trust level of `differentialClearance` as an absolute number. */
  clearanceStatus: VerificationStatus | 'calibrated';
}

export interface ClearanceComparison {
  baseline: ClearanceResult;
  selected: ClearanceResult;
  /** True when both sides are the same axle. */
  sameAxle: boolean;
  diameterDelta: number;
  /** Selected clearance minus baseline clearance. */
  clearanceDelta: number;
  /**
   * 'exact' when the housing drops cancel (same axle, same drop, same
   * deflection), so the change holds even if the drop itself is unverified.
   * Otherwise the weaker of the two absolute clearance statuses.
   */
  deltaStatus: 'exact' | ClearanceResult['clearanceStatus'];
}
