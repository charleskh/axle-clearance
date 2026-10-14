import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'ford-bblb-2014',
    title: 'Ford 2014 Super Duty Body Builders Layout Book, Axle/Tire/Vehicle Height Data (p. 21)',
    kind: 'manufacturer',
    url: 'https://irp.cdn-website.com/8e9b3e0f/files/uploaded/2014_SD_F-Series_v1-1.pdf',
    excerpt:
      'F-250/F-350 SRW 4x4, LT245/75R17E: front track (FW) 1736 mm [68.3 in]; static loaded radius 371 mm [14.6 in]; tire diameter 814 mm [32.0 in].'
  },
  {
    id: 'torqueking-idn118',
    title: 'Torque King: Ford Dana Super 60 front axle identification (IDN-118)',
    kind: 'supplier',
    url: 'https://torqueking.com/products/sku-ford-dana-super-60-front-axle-id-idn-118',
    excerpt:
      'Differential is offset to left side (drivers side). 10-bolt cover, 12" high x 11-1/16" wide. Spreader holes 14-1/8" apart. Ball joints attach steering knuckles to axle. Unitized wheel hubs.'
  },
  {
    id: 'dennys-super60',
    title: "Denny's Driveshafts: Dana Super 60 front, Ford 2005 to 2016",
    kind: 'supplier',
    url: 'https://www.dennysdriveshaft.com/c2744_dana_super_60_front_ford_2005_to_2016.html',
    excerpt: '256 mm / 10 inch ring gear.'
  },
  {
    id: 'blueoval-super60',
    title: 'Blue Oval Trucks: Dana Super 60 front axle overview',
    kind: 'supplier',
    url: 'https://www.blueovaltrucks.com/?p=8720',
    excerpt:
      'Larger 10-inch-diameter ring gear. 3-3/4 inch-diameter steel tubes that are 1/2 inch thick.'
  },
  {
    id: 'jkforum-super60',
    title: 'JK-Forum: Dana Super 60 swap thread (owner measurements)',
    kind: 'community',
    url: 'https://www.jk-forum.com/forums/modified-jk-tech-2/dana-super-60-a-309331',
    excerpt:
      'Pre-2005 D60s are 69", the 2005+ are 72" [wheel mounting surface to wheel mounting surface]. Long-side inner shaft 37-5/8". Swappers cut 4-5" from the passenger tube to center the pumpkin.'
  },
  {
    id: 'wheel-sizes-sd',
    title: 'wheel-sizes.com: Ford F-250/F-350 Super Duty 2005-2016 OE wheel specs',
    kind: 'community',
    url: 'https://www.wheel-sizes.com/',
    excerpt:
      '8x170 bolt pattern, 124.9 mm center bore, OE offset listed as ET34 (not split by year).'
  },
  {
    id: 'listing-ground-clearance',
    title: 'Third-party spec listings (Edmunds 2016 King Ranch 4WD, Auto123 2015 F-250 4WD)',
    kind: 'community',
    excerpt:
      'Minimum ground clearance 8.1 in (206 mm). Tire size not stated, or stated as LT275/65R20, which would imply a different drop. Not a measured under-differential figure.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the verified ring gear, cover and tube sizes. Must be measured on a real housing before being trusted.'
  }
];

const trackWidth = 1736 * MM;
const wheelOffset = 34 * MM;

export const danaSuper60Ford: AxleConfiguration = {
  id: 'ford-sd-dana-super-60-front-2005-2016',
  name: 'Ford Super Duty Dana Super 60 (2005–2016)',
  shortName: 'Dana Super 60',
  group: 'Ford',
  manufacturer: 'Dana / Spicer',
  vehicle: 'Ford F-250 / F-350 Super Duty 4x4, SRW',
  years: { from: 2005, to: 2016 },
  kind: 'solid',
  position: 'front',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        256 * MM,
        'verified',
        ['dennys-super60', 'blueoval-super60'],
        'Shown dashed. It is not the drop: the housing wall and oil clearance sit below the ring gear.'
      ),
      offsetFromVehicleCenter: dim(
        7,
        'estimated',
        ['torqueking-idn118', 'jkforum-super60'],
        'Driver-side offset is verified; the 7 in amount is inferred from the 37-5/8 in long-side shaft and the 4-5 in tube cut swappers use to center it.'
      ),
      dropBelowCenterline: dim(
        6.5,
        'estimated',
        ['engineering-estimate', 'ford-bblb-2014', 'listing-ground-clearance'],
        'No published value found. 6.5 in is consistent with a 10.08 in ring gear (5.04 in radius) plus housing wall, and with 14.6 in static loaded radius minus an 8.1 in listed ground clearance. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        6.75,
        'schematic',
        ['engineering-estimate'],
        'High-pinion housing top. Drawing only.'
      ),
      width: dim(
        15.75,
        'estimated',
        ['torqueking-idn118', 'engineering-estimate'],
        'Must exceed the 14-1/8 in spreader-hole spacing; casting edges sit just outside it.'
      ),
      cover: {
        width: dim(11 + 1 / 16, 'verified', ['torqueking-idn118']),
        height: dim(12, 'verified', ['torqueking-idn118']),
        boltCount: 10,
        boltCircle: dim(
          9.9,
          'schematic',
          ['engineering-estimate'],
          'Bolt path inset from the cover edge. Drawing only.'
        )
      },
      coverCenterHeight: dim(
        0,
        'estimated',
        ['engineering-estimate'],
        'The ring gear turns on the axle shaft axis, so the cover is drawn concentric with the axle centerline.'
      )
    },
    tubes: {
      outerDiameter: dim(3.75, 'verified', ['blueoval-super60', 'jkforum-super60'], '1/2 in wall.')
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'ball-joint',
      wmsWidth: dim(
        trackWidth + 2 * wheelOffset,
        'community',
        ['ford-bblb-2014', 'wheel-sizes-sd', 'jkforum-super60'],
        'Ford track (68.3 in) plus twice the OE wheel offset (ET34) = 71.0 in. Owners report about 72 in. The offset input is not manufacturer-verified, so treat this as within about 1 in.'
      ),
      cEndWidth: dim(3.5, 'schematic', ['engineering-estimate']),
      pivotSpan: dim(9, 'schematic', ['engineering-estimate'], 'Upper to lower ball joint.'),
      knuckleWidth: dim(4, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(5.5, 'schematic', ['engineering-estimate']),
      hubLength: dim(3.5, 'schematic', ['engineering-estimate']),
      boltPattern: '8x170 mm'
    }
  },
  wheel: {
    diameter: dim(17, 'verified', ['ford-bblb-2014'], 'Base tire LT245/75R17E.'),
    width: dim(
      7.5,
      'estimated',
      ['engineering-estimate'],
      'Typical OE 17 in steel wheel width. Drawing only.'
    ),
    offset: dim(wheelOffset, 'community', ['wheel-sizes-sd']),
    trackWidth: dim(
      trackWidth,
      'verified',
      ['ford-bblb-2014'],
      'F-250/F-350 SRW 4x4 front track, 1736 mm.'
    )
  },
  facts: [
    {
      label: 'Pinion',
      value: 'High pinion, reverse rotation',
      status: 'verified',
      sourceIds: ['torqueking-idn118']
    },
    {
      label: 'Steering pivots',
      value: 'Ball joints (Dana 708238 kit)',
      status: 'verified',
      sourceIds: ['torqueking-idn118', 'dennys-super60']
    },
    {
      label: 'Hubs',
      value: 'Unit-bearing, manual or auto locking',
      status: 'verified',
      sourceIds: ['torqueking-idn118']
    },
    { label: 'Ring gear bolts', value: '12', status: 'community', sourceIds: ['jkforum-super60'] },
    {
      label: 'Axle shafts',
      value: '35-spline inner and outer',
      status: 'community',
      sourceIds: ['jkforum-super60']
    },
    {
      label: 'Bolt pattern',
      value: '8x170 mm, 124.9 mm center bore',
      status: 'community',
      sourceIds: ['wheel-sizes-sd']
    }
  ],
  sources,
  notes: [
    'Wheel centers sit on the Ford-published 68.3 in front track and do not move with tire size.',
    'Differential drop below axle centerline has not been published by Ford or Dana. The absolute clearance shown is an estimate until you calibrate it with a measurement from a real axle.',
    'Clearance gained from a taller tire does not depend on the drop: it is half the diameter change, assuming the same loaded-radius deflection.',
    'Real tire diameter and loaded radius vary with brand, inflation pressure, wheel width and load. Ford lists the stock LT245/75R17E at 32.0 in diameter with a 14.6 in static loaded radius, 1.4 in less than nominal.'
  ]
};
