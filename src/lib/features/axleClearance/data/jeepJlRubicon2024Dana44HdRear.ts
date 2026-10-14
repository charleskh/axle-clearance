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
      'Rear: Dana 44 HD Full Float (Rubicon models). Tru-Lok electronic locking (Rubicon models). Ratios 3.45, 4.10 (Rubicon, Willys), 4.56 (Rubicon 392 and Xtreme 35 Pkg), 4.88 (opt Rubicon 3.6). Track front and rear: base 62.9 in (1,598 mm); Rubicon 64.4 in (1,636 mm); Xtreme 35 Pkg and Rubicon 392 66.9 in (1,699 mm). Rubicon LT285/70R17C on 17 x 7.5 in. GAWR Rubicon 4-door rear 3,550 lb. Ground clearance Rubicon (LT285/70R17) 10.8 in, measurement point not stated.'
  },
  {
    id: 'thedrive-2024-fullfloat',
    title: 'The Drive: Why the 2024 Jeep Wrangler Rubicon is switching to a full-float rear axle',
    kind: 'community',
    url: 'https://www.thedrive.com/news/why-the-2024-jeep-wrangler-rubicon-is-switching-to-a-full-float-rear-axle',
    excerpt:
      'Standard on the 2024 Rubicon, Rubicon X and Rubicon 392. The wheel mounts to a separate hub assembly on the spindle; the shaft only carries torque. 3.6 or 2.0 automatic Rubicons tow 5,000 lb.'
  },
  {
    id: 'yukon-jl-rear-shafts',
    title:
      'Quadratec: Yukon double-drilled axle kit for 18-22 JL Rubicon Dana 44 rear (semi-float)',
    kind: 'supplier',
    url: 'https://oms.quadratec.com/c-1011240.html',
    excerpt: 'Passenger side (Right) 33.9". Driver side (Left) 32.2". Spline count 32.'
  },
  {
    id: 'quadratec-prorock44-jl-67-9',
    title: 'Quadratec: Dynatrac ProRock 44 housing, 67.9 in front, stock JL (JL44-1X3010-C)',
    kind: 'supplier',
    url: 'https://oms.quadratec.com/52442-3022-prorock-44-housing-67-9-frt-stock-jl-jl44-1x3010-c.html',
    excerpt: 'PROROCK 44 HOUSING 67.9 FRT STOCK JL. 67.9 in for Rubicon.'
  },
  {
    id: 'revolution-jl-rear-kit',
    title: 'Quadratec: Revolution Gear Discovery Series Dana 44 rear axle kit, JL Rubicon',
    kind: 'supplier',
    url: 'https://www.quadratec.com/p/revolution-gear-and-axle/discovery-series-dana-44-rear-axle-kit-wrangler-jl-non-rubicon/32-spline-rubicon-dc-d44jl-Rubicon-rev',
    excerpt:
      '32 spline, 18-26 Wrangler JL and Gladiator Rubicon with Dana 44 (M220) rear. Dual 5x5 and 5x5.5 bolt pattern. Listings disagree on Rubicon vs non-Rubicon.'
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

export const jeepJlRubicon2024Dana44HdRear: AxleConfiguration = {
  id: 'jeep-jl-rubicon-dana-44-hd-full-float-rear-2024',
  name: 'Jeep JL Wrangler Rubicon Dana 44 HD full-float rear (2024–)',
  shortName: 'JL Rubicon 44 HD FF rear',
  group: 'Jeep',
  manufacturer: 'Dana / Spicer',
  vehicle: 'Jeep Wrangler JL Rubicon, Rubicon X, Rubicon 392 (2024 on)',
  years: { from: 2024, to: 2026 },
  kind: 'solid',
  position: 'rear',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        220 * MM,
        'estimated',
        ['engineering-estimate', 'revolution-jl-rear-kit'],
        'Assumed the same 220 mm (8.66 in) gear as the 2018 to 2023 M220. Jeep kept the same ratios, but no source states the HD ring gear size. Shown dashed. It is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        (33.9 - 32.2) / 2,
        'estimated',
        ['yukon-jl-rear-shafts', 'engineering-estimate'],
        'Slightly driver side, carried over from the semi-float M220 shaft lengths ((33.9 - 32.2) / 2 = 0.85 in). Full-float shaft lengths were not found.'
      ),
      dropBelowCenterline: dim(
        5.5,
        'estimated',
        ['engineering-estimate', 'stellantis-2024-wrangler-specs'],
        'Bounded, not measured. Jeep lists 10.8 in ground clearance on the 32.7 in LT285/70R17, so no axle drops more than 16.35 - 10.8 = 5.55 in at nominal radius. Measure before trusting.'
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
        'Casting edges sit just outside the cover.'
      ),
      cover: {
        width: dim(10.5, 'estimated', ['engineering-estimate'], 'No published size found.'),
        height: dim(10.75, 'estimated', ['engineering-estimate'], 'No published size found.'),
        boltCount: 12,
        boltCircle: dim(
          9.5,
          'schematic',
          ['engineering-estimate'],
          'Bolt count assumed from the M220. Drawing only.'
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
      floating: 'full-float',
      wmsWidth: dim(
        trackWidth + 2 * wheelOffset,
        'derived',
        ['stellantis-2024-wrangler-specs', 'quadratec-prorock44-jl-67-9'],
        'Jeep rear track is still 64.4 in on the same wheel, so WMS stays 64.4 + 2 x 1.74 = 67.9 in.'
      ),
      brakeDiameter: dim(13.5, 'schematic', ['engineering-estimate'], 'Rear disc. Drawing only.'),
      flangeDiameter: dim(6, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(7, 'schematic', ['engineering-estimate'], 'Full-float hub on the spindle.'),
      hubLength: dim(3.5, 'schematic', ['engineering-estimate']),
      boltPattern: '5x5 in (5x127 mm)'
    }
  },
  wheel: {
    diameter: dim(17, 'verified', ['stellantis-2024-wrangler-specs'], 'Rubicon LT285/70R17C.'),
    width: dim(7.5, 'verified', ['stellantis-2024-wrangler-specs'], 'Rubicon 17 x 7.5 in.'),
    offset: dim(
      wheelOffset,
      'derived',
      ['quadratec-prorock44-jl-67-9', 'stellantis-2024-wrangler-specs'],
      '(67.9 - 64.4) / 2 = 1.74 in (44 mm), from the front axle WMS and Jeep track.'
    ),
    trackWidth: dim(
      trackWidth,
      'verified',
      ['stellantis-2024-wrangler-specs'],
      'Rubicon rear track 1,636 mm (64.4 in). Rubicon 392 is 66.9 in.'
    )
  },
  facts: [
    {
      label: 'Wheel ends',
      value: 'Full float: hub on bearings on a spindle, shaft carries torque only',
      status: 'verified',
      sourceIds: ['stellantis-2024-wrangler-specs', 'thedrive-2024-fullfloat']
    },
    {
      label: 'Trims',
      value: 'Rubicon, Rubicon X, Rubicon 392',
      status: 'community',
      sourceIds: ['thedrive-2024-fullfloat']
    },
    {
      label: 'Ratios',
      value: '4.10; 4.56 (392, Xtreme 35); 4.88 optional on 3.6',
      status: 'verified',
      sourceIds: ['stellantis-2024-wrangler-specs']
    },
    {
      label: 'Locker',
      value: 'Tru-Lok electronic',
      status: 'verified',
      sourceIds: ['stellantis-2024-wrangler-specs']
    },
    {
      label: 'Gross axle weight rating',
      value: '3,550 lb rear (Rubicon 4-door)',
      status: 'verified',
      sourceIds: ['stellantis-2024-wrangler-specs']
    },
    {
      label: 'Towing',
      value: '5,000 lb (2.0 or 3.6 with automatic)',
      status: 'community',
      sourceIds: ['thedrive-2024-fullfloat']
    }
  ],
  sources,
  notes: [
    'Jeep confirms the full-float Dana 44 HD and keeps the 64.4 in Rubicon track. Almost every other number here is carried over from the 2018 to 2023 M220 and marked as an estimate.',
    'Ring gear size, shaft splines and pumpkin offset for the HD housing were not found in any Jeep, Dana or supplier source.',
    "The drop is an estimate held under the bound from Jeep's published ground clearance. Measure your housing and calibrate.",
    'Rubicon 392 and Xtreme 35 trucks sit on a 66.9 in track. Do not use these widths for them.'
  ]
};
