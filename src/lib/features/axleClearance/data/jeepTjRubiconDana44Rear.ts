import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'quadratec-tj-2003-specs',
    title: 'Quadratec: 2003 Jeep Wrangler TJ factory specifications (reprint of Jeep data)',
    kind: 'supplier',
    url: 'https://www.quadratec.com/c/reference/2003-jeep-wrangler-tj-specs',
    excerpt:
      'Rubicon: front axle DANA 44 (216 mm); rear axle DANA 44 (216 mm). Other 4x4 trims: rear Dana 35c (194 mm), Dana 44 rear optional. Ground clearance 8.2 in (measurement point not stated).'
  },
  {
    id: 'cars-com-2003-rubicon',
    title: 'Cars.com: 2003 Jeep Wrangler Rubicon specs',
    kind: 'community',
    url: 'https://www.cars.com/research/jeep-wrangler-2003/specs/101307/',
    excerpt: 'Track width front 58 in, rear 58 in. Tires LT245/75R16. Wheels 16 x 8 in.'
  },
  {
    id: 'threepiece-tj-rubicon',
    title: 'ThreePiece.us: 2005 Jeep Wrangler TJ Rubicon OE wheel fitment',
    kind: 'community',
    url: 'https://vehicles.threepiece.us/vehicles/jeep/tj/2005/rubicon/',
    excerpt: 'Factory 5x114.3 bolt pattern, 71.6 mm center bore, stock 16x8 wheels at 30 mm offset.'
  },
  {
    id: 'quadratec-yukon-tj-rp',
    title: 'Quadratec: Yukon ring and pinion for 03-06 TJ Rubicon Dana 44 front or rear',
    kind: 'supplier',
    url: 'https://quadratec.com/p/yukon-gear-axle/ring-and-pinion-kit-jeep-wrangler-tj-rubicon-unlimited-rubicon-dana-44-axle',
    excerpt:
      '8.50" ring gear diameter, 26 spline pinion, 10 ring gear bolts. Standard rotation Dana Spicer 44 TJ Rubicon (front or rear).'
  },
  {
    id: 'yukon-tj44-rear-lh',
    title: 'Yukon alloy left hand rear axle, Dana 44 TJ Rubicon, 30 spline (retailer listing)',
    kind: 'supplier',
    url: 'https://tamelessperformance.com/products/alloy-replacement-left-hand-rear-axle-for-dana-44-jeep-rubicon-30-spline-29-21-inch-d44-jeep-rubicon-tj-left-hand-rear-axle-assembly-30-spline-yukon-gear',
    excerpt:
      'Left hand rear axle, Dana 44 Jeep Rubicon, 30 spline. Listed as 29.21 in in the title and 29.25 in elsewhere.'
  },
  {
    id: 'nitro-tj44-rear-rh',
    title:
      'West Coast Offroaders: Nitro Gear & Axle 30-spline 29-3/4" right hand rear axle shaft for Dana 44 (AXD75786-1X)',
    kind: 'supplier',
    url: 'https://westcoastoffroaders.com/products/nitro-gear-axle-30-spline-29-3-4-right-hand-rear-axle-shaft-for-dana-44-axd75786-1x',
    excerpt: 'Right hand rear, 30 spline, 29-3/4 in. 1997-2006 Jeep Wrangler TJ fitment.'
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
    id: 'rockcrawler-rubicon-launch',
    title:
      'Rockcrawler.com: Jeep brings Rubicon Wrangler to European market (Jeep release reprint)',
    kind: 'community',
    url: 'https://www.rockcrawler.com/features/newsshorts/03june/jeep_rubicon_euro.asp',
    excerpt:
      'Tru-Lok locking front and rear differentials; front and rear Dana 44 axles; 4.11:1 ratios.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the verified ring gear, cover and shaft sizes. Must be measured on a real housing before being trusted.'
  }
];

const trackWidth = 58;
const wheelOffset = 30 * MM;

export const jeepTjRubiconDana44Rear: AxleConfiguration = {
  id: 'jeep-tj-rubicon-dana-44-rear-2003-2006',
  name: 'Jeep TJ Rubicon Dana 44 rear (2003–2006)',
  shortName: 'TJ Rubicon D44 rear',
  group: 'Jeep',
  manufacturer: 'Dana / Spicer',
  vehicle:
    'Jeep Wrangler TJ Rubicon and LJ Unlimited Rubicon (also optional on other TJ 4x4 trims)',
  years: { from: 2003, to: 2006 },
  kind: 'solid',
  position: 'rear',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        216 * MM,
        'verified',
        ['quadratec-tj-2003-specs', 'quadratec-yukon-tj-rp'],
        'Jeep lists the Dana 44 as 216 mm; gear suppliers list 8.50 in. Shown dashed. It is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        0.25,
        'estimated',
        ['yukon-tj44-rear-lh', 'nitro-tj44-rear-rh'],
        'Close to centered. Left shaft 29.25 in, right shaft 29.75 in, so (29.75 - 29.25) / 2 = 0.25 in toward the driver side. The two lengths come from different vendors who may measure differently, so the side is not certain.'
      ),
      dropBelowCenterline: dim(
        5.25,
        'estimated',
        ['engineering-estimate', 'quadratec-yukon-tj-rp', 'torqueking-idn107'],
        'No published value found. 4.25 in ring gear radius plus about 1 in of oil clearance and housing wall. The 8.2 in factory ground clearance has no stated measurement point, so it was not used. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        5.5,
        'schematic',
        ['engineering-estimate'],
        'Housing top. Drawing only.'
      ),
      width: dim(
        11.5,
        'estimated',
        ['torqueking-idn107', 'engineering-estimate'],
        'Casting edges sit just outside the 9-3/8 in wide cover.'
      ),
      cover: {
        width: dim(9 + 3 / 8, 'verified', ['torqueking-idn107'], 'Approximate, per Torque King.'),
        height: dim(10 + 3 / 8, 'verified', ['torqueking-idn107'], 'Approximate, per Torque King.'),
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
        'Typical Dana 44 rear tube. The TJ size was not found in a supplier source. Measure with calipers.'
      )
    },
    wheelEnds: {
      kind: 'rear',
      floating: 'semi-float',
      wmsWidth: dim(
        trackWidth + 2 * wheelOffset,
        'community',
        ['cars-com-2003-rubicon', 'threepiece-tj-rubicon'],
        '58 in rear track plus twice the 30 mm OE wheel offset = 60.4 in. Neither input is a Jeep document, so treat this as within about 1 in.'
      ),
      brakeDiameter: dim(
        11.5,
        'schematic',
        ['engineering-estimate'],
        'Rubicon has rear discs. Drawing only.'
      ),
      flangeDiameter: dim(6, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(6, 'schematic', ['engineering-estimate']),
      hubLength: dim(2.5, 'schematic', ['engineering-estimate']),
      boltPattern: '5x4.5 in (5x114.3 mm)'
    }
  },
  wheel: {
    diameter: dim(16, 'community', ['cars-com-2003-rubicon'], 'Stock tire LT245/75R16.'),
    width: dim(8, 'community', ['cars-com-2003-rubicon'], '16 x 8 in per Cars.com.'),
    offset: dim(
      wheelOffset,
      'community',
      ['threepiece-tj-rubicon'],
      'ET30. Not confirmed against a Jeep document.'
    ),
    trackWidth: dim(
      trackWidth,
      'community',
      ['cars-com-2003-rubicon'],
      'Rear track 58 in, as listed by Cars.com from Jeep data.'
    )
  },
  facts: [
    {
      label: 'Pinion',
      value: 'Standard rotation',
      status: 'verified',
      sourceIds: ['quadratec-yukon-tj-rp']
    },
    {
      label: 'Pinion splines',
      value: '26',
      status: 'verified',
      sourceIds: ['quadratec-yukon-tj-rp']
    },
    {
      label: 'Ring gear bolts',
      value: '10',
      status: 'verified',
      sourceIds: ['quadratec-yukon-tj-rp']
    },
    {
      label: 'Axle shafts',
      value: '30-spline, semi-float',
      status: 'verified',
      sourceIds: ['yukon-tj44-rear-lh', 'nitro-tj44-rear-rh']
    },
    {
      label: 'Locker',
      value: 'Tru-Lok selectable locker, factory on Rubicon',
      status: 'community',
      sourceIds: ['rockcrawler-rubicon-launch']
    },
    {
      label: 'Non-Rubicon option',
      value: 'Dana 44 rear was optional on other TJ 4x4 trims (Dana 35c standard)',
      status: 'verified',
      sourceIds: ['quadratec-tj-2003-specs']
    },
    {
      label: 'Bolt pattern',
      value: '5x114.3 mm, 71.6 mm center bore',
      status: 'community',
      sourceIds: ['threepiece-tj-rubicon']
    }
  ],
  sources,
  notes: [
    'The carrier is close to the vehicle centerline. Shaft lengths from two vendors differ by only 0.5 in, which is inside their measuring tolerance.',
    'The drop below centerline is an estimate from the 8.5 in ring gear. Measure your housing and calibrate before trusting the absolute clearance.',
    'The optional Dana 44 rear on non-Rubicon TJs shares the 216 mm ring gear. It did not get the Tru-Lok locker, and its brakes and shafts were not checked here.',
    'Track and WMS come from third-party listings, not a Jeep document.'
  ]
};
