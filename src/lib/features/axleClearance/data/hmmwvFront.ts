import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'amgeneral-m1097a2',
    title: 'AM General: M1097A2 HMMWV specifications sheet',
    kind: 'manufacturer',
    url: 'https://warwheels.net/images/M1097a2specsAMG.pdf',
    excerpt:
      'Ground Clearance 17 in. (0.43 m). Track Width 71.6 in (1.82 m). Axles: Hypoid, ratio of 2.73:1. Geared Hubs: Gear ratio 1.92:1. Differential: Torque biasing. Brakes: four wheel inboard mounted power disc. Suspension: Independent double A-frame with open end coil springs. Does not say where clearance is measured.'
  },
  {
    id: 'nf6x-m998',
    title: 'nf6x.net: owner write-up of an M998 HMMWV, with spec table',
    kind: 'community',
    url: 'https://www.nf6x.net/1999/12/m998-hmmwv/',
    excerpt:
      'Ground clearance: 16 in under axle, 24 in under chassis. Tires 36x12.5-16.5 LT. "The 4-wheel disc brakes are mounted inboard at the differentials." Does not name the manual the table came from.'
  },
  {
    id: 'military-com-hmmwv',
    title: 'Military.com: High Mobility Multipurpose Wheeled Vehicle (HMMWV)',
    kind: 'community',
    url: 'https://365.military.com/equipment/high-mobility-multipurpose-wheeled-vehicle-hmmwv',
    excerpt:
      'The geared hub assembly helps achieve 16 inches of ground clearance. Equipment overview page, not a technical manual.'
  },
  {
    id: 'allisons-hmmwv',
    title: 'allisons.org: HMMWV summary specifications (c. 1995)',
    kind: 'community',
    url: 'https://allisons.org/ll/4/Hummer/HMMWV/',
    excerpt:
      'Track 1.82 m / 1.82 m (71.6 in / 71.6 in), ground clearance 0.39 m (15 in). Secondary summary.'
  },
  {
    id: 'feltz-hmmwv-wheel',
    title: 'Feltz Tire: 12-bolt 16.5 x 8.25 steel HMMWV wheel',
    kind: 'supplier',
    url: 'https://feltztire.com/?p=268',
    excerpt:
      '16.5 x 8.25 two-piece steel HMMWV wheel, originally mounted on a 37x12.5R16.5LT on the HMMWV and M1101 trailer.'
  },
  {
    id: 'steelsoldiers-backspacing',
    title: 'Steel Soldiers forum: HMMWV wheel backspacing and bolt pattern',
    kind: 'community',
    url: 'https://steelsoldiers.com/goto/post?id=2528185',
    excerpt:
      'HMMWV wheels are 16.5x8.25 with a 7 in backspacing. Aftermarket wheels with the wrong offset stick out far. 8 on 6.5 bolt pattern discussed.'
  },
  {
    id: 'steelsoldiers-diff',
    title: 'Steel Soldiers forum: HMMWV differential ratios and type',
    kind: 'community',
    url: 'https://steelsoldiers.com/goto/post?id=2393942',
    excerpt:
      'Most HMMWV differentials are 2.56 or 2.73 and are AMC 20 based Torsen units. Some 3.08 sets use a thicker ring gear to fit the 2.73-and-down carrier.'
  },
  {
    id: 'offroad-h1-center-diff',
    title: 'Off-Road.com: Centering the front diff on a Hummer H1',
    kind: 'community',
    url: 'https://www.off-road.com/trucks-4x4/feature/centering-the-front-diff-on-a-hummer-h1-13373.html',
    excerpt:
      'The stock front differential is offset, so the driver side front half-shaft is the shortest. Three half-shaft lengths are needed on a stock HMMWV or H1; centering the front diff lets a rear half-shaft be used at all four corners. Read through a search summary; the article itself was paywalled.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with an AMC 20 size ring gear in a frame-mounted carrier, geared hubs, and a 37x12.50R16.5 tire. Must be measured on a real truck before being trusted.'
  }
];

const trackWidth = 71.6;
/** 7 in backspacing on a 8.25 in wheel (about 9.25 in over the flanges): 7 - 9.25 / 2. */
const wheelOffset = 7 - 9.25 / 2;
const wmsWidth = trackWidth + 2 * wheelOffset;

export const hmmwvFront: AxleConfiguration = {
  id: 'am-general-hmmwv-m998-geared-hub-front',
  name: 'AM General HMMWV (M998 family) geared-hub IFS front (1985–2026)',
  shortName: 'HMMWV geared hub front',
  group: 'AM General',
  manufacturer: 'AM General',
  vehicle: 'HMMWV M998 family and A1/A2 variants, civilian Hummer H1 (same layout)',
  years: { from: 1985, to: 2026 },
  kind: 'ifs',
  position: 'front',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        8.875,
        'community',
        ['steelsoldiers-diff'],
        'Owners describe the carrier as AMC 20 based, which is an 8-7/8 in ring gear. No AM General figure found. Shown dashed. It is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        3,
        'estimated',
        ['offroad-h1-center-diff', 'engineering-estimate'],
        'Driver side: the driver front half-shaft is the shortest of the three lengths. The 3 in amount is an estimate; no shaft lengths were found.'
      ),
      dropBelowCenterline: dim(
        37 / 2 - 16,
        'community',
        ['nf6x-m998', 'military-com-hmmwv', 'feltz-hmmwv-wheel'],
        'Wheel centerline to diff low point at ride height, derived as 18.5 in nominal radius of the 37 in stock tire minus 16 in "under axle" clearance = 2.5 in. The 16 in figure comes from secondary sources, and none of them shows the TM page or says whether it was loaded. AM General lists 17 in for the heavier M1097A2, which would give 1.5 in. A loaded tire makes the real drop smaller still.'
      ),
      riseAboveCenterline: dim(
        5.5,
        'schematic',
        ['engineering-estimate'],
        'Carrier top above the carrier center. Drawing only.'
      ),
      width: dim(
        12,
        'estimated',
        ['engineering-estimate'],
        'Carrier casting width with the inboard brake mounts trimmed off. Not published.'
      ),
      cover: {
        width: dim(10, 'estimated', ['engineering-estimate'], 'AMC 20 size cover. Not published.'),
        height: dim(10, 'estimated', ['engineering-estimate'], 'AMC 20 size cover. Not published.'),
        boltCount: 12,
        boltCircle: dim(9, 'schematic', ['engineering-estimate'], 'Drawing only.')
      },
      coverCenterHeight: dim(
        0,
        'estimated',
        ['engineering-estimate'],
        'Relative to the carrier center. Drawn concentric with the half-shaft axis.'
      )
    },
    tubes: {
      outerDiameter: dim(
        1.5,
        'estimated',
        ['engineering-estimate'],
        'No stub tube. This is the CV half-shaft diameter, used because the HMMWV carrier has none.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'ball-joint',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['amgeneral-m1097a2', 'steelsoldiers-backspacing'],
        'Computed as 71.6 in track + 2 x 2.375 in wheel offset = 76.35 in. The offset comes from a forum figure of 7 in backspacing, so this is only as good as that figure.'
      ),
      cEndWidth: dim(2.5, 'schematic', ['engineering-estimate'], 'Knuckle boss. Drawing only.'),
      pivotSpan: dim(10, 'schematic', ['engineering-estimate'], 'Upper to lower ball joint.'),
      knuckleWidth: dim(4.5, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(7, 'schematic', ['engineering-estimate']),
      hubLength: dim(5, 'schematic', ['engineering-estimate']),
      boltPattern: '8x6.5 in (8x165.1 mm)'
    }
  },
  wheel: {
    diameter: dim(16.5, 'verified', ['feltz-hmmwv-wheel']),
    width: dim(
      8.25,
      'verified',
      ['feltz-hmmwv-wheel'],
      'Two-piece steel wheel with a run-flat insert.'
    ),
    offset: dim(
      wheelOffset,
      'community',
      ['steelsoldiers-backspacing'],
      '7 in backspacing minus half of a 9.25 in flange-to-flange width = 2.375 in. Forum figure.'
    ),
    trackWidth: dim(
      trackWidth,
      'verified',
      ['amgeneral-m1097a2', 'allisons-hmmwv'],
      '71.6 in (1.82 m) front and rear. The AM General sheet is for the M1097A2; earlier M998 summaries give the same track.'
    )
  },
  ifs: {
    carrierHeight: dim(
      3.5,
      'estimated',
      ['engineering-estimate'],
      'The geared hub lets the half-shafts enter above the wheel centerline, and the diff sits up with them. Not published.'
    ),
    lowerArmInnerPivot: {
      x: dim(14, 'schematic', ['engineering-estimate'], 'Drawing only.'),
      y: dim(0, 'schematic', ['engineering-estimate'])
    },
    upperArmInnerPivot: {
      x: dim(16, 'schematic', ['engineering-estimate'], 'Drawing only.'),
      y: dim(10, 'schematic', ['engineering-estimate'])
    },
    lowerBallJointHeight: dim(-1, 'schematic', ['engineering-estimate']),
    upperBallJointHeight: dim(9, 'schematic', ['engineering-estimate']),
    halfShaftDiameter: dim(1.5, 'estimated', ['engineering-estimate'], 'Not published.')
  },
  portal: {
    drop: dim(
      4,
      'estimated',
      ['engineering-estimate'],
      'Input to output gear center distance of the geared hub. No AM General or supplier figure found. Only used to place the hub box and half-shaft in the drawing; on this IFS front it does not enter the clearance math.'
    ),
    boxWidth: dim(4, 'schematic', ['engineering-estimate'], 'Drawing only.'),
    boxHeight: dim(9.5, 'schematic', ['engineering-estimate'], 'Drawing only.'),
    reductionRatio: 1.92
  },
  facts: [
    {
      label: 'Geared hub reduction',
      value: '1.92:1',
      status: 'verified',
      sourceIds: ['amgeneral-m1097a2']
    },
    {
      label: 'Differential',
      value: 'Torque-biasing (Torsen) hypoid, 2.73:1 standard; 2.56 and 3.08 also seen',
      status: 'verified',
      sourceIds: ['amgeneral-m1097a2', 'steelsoldiers-diff']
    },
    {
      label: 'Brakes',
      value: 'Inboard discs on the differential housings, front and rear',
      status: 'verified',
      sourceIds: ['amgeneral-m1097a2', 'nf6x-m998']
    },
    {
      label: 'Published ground clearance',
      value:
        '16 in under axle (M998, secondary sources); 17 in (M1097A2, AM General). No source found states the TM measuring point.',
      status: 'community',
      sourceIds: ['nf6x-m998', 'military-com-hmmwv', 'amgeneral-m1097a2']
    },
    {
      label: 'Pumpkin side',
      value: 'Front diff offset to the driver side; three half-shaft lengths on a stock truck',
      status: 'community',
      sourceIds: ['offroad-h1-center-diff']
    },
    {
      label: 'Stock tire',
      value: '37x12.50R16.5LT on a 16.5x8.25 two-piece wheel',
      status: 'verified',
      sourceIds: ['feltz-hmmwv-wheel']
    },
    {
      label: 'Bolt pattern',
      value: '8x6.5 in (8x165.1 mm)',
      status: 'community',
      sourceIds: ['steelsoldiers-backspacing']
    }
  ],
  sources,
  notes: [
    'The diff hangs from the frame, so the drop here is measured from the wheel centerline at stock ride height. The geared-hub drop only places the drawing and does not add to the clearance.',
    'The 2.5 in drop is worked back from a 16 in "under axle" clearance on the 37 in stock tire. Copies of the TM 9-2320-280-10 table were not found, so the measuring point and load state are not confirmed. Measure before trusting it.',
    'The rear uses the same layout: frame-mounted Torsen diff, inboard brakes, CV half-shafts and 1.92:1 geared hubs.',
    'Wheel offset comes from a forum backspacing figure. The 71.6 in track is an AM General number, so the tire placement is good even if the WMS is not.',
    'Few civilian tires fit the 16.5 in stock wheel. Many owners swap to 17 in wheels, which changes the offset and the track.'
  ]
};
