import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'torqueking-idn119',
    title: 'Torque King: 1977-1991 GM Dana 60 front axle identification (IDN-119)',
    kind: 'supplier',
    url: 'https://torqueking.com/products/sku-id-a-1977-1991-gm-dana-60-front-axle-idn-119',
    excerpt:
      'Cover: 10 Bolt, 12" high. Ring Gear: 9-7/8", 12 Bolt. Depending on the year and engine GM Dana 60 front axles were available with 3.73, 4.10, or 4.56 gearing. 1977-1983 BOM number usually stamped on the front side of the right axle tube.'
  },
  {
    id: 'torqueking-gm-kingpin',
    title: 'Torque King: kingpin tech notes, GM Dana 60 front (QT1064 kingpin socket)',
    kind: 'supplier',
    url: 'https://torqueking.com/product/1064/qt1064-king-pin-socket-for-1975-1993-dana-60-open-knuckle-front-axles',
    excerpt:
      'Chevrolet Dana 60: K30, K3500 1977 through 1987; K3500/V3500 1 ton (square cab) 1988-1991. Upper kingpins torqued to 600 ft-lb. Lower kingpin cap held by four bolts, 70-90 ft-lb.'
  },
  {
    id: 'usstd-gm-long-inner',
    title:
      'USA Standard Gear 35-spline left (long) inner axle, 1979-1986 Chevrolet K30 Dana 60 front',
    kind: 'supplier',
    url: 'https://completewebsol.com/product/replacement-inner-axle-gm-and-dodge-dana-60-front-35-spline-4340-chrome-moly-usa-standard',
    excerpt: 'Left inner axle, 35 spline, 35.1 in long. 1979-1986 Chevrolet K30.'
  },
  {
    id: 'usstd-gm-short-inner',
    title: 'USA Standard Gear ZA W48208: 35-spline short inner axle, 77-91 GM Dana 60 front',
    kind: 'supplier',
    url: 'https://completewebsol.com/product/replacement-inner-axle-77-91-gm-dana-60-35-spline-4340-chrome-moly-usa-standard-gear',
    excerpt:
      '17.67 in, measured from the end of the splines to the center of the U-joint bore. 35 spline. Application summary "Front Right Inner" (spec table says left, which conflicts). 1977-1986 K30, 1987-1988 V30, 1986 K3500, 1987 V3500.'
  },
  {
    id: 'ruffstuff-d60-widths',
    title:
      'Ruff Stuff Specialties: Dana 60 front width notes (seen in search excerpt; page blocked to fetch)',
    kind: 'supplier',
    url: 'https://www.ruffstuffspecialties.com/TR6031.html',
    excerpt:
      'Most SRW Dodge are 67 in wide, although some are reportedly 69 in. Chevy 60s 69 in. Chevy and Dodge 60s are fairly interchangeable, but tie rod and spring pad dimensions differ.'
  },
  {
    id: 'steelsoldiers-d60',
    title: 'Steel Soldiers forum: Dodge vs Chevy Dana 60 front (owner measurements)',
    kind: 'community',
    url: 'https://www.steelsoldiers.com/goto/post?id=656249',
    excerpt:
      'Dodge SRW D60 measured 67 in, Chevy SRW 69 in. GM perches 3 in wide, 32 in apart; Dodge perches 2.5 in wide, 32.5 in apart.'
  },
  {
    id: 'wikipedia-d60',
    title: 'Wikipedia: Dana 60',
    kind: 'community',
    url: 'https://en.wikipedia.org/wiki/Dana_60',
    excerpt:
      'GM versions are passenger side differential drop, standard rotation gears, kingpin knuckles and 35 spline axle shafts. Chevrolet: 1977-1991 1 ton (K30/V30).'
  },
  {
    id: 'sizemytires-k30',
    title: 'SizeMyTires: 1985 Chevrolet K30 original tire sizes',
    kind: 'community',
    url: 'https://www.sizemytires.com/vehicle/1985/chevrolet/k30',
    excerpt: 'LT235/85R16 (front) on some configurations; LT215/85R16 on dual rear wheel trucks.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the published ring gear and cover sizes. Must be measured on a real housing before being trusted.'
  }
];

const longInner = 35.1;
const shortInner = 17.67;
const wmsWidth = 69;
const wheelOffset = 0.25;

export const gmDana60KingpinFront: AxleConfiguration = {
  id: 'gm-k30-k3500-dana-60-kingpin-front-1977-1991',
  name: 'GM K30 / K3500 kingpin Dana 60 front (1977–1991)',
  shortName: 'GM kingpin Dana 60',
  group: 'GM',
  manufacturer: 'Dana / Spicer',
  vehicle: 'Chevrolet / GMC K30, K3500, V30, V3500 1-ton 4x4',
  years: { from: 1977, to: 1991 },
  kind: 'solid',
  position: 'front',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        9 + 7 / 8,
        'verified',
        ['torqueking-idn119'],
        'Shown dashed. Torque King lists 9-7/8 in; most references call it 9.75 in. It is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        -(longInner - shortInner) / 2,
        'derived',
        ['usstd-gm-long-inner', 'usstd-gm-short-inner', 'wikipedia-d60'],
        'Passenger side. Inner shafts are 35.1 in (left, driver) and 17.67 in (right, passenger), so the carrier sits (35.1 - 17.67) / 2 = 8.72 in toward the passenger side. Assumes equal outer shafts. The short-shaft listing contradicts itself on side, so this leans on the passenger-drop fact.'
      ),
      dropBelowCenterline: dim(
        6.25,
        'estimated',
        ['engineering-estimate', 'torqueking-idn119'],
        'No published value found. Must exceed half the verified 12 in cover height (6 in); 6.25 in allows for the cover flange. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        6,
        'schematic',
        ['engineering-estimate'],
        'Low-pinion housing top. Drawing only.'
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
        height: dim(12, 'verified', ['torqueking-idn119']),
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
        ['engineering-estimate'],
        'Builders commonly cite 3.5 in for Dana 60 front tubes. No GM or Dana figure found. Measure.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'kingpin',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['ruffstuff-d60-widths', 'steelsoldiers-d60'],
        'Ruff Stuff and an owner both give 69 in for the Chevy front. The Ruff Stuff page could not be fetched to confirm the wording, so it is not marked verified.'
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
      'community',
      ['sizemytires-k30'],
      'LT235/85R16 listed for some 1985 K30s. 16.5 in wheels were also used in these years.'
    ),
    width: dim(6.5, 'estimated', ['engineering-estimate'], 'Drawing only.'),
    offset: dim(
      wheelOffset,
      'estimated',
      ['engineering-estimate'],
      'OE offset not found. Near-zero offset assumed.'
    ),
    trackWidth: dim(
      wmsWidth - 2 * wheelOffset,
      'estimated',
      ['ruffstuff-d60-widths', 'engineering-estimate'],
      'WMS 69 in minus twice the assumed 0.25 in offset = 68.5 in. GM brochure track for the K30 was not found.'
    )
  },
  facts: [
    {
      label: 'Pumpkin side',
      value: 'Passenger side (left inner shaft is the long one)',
      status: 'verified',
      sourceIds: ['usstd-gm-long-inner', 'wikipedia-d60']
    },
    {
      label: 'Pinion',
      value: 'Low pinion, standard rotation',
      status: 'community',
      sourceIds: ['wikipedia-d60']
    },
    {
      label: 'Steering pivots',
      value: 'Kingpins; upper torqued to 600 ft-lb, lower cap 4 bolts at 70-90 ft-lb',
      status: 'verified',
      sourceIds: ['torqueking-gm-kingpin']
    },
    { label: 'Ring gear bolts', value: '12', status: 'verified', sourceIds: ['torqueking-idn119'] },
    {
      label: 'Inner axle shafts',
      value: '35-spline; 35.1 in left, 17.67 in right',
      status: 'verified',
      sourceIds: ['usstd-gm-long-inner', 'usstd-gm-short-inner']
    },
    {
      label: 'Ratios',
      value: '3.73, 4.10 or 4.56',
      status: 'verified',
      sourceIds: ['torqueking-idn119']
    },
    {
      label: 'Fitment',
      value: 'K30/K3500 1977-1987; K3500/V3500 square body 1988-1991',
      status: 'verified',
      sourceIds: ['torqueking-gm-kingpin']
    },
    {
      label: 'Spring perches',
      value: '3 in wide, about 32 in apart',
      status: 'community',
      sourceIds: ['steelsoldiers-d60']
    },
    {
      label: 'Bolt pattern',
      value: '8x6.5 in',
      status: 'community',
      sourceIds: ['steelsoldiers-d60']
    }
  ],
  sources,
  notes: [
    'The pumpkin is on the passenger side, about 8.7 in off center, worked out from published inner shaft lengths.',
    'Width (69 in) is a supplier and owner figure. No GM brochure track was found, so track and wheel offset are estimates.',
    'Differential drop below axle centerline has not been published. The absolute clearance is an estimate until you calibrate it.',
    'GM and Dodge kingpin 60s look alike. The Dodge is about 2 in narrower and has different perches and tie rod height.',
    'The 1977 to 1983 axle code is stamped on the front of the right tube; later axles carry a tag.'
  ]
};
