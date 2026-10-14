import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'zukn-specs-86',
    title: 'ZUK-N-OVATIONS (Syclone ATTCO): 1985-1987 Suzuki Samurai specs',
    kind: 'supplier',
    url: 'https://zuk-n-ovations.com/pages/tech/tech_86_samurai.html',
    excerpt:
      'Minimum ground clearance 8.1 in. (205 mm). Tire P205/70R15. Wheel 15" x 5" (381 x 127 mm). Ring and pinion 3.73:1. Gross axle weight rating front 1257 lb. (566 kg), rear 1675 lb. (754 kg). Wheelbase 79.9 in. (2030 mm).'
  },
  {
    id: 'zuwharrie-specs',
    title: 'Zuwharrie forum: 1986-1996 Samurai specs with year to year changes',
    kind: 'community',
    url: 'https://bbs.zuwharrie.com/threads/1986-1996-samurai-specs-with-year-to-year-changes.23802/',
    excerpt:
      '1986: tread width front 51.2 in. (1300 mm), rear 51.6 in. (1310 mm). Front diff oil 4.2 US pt (2.0 L), rear 3.2 US pt (1.5 L). Spec table reproduced without a stated source.'
  },
  {
    id: 'zuwharrie-wms',
    title: 'Zuwharrie forum: front sammy axle width? (owner measurement by Orionn)',
    kind: 'community',
    url: 'https://bbs.zuwharrie.com/threads/front-sammy-axle-width.46588/',
    excerpt:
      'Stock 1986 Samurai axles: front 52.5" WMS to WMS, rear 52.2" WMS to WMS. Measurements may differ slightly due to build variation and parts sourcing.'
  },
  {
    id: 'yukon-suzsam',
    title: 'Yukon YG SUZSAM ring and pinion, Suzuki Samurai front or rear (dealer listing)',
    kind: 'supplier',
    url: 'https://completewebsol.com/product/high-performance-yukon-ring-pinion-gear-set-suzuki-samuri-457-538-ratio-yukon-gear-axle',
    excerpt:
      '6.875 inch ring gear diameter. 10 ring gear bolts. 26 spline pinion. Fits Suzuki Samurai front or rear, 1986-1995.'
  },
  {
    id: 'lowrange-sax4340',
    title:
      'Low Range Off-Road: SAX-4340LR Samurai HD front birfield axle set, installation instructions',
    kind: 'supplier',
    url: 'https://lowrangeoffroad.com/media/downloads/pdf/instructions/SAX-4340LR_HD-4340-Chromoly-Birfield-Axle-Set.pdf',
    excerpt:
      'These chromoly axles have 26 splines on the end that fits into the differential side gears. The OEM side gears are 23 spline. Removing the differential (3rd member). Birfield joint, axle shaft, steering knuckle.'
  },
  {
    id: 'rockyroad-longfield',
    title: 'Rocky Road Outfitters: Longfield Samurai front axle kit',
    kind: 'supplier',
    url: 'https://rocky-road.com/shop/samurai-axle/',
    excerpt:
      '33 spline axle shafts (driver and passenger side), sold as short side and long side. You will need to run 26 spline side gears in your front differential; 26 spline stock in the rear third.'
  },
  {
    id: 'suzukiclubuk-kingpin',
    title: 'Suzuki Club UK forum: SJ axle info',
    kind: 'community',
    url: 'https://forum.suzukiclubuk.co.uk/viewtopic.php?p=14157',
    excerpt: 'Kingpin bearings are 15x42x14.25 mm metric taper roller bearings, 30302.'
  },
  {
    id: 'threepiece-samurai',
    title: 'ThreePiece.us: Suzuki Samurai wheel fitment',
    kind: 'supplier',
    url: 'https://vehicles.threepiece.us/vehicles/suzuki/samurai/1986/',
    excerpt:
      'Lug pattern 5x139.7, 104 mm center bore, M12x1.25 nuts. Lists the factory wheel as 15x5.5 at -38 offset, which does not agree with the owner-measured WMS and the published track.'
  },
  {
    id: 'izook-toy-axles',
    title: 'izook.com: Toyota axles under a Samurai (build write-up)',
    kind: 'community',
    url: 'https://www2.izook.com/toy-axles/',
    excerpt:
      'The front passenger side spring perch needed to be clearanced to fit over the diff housing [of the passenger-drop Toyota front swapped in].'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the ring gear, track and WMS above. Must be measured on a real housing before being trusted.'
  }
];

const trackWidth = 1300 * MM;
const wmsWidth = 52.5;
const wheelOffset = 0.5;

export const suzukiSamuraiFront: AxleConfiguration = {
  id: 'suzuki-samurai-front-1986-1995',
  name: 'Suzuki Samurai front (1986–1995)',
  shortName: 'Samurai front',
  group: 'Suzuki',
  manufacturer: 'Suzuki',
  vehicle: 'Suzuki Samurai (SJ413, US market)',
  years: { from: 1986, to: 1995 },
  kind: 'solid',
  position: 'front',
  housing: {
    centerSection: {
      style: 'third-member',
      ringGearDiameter: dim(
        6.875,
        'verified',
        ['yukon-suzsam'],
        'Same ring gear front and rear. Shown dashed; it is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        -4,
        'estimated',
        ['izook-toy-axles', 'engineering-estimate'],
        'Passenger side is the usual description, but no source found states it outright for the front. The 4 in amount is a guess. Check your own axle and measure before trusting.'
      ),
      dropBelowCenterline: dim(
        4.6,
        'estimated',
        ['engineering-estimate', 'zukn-specs-86', 'yukon-suzsam'],
        'No published value found. The stock P205/70R15 is 26.3 in tall (13.15 in nominal radius); minus the 8.1 in minimum ground clearance gives 5.05 in, and a loaded radius about 0.9 in under nominal gives 4.2 in. 4.6 in sits between and clears the 3.44 in ring gear radius. Suzuki does not say where the 8.1 in was measured.'
      ),
      riseAboveCenterline: dim(
        4.5,
        'schematic',
        ['engineering-estimate'],
        'Third-member nose and housing top. Drawing only.'
      ),
      width: dim(
        9.5,
        'estimated',
        ['engineering-estimate'],
        'Banjo housing width around a 6.875 in ring gear. Drawing aid.'
      ),
      cover: {
        width: dim(
          8,
          'estimated',
          ['engineering-estimate'],
          'Welded rear dome of the banjo housing, facing forward on a front axle.'
        ),
        height: dim(8, 'estimated', ['engineering-estimate']),
        boltCount: 0,
        boltCircle: dim(0, 'schematic', ['engineering-estimate'], 'No bolts: welded dome.')
      },
      coverCenterHeight: dim(
        0,
        'estimated',
        ['engineering-estimate'],
        'Dome drawn concentric with the axle centerline.'
      )
    },
    tubes: {
      outerDiameter: dim(
        2.4,
        'estimated',
        ['engineering-estimate'],
        'No published stock tube size found (aftermarket Samurai housings use 3 in tube). Measure before trusting.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'closed-knuckle',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['zuwharrie-wms'],
        'Owner measurement of a stock 1986 front axle.'
      ),
      cEndWidth: dim(2.5, 'schematic', ['engineering-estimate'], 'Knuckle flange on the tube end.'),
      pivotSpan: dim(7, 'schematic', ['engineering-estimate'], 'Upper to lower kingpin bearing.'),
      knuckleWidth: dim(7, 'schematic', ['engineering-estimate'], 'Knuckle ball diameter.'),
      hubDiameter: dim(4.5, 'schematic', ['engineering-estimate']),
      hubLength: dim(3, 'schematic', ['engineering-estimate']),
      boltPattern: '5x139.7 mm (5x5.5 in)'
    }
  },
  wheel: {
    diameter: dim(15, 'verified', ['zukn-specs-86'], 'Stock 15x5 wheel with P205/70R15 tire.'),
    width: dim(5, 'verified', ['zukn-specs-86']),
    offset: dim(
      wheelOffset,
      'estimated',
      ['zuwharrie-wms', 'zuwharrie-specs', 'threepiece-samurai'],
      'Front (52.5 - 51.2) / 2 = 0.65 in, rear (52.2 - 51.6) / 2 = 0.3 in, so 0.5 in (about +13 mm) is used for both. ThreePiece lists -38 mm, which would put the track about 3 in outside the measured WMS, so it is not used.'
    ),
    trackWidth: dim(
      trackWidth,
      'community',
      ['zuwharrie-specs'],
      '1300 mm front tread from a 1986 spec table reproduced on a forum. Likely Suzuki data, but the original was not found.'
    )
  },
  facts: [
    {
      label: 'Housing',
      value: 'Banjo housing with drop-out third member',
      status: 'verified',
      sourceIds: ['lowrange-sax4340']
    },
    {
      label: 'Steering pivots',
      value: 'Closed knuckle on kingpin bearings (30302 taper rollers) around a Birfield joint',
      status: 'community',
      sourceIds: ['lowrange-sax4340', 'suzukiclubuk-kingpin']
    },
    { label: 'Ring gear bolts', value: '10', status: 'verified', sourceIds: ['yukon-suzsam'] },
    { label: 'Pinion', value: '26-spline pinion', status: 'verified', sourceIds: ['yukon-suzsam'] },
    {
      label: 'Side gears',
      value: '23-spline OEM front (rear third member uses 26)',
      status: 'verified',
      sourceIds: ['lowrange-sax4340', 'rockyroad-longfield']
    },
    { label: 'Stock ratio', value: '3.73:1', status: 'verified', sourceIds: ['zukn-specs-86'] },
    {
      label: 'Gross axle weight rating',
      value: '1257 lb (566 kg)',
      status: 'verified',
      sourceIds: ['zukn-specs-86']
    },
    {
      label: 'Bolt pattern',
      value: '5x139.7 mm, 104 mm center bore',
      status: 'verified',
      sourceIds: ['threepiece-samurai']
    }
  ],
  sources,
  notes: [
    'This is a third-member axle. The face you see from the front is a welded dome, not a bolt-on cover.',
    'Track (51.2 in) comes from a reproduced 1986 spec table and WMS (52.5 in) from one owner measurement. The differential side and offset are not confirmed by any source found, so check the pumpkin on your own truck.',
    'The drop below centerline is worked out from the 8.1 in minimum ground clearance and the stock tire, without knowing where Suzuki measured it. Measure before trusting the absolute clearance.',
    'Stock birfields and 23-spline inner shafts are the weak point. Common upgrades are 26-spline side gears with chromoly shafts, or a Toyota axle swap.'
  ]
};
