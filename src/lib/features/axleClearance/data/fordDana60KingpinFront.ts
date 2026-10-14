import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'torqueking-idn139',
    title: 'Torque King: 1985-1991 Ford F-350 Dana 60 front axle identification (IDN-139)',
    kind: 'supplier',
    url: 'https://torqueking.com/products/sku-1985-1991-ford-f350-dana-60-front-axle-identification-idn-139',
    excerpt:
      'Reintroduced by Ford as a mid-year design change in the 1985 model year. Weight rating of 5000 pounds. Cover: 10 Bolt, 12" high. Ring Gear: 9-7/8", 12 Bolt. Mono Beam 1-piece iron housing. Reverse spiral ring and pinion set, 3.54 or 4.10. Outer shafts 1-5/16" 30 spline; inner shafts 1-1/2" x 35 spline. Open with greaseable king pins; upper a spring loaded plastic bushing on a tapered king pin, lower a taper roller bearing.'
  },
  {
    id: 'torqueking-idn138',
    title: 'Torque King: 1992-1997 Ford F-350 Dana 60 front axle identification (IDN-138)',
    kind: 'supplier',
    url: 'https://torqueking.com/products/sku-1992-1997-ford-f350-dana-60-front-axle-identification-idn-138',
    excerpt:
      'Cover: 10 Bolt, 12" high. Ring Gear: 9-7/8", 12 Bolt. Knuckle Mounting: Ball Joints. Suspension: Leaf spring.'
  },
  {
    id: 'ord-ford-d60',
    title: 'Offroad Design: Ford Dana 60 technical information',
    kind: 'supplier',
    url: 'https://www.offroaddesign.com/tech/offroad-design-axles-knowledge/offroad-design-ford-dana-60-technical-information',
    excerpt:
      '1977.5-79 F250/F350: high pinion, kingpin, 31-1/2" spring pad spacing. 1985-91 F350: high pinion, kingpin, 36-1/2" spring pad spacing, short side tube shortened about 2", driver\'s side very short. 1992-98: ball joint. 8 x 6.5" lug pattern. Ford made no solid front axles 1980-84.'
  },
  {
    id: 'wikipedia-d60',
    title: 'Wikipedia: Dana 60',
    kind: 'community',
    url: 'https://en.wikipedia.org/wiki/Dana_60',
    excerpt:
      "Ford versions are driver's side differential drop, reverse-cut gears, and kingpin knuckles up to 1991. Ford mostly 35 spline inner shafts, some 30."
  },
  {
    id: 'dieselhub-d60',
    title: 'DieselHub: Dana 60 front/rear axle',
    kind: 'community',
    url: 'https://www.dieselhub.com/axle/dana-60.html',
    excerpt:
      'Tube diameter listed as 3.125 in; front axle wall 0.50 in. Ford Dana 60 has a driver side drop and reverse cut gears.'
  },
  {
    id: 'jkforum-super60',
    title: 'JK-Forum: Dana Super 60 swap thread (owner measurements)',
    kind: 'community',
    url: 'https://www.jk-forum.com/forums/modified-jk-tech-2/dana-super-60-a-309331',
    excerpt:
      'Pre-2005 D60s are 69", the 2005+ are 72" [wheel mounting surface to wheel mounting surface].'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the published ring gear and cover sizes. Must be measured on a real housing before being trusted.'
  }
];

const wmsWidth = 69;
const wheelOffset = 0.25;

export const fordDana60KingpinFront: AxleConfiguration = {
  id: 'ford-f350-dana-60-kingpin-front-1985-1991',
  name: 'Ford F-350 kingpin Dana 60 front (1985–1991)',
  shortName: 'Ford kingpin Dana 60',
  group: 'Ford',
  manufacturer: 'Dana / Spicer',
  vehicle: 'Ford F-350 4x4 (mid-1985 to 1991)',
  years: { from: 1985, to: 1991 },
  kind: 'solid',
  position: 'front',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        9 + 7 / 8,
        'verified',
        ['torqueking-idn139'],
        'Shown dashed. Torque King lists 9-7/8 in; Dana and most references call it 9.75 in. It is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        7,
        'estimated',
        ['ord-ford-d60', 'wikipedia-d60', 'engineering-estimate'],
        "Driver-side drop is verified (Offroad Design: the driver's side tube is very short). The 7 in amount is an estimate based on the later Super 60; no published figure was found."
      ),
      dropBelowCenterline: dim(
        6.25,
        'estimated',
        ['engineering-estimate', 'torqueking-idn139'],
        'No published value found. Must exceed half the verified 12 in cover height (6 in); 6.25 in allows for the cover flange. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        6.5,
        'schematic',
        ['engineering-estimate'],
        'High-pinion housing top. Drawing only.'
      ),
      width: dim(
        14,
        'estimated',
        ['engineering-estimate'],
        'Casting edges just outside an 11 in wide cover. Drawing and fit check only.'
      ),
      cover: {
        width: dim(
          11,
          'estimated',
          ['engineering-estimate'],
          'Height is published; width assumed close to the Super 60 cover (11-1/16 in).'
        ),
        height: dim(12, 'verified', ['torqueking-idn139', 'torqueking-idn138']),
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
      outerDiameter: dim(
        3.5,
        'estimated',
        ['dieselhub-d60', 'engineering-estimate'],
        'Builders commonly cite 3.5 in x 1/2 in for Dana 60 front tubes, but no Ford or Dana figure was found and DieselHub lists 3.125 in. Measure.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'kingpin',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['jkforum-super60', 'ord-ford-d60'],
        'Owner figure for pre-2005 Ford Dana 60 fronts. Spring pad spacing is 36-1/2 in (Offroad Design). Not split by year in the source.'
      ),
      cEndWidth: dim(3.5, 'schematic', ['engineering-estimate']),
      pivotSpan: dim(10, 'schematic', ['engineering-estimate'], 'Upper to lower kingpin.'),
      knuckleWidth: dim(4.5, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(6, 'schematic', ['engineering-estimate']),
      hubLength: dim(4, 'schematic', ['engineering-estimate']),
      boltPattern: '8x6.5 in'
    }
  },
  wheel: {
    diameter: dim(
      16,
      'estimated',
      ['engineering-estimate'],
      'Typical OE 16 in 8-lug steel wheel. 16.5 in wheels were also used.'
    ),
    width: dim(6, 'estimated', ['engineering-estimate'], 'Drawing only.'),
    offset: dim(
      wheelOffset,
      'estimated',
      ['engineering-estimate'],
      'OE offset not found. Near-zero offset assumed.'
    ),
    trackWidth: dim(
      wmsWidth - 2 * wheelOffset,
      'estimated',
      ['jkforum-super60', 'engineering-estimate'],
      'Owner WMS (69 in) minus twice the assumed 0.25 in offset = 68.5 in. Ford track figure for these years was not found.'
    )
  },
  facts: [
    {
      label: 'Pinion',
      value: 'High pinion, reverse spiral',
      status: 'verified',
      sourceIds: ['torqueking-idn139', 'ord-ford-d60']
    },
    {
      label: 'Steering pivots',
      value: 'Kingpins: tapered upper with spring-loaded bushing, lower taper roller bearing',
      status: 'verified',
      sourceIds: ['torqueking-idn139']
    },
    { label: 'Ring gear bolts', value: '12', status: 'verified', sourceIds: ['torqueking-idn139'] },
    {
      label: 'Axle shafts',
      value: '35-spline inner (1.5 in), 30-spline outer (1-5/16 in)',
      status: 'verified',
      sourceIds: ['torqueking-idn139']
    },
    { label: 'Front GAWR', value: '5000 lb', status: 'verified', sourceIds: ['torqueking-idn139'] },
    {
      label: 'Ratios',
      value: '3.54 or 4.10',
      status: 'verified',
      sourceIds: ['torqueking-idn139']
    },
    {
      label: 'Spring pad spacing',
      value: '36-1/2 in',
      status: 'verified',
      sourceIds: ['ord-ford-d60']
    },
    { label: 'Bolt pattern', value: '8x6.5 in', status: 'verified', sourceIds: ['ord-ford-d60'] }
  ],
  sources,
  notes: [
    'Ford also built a kingpin Dana 60 for 1977.5 to 1979 F-250/F-350. It is also high pinion but narrower, with 31-1/2 in spring pad spacing instead of 36-1/2 in. Ford used no solid front axle from 1980 to early 1985.',
    'From 1992 the Ford Dana 60 changed to ball joints. Kingpin housings are the ones builders look for.',
    'Width and track are owner figures, not Ford data. Measure your own housing before trusting the tire position.',
    'Differential drop below axle centerline has not been published. The absolute clearance is an estimate until you calibrate it.',
    'The pumpkin is on the driver side, the same as every later Ford Dana 60 front. GM and early Dodge Dana 60 fronts drop on the passenger side.'
  ]
};
