import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'wildhorses-axle-tech',
    title: 'Wild Horses 4x4: Early Bronco front axle tech (Dana 30 vs Dana 44 identification)',
    kind: 'supplier',
    url: 'https://www.wildhorses4x4.com/early-bronco-front-axle-tech',
    excerpt:
      'Dana 44 used from 1971 through 1977, disc brakes in 1976 and 1977. Dana 44 uses ball joints secured with large castle nuts. The Dana 44 has an offset [cover] shape. 76-77 disc brake spindle has five bolt holes.'
  },
  {
    id: 'wildhorses-d30-parts',
    title: 'Wild Horses 4x4: Early Bronco front end parts',
    kind: 'supplier',
    url: 'https://wildhorses4x4.com/early-bronco-front-end-parts-for-dana-30',
    excerpt:
      'Dana 30 & 44 axle U-joint, OE type, Spicer 260, 1966-77 Ford Bronco. Dana 30 & 44 pinion yoke, 1310 series U-joint.'
  },
  {
    id: 'usastandard-d44-rh',
    title:
      'USA Standard Gear replacement axle, Dana 44 1971-77 Bronco RH inner, 5-760X U-joint (dealer listing)',
    kind: 'supplier',
    url: 'https://completewebsol.com/product/replacement-axle-dana-44-71-77-bronco-rh-inner-uses-5-760x-u-joint-4340-chrome-moly-usa',
    excerpt: 'Right hand inner, 30 spline, 27.94 inches. Fits 1971-1977 Bronco Dana 44.'
  },
  {
    id: 'torqueking-tk42153',
    title: 'Torque King TK42153: 19 spline outer axle shaft for 71-77 Bronco, 74-76 Jeep, Dana 44',
    kind: 'supplier',
    url: 'https://torqueking.com/products/42153-tk42153-19-spline-outer-axle-shaft-for-71-77-bronco-74-76-jeep-dana-44s',
    excerpt: '19 spline outer axle shaft for 71-77 Bronco Dana 44.'
  },
  {
    id: 'wildhorses-wheels',
    title: 'Wild Horses 4x4: Early Bronco tire and wheel guide',
    kind: 'supplier',
    url: 'https://www.wildhorses4x4.com/early-bronco-tire-and-wheel-guide',
    excerpt:
      'The standard wheel is a 15x5.5 steel wheel; some higher GVW models used 15x6. All 66-77 Ford Broncos use a 5 on 5.5 wheel bolt pattern (5x139.7 mm). Factory tires 28 to 30 inch overall diameter.'
  },
  {
    id: 'rangerstation-eb-d44',
    title: 'The Ranger Station: Early Ford Bronco Dana 44 front axle',
    kind: 'community',
    url: 'https://www.therangerstation.com/tech/the-early-bronco-dana-44/',
    excerpt:
      'Ring gear diameter 8.5 inches. Axle shafts 1.31 inch, 30 spline. Pinion 1.38 inch, 26 spline. Carrier break 3.73 and down / 3.92 and up. Standard-cut, low-pinion. Overall axle width 58 inches. Driver side inner 18.31 in, passenger side inner 27.94 in, outer stub 9.72 in, 19 spline.'
  },
  {
    id: 'rangerstation-dimensions',
    title: 'The Ranger Station: Bronco II vs Bronco dimensions chart',
    kind: 'community',
    url: 'https://www.therangerstation.com/bronco-ii-corral/bronco-ii-vs-bronco-dimensions/',
    excerpt:
      '1966-1977 Ford Bronco: track width 57.4 in, overall width 68.5 in, wheelbase 92.0 in. No front/rear split, no source cited.'
  },
  {
    id: 'offroadingpro-1977',
    title: 'Off-Roading Pro: 1977 Ford Bronco specs',
    kind: 'community',
    url: 'https://offroadingpro.com/1977-ford-bronco/',
    excerpt:
      'Front and rear track 1,458 mm (57.4 in). Road clearance 7.9 in (location not stated). Dana 44 front. E78-15 tires (about 27 in) on 15x5.5 rims.'
  },
  {
    id: 'blueoval-d44',
    title: 'Blue Oval Trucks: Ford Dana 44 front axle reference',
    kind: 'community',
    url: 'https://blueovaltrucks.com/tech/Dana44.htm',
    excerpt:
      'F-100/150 Dana 44 front 1966 through 1975: 2.75 x 1/2 inch tube. This is the full-size truck axle, not the Bronco unit.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the ring gear, shaft lengths and track above. Must be measured on a real housing before being trusted.'
  }
];

const trackWidth = 57.4;
const wmsWidth = 58;
const wheelOffset = (wmsWidth - trackWidth) / 2;
const longInner = 27.94;
const shortInner = 18.31;

export const earlyBroncoDana44Front: AxleConfiguration = {
  id: 'ford-early-bronco-dana-44-front-1971-1977',
  name: 'Ford Early Bronco Dana 44 front (1971–1977)',
  shortName: 'EB Dana 44',
  group: 'Ford',
  manufacturer: 'Dana / Spicer',
  vehicle: 'Ford Bronco (first generation), mid-1971 to 1977',
  years: { from: 1971, to: 1977 },
  kind: 'solid',
  position: 'front',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        8.5,
        'community',
        ['rangerstation-eb-d44'],
        'Standard Dana 44 ring gear. Not found in a Ford or Dana document for the Bronco specifically. Shown dashed; it is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        (longInner - shortInner) / 2,
        'estimated',
        ['rangerstation-eb-d44', 'usastandard-d44-rh', 'engineering-estimate'],
        'Driver side. Passenger inner 27.94 in minus driver inner 18.31 in, halved = 4.8 in, assuming the housing is centered on the truck and the side gears sit symmetric about the cover. Measure before trusting.'
      ),
      dropBelowCenterline: dim(
        5.4,
        'estimated',
        ['engineering-estimate', 'rangerstation-eb-d44', 'offroadingpro-1977'],
        'No published value found. 8.5 in ring gear gives a 4.25 in radius; oil clearance and housing wall below it put the low point near 5.4 in. A stock 27 in tire (13.5 in radius) less the 7.9 in listed road clearance gives 5.6 in, but that clearance figure does not say where it was measured. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        5.5,
        'schematic',
        ['engineering-estimate'],
        'Low-pinion housing top. Drawing only.'
      ),
      width: dim(
        12,
        'estimated',
        ['engineering-estimate'],
        'Casting width around an 8.5 in ring gear with a 10-bolt cover flange. Drawing aid.'
      ),
      cover: {
        width: dim(
          10.75,
          'estimated',
          ['wildhorses-axle-tech', 'engineering-estimate'],
          'Wild Horses confirms the offset (non-round) cover shape that tells it from a Dana 30. Size is estimated.'
        ),
        height: dim(10.5, 'estimated', ['wildhorses-axle-tech', 'engineering-estimate']),
        boltCount: 10,
        boltCircle: dim(
          9.6,
          'schematic',
          ['engineering-estimate'],
          'Bolt path inset from the cover edge. Drawing only.'
        )
      },
      coverCenterHeight: dim(
        0,
        'estimated',
        ['engineering-estimate'],
        'Drawn concentric with the axle centerline. The real cover is an offset oval, so its center sits slightly off the axle line.'
      )
    },
    tubes: {
      outerDiameter: dim(
        2.75,
        'estimated',
        ['blueoval-d44', 'engineering-estimate'],
        'Borrowed from the 1966-75 F-100 Dana 44 (2.75 in OD). No Bronco-specific tube size found. Measure before trusting.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'ball-joint',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['rangerstation-eb-d44', 'rangerstation-dimensions'],
        'Ranger Station gives 58 in "overall axle width". Read here as wheel mounting surface to wheel mounting surface; the source does not say. It agrees with the 57.4 in track and a near-zero offset stock wheel.'
      ),
      cEndWidth: dim(3.25, 'schematic', ['engineering-estimate']),
      pivotSpan: dim(8, 'schematic', ['engineering-estimate'], 'Upper to lower ball joint.'),
      knuckleWidth: dim(3.75, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(5.25, 'schematic', ['engineering-estimate']),
      hubLength: dim(3.5, 'schematic', ['engineering-estimate']),
      boltPattern: '5x5.5 in (5x139.7 mm)'
    }
  },
  wheel: {
    diameter: dim(15, 'verified', ['wildhorses-wheels'], 'Standard 15x5.5 steel wheel.'),
    width: dim(5.5, 'verified', ['wildhorses-wheels']),
    offset: dim(
      wheelOffset,
      'estimated',
      ['rangerstation-eb-d44', 'rangerstation-dimensions'],
      '(58 - 57.4) / 2 = 0.3 in (about +8 mm). Both inputs are community figures and no factory offset was found.'
    ),
    trackWidth: dim(
      trackWidth,
      'community',
      ['rangerstation-dimensions', 'offroadingpro-1977'],
      'Two enthusiast spec pages agree on 57.4 in (1458 mm). Not yet matched to a Ford brochure.'
    )
  },
  facts: [
    {
      label: 'Steering pivots',
      value: 'Ball joints, open knuckle (castle nuts)',
      status: 'verified',
      sourceIds: ['wildhorses-axle-tech']
    },
    {
      label: 'Differential side',
      value: 'Driver side (passenger inner shaft is the long one)',
      status: 'derived',
      sourceIds: ['usastandard-d44-rh', 'rangerstation-eb-d44']
    },
    {
      label: 'Pinion',
      value: 'Low pinion, standard rotation',
      status: 'community',
      sourceIds: ['rangerstation-eb-d44']
    },
    {
      label: 'Axle shafts',
      value: '30-spline inner (1.31 in), 19-spline outer stub',
      status: 'verified',
      sourceIds: ['usastandard-d44-rh', 'torqueking-tk42153']
    },
    {
      label: 'Carrier break',
      value: '3.73 and down / 3.92 and up',
      status: 'community',
      sourceIds: ['rangerstation-eb-d44']
    },
    {
      label: 'Axle U-joint',
      value: 'Spicer 260 series',
      status: 'verified',
      sourceIds: ['wildhorses-d30-parts']
    },
    {
      label: 'Cover',
      value: '10 bolts, offset shape',
      status: 'community',
      sourceIds: ['wildhorses-axle-tech', 'engineering-estimate']
    },
    {
      label: 'Brakes',
      value: 'Drums 1971 to 1975, discs 1976 and 1977',
      status: 'verified',
      sourceIds: ['wildhorses-axle-tech']
    },
    {
      label: 'Bolt pattern',
      value: '5x5.5 in (5x139.7 mm)',
      status: 'verified',
      sourceIds: ['wildhorses-wheels']
    }
  ],
  sources,
  notes: [
    'The pumpkin sits on the driver side. The 4.8 in offset is worked out from the inner shaft lengths, not measured on a housing.',
    'Ring gear (8.5 in), tube size and the drop below centerline are not from a Ford or Dana document. Measure the drop before trusting the absolute clearance.',
    'Track (57.4 in) and the 58 in axle width come from enthusiast spec pages. Early Bronco axles are narrow, so most builds on tires over 33 in move to a wider full-size Ford Dana 44 or Dana 60.',
    'Some 1969 and 1970 Broncos have a Dana 44 center section with Dana 30 kingpin outers. This entry covers the ball-joint Dana 44 from mid-1971 on.'
  ]
};
