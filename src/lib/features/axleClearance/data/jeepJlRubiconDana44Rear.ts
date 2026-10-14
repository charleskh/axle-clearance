import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'stellantis-2024-wrangler-specs',
    title:
      '2024 Jeep Wrangler specification chart (Stellantis media data, reprinted by PickupTruckTalk)',
    kind: 'manufacturer',
    url: 'https://pickuptrucktalk.com/2023/04/2024-jeep-wrangler-specification-chart/',
    excerpt:
      'Track front and rear: Sport and Sahara 62.9 (1,598); Rubicon 64.4 (1,636); Xtreme 35 Pkg and Rubicon 392 66.9 (1,699). Rubicon LT285/70R17C on 17 x 7.5 in wheels. GAWR Rubicon front 3,100, rear 3,550. Rear: Dana 44 HD Full Float (Rubicon models).'
  },
  {
    id: 'quadratec-jl-2018-specs',
    title: 'Quadratec: 2018 Jeep Wrangler JL specifications (reprint of Jeep data)',
    kind: 'supplier',
    url: 'https://www.quadratec.com/c/blog/2018-jeep-wrangler-specifications',
    excerpt:
      'Rear Dana 35, Dana 44 on Rubicon models; Tru-Lok electronic locking (Rubicon). Rubicon LT285/70R17C, 17 x 7.5 in. Ground clearance 10.8 in with LT285/70R17 (Rubicon), measurement point not stated.'
  },
  {
    id: 'quadratec-dana-jl-rear-rp',
    title: 'Quadratec: Dana Spicer Dana 44 rear ring and pinion, Wrangler JL / Gladiator JT',
    kind: 'supplier',
    url: 'https://www.quadratec.com/p/dana-spicer/dana-44-rear-ring-pinion-wrangler-jl-gladiator-jt',
    excerpt: '8.660 in ring gear diameter. 28-spline, 1.750 in pinion.'
  },
  {
    id: 'motive-d44-488jl',
    title: 'Motive Gear D44-488JL ring and pinion, Dana AdvanTEK M220 rear',
    kind: 'supplier',
    url: 'https://www.motivegear.com/auto-parts-product/384871-differential-ring-and-pinion-12-bolt-d44-488jl',
    excerpt:
      '8.66 in ring gear outside diameter. 12-bolt cover. 2018-2023 Wrangler JL and 2020-2023 Gladiator.'
  },
  {
    id: 'yukon-jl-rear-shafts',
    title: 'Quadratec: Yukon double-drilled axle kit for 18-22 JL Rubicon Dana 44 rear',
    kind: 'supplier',
    url: 'https://oms.quadratec.com/c-1011240.html',
    excerpt:
      'Passenger side (Right) 33.9". Driver side (Left) 32.2". Spline count 32. Dual bolt pattern 5 x 5" & 5 x 5.5". Dana 44 - Rubicon Rear.'
  },
  {
    id: 'quadratec-prorock44-jl-67-9',
    title: 'Quadratec: Dynatrac ProRock 44 housing, 67.9 in front, stock JL (JL44-1X3010-C)',
    kind: 'supplier',
    url: 'https://oms.quadratec.com/52442-3022-prorock-44-housing-67-9-frt-stock-jl-jl44-1x3010-c.html',
    excerpt:
      'PROROCK 44 HOUSING 67.9 FRT STOCK JL. Offered in 67.9 in for Rubicon and 66.4 in for Sport and Sahara.'
  },
  {
    id: 'quadratec-jl-axle-qa',
    title: 'Quadratec product Q&A: JL axle identification',
    kind: 'community',
    url: 'https://www.quadratec.com/node/1017809/questions',
    excerpt:
      "Rubicon's, Max Tow and all Gladiator JT packages would have the M210/M220 front and rear respectively. Sahara and Sport could be ordered with an M220 rear."
  },
  {
    id: 'au-gladiator-specs',
    title: '4X4 Australia: 2024 Jeep Gladiator Rubicon JT specifications',
    kind: 'community',
    url: 'https://www.4x4australia.com.au/specs/2024-jeep-gladiator-rubicon-4x4-jt-my23-petrol-dual-cab-utility-Az8yP4nGuG',
    excerpt: 'Tracking front 1636 mm, tracking rear 1636 mm.'
  },
  {
    id: 'wayalife-jl-axles',
    title:
      'WayAlife forum: JL Wrangler axles, Dana M186 and M210 front / M200 and M220 rear (pre-launch)',
    kind: 'community',
    url: 'https://www.wayalife.com/goto/post?id=987432',
    excerpt:
      'The M220 rear will have a ring gear that measures 8.66 in. Rubicon axles measure 68 in wide.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Drawing-only shapes and estimates. Must be measured on a real housing before being trusted.'
  }
];

const trackWidth = 1636 * MM;
const wheelOffset = (67.9 - trackWidth) / 2;

export const jeepJlRubiconDana44Rear: AxleConfiguration = {
  id: 'jeep-jl-rubicon-dana-44-m220-rear-2018-2023',
  name: 'Jeep JL Wrangler / JT Gladiator Rubicon Dana 44 M220 rear (2018–2023)',
  shortName: 'JL/JT Rubicon M220 rear',
  group: 'Jeep',
  manufacturer: 'Dana / Spicer (AdvanTEK)',
  vehicle: 'Jeep Wrangler JL Rubicon (2018 to 2023, semi-float); Gladiator JT (2020 on)',
  years: { from: 2018, to: 2023 },
  kind: 'solid',
  position: 'rear',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        220 * MM,
        'verified',
        ['quadratec-dana-jl-rear-rp', 'motive-d44-488jl'],
        'M220 means a 220 mm (8.66 in) ring gear. Shown dashed. It is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        (33.9 - 32.2) / 2,
        'derived',
        ['yukon-jl-rear-shafts'],
        'Slightly driver side. Yukon lists the shafts at 32.2 in (driver) and 33.9 in (passenger), so the carrier sits (33.9 - 32.2) / 2 = 0.85 in toward the driver side. One source only.'
      ),
      dropBelowCenterline: dim(
        5.5,
        'estimated',
        ['engineering-estimate', 'quadratec-jl-2018-specs', 'quadratec-dana-jl-rear-rp'],
        'Bounded, not measured. Jeep lists 10.8 in minimum ground clearance on the 32.7 in LT285/70R17, so no axle drops more than 16.35 - 10.8 = 5.55 in (nominal radius). A 4.33 in ring gear radius plus wall lands near 5.5 in, just under that bound. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        5.75,
        'schematic',
        ['engineering-estimate'],
        'Housing top. Drawing only.'
      ),
      width: dim(
        12.5,
        'estimated',
        ['engineering-estimate'],
        'Casting edges sit just outside the 12-bolt cover.'
      ),
      cover: {
        width: dim(
          10.5,
          'estimated',
          ['engineering-estimate', 'motive-d44-488jl'],
          '12-bolt cover. No published size found.'
        ),
        height: dim(
          10.75,
          'estimated',
          ['engineering-estimate', 'motive-d44-488jl'],
          '12-bolt cover. No published size found.'
        ),
        boltCount: 12,
        boltCircle: dim(
          9.5,
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
        'No published OD found. Measure with calipers.'
      )
    },
    wheelEnds: {
      kind: 'rear',
      floating: 'semi-float',
      wmsWidth: dim(
        trackWidth + 2 * wheelOffset,
        'derived',
        ['stellantis-2024-wrangler-specs', 'quadratec-prorock44-jl-67-9'],
        'Jeep rear track 64.4 in plus twice the 1.74 in wheel offset worked out on the front axle = 67.9 in. Same wheel front and rear.'
      ),
      brakeDiameter: dim(13.5, 'schematic', ['engineering-estimate'], 'Rear disc. Drawing only.'),
      flangeDiameter: dim(6, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(6.25, 'schematic', ['engineering-estimate']),
      hubLength: dim(2.5, 'schematic', ['engineering-estimate']),
      boltPattern: '5x5 in (5x127 mm)'
    }
  },
  wheel: {
    diameter: dim(
      17,
      'verified',
      ['stellantis-2024-wrangler-specs', 'quadratec-jl-2018-specs'],
      'Rubicon tire LT285/70R17C.'
    ),
    width: dim(7.5, 'verified', ['stellantis-2024-wrangler-specs'], 'Rubicon 17 x 7.5 in.'),
    offset: dim(
      wheelOffset,
      'derived',
      ['quadratec-prorock44-jl-67-9', 'stellantis-2024-wrangler-specs'],
      '(67.9 - 64.4) / 2 = 1.74 in (44 mm), from the front axle.'
    ),
    trackWidth: dim(
      trackWidth,
      'verified',
      ['stellantis-2024-wrangler-specs', 'au-gladiator-specs'],
      'Rubicon rear track 1,636 mm (64.4 in). Gladiator Rubicon lists the same 1,636 mm.'
    )
  },
  facts: [
    {
      label: 'Pinion',
      value: 'Standard rotation (as on every rear axle)',
      status: 'derived',
      sourceIds: ['engineering-estimate']
    },
    {
      label: 'Pinion size',
      value: '28-spline, 1.750 in',
      status: 'verified',
      sourceIds: ['quadratec-dana-jl-rear-rp']
    },
    { label: 'Cover bolts', value: '12', status: 'verified', sourceIds: ['motive-d44-488jl'] },
    {
      label: 'Axle shafts (Rubicon)',
      value: '32-spline, semi-float',
      status: 'verified',
      sourceIds: ['yukon-jl-rear-shafts']
    },
    {
      label: 'Locker',
      value: 'Tru-Lok electronic locker on Rubicon',
      status: 'verified',
      sourceIds: ['quadratec-jl-2018-specs']
    },
    {
      label: 'Gross axle weight rating',
      value: '3,550 lb rear (2024 Rubicon 4-door)',
      status: 'verified',
      sourceIds: ['stellantis-2024-wrangler-specs']
    },
    {
      label: 'Fitment',
      value: 'JL Rubicon, JL Max Tow, all Gladiator JT; optional on Sport and Sahara',
      status: 'community',
      sourceIds: ['quadratec-jl-axle-qa']
    },
    {
      label: '2024 on',
      value: 'Wrangler Rubicon moved to a Dana 44 HD full-float rear',
      status: 'verified',
      sourceIds: ['stellantis-2024-wrangler-specs']
    }
  ],
  sources,
  notes: [
    'From 2024 the Wrangler Rubicon has a full-float Dana 44 HD rear. This entry is the 2018 to 2023 semi-float M220. The full-float wheel ends are not modelled here.',
    'This entry also covers the Gladiator JT rear at the same 64.4 in Rubicon track. Whether the JT got the 2024 full-float change was not checked.',
    "The drop is an estimate held under the bound from Jeep's published minimum ground clearance. Measure your housing and calibrate.",
    'Sport and Sahara models with the optional M220 sit on a narrower 62.9 in track. Do not use these widths for them.'
  ]
};
