import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'usastandard-ifs75-4cyl-kit',
    title: 'USA Standard Gear: master overhaul kit, Toyota 7.5 in IFS, four cylinder only',
    kind: 'supplier',
    url: 'https://www.completewebsol.com/product/toyota-master-overhaul-kit-full-toyota-75-inch-ifs-differential-four-cylinder-only-usa',
    excerpt:
      'Fits standard rotation Toyota 7.5 inch front with 4 cylinder engine. Ring Gear Rotation: Standard. Fits 1986-1995 Toyota Pickup, 1986-1995 Toyota 4Runner.'
  },
  {
    id: 'usastandard-ifs75-v6-kit',
    title: 'USA Standard Gear: master overhaul kit, Toyota 7.5 in IFS, V6',
    kind: 'supplier',
    url: 'https://completewebsol.com/product/toyota-master-overhaul-kit-full-toyota-75-inch-ifs-differential-v6-usa-standard-gear',
    excerpt:
      'Toyota 7.5 Inch IFS Differential V6. Ring Gear Rotation: Reverse. Fits 1986-1995 Toyota Pickup, 1986-1995 Toyota 4Runner, 1993-1998 Toyota T100.'
  },
  {
    id: 'nitro-75-411',
    title: 'Nitro Gear & Axle: Toyota 7.5 in 4.11 ring and pinion (Suspension Connection listing)',
    kind: 'supplier',
    url: 'https://suspensionconnection.com/toyota-7-5-inch-4-11-ratio-ring-and-pinion-nitro-gear-and-axle',
    excerpt: 'Toyota 7.5 in. 23 spline pinion, 10 ring gear bolts (sold separately).'
  },
  {
    id: 'rme-ifs75-listing',
    title: 'RME4x4 forum: 4.70 front 7.5 in differential for 86-95 IFS trucks, 4Runner and T100s',
    kind: 'community',
    url: 'https://rme4x4.com/threads/4-70-front-7-5-differential-for-86-95-ifs-trucks-4runner-and-t-100s.106147/post-1009008',
    excerpt:
      "'86-95 IFS trucks and 4Runners, and all '93-98 T100s use a 7.5\" front diff that is offset to the passenger's side. ADD and non-ADD diffs are swappable. Low pinion, passenger's side drop, 27 spline axles."
  },
  {
    id: 'wheelsize-1990-4runner',
    title: 'Wheel-Size.com: 1990 Toyota 4Runner fitment',
    kind: 'community',
    url: 'https://www.wheel-size.com/size/toyota/4runner/1990/',
    excerpt:
      'OE tire 225/75R15 on 6J x 15 ET0 (offset range -2 to 2 mm). Aggregated database, not a Toyota document.'
  },
  {
    id: 'carsguide-1990-4runner',
    title: 'CarsGuide Australia: 1990 Toyota 4Runner 4x4 Deluxe and SR5 specifications',
    kind: 'community',
    url: 'https://www.carsguide.com.au/toyota/4runner/price/1990/sr5',
    excerpt:
      'Front track 1430 mm. Ground clearance unladen 210 mm. Australian-market data aggregator, 2.4 L and 2.8 L diesel models, not a Toyota document.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with a 7.5 in ring gear in a frame-mounted carrier and a stock 225/75R15 tire. Must be measured on a real truck before being trusted.'
  }
];

const trackWidth = 1430 * MM;
const wheelOffset = 0 * MM;
const wmsWidth = trackWidth + 2 * wheelOffset;

export const toyotaIfs75Front: AxleConfiguration = {
  id: 'toyota-pickup-4runner-ifs-7-5-front-1986-1995',
  name: 'Toyota Pickup / 4Runner IFS 7.5 in front (1986–1995)',
  shortName: 'Toyota IFS 7.5 front',
  group: 'Toyota',
  manufacturer: 'Toyota',
  vehicle: 'Toyota Pickup 4x4 (1986–1995) and 4Runner 4x4 (1986–1995) with IFS',
  years: { from: 1986, to: 1995 },
  kind: 'ifs',
  position: 'front',
  housing: {
    centerSection: {
      style: 'third-member',
      ringGearDiameter: dim(
        7.5,
        'verified',
        ['usastandard-ifs75-4cyl-kit', 'usastandard-ifs75-v6-kit', 'nitro-75-411'],
        'Shown dashed. Both engines use a 7.5 in ring gear. The 4-cylinder is standard rotation, the V6 is reverse rotation.'
      ),
      offsetFromVehicleCenter: dim(
        -3,
        'estimated',
        ['rme-ifs75-listing', 'engineering-estimate'],
        'Passenger side, per a seller listing on RME4x4. The amount is an estimate: no published figure for the carrier offset was found. Measure from the frame centerline to the carrier center.'
      ),
      dropBelowCenterline: dim(
        4.0,
        'estimated',
        ['engineering-estimate'],
        'Wheel centerline to the lowest point of the carrier at stock ride height. Estimated as 3.75 in ring gear radius plus about 1.25 in of casting and oil space below the carrier center, minus the carrier sitting about 1 in above the wheel centerline. Not published. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        4.75,
        'schematic',
        ['engineering-estimate'],
        'Carrier top above the carrier center. Drawing only.'
      ),
      width: dim(
        11,
        'estimated',
        ['engineering-estimate'],
        'Carrier casting width seen from the front, not counting the side tube. Not published.'
      ),
      cover: {
        width: dim(
          9,
          'estimated',
          ['engineering-estimate'],
          'Closed cast front of the carrier. No bolt-on cover faces forward. No published size.'
        ),
        height: dim(
          9,
          'estimated',
          ['engineering-estimate'],
          'Closed cast front of the carrier. No published size.'
        ),
        boltCount: 0,
        boltCircle: dim(0, 'schematic', ['engineering-estimate'], 'Closed casting, no bolts.')
      },
      coverCenterHeight: dim(
        0,
        'estimated',
        ['engineering-estimate'],
        'Relative to the carrier center. The ring gear turns on the half-shaft axis, so the dome is drawn concentric with it.'
      )
    },
    tubes: {
      outerDiameter: dim(
        3.0,
        'estimated',
        ['engineering-estimate', 'rme-ifs75-listing'],
        'The bolt-on side tube (ADD or non-ADD) that carries the driver-side output, since the carrier sits toward the passenger side. Diameter not published; estimated from its 50 mm class bearing and seal.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'ball-joint',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['carsguide-1990-4runner', 'wheelsize-1990-4runner'],
        'Computed as 1430 mm track + 2 x 0 mm OE offset = 56.30 in. Both inputs are aggregator figures, so this is no better than community grade.'
      ),
      cEndWidth: dim(2.5, 'schematic', ['engineering-estimate'], 'Knuckle boss. Drawing only.'),
      pivotSpan: dim(
        9.5,
        'schematic',
        ['engineering-estimate'],
        'Upper to lower ball joint. Drawing only.'
      ),
      knuckleWidth: dim(4, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(5, 'schematic', ['engineering-estimate']),
      hubLength: dim(4, 'schematic', ['engineering-estimate']),
      boltPattern: '6x139.7 mm (6x5.5 in)'
    }
  },
  wheel: {
    diameter: dim(15, 'community', ['wheelsize-1990-4runner']),
    width: dim(
      6,
      'community',
      ['wheelsize-1990-4runner'],
      'Base steel wheel. Many trucks had 15x7 options.'
    ),
    offset: dim(
      wheelOffset,
      'community',
      ['wheelsize-1990-4runner'],
      'ET0 for the 15x6 OE wheel. Aggregated database figure.'
    ),
    trackWidth: dim(
      trackWidth,
      'community',
      ['carsguide-1990-4runner'],
      '1430 mm from Australian-market 1990 4Runner 4x4 listings. No US Toyota brochure figure was found.'
    )
  },
  ifs: {
    carrierHeight: dim(
      1.0,
      'estimated',
      ['engineering-estimate'],
      'Carrier center sits a little above the wheel centerline at stock height, so the half shafts run slightly downhill to the hubs. Not published.'
    ),
    lowerArmInnerPivot: {
      x: dim(12, 'schematic', ['engineering-estimate'], 'Under the frame rail. Drawing only.'),
      y: dim(-3, 'schematic', ['engineering-estimate'])
    },
    upperArmInnerPivot: {
      x: dim(
        15,
        'schematic',
        ['engineering-estimate'],
        'Upper arm is shorter than the lower. Drawing only.'
      ),
      y: dim(7.5, 'schematic', ['engineering-estimate'])
    },
    lowerBallJointHeight: dim(-4, 'schematic', ['engineering-estimate']),
    upperBallJointHeight: dim(5.5, 'schematic', ['engineering-estimate']),
    halfShaftDiameter: dim(
      1.1,
      'estimated',
      ['engineering-estimate'],
      'CV half-shaft bar. Boots are much larger. Not published.'
    ),
    lowerArmLowPoint: dim(
      -4.5,
      'estimated',
      ['engineering-estimate'],
      'Underside of the lower control arm near its inner pivots. On these trucks the arms and the crossmember hang about as low as the diff, so the diff is often not the first thing to hit. Measure yours.'
    )
  },
  facts: [
    {
      label: 'Pumpkin side',
      value: 'Passenger side, with a bolt-on side tube to the driver side',
      status: 'community',
      sourceIds: ['rme-ifs75-listing']
    },
    {
      label: 'Ring gear',
      value: '7.5 in, 10 ring gear bolts',
      status: 'verified',
      sourceIds: ['nitro-75-411', 'usastandard-ifs75-v6-kit']
    },
    {
      label: 'Rotation by engine',
      value:
        '4-cylinder standard rotation (low pinion); V6 reverse rotation. Gears do not interchange.',
      status: 'verified',
      sourceIds: ['usastandard-ifs75-4cyl-kit', 'usastandard-ifs75-v6-kit']
    },
    {
      label: 'Pinion spline',
      value: '23',
      status: 'verified',
      sourceIds: ['nitro-75-411']
    },
    {
      label: 'Side gear spline',
      value: '27',
      status: 'community',
      sourceIds: ['rme-ifs75-listing']
    },
    {
      label: 'Housing style',
      value:
        'One-piece cast carrier bolted to the frame, removed and swapped as a unit, with no bolt-on cover facing forward. Modeled as third-member.',
      status: 'estimated',
      sourceIds: ['rme-ifs75-listing', 'engineering-estimate']
    },
    {
      label: 'Axle disconnect',
      value: 'ADD (vacuum axle disconnect) and non-ADD carriers exist and swap',
      status: 'community',
      sourceIds: ['rme-ifs75-listing']
    },
    {
      label: 'Bolt pattern',
      value: '6x139.7 mm (6x5.5 in)',
      status: 'community',
      sourceIds: ['wheelsize-1990-4runner']
    }
  ],
  sources,
  notes: [
    'This is an independent front: the diff bolts to the frame, so its height above the ground changes with tire size and lift, not with suspension travel. A lift kit without a diff drop raises it; a diff drop kit lowers it.',
    'The 7.5 in ring gear and the 4-cylinder versus V6 rotation split come from gear suppliers. The carrier offset, the drop and every linkage point are estimates or drawing-only shapes.',
    'Wheel centerline to diff low point is not published. Measure from the hub center down to the lowest point of the carrier at ride height and calibrate.',
    'The lower control arms and the front crossmember can sit as low as the diff, so the diff may not set front clearance on its own.',
    'Track and wheel offset come from aggregator listings, not a Toyota brochure. Treat wheel placement as good to about an inch.'
  ]
};
