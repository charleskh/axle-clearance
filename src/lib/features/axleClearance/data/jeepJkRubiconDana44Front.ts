import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'quadratec-jk-2007-specs',
    title: 'Quadratec: 2007 Jeep Wrangler JK factory specifications (reprint of Jeep data)',
    kind: 'supplier',
    url: 'https://www.quadratec.com/jeep_knowledgebase/article-103.htm',
    excerpt:
      'Track, Front 61.9 (1572.3); Track, Rear 61.9 (1572.3). Rubicon wheel 17 x 7.5, tire LT255/75R17. Front Axle to ground (inches) with LT255/75R17: 10.5. Rear Axle to ground: 10.2. Axle ratio 4.10 standard on Rubicon.'
  },
  {
    id: 'dennys-jk44-front-rp',
    title:
      "Denny's Driveshafts: Yukon D44RS-456RUB ring and pinion, reverse rotation Dana 44 front, JK Rubicon",
    kind: 'supplier',
    url: 'https://www.dennysdriveshaft.com/p17441_d44rs_456rub_ring_and_pinion_gear_set_thick_4.56_ratio_short.html',
    excerpt:
      'THICK 8.50 inch ring gear diameter, 10 ring gear bolts, 24 spline pinion. Fits reverse rotation Dana 44 FRONT Jeep JK Rubicon, 2007-2018.'
  },
  {
    id: 'crown-jk44-front-shafts',
    title:
      'Quadratec: Crown Automotive 68017180AB / 68017183AB Dana 44 front axle assemblies, 07-18 JK',
    kind: 'supplier',
    url: 'https://www.quadratec.com/p/crown-automotive/dana-44-front-axle-shaft-assembly-wrangler-jk/driver-side',
    excerpt:
      'Factory Assembled, Driver Side Measures 26.06" Long, Passenger Side Measures 39.82" Long. Rubicon models have Dana 44 front axles.'
  },
  {
    id: 'xtreme4x4-prorock44-jk',
    title: 'Xtreme4x4 (retailer): Dynatrac ProRock 44 JK front housing, stock width',
    kind: 'community',
    url: 'https://www.xtreme4x4.me/products/wrangler-jk-front-pro-rock-dana-44-unlimited-axle-housing-with-pro-steer-ball-joints-dynatrac-jk44-1x3010-l-2',
    excerpt: '65.5 inch overall width for the JK front replacement housing.'
  },
  {
    id: 'tjforum-axle-widths',
    title: 'WranglerTJForum: Common axle swap widths (owner measurements)',
    kind: 'community',
    url: 'https://wranglertjforum.com/threads/common-axle-swap-widths.16127/post-260522',
    excerpt: 'JK factory Dana 44s are about 65.375 in wheel mount to wheel mount.'
  },
  {
    id: 'torqueking-idn107',
    title: 'Torque King: Dana 44 differential cover identification (IDN-107)',
    kind: 'supplier',
    url: 'https://torqueking.com/products/sku-dana-44-diff-cover-id-idn-107',
    excerpt:
      'Dana 44 beam type axles have 10 bolt covers that are approximately 10-3/8" high and 9-3/8" wide.'
  },
  {
    id: 'jkforum-d44-tech',
    title: 'JK-Forum: Dana 44 Front Axle Tech, Part 1',
    kind: 'community',
    url: 'https://jk-forum.com/articles/dana-44-front-axle-tech-part-1-dana-44',
    excerpt:
      "For most Jeeps like the JK, TJ, XJ, you'll want to find a Dana 44 with a driver's-side drop. The type to get is the high pinion version. Tube diameters range from 2.75 to 3 inches OD."
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Drawing-only shapes and estimates. Must be measured on a real housing before being trusted.'
  }
];

const trackWidth = 61.9;
const wmsWidth = 65.5;
const wheelOffset = (wmsWidth - trackWidth) / 2;
// LT255/75R17 nominal diameter: 17 + 2 * 255 * 0.75 / 25.4 = 32.06 in.
const tireRadius = (17 + (2 * 255 * 0.75) / 25.4) / 2;

export const jeepJkRubiconDana44Front: AxleConfiguration = {
  id: 'jeep-jk-rubicon-dana-44-front-2007-2018',
  name: 'Jeep JK Wrangler Rubicon Dana 44 front (2007–2018)',
  shortName: 'JK Rubicon D44 front',
  group: 'Jeep',
  manufacturer: 'Dana / Spicer',
  vehicle: 'Jeep Wrangler JK and JK Unlimited Rubicon',
  years: { from: 2007, to: 2018 },
  kind: 'solid',
  position: 'front',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        8.5,
        'verified',
        ['dennys-jk44-front-rp'],
        'Shown dashed. It is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        (39.82 - 26.06) / 2,
        'derived',
        ['crown-jk44-front-shafts', 'jkforum-d44-tech'],
        'Driver side. Crown lists the factory shaft assemblies at 26.06 in (driver) and 39.82 in (passenger), so the carrier sits (39.82 - 26.06) / 2 = 6.9 in toward the driver side.'
      ),
      dropBelowCenterline: dim(
        tireRadius - 10.5,
        'estimated',
        ['quadratec-jk-2007-specs', 'dennys-jk44-front-rp'],
        'Jeep lists 10.5 in front axle to ground on the Rubicon LT255/75R17. Nominal radius 16.03 in - 10.5 in = 5.5 in. Jeep likely measured at the loaded radius, which is smaller, so the true drop is probably 0.5 to 1 in less. Treat 5.5 in as an upper bound.'
      ),
      riseAboveCenterline: dim(
        6,
        'schematic',
        ['engineering-estimate'],
        'High-pinion housing top. Drawing only.'
      ),
      width: dim(
        11.5,
        'estimated',
        ['torqueking-idn107', 'engineering-estimate'],
        'Casting edges sit just outside the 9-3/8 in wide cover.'
      ),
      cover: {
        width: dim(
          9 + 3 / 8,
          'estimated',
          ['torqueking-idn107'],
          'Torque King size for 10-bolt Dana 44 covers. Not confirmed for the reverse-rotation JK casting.'
        ),
        height: dim(
          10 + 3 / 8,
          'estimated',
          ['torqueking-idn107'],
          'Torque King size for 10-bolt Dana 44 covers. Not confirmed for the reverse-rotation JK casting.'
        ),
        boltCount: 10,
        boltCircle: dim(
          8.4,
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
        3,
        'estimated',
        ['jkforum-d44-tech', 'engineering-estimate'],
        'Dana 44 tubes run 2.75 to 3 in OD. The JK size was not found in a supplier source. Measure with calipers.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'ball-joint',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['xtreme4x4-prorock44-jk', 'tjforum-axle-widths'],
        'Stock-width Dynatrac replacement housing is listed at 65.5 in; owners measure about 65.4 in.'
      ),
      cEndWidth: dim(3.25, 'schematic', ['engineering-estimate']),
      pivotSpan: dim(8.5, 'schematic', ['engineering-estimate'], 'Upper to lower ball joint.'),
      knuckleWidth: dim(3.75, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(5.25, 'schematic', ['engineering-estimate']),
      hubLength: dim(3, 'schematic', ['engineering-estimate']),
      boltPattern: '5x5 in (5x127 mm)'
    }
  },
  wheel: {
    diameter: dim(17, 'verified', ['quadratec-jk-2007-specs'], 'Rubicon tire LT255/75R17.'),
    width: dim(7.5, 'verified', ['quadratec-jk-2007-specs'], 'Rubicon 17 x 7.5 in.'),
    offset: dim(
      wheelOffset,
      'community',
      ['quadratec-jk-2007-specs', 'xtreme4x4-prorock44-jk'],
      '(65.5 - 61.9) / 2 = 1.8 in (46 mm). Close to the commonly quoted 44.45 mm JK factory offset.'
    ),
    trackWidth: dim(
      trackWidth,
      'verified',
      ['quadratec-jk-2007-specs'],
      'Front track 61.9 in (1572.3 mm).'
    )
  },
  facts: [
    {
      label: 'Pinion',
      value: 'High pinion, reverse rotation',
      status: 'verified',
      sourceIds: ['dennys-jk44-front-rp', 'jkforum-d44-tech']
    },
    {
      label: 'Pinion splines',
      value: '24',
      status: 'verified',
      sourceIds: ['dennys-jk44-front-rp']
    },
    {
      label: 'Ring gear bolts',
      value: '10',
      status: 'verified',
      sourceIds: ['dennys-jk44-front-rp']
    },
    {
      label: 'Differential side',
      value: 'Driver side (short shaft assembly on the driver side)',
      status: 'derived',
      sourceIds: ['crown-jk44-front-shafts']
    },
    {
      label: 'Axle ratio',
      value: '4.10 standard on Rubicon',
      status: 'verified',
      sourceIds: ['quadratec-jk-2007-specs']
    }
  ],
  sources,
  notes: [
    'The JK front is a high-pinion, reverse-rotation Dana 44 with the carrier on the driver side. Ring and pinion sets are not interchangeable with a TJ front.',
    "The drop comes from Jeep's own front axle to ground figure, using the nominal tire radius. That makes it an upper bound, so the clearance shown is slightly pessimistic.",
    'WMS is from a stock-width replacement housing and owner measurements, not a Jeep document. It agrees with the 61.9 in track and a typical 44 to 46 mm wheel offset.',
    'Non-Rubicon JKs used a Dana 30 front. Do not use these numbers for it.'
  ]
};
