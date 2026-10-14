import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'usastandard-75-reverse',
    title: 'USA Standard Gear: Toyota 7.5 in reverse rotation ring and pinion, 4.56 to 5.29',
    kind: 'supplier',
    url: 'https://completewebsol.com/product/toyota-ring-and-pinion-gear-set-toyota-75-inch-reverse-rotation-456-529-ratio-usa-standard',
    excerpt:
      '7.50 Inch Ring Gear Diameter. 23 spline pinion. 10 Ring Gear Bolts. Ring Gear Rotation: Reverse. Front, 4WD: 1995-2002 4Runner, 1995-2004 Tacoma, 2000-2006 Tundra, 2001-2007 Sequoia.'
  },
  {
    id: 'toyota-41101-35131',
    title: 'Toyota OEM parts catalog: 41101-35131 Carrier Sub-Assy, Differential, Front',
    kind: 'manufacturer',
    url: 'https://www.toyotapartsdeal.com/oem/toyota~carrier~sub~assy~differential~front~41101-35131.html',
    excerpt:
      'Carrier Sub-Assy, Differential, Front. Fits 1996-2002 4Runner (2.7L 4 cyl, 3.4L 6 cyl) and 1995-2004 Tacoma (2.7L 4 cyl, 3.4L 6 cyl), also Tundra and Sequoia.'
  },
  {
    id: 'revolution-tacoma',
    title: 'Revolution Gear: Tacoma parts by vehicle',
    kind: 'supplier',
    url: 'https://revolutiongear.com/shop-by-vehicle/tacoma-parts/',
    excerpt:
      'First generation Tacoma with open differentials have a 30 spline 7.5" front ring and pinion and a 27 spline 8.4" rear. Also lists a 1996-2004 Tacoma 7.5" IFS locker with 27 spline axles.'
  },
  {
    id: 'cv-axle-listing',
    title:
      'Aftermarket CV axle listing: 1996-2002 4Runner 4WD and 1995-2004 Tacoma 4WD, driver or passenger',
    kind: 'community',
    url: 'https://comeduc.cl/products/front-driver-or-passenger-side-cv-axle-drive-shaft-assembly/229514708/',
    excerpt:
      'Fits driver and passenger side. Compressed length 24 1/4 in. Inner spline 27, outer spline 30. Reseller listing, not a Toyota document.'
  },
  {
    id: 'cararac-4runner',
    title: 'Cararac: Toyota 4Runner 1999-2002 technical specifications',
    kind: 'community',
    url: 'https://cararac.com/spec/toyota/4runner/suv-1999/',
    excerpt:
      'Front track 1505 mm (59.3 in). Rear track 1495-1510 mm. Aggregator, not a Toyota document.'
  },
  {
    id: 'wheelsize-1998-tacoma',
    title: 'Wheel-Size.com: 1998 Toyota Tacoma fitment',
    kind: 'community',
    url: 'https://www.wheel-size.com/size/toyota/tacoma/1998/',
    excerpt:
      '4x4 1995-2000: OE 225/75R15 on 6Jx15 ET10, or 31x10.50R15LT on 7Jx15 ET15. Aggregated database.'
  },
  {
    id: 'carscom-1998-tacoma',
    title: 'Cars.com: 1998 Toyota Tacoma XtraCab V6 Auto 4WD Limited specs',
    kind: 'community',
    url: 'https://cars.com/research/toyota-tacoma-1998/specs/105819/',
    excerpt:
      'Ground clearance, front: 11 in. Ground clearance, rear: 11 in. Tires P225/75R15, wheels 15 x 6 in. Does not say where clearance was measured.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with a 7.5 in ring gear in a frame-mounted carrier and a stock 225/75R15 tire. Must be measured on a real truck before being trusted.'
  }
];

const trackWidth = 1505 * MM;
const wheelOffset = 10 * MM;
const wmsWidth = trackWidth + 2 * wheelOffset;

export const toyotaTacomaIfsFront: AxleConfiguration = {
  id: 'toyota-tacoma-4runner-ifs-7-5-front-1995-2004',
  name: 'Toyota Tacoma / 4Runner IFS 7.5 in front (1995.5–2004)',
  shortName: 'Tacoma IFS 7.5 front',
  group: 'Toyota',
  manufacturer: 'Toyota',
  vehicle: 'Toyota Tacoma 4x4 (1995.5–2004) and 4Runner 4x4 (1996–2002), 2.7 L and 3.4 L',
  years: { from: 1995, to: 2004 },
  kind: 'ifs',
  position: 'front',
  housing: {
    centerSection: {
      style: 'third-member',
      ringGearDiameter: dim(
        7.5,
        'verified',
        ['usastandard-75-reverse', 'toyota-41101-35131'],
        'Shown dashed. The V6 does not get an 8 in front: Toyota lists one front carrier for both the 2.7 L and the 3.4 L, and gear suppliers sell a 7.5 in reverse-rotation set for it.'
      ),
      offsetFromVehicleCenter: dim(
        3.5,
        'estimated',
        ['engineering-estimate', 'cv-axle-listing'],
        'Side NOT confirmed by a source. Drawn on the driver side with a long tube to the passenger side, following owner references to a right-hand tube bearing and seal. Left and right CV shafts are the same part, so the tube makes up the whole offset. Check under your truck.'
      ),
      dropBelowCenterline: dim(
        3.5,
        'estimated',
        ['engineering-estimate', 'carscom-1998-tacoma'],
        'Wheel centerline to the carrier low point at stock ride height. Geometry gives about 3.75 in ring gear radius plus 0.75 in of casting below the carrier center, minus about 1 in of carrier height, so 3.5 in. A listing of 11 in front clearance on P225/75R15 (14.14 in radius) would imply 3.1 in, but it does not say what it measured. Measure before trusting.'
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
          8.5,
          'estimated',
          ['engineering-estimate'],
          'Closed cast front of the carrier. No bolt-on cover faces forward. No published size.'
        ),
        height: dim(
          8.5,
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
        'Relative to the carrier center. Drawn concentric with the half-shaft axis.'
      )
    },
    tubes: {
      outerDiameter: dim(
        3.0,
        'estimated',
        ['engineering-estimate'],
        'The bolt-on side tube (ADD or non-ADD) that holds the intermediate shaft. Diameter not published.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'ball-joint',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['cararac-4runner', 'wheelsize-1998-tacoma'],
        'Computed as 1505 mm track + 2 x 10 mm OE offset = 1525 mm (60.04 in). The track is a 1999-2002 4Runner figure; the Tacoma 4x4 shares the front suspension, but no Tacoma track was found.'
      ),
      cEndWidth: dim(2.5, 'schematic', ['engineering-estimate'], 'Knuckle boss. Drawing only.'),
      pivotSpan: dim(
        10,
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
    diameter: dim(15, 'community', ['wheelsize-1998-tacoma', 'carscom-1998-tacoma']),
    width: dim(
      6,
      'community',
      ['wheelsize-1998-tacoma', 'carscom-1998-tacoma'],
      'Base wheel. TRD and 31 in tire packages used 15x7 ET15.'
    ),
    offset: dim(
      wheelOffset,
      'community',
      ['wheelsize-1998-tacoma'],
      'ET10 for the 15x6 OE wheel. Aggregated database figure.'
    ),
    trackWidth: dim(
      trackWidth,
      'community',
      ['cararac-4runner'],
      '1505 mm, from a 1999-2002 4Runner listing. Used for the Tacoma 4x4 as well.'
    )
  },
  ifs: {
    carrierHeight: dim(
      1.0,
      'estimated',
      ['engineering-estimate'],
      'Carrier center a little above the wheel centerline at stock height. Not published.'
    ),
    lowerArmInnerPivot: {
      x: dim(12, 'schematic', ['engineering-estimate'], 'Under the frame rail. Drawing only.'),
      y: dim(-3, 'schematic', ['engineering-estimate'])
    },
    upperArmInnerPivot: {
      x: dim(
        15.5,
        'schematic',
        ['engineering-estimate'],
        'Upper arm is shorter than the lower. Drawing only.'
      ),
      y: dim(8, 'schematic', ['engineering-estimate'])
    },
    lowerBallJointHeight: dim(-4, 'schematic', ['engineering-estimate']),
    upperBallJointHeight: dim(6, 'schematic', ['engineering-estimate']),
    halfShaftDiameter: dim(
      1.1,
      'estimated',
      ['engineering-estimate', 'cv-axle-listing'],
      'CV half-shaft bar (27 spline inner, 30 spline outer). Boots are much larger. Not published.'
    ),
    lowerArmLowPoint: dim(
      -4.5,
      'estimated',
      ['engineering-estimate'],
      'Underside of the lower control arm near its inner pivots. The arms and the front crossmember hang about as low as the diff on these trucks. Measure yours.'
    )
  },
  facts: [
    {
      label: 'Ring gear',
      value: '7.5 in, 10 ring gear bolts, reverse rotation (high pinion), both 2.7 L and 3.4 L',
      status: 'verified',
      sourceIds: ['usastandard-75-reverse', 'toyota-41101-35131']
    },
    {
      label: 'Pinion spline',
      value: '23',
      status: 'verified',
      sourceIds: ['usastandard-75-reverse']
    },
    {
      label: 'Side gear spline',
      value:
        '27 per supplier locker fitment, but the same supplier page also says 30. Count yours.',
      status: 'estimated',
      sourceIds: ['revolution-tacoma']
    },
    {
      label: 'CV shafts',
      value: 'Same part both sides, 27 spline inner, 30 spline outer, 24-1/4 in compressed',
      status: 'community',
      sourceIds: ['cv-axle-listing']
    },
    {
      label: 'Housing style',
      value:
        'One cast carrier bolted to the frame and sold by Toyota as a single carrier sub-assembly, with no bolt-on cover facing forward. Modeled as third-member.',
      status: 'estimated',
      sourceIds: ['toyota-41101-35131', 'engineering-estimate']
    },
    {
      label: 'Pumpkin side',
      value: 'Driver side, unconfirmed',
      status: 'estimated',
      sourceIds: ['engineering-estimate']
    },
    {
      label: 'Bolt pattern',
      value: '6x139.7 mm (6x5.5 in)',
      status: 'community',
      sourceIds: ['wheelsize-1998-tacoma']
    }
  ],
  sources,
  notes: [
    'The V6 did not get an 8 in front. Toyota lists one front carrier for the 2.7 L and 3.4 L, and suppliers sell a 7.5 in reverse-rotation gear set for every 1995.5-2004 Tacoma and 1996-2002 4Runner front.',
    'Which side the carrier sits on was not confirmed by any source found. It is drawn on the driver side. Look under your truck before trusting the left-right layout.',
    'The diff bolts to the frame, so its height changes with tire size and lift, not with suspension travel. A diff drop kit lowers it.',
    'Wheel centerline to diff low point is not published. A spec listing of 11 in front clearance on stock tires suggests about 3.1 in, but it does not say what was measured. Calibrate with your own measurement.',
    'Track comes from a 4Runner listing and the wheel offset from a fitment database. Treat wheel placement as good to about an inch.'
  ]
};
