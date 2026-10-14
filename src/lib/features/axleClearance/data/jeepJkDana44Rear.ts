import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'quadratec-jk-2007-specs',
    title: 'Quadratec: 2007 Jeep Wrangler JK factory specifications (reprint of Jeep data)',
    kind: 'supplier',
    url: 'https://www.quadratec.com/jeep_knowledgebase/article-103.htm',
    excerpt:
      'Track, Front 61.9 (1572.3); Track, Rear 61.9 (1572.3). Rubicon wheel 17 x 7.5, tire LT255/75R17. Front Axle to ground (inches) with LT255/75R17: 10.5. Rear Axle to ground: 10.2.'
  },
  {
    id: 'motive-d44-488jk',
    title: 'Motive Gear D44-488JK ring and pinion, Dana 44 JK rear',
    kind: 'supplier',
    url: 'https://www.motivegear.com/auto-parts-product/3538-differential-ring-and-pinion-10-bolt-d44-488jk',
    excerpt:
      '8.89 in ring gear outside diameter, 10 ring gear bolts, 24 spline pinion. Position rear, Dana 44 JK, 2007-2018 Jeep Wrangler.'
  },
  {
    id: 'dana-708107',
    title: 'FinditParts: Dana 708107 differential carrier, Dana 44 (226 mm) rear',
    kind: 'supplier',
    url: 'https://finditparts.com/products/3097926/dana-708107',
    excerpt:
      'Differential Carrier - DANA 44 (226 MM) Axle, Rear, 30 Spline, 10 Cover Bolt, Standard. Generic 226 mm Dana 44 rear carrier, cited only to confirm the 226 mm size class; not a JK-specific part.'
  },
  {
    id: 'crown-jk44-rear-shafts',
    title: 'Quadratec: Crown Automotive 68003557AA Dana 44 rear axle shaft, 07-18 JK Rubicon',
    kind: 'supplier',
    url: 'https://www.quadratec.com/p/crown-automotive/rubicon-axle-shaft-assembly-wrangler-jk/driver-side-68003557AA',
    excerpt:
      'Driver side measures 31.18" and Passenger side 32.52" from flange to end of shaft. 32-spline Dana 44 rear axle for Tru-Lok applications. Fits Rubicon only.'
  },
  {
    id: 'yukon-1541h-jk-rear',
    title: 'Quadratec: Yukon 1541H HD Dana 44 rear axle, 32 spline, 07-18 JK Rubicon',
    kind: 'supplier',
    url: 'https://oms.quadratec.com/yukon-gear-axle-1541h-hd-dana-44-rear-axle-with-32-spline-for-07-18-jeep-wrangler-jk-rubicon.html',
    excerpt:
      'Passenger side (Right) Axle Length - 31 1/4". Driver side (Left) Axle Length - 32 5/8". Spline Count - 32. Dual bolt pattern 5x5" & 5x5.5".'
  },
  {
    id: 'xtreme4x4-prorock44-jk',
    title: 'Xtreme4x4 (retailer): Dynatrac ProRock 44 JK front housing, stock width',
    kind: 'community',
    url: 'https://www.xtreme4x4.me/products/wrangler-jk-front-pro-rock-dana-44-unlimited-axle-housing-with-pro-steer-ball-joints-dynatrac-jk44-1x3010-l-2',
    excerpt: '65.5 inch overall width for the JK front replacement housing.'
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
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Drawing-only shapes and estimates. Must be measured on a real housing before being trusted.'
  }
];

const trackWidth = 61.9;
const wheelOffset = (65.5 - trackWidth) / 2;
// LT255/75R17 nominal diameter: 17 + 2 * 255 * 0.75 / 25.4 = 32.06 in.
const tireRadius = (17 + (2 * 255 * 0.75) / 25.4) / 2;

export const jeepJkDana44Rear: AxleConfiguration = {
  id: 'jeep-jk-dana-44-rear-2007-2018',
  name: 'Jeep JK Wrangler Dana 44 rear (2007–2018)',
  shortName: 'JK D44 rear',
  group: 'Jeep',
  manufacturer: 'Dana / Spicer',
  vehicle: 'Jeep Wrangler JK and JK Unlimited (Rubicon standard, optional on other trims)',
  years: { from: 2007, to: 2018 },
  kind: 'solid',
  position: 'rear',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        8.89,
        'verified',
        ['motive-d44-488jk', 'dana-708107'],
        'The JK rear is the larger 226 mm Dana 44, not the 216 mm TJ size. Shown dashed. It is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        0,
        'estimated',
        ['crown-jk44-rear-shafts', 'yukon-1541h-jk-rear'],
        'Suppliers disagree. Crown has the passenger shaft 1.34 in longer, Yukon has the driver shaft 1.38 in longer. Either way the carrier is within about 0.7 in of center, so it is drawn centered.'
      ),
      dropBelowCenterline: dim(
        tireRadius - 10.2,
        'estimated',
        ['quadratec-jk-2007-specs', 'motive-d44-488jk'],
        'Jeep lists 10.2 in rear axle to ground on the Rubicon LT255/75R17. Nominal radius 16.03 in - 10.2 in = 5.8 in. Jeep likely measured at the loaded radius, which is smaller, so the true drop is probably 0.5 to 1 in less. Treat 5.8 in as an upper bound.'
      ),
      riseAboveCenterline: dim(
        5.75,
        'schematic',
        ['engineering-estimate'],
        'Housing top. Drawing only.'
      ),
      width: dim(
        12,
        'estimated',
        ['torqueking-idn107', 'engineering-estimate'],
        'Casting edges sit just outside the cover.'
      ),
      cover: {
        width: dim(
          9 + 3 / 8,
          'estimated',
          ['torqueking-idn107'],
          'Torque King size for 10-bolt Dana 44 covers. The 226 mm JK casting may be slightly larger.'
        ),
        height: dim(
          10 + 3 / 8,
          'estimated',
          ['torqueking-idn107'],
          'Torque King size for 10-bolt Dana 44 covers. The 226 mm JK casting may be slightly larger.'
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
        ['engineering-estimate'],
        'Typical Dana 44 rear tube. The JK size was not found in a supplier source. Measure with calipers.'
      )
    },
    wheelEnds: {
      kind: 'rear',
      floating: 'semi-float',
      wmsWidth: dim(
        trackWidth + 2 * wheelOffset,
        'community',
        ['quadratec-jk-2007-specs', 'xtreme4x4-prorock44-jk'],
        'Jeep rear track 61.9 in plus twice the 1.8 in wheel offset worked out on the front axle = 65.5 in. Same wheel front and rear.'
      ),
      brakeDiameter: dim(12.4, 'schematic', ['engineering-estimate'], 'Rear disc. Drawing only.'),
      flangeDiameter: dim(6, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(6.25, 'schematic', ['engineering-estimate']),
      hubLength: dim(2.5, 'schematic', ['engineering-estimate']),
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
      '(65.5 - 61.9) / 2 = 1.8 in (46 mm), from the front axle.'
    ),
    trackWidth: dim(
      trackWidth,
      'verified',
      ['quadratec-jk-2007-specs'],
      'Rear track 61.9 in (1572.3 mm).'
    )
  },
  facts: [
    {
      label: 'Pinion',
      value: 'Standard rotation (as on every rear axle)',
      status: 'derived',
      sourceIds: ['engineering-estimate']
    },
    { label: 'Pinion splines', value: '24', status: 'verified', sourceIds: ['motive-d44-488jk'] },
    { label: 'Ring gear bolts', value: '10', status: 'verified', sourceIds: ['motive-d44-488jk'] },
    {
      label: 'Axle shafts (Rubicon)',
      value: '32-spline, semi-float',
      status: 'verified',
      sourceIds: ['crown-jk44-rear-shafts', 'yukon-1541h-jk-rear']
    },
    {
      label: 'Bolt pattern',
      value: '5x5 in',
      status: 'verified',
      sourceIds: ['yukon-1541h-jk-rear']
    }
  ],
  sources,
  notes: [
    'The JK rear Dana 44 uses an 8.89 in (226 mm) ring gear, larger than the TJ Dana 44. Gears do not swap between them.',
    "The drop comes from Jeep's own rear axle to ground figure, using the nominal tire radius. That makes it an upper bound, so the clearance shown is slightly pessimistic.",
    'Which side the carrier sits on is not settled: two shaft suppliers list opposite long sides. The offset is under 1 in either way.',
    'Rubicons have 32-spline shafts for the Tru-Lok locker. Some non-Rubicon JKs also got a Dana 44 rear with the same ring gear; check the shaft spline count before buying parts.'
  ]
};
