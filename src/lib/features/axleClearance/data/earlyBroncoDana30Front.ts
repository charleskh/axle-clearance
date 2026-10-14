import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'wildhorses-axle-tech',
    title: 'Wild Horses 4x4: Early Bronco front axle tech (Dana 30 vs Dana 44 identification)',
    kind: 'supplier',
    url: 'https://www.wildhorses4x4.com/early-bronco-front-axle-tech',
    excerpt:
      'The Dana 30 was used from 1966 to mid-year 1971. Dana 30 uses king pins held in with four bolts on the top and bottom. The Dana 30 has a concentric [cover] shape; the Dana 44 has an offset shape. Hybrid axles (Dana 30 outers, Dana 44 center section) mainly on 69 and 70 Broncos.'
  },
  {
    id: 'wildhorses-d30-parts',
    title: 'Wild Horses 4x4: Early Bronco front end parts for Dana 30',
    kind: 'supplier',
    url: 'https://wildhorses4x4.com/early-bronco-front-end-parts-for-dana-30',
    excerpt:
      'Dana 30 & 44 axle U-joint, OE type, Spicer 260, 1966-77 Ford Bronco. Dana 30 & 44 pinion yoke, 1310 series U-joint. Upper and lower kingpin caps secured with four bolts.'
  },
  {
    id: 'dennys-d30-bronco',
    title: "Denny's Driveshafts: Dana 30 front, 1966 to 1971 Ford Bronco",
    kind: 'supplier',
    url: 'https://www.dennysdriveshaft.com/c721_dana_30_front_1967_1971_ford_u_100_bronco.html',
    excerpt:
      'Early first generation Ford Broncos 1966 to 1971 were built with a Dana 30 front axle. Bolts for diff cover, quantity 10. Ring gear bolts, quantity 10.'
  },
  {
    id: 'yukon-yaw38807',
    title: 'Yukon YA W38807 right hand inner axle, Dana 30, 1967-1971 Ford Bronco (dealer listing)',
    kind: 'supplier',
    url: 'https://dalessuperstore.com/i-23910322-yukon-4340-chrome-moly-right-hand-inner-replacement-axle-for-dana-30-67-71-ford-bronco-uses-5-760x-u-joint-ya-w38807-fdhc.html',
    excerpt:
      'Right hand inner, 27 spline, 28.06 inches long. Fits Dana Spicer 30 in 1967-1971 Bronco.'
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
      'Front and rear track 1,458 mm (57.4 in). Road clearance 7.9 in (location not stated). E78-15 tires on 15x5.5 rims.'
  },
  {
    id: 'rangerstation-eb-d44',
    title: 'The Ranger Station: Early Ford Bronco Dana 44 front axle',
    kind: 'community',
    url: 'https://www.therangerstation.com/tech/the-early-bronco-dana-44/',
    excerpt:
      'Overall axle width 58 inches (measurement points not stated). Same 1966-77 Bronco track as the Dana 30 trucks.'
  },
  {
    id: 'wikipedia-dana30',
    title: 'Wikipedia: Dana 30',
    kind: 'community',
    url: 'https://en.wikipedia.org/wiki/Dana_30',
    excerpt:
      'Ring gear measures 7.12 inches (181 mm). OEM inner axle shaft spline count: 27. Applications include 1966-1971 Ford Bronco.'
  },
  {
    id: 'trailmanual-eb',
    title: 'TrailManual: Ford Bronco Dana 44 front axle stock specs',
    kind: 'community',
    url: 'https://trailmanual.com/db/bronco/bronco-axle-dana44-front/',
    excerpt:
      'Describes the early Bronco front axles as closed-knuckle kingpin designs. This contradicts Wild Horses and the visible open C-knuckles on these axles; cited only to flag the confusion.'
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

export const earlyBroncoDana30Front: AxleConfiguration = {
  id: 'ford-early-bronco-dana-30-front-1966-1971',
  name: 'Ford Early Bronco Dana 30 front (1966–1971)',
  shortName: 'EB Dana 30',
  group: 'Ford',
  manufacturer: 'Dana / Spicer',
  vehicle: 'Ford Bronco (first generation), 1966 to mid-1971',
  years: { from: 1966, to: 1971 },
  kind: 'solid',
  position: 'front',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        7.12,
        'community',
        ['wikipedia-dana30'],
        'Common Dana 30 figure (181 mm). Not found in a Ford or Dana document for the Bronco specifically.'
      ),
      offsetFromVehicleCenter: dim(
        4.8,
        'estimated',
        ['yukon-yaw38807', 'rangerstation-eb-d44', 'engineering-estimate'],
        'Driver side. The passenger (RH) inner shaft is the long one at 28.06 in, so the carrier sits left of center. Amount assumes the left inner is about the same length as the Dana 44 left inner (18.31 in): (28.06 - 18.31) / 2 = 4.9 in, rounded down. Measure before trusting.'
      ),
      dropBelowCenterline: dim(
        4.6,
        'estimated',
        ['engineering-estimate', 'wikipedia-dana30'],
        'No published value found. 7.12 in ring gear gives a 3.56 in radius; about 1 in of oil clearance and housing wall below it puts the low point near 4.6 in. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        4.75,
        'schematic',
        ['engineering-estimate'],
        'Low-pinion housing top. Drawing only.'
      ),
      width: dim(
        10.5,
        'estimated',
        ['engineering-estimate'],
        'Casting width around a 7.12 in ring gear with a 10-bolt cover flange. Drawing aid.'
      ),
      cover: {
        width: dim(
          9.25,
          'estimated',
          ['wildhorses-axle-tech', 'engineering-estimate'],
          'Cover shape is round and concentric with the axle (verified). Size is estimated.'
        ),
        height: dim(9.0, 'estimated', ['wildhorses-axle-tech', 'engineering-estimate']),
        boltCount: 10,
        boltCircle: dim(
          8.2,
          'schematic',
          ['engineering-estimate'],
          'Bolt path inset from the cover edge. Drawing only.'
        )
      },
      coverCenterHeight: dim(
        0,
        'estimated',
        ['wildhorses-axle-tech', 'engineering-estimate'],
        'Wild Horses describes the Dana 30 cover as concentric, so it is drawn centered on the axle centerline.'
      )
    },
    tubes: {
      outerDiameter: dim(
        2.5,
        'estimated',
        ['engineering-estimate'],
        'No published Bronco Dana 30 tube size found. Wild Horses says the Dana 44 tubes are larger. Measure before trusting.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'kingpin',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['rangerstation-eb-d44', 'rangerstation-dimensions'],
        'Ranger Station gives 58 in "overall axle width" for the Dana 44 that replaced this axle on the same 57.4 in track. Read here as wheel mounting surface to wheel mounting surface; the source does not say. Assumed equal for the Dana 30.'
      ),
      cEndWidth: dim(3.0, 'schematic', ['engineering-estimate']),
      pivotSpan: dim(8.5, 'schematic', ['engineering-estimate'], 'Upper to lower kingpin.'),
      knuckleWidth: dim(3.5, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(5.0, 'schematic', ['engineering-estimate']),
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
      value: 'Kingpins, open C-knuckle (four-bolt caps top and bottom)',
      status: 'verified',
      sourceIds: ['wildhorses-axle-tech', 'wildhorses-d30-parts']
    },
    {
      label: 'Differential side',
      value: 'Driver side (passenger inner shaft is the long one)',
      status: 'derived',
      sourceIds: ['yukon-yaw38807']
    },
    {
      label: 'Cover',
      value: '10 bolts, round concentric shape',
      status: 'verified',
      sourceIds: ['dennys-d30-bronco', 'wildhorses-axle-tech']
    },
    { label: 'Ring gear bolts', value: '10', status: 'verified', sourceIds: ['dennys-d30-bronco'] },
    {
      label: 'Axle shafts',
      value: '27-spline inner',
      status: 'verified',
      sourceIds: ['yukon-yaw38807']
    },
    {
      label: 'Axle U-joint',
      value: 'Spicer 260 series',
      status: 'verified',
      sourceIds: ['wildhorses-d30-parts']
    },
    {
      label: 'Pinion yoke',
      value: '1310 series',
      status: 'verified',
      sourceIds: ['wildhorses-d30-parts']
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
    'This is an open-knuckle kingpin axle. Some spec sites call it closed-knuckle; it is not. The Dana 30 has bolted kingpin caps where the later Dana 44 has ball joints.',
    'Some 1969 and 1970 Broncos left the factory with hybrid axles: Dana 30 kingpin outers on a Dana 44 center section. Check the cover. A round cover is a Dana 30, an offset cover is a Dana 44.',
    'The pumpkin sits on the driver side. Ring gear, cover size, tube size and the drop below centerline are not from a Ford or Dana document. Measure the drop before trusting the absolute clearance.',
    'Track (57.4 in) and the 58 in axle width come from enthusiast spec pages, not a Ford brochure. Most owners swap this axle for the 1971 to 1977 Dana 44 or a wider full-size axle.'
  ]
};
