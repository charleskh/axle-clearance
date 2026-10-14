import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'dennys-700004',
    title: "Denny's Driveshafts: Dana Spicer 700004 spindle, 1977-1/2 to 1979 Ford F-250",
    kind: 'supplier',
    url: 'https://dennysdriveshaft.com/p4578_dana_spicer_700004_spindle_fits_1977_12_to_1979_ford_f250_wi.html',
    excerpt:
      'Fits FORD F-250 with High Pinion Reverse Rotation DANA 44 Front Axle. 1977-1/2, 1978 and 1979.'
  },
  {
    id: 'torqueking-f250-d44',
    title: 'Torque King: 1977.5-1979 Ford F250 Dana 44 front axle collection',
    kind: 'supplier',
    url: 'https://torqueking.com/collections/1977-5-1979-ford-f250-dana-44-front-axle?page=3',
    excerpt:
      'All 1977.5-1979 Dana 44 axles used an internal spline type wheel hub. 1979 was the last year Ford used a beam type Dana 44 front axle in the F-250 series. Heavy-duty trucks could be ordered with an available 4500-pound Dana 60 front axle for 1978 and 1979. 1976 to 1977.5 axles are open knuckle, disc brake, Dana 44 monobeam axles.'
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
    id: 'torqueking-7879-d44',
    title: 'Torque King: 1976-1979 F-Series and 1978-1979 Bronco Dana 44 front axle',
    kind: 'supplier',
    url: 'https://torqueking.com/category/1976-1979-f-series-1978-1979-bronco-dana-44-1',
    excerpt:
      'Bronco and F-150: axle tube outside diameter is 3 inches; replaceable upper and lower ball joints.'
  },
  {
    id: 'ford-1979-pickup-brochure',
    title: 'Ford Division: 1979 Ford Pickups brochure, two-wheel-drive equipment table (p. 17)',
    kind: 'manufacturer',
    url: 'https://www.oldcarbrochures.com/static/NA/FMC%20Trucks-Vans/1979_Trucks-Vans/1979_Ford_Pickups/1979%20Ford-16.html',
    excerpt:
      'F-250 (4x2): wheels (4) 8-hole, 6.0 rim; tires 8.00 x 16.5D TT. The 4x4 table is not on this page.'
  },
  {
    id: 'rangerstation-d44-wms',
    title: 'The Ranger Station forum: WMS to WMS width of full width Ford D44',
    kind: 'community',
    url: 'https://www.therangerstation.com/forums/goto/post?id=616624',
    excerpt:
      'Should be around 69"-69.5" [later said to apply to his 1-tons]. That would be for the F250 D44; the half ton stuff was a bit narrower. 65.5" for a 1/2 ton D44.'
  },
  {
    id: 'ord-ford-d60',
    title: 'Offroad Design: Ford Dana 60 technical information',
    kind: 'supplier',
    url: 'https://www.offroaddesign.com/tech/offroad-design-axles-knowledge/offroad-design-ford-dana-60-technical-information',
    excerpt:
      '1977.5-79 F250/F350 Dana 60: high pinion, kingpin, 31-1/2" spring pad spacing, 8 x 6.5" lug pattern.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the published ring gear and cover sizes. Must be measured on a real housing before being trusted.'
  }
];

const wmsWidth = 68.5;
const wheelOffset = 0.25;

export const fordF250Dana44HpFront: AxleConfiguration = {
  id: 'ford-f250-dana-44-hp-front-1977-1979',
  name: 'Ford F-250 high-pinion Dana 44 front (1977.5–1979)',
  shortName: 'Ford HP Dana 44 (3/4 ton)',
  group: 'Ford',
  manufacturer: 'Dana / Spicer',
  vehicle: 'Ford F-250 4x4, 8-lug',
  years: { from: 1977, to: 1979 },
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
        ['engineering-estimate'],
        'Driver-side drop like other Ford high-pinion fronts. Neither the side nor the 5 in amount was confirmed for this axle; measure.'
      ),
      dropBelowCenterline: dim(
        5.5,
        'estimated',
        ['engineering-estimate', 'dana-2020809'],
        'No published value found. Same 8.5 in carrier as the Bronco high-pinion Dana 44, where Ford ground clearance data implies about 5.5 in. Measure before trusting.'
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
        'estimated',
        ['torqueking-7879-d44', 'engineering-estimate'],
        'Torque King states 3 in for the 1/2 ton axle of the same years. Some owner posts cite 2.75 in for F-250 tubes. Measure.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'ball-joint',
      wmsWidth: dim(
        wmsWidth,
        'estimated',
        ['rangerstation-d44-wms', 'engineering-estimate'],
        'Owner figures conflict: about 66 in recalled, 69 to 69.5 in for 1 ton axles. 68.5 in is a midpoint guess for the 3/4 ton axle. Measure.'
      ),
      cEndWidth: dim(3, 'schematic', ['engineering-estimate']),
      pivotSpan: dim(8, 'schematic', ['engineering-estimate'], 'Upper to lower ball joint.'),
      knuckleWidth: dim(3.5, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(5.5, 'schematic', ['engineering-estimate']),
      hubLength: dim(3.75, 'schematic', ['engineering-estimate']),
      boltPattern: '8x6.5 in'
    }
  },
  wheel: {
    diameter: dim(
      16.5,
      'estimated',
      ['ford-1979-pickup-brochure'],
      'Ford lists 16.5x6 8-hole wheels on the 2WD F-250; the 4x4 is assumed the same.'
    ),
    width: dim(6, 'estimated', ['ford-1979-pickup-brochure'], 'Same assumption as the diameter.'),
    offset: dim(
      wheelOffset,
      'estimated',
      ['engineering-estimate'],
      'OE offset not found. Near-zero offset assumed.'
    ),
    trackWidth: dim(
      wmsWidth - 2 * wheelOffset,
      'estimated',
      ['rangerstation-d44-wms', 'engineering-estimate'],
      'Estimated WMS (68.5 in) minus twice the assumed 0.25 in offset = 68.0 in. A Ford track figure was not found.'
    )
  },
  facts: [
    {
      label: 'Pinion',
      value: 'High pinion, reverse rotation',
      status: 'verified',
      sourceIds: ['dennys-700004']
    },
    {
      label: 'Steering pivots',
      value: 'Ball joints, open knuckle',
      status: 'community',
      sourceIds: ['torqueking-7879-d44']
    },
    {
      label: 'Hubs',
      value: 'Internally splined wheel hub for lockouts',
      status: 'verified',
      sourceIds: ['torqueking-f250-d44']
    },
    {
      label: 'Suspension',
      value:
        'Leaf springs (coil and radius arm was the 1/2 ton setup); not confirmed from a Ford source',
      status: 'estimated',
      sourceIds: ['engineering-estimate', 'torqueking-7879-d44']
    },
    {
      label: 'Option',
      value: '4500 lb Dana 60 front available on heavy-duty 1978-1979 trucks',
      status: 'verified',
      sourceIds: ['torqueking-f250-d44']
    },
    {
      label: 'Bolt pattern',
      value: '8x6.5 in',
      status: 'verified',
      sourceIds: ['ord-ford-d60', 'ford-1979-pickup-brochure']
    }
  ],
  sources,
  notes: [
    'This is the 3/4 ton high-pinion Dana 44 that owners often call the "Dana 44 HD". The high-pinion, reverse-rotation design starts at the mid-1977 model change, so 1977 trucks can have either.',
    'Many 1978 to 1979 F-250s left the factory with the optional Dana 60 instead. Check the housing before relying on this entry.',
    'Width, track, tube size and the differential offset are owner figures or estimates. Measure before trusting the tire position.',
    'The housing drop is borrowed from the half-ton Bronco axle, which uses the same 8.5 in ring gear. Calibrate it with a tape measure under the axle.',
    '1979 was the last year of the beam Dana 44 in the F-250. 1980 changed to Twin Traction Beam.'
  ]
};
