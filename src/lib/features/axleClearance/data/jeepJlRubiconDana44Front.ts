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
      'Front Dana 30, Dana 44 on Rubicon models; Tru-Lok electronic locking (Dana 44). Rubicon LT285/70R17C, 17 x 7.5 in. Ground clearance 10.8 in with LT285/70R17 (Rubicon), measurement point not stated.'
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
    id: 'motive-d44-456jlf',
    title: 'Motive Gear D44-456JLF ring and pinion, Dana AdvanTEK M210 front',
    kind: 'supplier',
    url: 'https://www.motivegear.com/auto-parts-product/397789-differential-ring-and-pinion-12-bolt-d44-456jlf/',
    excerpt:
      'Ring gear diameter 8.27 in. 10 ring gear bolts. 28 spline pinion. Rotation: Reverse. Position: Front. Dana AdvanTEK M210, Dana 44 JL Reverse. 2018-2023 Wrangler, 2020-2023 Gladiator. Cover bolt quantity 12.'
  },
  {
    id: 'spicer-10050979',
    title: 'Spicer 10050979 Dana 44 AdvanTEK M210 front ring and pinion (90Racing listing)',
    kind: 'supplier',
    url: 'https://90racing.com/products/dana-spicer-ring-and-pinion-10050979',
    excerpt:
      'Axle type M210. Ring gear diameter 8.270 in. 10 ring gear bolts. Fits 2018-2022 Wrangler Rubicon and 2020-2022 Gladiator.'
  },
  {
    id: 'yukon-jl-front-inners',
    title: 'Quadratec: Yukon inner axle shafts for 18-19 JL Rubicon Dana 44 front',
    kind: 'supplier',
    url: 'https://oms.quadratec.com/c-1011210.html',
    excerpt: 'Driver Side = 21.3". Passenger Side = 34.7". Spline Count - 32.'
  },
  {
    id: 'quadratec-jl-axle-qa',
    title: 'Quadratec product Q&A: JL axle identification',
    kind: 'community',
    url: 'https://www.quadratec.com/node/1017809/questions',
    excerpt:
      "Rubicon's, Max Tow and all Gladiator JT packages would have the M210/M220 front and rear respectively."
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
      'Rubicon M210 front and M220 rear measure 68 in wide. Sport and Sahara M220 option is 66.5 in wide. Tubes are larger and thicker than on the JK (no figure given).'
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
const wmsWidth = 67.9;
const wheelOffset = (wmsWidth - trackWidth) / 2;

export const jeepJlRubiconDana44Front: AxleConfiguration = {
  id: 'jeep-jl-rubicon-dana-44-m210-front-2018-2026',
  name: 'Jeep JL Wrangler / JT Gladiator Rubicon Dana 44 M210 front (2018–2026)',
  shortName: 'JL/JT Rubicon M210 front',
  group: 'Jeep',
  manufacturer: 'Dana / Spicer (AdvanTEK)',
  vehicle: 'Jeep Wrangler JL Rubicon (2018 on); Gladiator JT Rubicon and other JT trims (2020 on)',
  years: { from: 2018, to: 2026 },
  kind: 'solid',
  position: 'front',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        210 * MM,
        'verified',
        ['motive-d44-456jlf', 'spicer-10050979'],
        'M210 means a 210 mm (8.27 in) ring gear. Some retailer listings say 8.66 in, which is the M220 rear. Shown dashed. It is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        (34.7 - 21.3) / 2,
        'derived',
        ['yukon-jl-front-inners'],
        'Driver side. Yukon lists the inner shafts at 21.3 in (driver) and 34.7 in (passenger), so the carrier sits (34.7 - 21.3) / 2 = 6.7 in toward the driver side.'
      ),
      dropBelowCenterline: dim(
        5.25,
        'estimated',
        ['engineering-estimate', 'quadratec-jl-2018-specs', 'motive-d44-456jlf'],
        'Bounded, not measured. Jeep lists 10.8 in minimum ground clearance on the 32.7 in LT285/70R17, so no axle drops more than 16.35 - 10.8 = 5.55 in (nominal radius). 4.13 in ring gear radius plus wall gives about 5.25 in. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        6,
        'schematic',
        ['engineering-estimate'],
        'High-pinion housing top. Drawing only.'
      ),
      width: dim(
        12,
        'estimated',
        ['engineering-estimate'],
        'Casting edges sit just outside the 12-bolt cover.'
      ),
      cover: {
        width: dim(
          10,
          'estimated',
          ['engineering-estimate', 'motive-d44-456jlf'],
          '12-bolt cover. No published size found.'
        ),
        height: dim(
          10.25,
          'estimated',
          ['engineering-estimate', 'motive-d44-456jlf'],
          '12-bolt cover. No published size found.'
        ),
        boltCount: 12,
        boltCircle: dim(
          9,
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
        ['engineering-estimate', 'wayalife-jl-axles'],
        'No published OD found; the JL tubes are said to be larger and thicker than the JK. Measure with calipers.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'ball-joint',
      wmsWidth: dim(
        wmsWidth,
        'verified',
        ['quadratec-prorock44-jl-67-9', 'wayalife-jl-axles'],
        'Dynatrac sells its stock-width Rubicon replacement at 67.9 in. The Sport and Sahara M186 is 66.4 in.'
      ),
      cEndWidth: dim(3.25, 'schematic', ['engineering-estimate']),
      pivotSpan: dim(8.5, 'schematic', ['engineering-estimate'], 'Upper to lower ball joint.'),
      knuckleWidth: dim(3.75, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(5.5, 'schematic', ['engineering-estimate']),
      hubLength: dim(3, 'schematic', ['engineering-estimate']),
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
      '(67.9 - 64.4) / 2 = 1.74 in (44 mm), matching the common 44.45 mm factory offset.'
    ),
    trackWidth: dim(
      trackWidth,
      'verified',
      ['stellantis-2024-wrangler-specs', 'au-gladiator-specs'],
      'Rubicon track 1,636 mm (64.4 in), 1.5 in wider than Sport and Sahara. Gladiator Rubicon lists the same 1,636 mm.'
    )
  },
  facts: [
    {
      label: 'Pinion',
      value: 'Reverse rotation',
      status: 'verified',
      sourceIds: ['motive-d44-456jlf']
    },
    {
      label: 'Pinion height',
      value: 'High pinion (implied by reverse-rotation front gearing)',
      status: 'derived',
      sourceIds: ['motive-d44-456jlf']
    },
    { label: 'Pinion splines', value: '28', status: 'verified', sourceIds: ['motive-d44-456jlf'] },
    {
      label: 'Ring gear bolts',
      value: '10',
      status: 'verified',
      sourceIds: ['motive-d44-456jlf', 'spicer-10050979']
    },
    { label: 'Cover bolts', value: '12', status: 'verified', sourceIds: ['motive-d44-456jlf'] },
    {
      label: 'Inner axle shafts',
      value: '32-spline',
      status: 'verified',
      sourceIds: ['yukon-jl-front-inners']
    },
    {
      label: 'Differential side',
      value: 'Driver side (short inner shaft on the driver side)',
      status: 'derived',
      sourceIds: ['yukon-jl-front-inners']
    },
    {
      label: 'Locker',
      value: 'Tru-Lok electronic locker on Rubicon',
      status: 'verified',
      sourceIds: ['quadratec-jl-2018-specs']
    },
    {
      label: 'Gross axle weight rating',
      value: '3,100 lb front (2024 Rubicon 4-door)',
      status: 'verified',
      sourceIds: ['stellantis-2024-wrangler-specs']
    },
    {
      label: 'Fitment',
      value: 'JL Rubicon, JL Max Tow, all Gladiator JT',
      status: 'community',
      sourceIds: ['quadratec-jl-axle-qa']
    }
  ],
  sources,
  notes: [
    'This entry covers the Gladiator JT as well. JT Rubicon uses the same M210 front at the same 64.4 in track. Track for non-Rubicon JT trims was not checked.',
    'The M210 is a Dana AdvanTEK design with a 210 mm ring gear, smaller than the JK front Dana 44. JK gears and lockers do not fit.',
    "The drop is an estimate held under the bound from Jeep's published minimum ground clearance. Measure your housing and calibrate.",
    'Xtreme 35 and Rubicon 392 models have a wider 66.9 in track. Do not use these widths for them.'
  ]
};
