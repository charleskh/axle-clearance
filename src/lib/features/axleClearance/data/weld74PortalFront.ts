import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: '74weld-jeep-portal',
    title: '74Weld: Jeep Wrangler Portal Axle (JL/JT four-portal kit)',
    kind: 'manufacturer',
    url: 'https://74weld.com/products/jeep-portal-axle',
    excerpt:
      '1.22 gear reduction. 3.88 in lift. 8 lug 1-Ton hub conversion. Billet 7075 knuckle with steel inserts, billet 6061 portal box. 14 in vented rotors front, 13.75 in rear. 17 in minimum wheel diameter with 5 in to 6 in of backspacing recommended. Fits 2018+ Rubicon, Mojave and 392 JL axles. No width figures.'
  },
  {
    id: '74weld-portals-collection',
    title: '74Weld: All Portals collection',
    kind: 'manufacturer',
    url: 'https://74weld.com/collections/portals',
    excerpt:
      'Bolt-on portal kits for New-Gen and Legacy Toyota, Bronco/Ranger Raptor, Jeep Wrangler, Jeep Gladiator, Full-Size Legacy Toyota and RCLT Toyota, plus a 2 Gear Crawler Portal and a 4 Gear Race Portal. They sell portal boxes and uprights, not complete axle housings.'
  },
  {
    id: 'sdhq-currie-74weld',
    title: 'SDHQ Off Road: Currie 44/60 Jeep Portal Axle Package (74Weld bolt-on portals)',
    kind: 'supplier',
    url: 'https://sdhqoffroad.com/products/currie-44-60-jeep-portal-axle-package',
    excerpt:
      'The axle width with portals installed is 73.25 inches. The effective overall width with a 25 mm positive offset wheel is 71 inches. Requires 8 x 6.5 (8 x 165.1 mm) wheels. 3.9 in of axle lift. 22% gear reduction. Front: Currie 44 high-pinion center, 3 x .5 in wall DOM tubes, 35 spline. Rear: Currie HD60 center, 3.5 in x .375 in wall DOM tubes, 35 spline full-floating 4340 shafts. Tires up to 42 in.'
  },
  {
    id: 'jl-dana44-front-data',
    title: 'This project: Jeep JL Rubicon Dana 44 front data file',
    kind: 'engineering',
    excerpt:
      'Driver-side carrier offset of 6.7 in derived from Yukon inner shaft lengths (21.3 in and 34.7 in), and a 5.25 in estimated drop for an 8.27 in ring gear.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be consistent with a Dana 44 size high-pinion center section and a bolt-on four-gear portal box. Must be measured before being trusted.'
  }
];

const wmsWidth = 73.25;
const wheelOffset = 25 * MM;
const trackWidth = wmsWidth - 2 * wheelOffset;

export const weld74PortalFront: AxleConfiguration = {
  id: 'aftermarket-currie-44-74weld-portal-front-jl',
  name: 'Jeep JL / JT Currie 44 with 74Weld portals front (2018–2026)',
  shortName: '74Weld portal Currie 44 front',
  group: 'Aftermarket',
  manufacturer: '74Weld portals on a Currie Enterprises 44 housing',
  vehicle: 'Jeep Wrangler JL and Gladiator JT (also sold for JK)',
  years: { from: 2018, to: 2026 },
  kind: 'solid',
  position: 'front',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        8.5,
        'estimated',
        ['engineering-estimate', 'sdhq-currie-74weld'],
        'Currie 44 takes Dana 44 size gears, about 8.5 in. The package listing does not state it. Shown dashed. It is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        (34.7 - 21.3) / 2,
        'estimated',
        ['jl-dana44-front-data', 'engineering-estimate'],
        'Driver side, assumed to follow the factory JL front layout (6.7 in). Currie does not publish its shaft lengths for this package.'
      ),
      dropBelowCenterline: dim(
        5.5,
        'estimated',
        ['engineering-estimate', 'jl-dana44-front-data'],
        'Axle tube centerline to diff low point. Not published. About 4.25 in ring gear radius plus a thick-wall Currie casting. The app adds the 3.88 in portal drop to the tire radius before subtracting this.'
      ),
      riseAboveCenterline: dim(
        6,
        'schematic',
        ['engineering-estimate'],
        'High-pinion housing top.'
      ),
      width: dim(12, 'estimated', ['engineering-estimate'], 'Not published.'),
      cover: {
        width: dim(10, 'estimated', ['engineering-estimate'], 'Dana 44 size cover.'),
        height: dim(10.25, 'estimated', ['engineering-estimate'], 'Dana 44 size cover.'),
        boltCount: 10,
        boltCircle: dim(9, 'schematic', ['engineering-estimate'], 'Drawing only.')
      },
      coverCenterHeight: dim(0, 'estimated', ['engineering-estimate'])
    },
    tubes: {
      outerDiameter: dim(3, 'verified', ['sdhq-currie-74weld'], '3 in x 0.5 in wall DOM.')
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'ball-joint',
      wmsWidth: dim(
        wmsWidth,
        'verified',
        ['sdhq-currie-74weld'],
        'Listed as "axle width with portals installed", read here as wheel mounting surface to wheel mounting surface. The 71 in effective width with a 25 mm wheel agrees with that reading.'
      ),
      cEndWidth: dim(3.25, 'schematic', ['engineering-estimate']),
      pivotSpan: dim(
        9,
        'schematic',
        ['engineering-estimate'],
        'Ball joints in the billet upright.'
      ),
      knuckleWidth: dim(4, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(6.5, 'schematic', ['engineering-estimate'], '8 lug 1-ton unit bearing.'),
      hubLength: dim(
        4.5,
        'schematic',
        ['engineering-estimate'],
        'Upright face to wheel mounting surface, including the portal box. Drawing only.'
      ),
      boltPattern: '8x6.5 in (8x165.1 mm)'
    }
  },
  wheel: {
    diameter: dim(17, 'verified', ['74weld-jeep-portal'], '17 in is the minimum 74Weld allows.'),
    width: dim(8.5, 'estimated', ['engineering-estimate'], 'Common width for 37 to 40 in tires.'),
    offset: dim(
      wheelOffset,
      'verified',
      ['sdhq-currie-74weld'],
      '25 mm positive, about 5.5 in backspacing, as recommended.'
    ),
    trackWidth: dim(
      trackWidth,
      'derived',
      ['sdhq-currie-74weld'],
      '73.25 - 2 x 25 mm (0.98 in) = 71.28 in, matching the listed 71 in effective width.'
    )
  },
  portal: {
    drop: dim(
      3.88,
      'verified',
      ['74weld-jeep-portal', 'sdhq-currie-74weld'],
      '74Weld lists 3.88 in of lift, which is the drop from axle shaft centerline to wheel centerline. SDHQ rounds it to 3.9 in of axle lift.'
    ),
    boxWidth: dim(
      3.5,
      'schematic',
      ['engineering-estimate'],
      'Four-gear billet box. Drawing only.'
    ),
    boxHeight: dim(10, 'schematic', ['engineering-estimate'], 'Drawing only.'),
    reductionRatio: 1.22
  },
  facts: [
    {
      label: 'Portal reduction',
      value: '1.22:1 (22%), four-gear box',
      status: 'verified',
      sourceIds: ['74weld-jeep-portal', 'sdhq-currie-74weld']
    },
    {
      label: 'What 74Weld sells',
      value:
        'Bolt-on portal boxes and billet uprights for existing axles, not housings. This entry uses the Currie package because it is the only one with published widths.',
      status: 'verified',
      sourceIds: ['74weld-portals-collection', 'sdhq-currie-74weld']
    },
    {
      label: 'Shafts',
      value: 'Currie 2-piece inner 35 spline, 1480 joint, forged 35 spline stub',
      status: 'verified',
      sourceIds: ['sdhq-currie-74weld']
    },
    {
      label: 'Brakes',
      value: '14 in vented front rotors with OEM calipers on adapters',
      status: 'verified',
      sourceIds: ['74weld-jeep-portal']
    },
    {
      label: 'Bolt pattern',
      value: '8x6.5 in (8x165.1 mm), 1-ton 8 lug unit bearings with JL ABS tone ring',
      status: 'verified',
      sourceIds: ['sdhq-currie-74weld', '74weld-jeep-portal']
    },
    {
      label: 'Pumpkin side',
      value: 'Driver side, assumed from the factory JL layout',
      status: 'estimated',
      sourceIds: ['jl-dana44-front-data']
    }
  ],
  sources,
  notes: [
    'The 3.88 in portal drop is a 74Weld figure, so the clearance gain over a conventional axle on the same tire is solid even though the diff drop is an estimate.',
    'Width figures come from the Currie 44/60 package that ships with 74Weld portals. On factory JL Rubicon axles with the 74Weld kit, 74Weld publishes no width, so expect it to differ.',
    '74Weld recommends 17 in or larger wheels with 5 in to 6 in of backspacing to keep scrub in check.',
    'Diff drop below the tube and the carrier offset are not published by Currie. Measure before trusting the absolute clearance.'
  ]
};
