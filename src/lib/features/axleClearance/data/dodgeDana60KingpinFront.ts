import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'torqueking-dodge-d60',
    title: 'Torque King: 1975-1993 Dodge Dana 60 front axle (category and tech notes)',
    kind: 'supplier',
    url: 'https://torqueking.com/category/1975-1993-dodge-dana-60-front-axle',
    excerpt:
      'Covers 1975-1993 W200, W250, W300 and W350 4x4. Except for wheel hubs and brake rotors, 1975-1993 Dana 60 front axles share a high percentage of the same parts for all years. 1975-1993 Dodge Dana 60 and 1987-1993 Dana 61 front axles all use the same axle shafts. The Dana 60/61 was stock in W300 and W350 and optional on 1980-1993 gas W250.'
  },
  {
    id: 'torqueking-dodge-tierod',
    title: 'Torque King TK11522: tie rod tube for 1977-1993 Dodge Dana 60 W250/W350',
    kind: 'supplier',
    url: 'https://torqueking.com/product/11522/tk11522-tie-rod-tube-for-1977-1993-dodge-dana-60-w250-w350-axles',
    excerpt: 'The Dana 60 uses greaseable kingpins; the Dana 44 uses ball joints (1981-1993).'
  },
  {
    id: 'torqueking-dodge-hubs',
    title: 'Torque King: exploded view, 1975-1989 Dodge W250/W350 Dana 60 front wheel hub',
    kind: 'supplier',
    url: 'https://torqueking.com/blogs/default-blog/blog-new-exploded-view-for-19751989-dodge-w250-w350-dana-60-4x4-front-wheel-hub',
    excerpt:
      'From 1975 until around early 1991 the hub is drilled and tapped with eight 3/8 in bolt holes for an external locking hub or drive flange. From 1991 hubs have internal splines for a Warn dial locking hub.'
  },
  {
    id: 'usstd-dodge-long-inner',
    title: 'USA Standard Gear 35-spline left (long) inner axle, Dodge W250/W350 Dana 60 front',
    kind: 'supplier',
    url: 'https://completewebsol.com/product/replacement-inner-axle-gm-and-dodge-dana-60-front-35-spline-4340-chrome-moly-usa-standard',
    excerpt:
      'Left inner axle, 35 spline, 35.1 in long. Fits 1981-1993 Dodge W250, 1976-1980 W300, 1981-1993 W350.'
  },
  {
    id: 'yukon-yaw48202',
    title: 'Yukon YA W48202: chromoly inner front axle, Dana 60, 35 spline, 15.96 in',
    kind: 'supplier',
    url: 'https://v2.finditparts.com/products/3007743/yukon-gear-axle-yaw48202',
    excerpt:
      '35 spline, 15.96 in long. Right hand inner axle for Dodge D60 (1975-1993); also 1985-1988 F-350 left hand.'
  },
  {
    id: 'ruffstuff-d60-widths',
    title:
      'Ruff Stuff Specialties: Dana 60 front width notes (seen in search excerpt; page blocked to fetch)',
    kind: 'supplier',
    url: 'https://www.ruffstuffspecialties.com/TR6031.html',
    excerpt:
      'Most SRW Dodge are 67 in wide, although some are reportedly 69 in. DRW Dodge 75.5 in WMS-WMS. Chevy 60s 69 in. Early (79-93) Dodge are kingpin, later (94+) ball joint.'
  },
  {
    id: 'steelsoldiers-d60',
    title: 'Steel Soldiers forum: Dodge vs Chevy Dana 60 front (owner measurements)',
    kind: 'community',
    url: 'https://www.steelsoldiers.com/goto/post?id=656249',
    excerpt:
      'Dodge SRW D60 measured 67 in, Chevy SRW 69 in. GM perches 3 in wide, 32 in apart; Dodge perches 2.5 in wide, 32.5 in apart. Dodge tie rods sit about an inch higher.'
  },
  {
    id: 'ck5-chevy-vs-dodge',
    title: 'CK5 forum: Chevy Dana 60 vs Dodge Dana 60',
    kind: 'community',
    url: 'https://ck5.com/forums/threads/chevy-dana-60-vs-dodge-dana-60.304361/',
    excerpt:
      'The Dodge axle is about 2 in narrower than a GM D60. Passenger-drop Dodge D60s run through 1993; 1994 and later are driver drop with ball joints and unit bearing hubs.'
  },
  {
    id: 'wikipedia-d60',
    title: 'Wikipedia: Dana 60',
    kind: 'community',
    url: 'https://en.wikipedia.org/wiki/Dana_60',
    excerpt:
      'Dodge versions were passenger side differential drop, standard rotation gears, kingpin knuckles; 35 spline shafts in early models. Ring gear diameter 9-3/4 in.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the Dana 60 ring gear and 10-bolt cover. Must be measured on a real housing before being trusted.'
  }
];

const longInner = 35.1;
const shortInner = 15.96;
const wmsWidth = 67;
const wheelOffset = 0.25;

export const dodgeDana60KingpinFront: AxleConfiguration = {
  id: 'dodge-w250-w350-dana-60-kingpin-front-1975-1993',
  name: 'Dodge W250 / W350 kingpin Dana 60 front (1975–1993)',
  shortName: 'Dodge kingpin Dana 60',
  group: 'Dodge',
  manufacturer: 'Dana / Spicer',
  vehicle: 'Dodge W250 / W300 / W350 4x4 (standard on W300/W350, optional on gas W250 from 1980)',
  years: { from: 1975, to: 1993 },
  kind: 'solid',
  position: 'front',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        9.75,
        'community',
        ['wikipedia-d60', 'engineering-estimate'],
        'Shown dashed. Standard Dana 60 ring gear (Torque King lists the GM and Ford front as 9-7/8 in). No Dodge-specific supplier figure found. It is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        -(longInner - shortInner) / 2,
        'derived',
        ['usstd-dodge-long-inner', 'yukon-yaw48202', 'wikipedia-d60'],
        'Passenger side. Inner shafts are 35.1 in (left, driver) and 15.96 in (right, passenger), so the carrier sits (35.1 - 15.96) / 2 = 9.57 in toward the passenger side. Assumes equal outer shafts and symmetric knuckles.'
      ),
      dropBelowCenterline: dim(
        6.25,
        'estimated',
        ['engineering-estimate'],
        'No published value found. Must exceed half the 12 in Dana 60 front cover height (6 in); 6.25 in allows for the cover flange. Measure before trusting.'
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
          'Assumed close to other Dana 60 front covers. Not published for Dodge.'
        ),
        height: dim(
          12,
          'estimated',
          ['engineering-estimate'],
          'Torque King lists the GM and Ford Dana 60 front 10-bolt cover as 12 in high. No Dodge-specific figure found.'
        ),
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
        'Builders commonly cite 3.5 in for Dana 60 front tubes. No Dodge or Dana figure found. Measure.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'kingpin',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['ruffstuff-d60-widths', 'steelsoldiers-d60', 'ck5-chevy-vs-dodge'],
        'Ruff Stuff says most single-rear-wheel Dodge fronts are 67 in, some reportedly 69 in. An owner measured 67 in; another says about 2 in narrower than a GM. Hedged, so not marked verified.'
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
      'Typical 16 in 8-lug steel wheel. 16.5 in wheels were also used.'
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
      ['ruffstuff-d60-widths', 'engineering-estimate'],
      'WMS 67 in minus twice the assumed 0.25 in offset = 66.5 in. No Dodge brochure track figure was found.'
    )
  },
  facts: [
    {
      label: 'Pumpkin side',
      value: 'Passenger side (left inner shaft is the long one)',
      status: 'verified',
      sourceIds: ['usstd-dodge-long-inner', 'yukon-yaw48202', 'wikipedia-d60']
    },
    {
      label: 'Pinion',
      value: 'Low pinion, standard rotation',
      status: 'community',
      sourceIds: ['wikipedia-d60']
    },
    {
      label: 'Steering pivots',
      value: 'Greaseable kingpins (ball joints from 1994)',
      status: 'verified',
      sourceIds: ['torqueking-dodge-tierod', 'ruffstuff-d60-widths']
    },
    {
      label: 'Inner axle shafts',
      value: '35-spline; 35.1 in left, 15.96 in right',
      status: 'verified',
      sourceIds: ['usstd-dodge-long-inner', 'yukon-yaw48202']
    },
    {
      label: 'Hubs',
      value: '8 tapped 3/8 in holes for external lockers to early 1991; internal splines after',
      status: 'verified',
      sourceIds: ['torqueking-dodge-hubs']
    },
    {
      label: 'Fitment',
      value: 'Standard on W300/W350, optional on gas W250 from 1980',
      status: 'verified',
      sourceIds: ['torqueking-dodge-d60']
    },
    {
      label: 'Spring perches',
      value: '2.5 in wide, about 32.5 in apart',
      status: 'community',
      sourceIds: ['steelsoldiers-d60']
    },
    {
      label: 'Bolt pattern',
      value: '8x6.5 in, 1/2 in studs',
      status: 'community',
      sourceIds: ['ck5-chevy-vs-dodge', 'steelsoldiers-d60']
    }
  ],
  sources,
  notes: [
    'The pumpkin is on the passenger side, about 9.6 in off center, worked out from the inner shaft lengths the gear suppliers publish.',
    'Width is 67 in on most single-rear-wheel trucks according to Ruff Stuff, but some are reportedly 69 in. Dually fronts are 75.5 in. Measure yours.',
    'Track, wheel offset, cover size and drop are estimates. No Dodge brochure or Dana figure was found for them.',
    'GM and Dodge kingpin 60s look alike but differ in width, spring perches, tie rod height and lug stud size.',
    'From 1994 the Dodge Dana 60 front moved to ball joints and a driver-side drop. This entry does not cover it.'
  ]
};
