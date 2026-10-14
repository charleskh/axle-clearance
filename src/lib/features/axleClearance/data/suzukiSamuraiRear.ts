import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'zukn-specs-86',
    title: 'ZUK-N-OVATIONS (Syclone ATTCO): 1985-1987 Suzuki Samurai specs',
    kind: 'supplier',
    url: 'https://zuk-n-ovations.com/pages/tech/tech_86_samurai.html',
    excerpt:
      'Minimum ground clearance 8.1 in. (205 mm). Tire P205/70R15. Wheel 15" x 5" (381 x 127 mm). Ring and pinion 3.73:1. Gross axle weight rating front 1257 lb. (566 kg), rear 1675 lb. (754 kg).'
  },
  {
    id: 'zuwharrie-specs',
    title: 'Zuwharrie forum: 1986-1996 Samurai specs with year to year changes',
    kind: 'community',
    url: 'https://bbs.zuwharrie.com/threads/1986-1996-samurai-specs-with-year-to-year-changes.23802/',
    excerpt:
      '1986: tread width front 51.2 in. (1300 mm), rear 51.6 in. (1310 mm). Spec table reproduced without a stated source.'
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
    id: 'zukiworld-rear-offset',
    title: 'ZukiWorld forum: why not run a Tracker/Sidekick rear in a Samurai',
    kind: 'community',
    url: 'https://www.zukiworld.com/forum/general-suzuki-forum/why-not-run-a-trackick-rear-in-a-samurai/',
    excerpt:
      'The diff on a tracker is centered unlike the passenger offset diff on the samurai. Another owner: just measured and yea it is offset like 7 inches (method not described).'
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
    id: 'rockyroad-longfield',
    title: 'Rocky Road Outfitters: Longfield Samurai front axle kit',
    kind: 'supplier',
    url: 'https://rocky-road.com/shop/samurai-axle/',
    excerpt: '26 spline side gears ... 26 spline stock in the rear third.'
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
    id: 'trailgear-rock-assault',
    title: 'Trail-Gear: Rock Assault Samurai rear axle housing',
    kind: 'supplier',
    url: 'https://trail-gear.com/rock-assault-samurai-rear-axle-housing.html',
    excerpt:
      'Aftermarket Toyota-width housing offset for the Samurai transfer case, 3 in OD DOM tubes. Not the stock housing.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the ring gear, track and WMS above. Must be measured on a real housing before being trusted.'
  }
];

const trackWidth = 1310 * MM;
const wmsWidth = 52.2;
const wheelOffset = 0.5;

export const suzukiSamuraiRear: AxleConfiguration = {
  id: 'suzuki-samurai-rear-1986-1995',
  name: 'Suzuki Samurai rear (1986–1995)',
  shortName: 'Samurai rear',
  group: 'Suzuki',
  manufacturer: 'Suzuki',
  vehicle: 'Suzuki Samurai (SJ413, US market)',
  years: { from: 1986, to: 1995 },
  kind: 'solid',
  position: 'rear',
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
        -3.5,
        'estimated',
        ['zukiworld-rear-offset', 'engineering-estimate'],
        'Passenger side per owners. One owner reports "offset like 7 inches" without saying what was measured; read here as the difference between shaft sides, so half of that from center. Measure before trusting.'
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
          'Welded rear dome of the banjo housing, seen from behind.'
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
        ['trailgear-rock-assault', 'engineering-estimate'],
        'No published stock tube size found. Aftermarket Samurai housings use 3 in tube, and the stock one is visibly smaller. Measure before trusting.'
      )
    },
    wheelEnds: {
      kind: 'rear',
      floating: 'semi-float',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['zuwharrie-wms'],
        'Owner measurement of a stock 1986 rear axle.'
      ),
      brakeDiameter: dim(8.7, 'schematic', ['engineering-estimate'], 'Rear drum. Drawing only.'),
      flangeDiameter: dim(
        5.5,
        'schematic',
        ['engineering-estimate'],
        'Backing plate mount flange. Drawing only.'
      ),
      hubDiameter: dim(5.5, 'schematic', ['engineering-estimate']),
      hubLength: dim(2.5, 'schematic', ['engineering-estimate']),
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
      'Rear (52.2 - 51.6) / 2 = 0.3 in, front (52.5 - 51.2) / 2 = 0.65 in, so 0.5 in (about +13 mm) is used for both. ThreePiece lists -38 mm, which does not fit the measured widths, so it is not used.'
    ),
    trackWidth: dim(
      trackWidth,
      'community',
      ['zuwharrie-specs'],
      '1310 mm rear tread from a 1986 spec table reproduced on a forum. Likely Suzuki data, but the original was not found.'
    )
  },
  facts: [
    {
      label: 'Housing',
      value: 'Banjo housing with drop-out third member',
      status: 'verified',
      sourceIds: ['yukon-suzsam', 'rockyroad-longfield']
    },
    {
      label: 'Axle shafts',
      value: 'Semi-float, 26-spline side gears',
      status: 'verified',
      sourceIds: ['rockyroad-longfield']
    },
    { label: 'Ring gear bolts', value: '10', status: 'verified', sourceIds: ['yukon-suzsam'] },
    { label: 'Pinion', value: '26-spline pinion', status: 'verified', sourceIds: ['yukon-suzsam'] },
    { label: 'Stock ratio', value: '3.73:1', status: 'verified', sourceIds: ['zukn-specs-86'] },
    {
      label: 'Gross axle weight rating',
      value: '1675 lb (754 kg)',
      status: 'verified',
      sourceIds: ['zukn-specs-86']
    },
    {
      label: 'Differential side',
      value: 'Passenger side',
      status: 'community',
      sourceIds: ['zukiworld-rear-offset']
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
    'This is a third-member axle. Seen from behind, the center section is a welded dome with no cover bolts.',
    'Owners put the pumpkin on the passenger side, unlike the centered Sidekick and Tracker rear. The 3.5 in amount is an estimate.',
    'Track (51.6 in) comes from a reproduced 1986 spec table and WMS (52.2 in) from one owner measurement.',
    'The drop below centerline is worked out from the 8.1 in minimum ground clearance and the stock tire, without knowing where Suzuki measured it. Measure before trusting the absolute clearance.'
  ]
};
