import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'quadratec-tj-2003-specs',
    title: 'Quadratec: 2003 Jeep Wrangler TJ factory specifications (reprint of Jeep data)',
    kind: 'supplier',
    url: 'https://www.quadratec.com/c/reference/2003-jeep-wrangler-tj-specs',
    excerpt:
      'Rubicon: transfer case NV241 Rock-Trac; front axle DANA 44 (216 mm); rear axle DANA 44 (216 mm). Other 4x4 trims: front Dana 30 (181 mm), rear Dana 35c (194 mm), Dana 44 rear optional. Ground clearance 8.2 in (measurement point not stated).'
  },
  {
    id: 'cars-com-2003-rubicon',
    title: 'Cars.com: 2003 Jeep Wrangler Rubicon specs',
    kind: 'community',
    url: 'https://www.cars.com/research/jeep-wrangler-2003/specs/101307/',
    excerpt:
      'Track width front 58 in, rear 58 in. Tires LT245/75R16. Wheels 16 x 8 in. Min ground clearance 8 in.'
  },
  {
    id: 'threepiece-tj-rubicon',
    title: 'ThreePiece.us: 2005 Jeep Wrangler TJ Rubicon OE wheel fitment',
    kind: 'community',
    url: 'https://vehicles.threepiece.us/vehicles/jeep/tj/2005/rubicon/',
    excerpt: 'Factory 5x114.3 bolt pattern, 71.6 mm center bore, stock 16x8 wheels at 30 mm offset.'
  },
  {
    id: 'tjforum-front-axles',
    title: 'WranglerTJForum: TJ front axle reference (owner compiled)',
    kind: 'community',
    url: 'https://wranglertjforum.com/goto/post?id=173',
    excerpt:
      'Rubicon Dana 44 front: 8.5 in ring gear, low pinion, 26-spline pinion, axle shafts 30 inner / 27 outer splines, WMS-WMS approximately 60.5 in.'
  },
  {
    id: 'alloyusa-tj44-pass-inner',
    title:
      'Quadratec: Alloy USA 10114 30-spline passenger side inner axle shaft, TJ Rubicon Dana 44',
    kind: 'supplier',
    url: 'https://www.quadratec.com/products/52400_7004.htm',
    excerpt: 'Measures 31.88" long. Fits the Dana 44 front axle in 2003-2006 Jeep Wrangler Rubicon.'
  },
  {
    id: 'alloyusa-tj44-driver-inner',
    title: 'Quadratec: Alloy USA 30-spline driver side inner axle shaft, TJ / LJ Rubicon Dana 44',
    kind: 'supplier',
    url: 'https://www.quadratec.com/products/52400_7010.htm',
    excerpt:
      'Driver side inner shaft for 97-06 TJ and Unlimited Rubicon with Dana 44 measures 16.625" long.'
  },
  {
    id: 'yukon-tj44-inners',
    title: 'Yukon 1541H TJ Rubicon Dana 44 front inner axles (retailer listings)',
    kind: 'supplier',
    url: 'https://tamelessperformance.com/products/dana-44-inner-axle-replacement-31-84-inch-30-spline-d44-tj-only-rubicon-right-hand-front-inner-axle-1541h-yukon-gear',
    excerpt:
      'Right hand front inner 31.84 in, 30 spline, TJ Rubicon only. Left hand front inner 16.96 in.'
  },
  {
    id: 'extremeterrain-alloy44-tj',
    title: 'ExtremeTerrain: Alloy USA 30-spline Dana 44 front axle shafts, 2003-2006 TJ Rubicon',
    kind: 'supplier',
    url: 'https://www.extremeterrain.com/alloy-usa-30-spline-alloy-44-tj-12165.html',
    excerpt:
      'The outer spline count is 27, and the inner is 30 splines. Fits 2003 - 2006 TJ Wrangler Rubicon models only.'
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
      "For most Jeeps like the JK, TJ, XJ, you'll want to find a Dana 44 with a driver's-side drop, since that will allow the axle to line up with the OEM transfer case."
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

export const jeepTjRubiconDana44Front: AxleConfiguration = {
  id: 'jeep-tj-rubicon-dana-44-front-2003-2006',
  name: 'Jeep TJ Rubicon Dana 44 front (2003–2006)',
  shortName: 'TJ Rubicon D44 front',
  group: 'Jeep',
  manufacturer: 'Dana / Spicer',
  vehicle: 'Jeep Wrangler TJ Rubicon and LJ Unlimited Rubicon',
  years: { from: 2003, to: 2006 },
  kind: 'solid',
  position: 'front',
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
        7.5,
        'derived',
        [
          'alloyusa-tj44-pass-inner',
          'alloyusa-tj44-driver-inner',
          'yukon-tj44-inners',
          'jkforum-d44-tech'
        ],
        'Driver side. Passenger inner shaft is 31.84 to 31.88 in and the driver inner is 16.63 to 16.96 in, so the carrier sits (31.86 - 16.79) / 2 = 7.5 in toward the short (driver) side. Assumes both outer stubs are the same length.'
      ),
      dropBelowCenterline: dim(
        5.25,
        'estimated',
        ['engineering-estimate', 'quadratec-yukon-tj-rp', 'torqueking-idn107'],
        'No published value found. 4.25 in ring gear radius plus about 1 in of oil clearance and housing wall. The 8.2 in factory ground clearance is not an axle figure (it would imply 7 in of drop on 30.5 in tires), so it was not used. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        5.5,
        'schematic',
        ['engineering-estimate'],
        'Low-pinion housing top. Drawing only.'
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
        2.75,
        'estimated',
        ['engineering-estimate', 'jkforum-d44-tech'],
        'Dana 44 tubes run 2.75 to 3 in OD. The TJ Rubicon front size was not found in a supplier source. Measure with calipers.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'ball-joint',
      wmsWidth: dim(
        trackWidth + 2 * wheelOffset,
        'community',
        ['cars-com-2003-rubicon', 'threepiece-tj-rubicon', 'tjforum-front-axles'],
        '58 in track plus twice the 30 mm OE wheel offset = 60.4 in. Owners report about 60.5 in. Neither input is a Jeep document, so treat this as within about 1 in.'
      ),
      cEndWidth: dim(3, 'schematic', ['engineering-estimate']),
      pivotSpan: dim(8, 'schematic', ['engineering-estimate'], 'Upper to lower ball joint.'),
      knuckleWidth: dim(3.5, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(5, 'schematic', ['engineering-estimate']),
      hubLength: dim(3, 'schematic', ['engineering-estimate']),
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
      'ET30. A forum post quotes 5 in backspacing for Moab wheels, which would be closer to ET13, so treat this as unconfirmed.'
    ),
    trackWidth: dim(
      trackWidth,
      'community',
      ['cars-com-2003-rubicon'],
      'Front track 58 in, as listed by Cars.com from Jeep data.'
    )
  },
  facts: [
    {
      label: 'Pinion',
      value: 'Low pinion, standard rotation',
      status: 'verified',
      sourceIds: ['quadratec-yukon-tj-rp', 'tjforum-front-axles']
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
      value: '30-spline inner, 27-spline outer',
      status: 'verified',
      sourceIds: ['extremeterrain-alloy44-tj', 'tjforum-front-axles']
    },
    {
      label: 'Differential side',
      value: 'Driver side (short inner shaft on the driver side)',
      status: 'derived',
      sourceIds: ['alloyusa-tj44-pass-inner', 'alloyusa-tj44-driver-inner', 'jkforum-d44-tech']
    },
    {
      label: 'Locker',
      value: 'Tru-Lok selectable locker, factory',
      status: 'community',
      sourceIds: ['rockcrawler-rubicon-launch']
    },
    {
      label: 'Transfer case',
      value: 'NV241 Rock-Trac',
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
    'Many guides call the TJ front a passenger-side drop. Supplier shaft lengths say otherwise: the passenger inner shaft is about 15 in longer, which puts the carrier on the driver side.',
    'Track and WMS come from third-party listings and owner reports, not a Jeep document. They agree with each other to about 0.1 in.',
    'The drop below centerline is an estimate from the 8.5 in ring gear. Measure your housing and calibrate before trusting the absolute clearance.',
    'The non-Rubicon TJ used a Dana 30 front with a smaller 181 mm ring gear. Do not use these numbers for it.'
  ]
};
