import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'ford-bronco-1978-brochure',
    title:
      'Ford Motor Company of Canada: 1978 Ford Bronco brochure, specifications page (litho 9/77)',
    kind: 'manufacturer',
    url: 'https://www.oldcarbrochures.com/static/NA/FMC%20Trucks-Vans/1978%20Trucks/1978%20Ford%20Bronco%20Brochure%20(Canadian)/image5.html',
    excerpt:
      'Tires L78-15B. Ground clearance: front axle 8.1", rear axle 7.8". Axle, front: rating 3,550 lb. Springs, front: coil, computer selected. Wheels: 5-hole disc, 5.5K rim. Wheelbase 104.0".'
  },
  {
    id: 'torqueking-7879-d44',
    title: 'Torque King: 1976-1979 F-Series and 1978-1979 Bronco Dana 44 front axle',
    kind: 'supplier',
    url: 'https://torqueking.com/category/1976-1979-f-series-1978-1979-bronco-dana-44-1',
    excerpt:
      'Open knuckle type. Axle tube outside diameter is 3 inches. Replaceable upper and lower ball joints. 3-link coil spring design with cast iron radius arms and a tracking bar. Ratios 3.00, 3.50, 4.09; Trac-Lok optional with 3.50 and 4.09. Last beam axles on Ford 1/2 ton 4x4s; 1980 switched to the Dana 44 TTB. The F-150 SuperCab axle is slightly wider.'
  },
  {
    id: 'torqueking-idn107',
    title: 'Torque King: Dana 44 differential cover ID (IDN-107)',
    kind: 'supplier',
    url: 'https://torqueking.com/products/sku-dana-44-diff-cover-id-idn-107',
    excerpt:
      'Dana 44 beam axle covers are approximately 10-3/8" high and 9-3/8" wide, 10 bolt covers.'
  },
  {
    id: 'dana-2020809',
    title: 'Dana 2020809 ring and pinion listing (FinditParts)',
    kind: 'supplier',
    url: 'https://finditparts.com/products/8085538/dana-2020809',
    excerpt: 'Differential ring and pinion, Dana 44, 8.50 in. ring gear.'
  },
  {
    id: 'classicbroncos-hp44',
    title: 'ClassicBroncos forum: Dana 44 high pinion narrow and install',
    kind: 'community',
    url: 'https://classicbroncos.com/forums/threads/dana-44-high-pinion-narrow-and-install.318022/page-3',
    excerpt:
      "The 78-79 differential is a high pinion and the early Bronco is a low pinion. A '79 Bronco axle is a driver's side drop. 78-79 tube is 3.0 x 1/4 wall."
  },
  {
    id: 'rangerstation-d44-wms',
    title: 'The Ranger Station forum: WMS to WMS width of full width Ford D44',
    kind: 'community',
    url: 'https://www.therangerstation.com/forums/goto/post?id=616624',
    excerpt:
      '65.5" for a 1/2 ton D44. Another member recalls about 66" for a 1978 Bronco; F-250 axles are wider.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the published ring gear, cover and tube sizes. Must be measured on a real housing before being trusted.'
  }
];

const wmsWidth = 65.5;
const wheelOffset = 0.25;

export const fordBroncoDana44HpFront: AxleConfiguration = {
  id: 'ford-bronco-f150-dana-44-hp-front-1978-1979',
  name: 'Ford Bronco / F-150 high-pinion Dana 44 front (1978–1979)',
  shortName: 'Ford HP Dana 44 (1/2 ton)',
  group: 'Ford',
  manufacturer: 'Dana / Spicer',
  vehicle: 'Ford Bronco (full size) and F-150 Regular Cab 4x4',
  years: { from: 1978, to: 1979 },
  kind: 'solid',
  position: 'front',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        8.5,
        'verified',
        ['dana-2020809'],
        'Shown dashed. It is not the drop: the housing wall sits below the ring gear.'
      ),
      offsetFromVehicleCenter: dim(
        5,
        'estimated',
        ['classicbroncos-hp44', 'engineering-estimate'],
        'Driver-side drop is reported by owners. The 5 in amount is an estimate; no published figure was found.'
      ),
      dropBelowCenterline: dim(
        5.5,
        'estimated',
        ['ford-bronco-1978-brochure', 'engineering-estimate'],
        'Ford lists 8.1 in front axle ground clearance on L78-15 tires (about 28.9 in nominal, so 14.45 in nominal radius). With an assumed 13.6 in loaded radius, 13.6 - 8.1 = 5.5 in. Using the nominal radius gives 6.35 in, an upper bound. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        5.5,
        'schematic',
        ['engineering-estimate'],
        'High-pinion housing top. Drawing only.'
      ),
      width: dim(
        11.5,
        'estimated',
        ['torqueking-idn107', 'engineering-estimate'],
        'Casting edges just outside the 9-3/8 in wide cover. Drawing and fit check only.'
      ),
      cover: {
        width: dim(9 + 3 / 8, 'verified', ['torqueking-idn107']),
        height: dim(10 + 3 / 8, 'verified', ['torqueking-idn107']),
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
        'verified',
        ['torqueking-7879-d44', 'classicbroncos-hp44'],
        '1/4 in wall per owners.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'ball-joint',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['rangerstation-d44-wms'],
        'Owner figures for the 1/2 ton Ford Dana 44 run 65.5 to 66 in. Not a Ford number.'
      ),
      cEndWidth: dim(3, 'schematic', ['engineering-estimate']),
      pivotSpan: dim(8, 'schematic', ['engineering-estimate'], 'Upper to lower ball joint.'),
      knuckleWidth: dim(3.5, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(5, 'schematic', ['engineering-estimate']),
      hubLength: dim(3.5, 'schematic', ['engineering-estimate']),
      boltPattern: '5x5.5 in'
    }
  },
  wheel: {
    diameter: dim(15, 'verified', ['ford-bronco-1978-brochure'], 'Base tire L78-15B.'),
    width: dim(5.5, 'verified', ['ford-bronco-1978-brochure'], '5-hole disc wheel, 5.5K rim.'),
    offset: dim(
      wheelOffset,
      'estimated',
      ['engineering-estimate'],
      'OE offset not found. Near-zero offset assumed for the 15x5.5 steel wheel.'
    ),
    trackWidth: dim(
      wmsWidth - 2 * wheelOffset,
      'estimated',
      ['rangerstation-d44-wms', 'engineering-estimate'],
      'Owner WMS (65.5 in) minus twice the assumed 0.25 in offset = 65.0 in. A Ford track figure was not found.'
    )
  },
  facts: [
    {
      label: 'Pinion',
      value: 'High pinion, reverse rotation',
      status: 'community',
      sourceIds: ['classicbroncos-hp44']
    },
    {
      label: 'Steering pivots',
      value: 'Ball joints, open knuckle',
      status: 'verified',
      sourceIds: ['torqueking-7879-d44']
    },
    {
      label: 'Suspension',
      value: 'Coil springs, cast iron radius arms, track bar',
      status: 'verified',
      sourceIds: ['torqueking-7879-d44', 'ford-bronco-1978-brochure']
    },
    {
      label: 'Front GAWR (Bronco)',
      value: '3550 lb',
      status: 'verified',
      sourceIds: ['ford-bronco-1978-brochure']
    },
    {
      label: 'Ratios',
      value: '3.00, 3.50, 4.09; Trac-Lok optional with 3.50 and 4.09',
      status: 'verified',
      sourceIds: ['torqueking-7879-d44']
    },
    {
      label: 'Wheel',
      value:
        '5-lug, 15x5.5 steel disc (5x5.5 in circle is common Ford usage, not stated in the brochure)',
      status: 'verified',
      sourceIds: ['ford-bronco-1978-brochure']
    }
  ],
  sources,
  notes: [
    'The 1978 to 1979 Bronco and F-150 4x4 both used coil springs and radius arms up front. The F-250 kept leaf springs. The F-150 SuperCab axle is slightly wider than this one.',
    'High pinion and the driver-side drop come from owner reports and are widely repeated, but Torque King and Ford do not state them on the pages found.',
    'Ford published 8.1 in of front axle ground clearance on stock L78-15 tires. The housing drop here is derived from that with an assumed loaded radius, so treat it as within about half an inch.',
    'Width and track are owner figures. Measure your own axle before trusting the tire position.',
    'This was the last beam axle on Ford half tons. 1980 switched to the Twin Traction Beam Dana 44.'
  ]
};
