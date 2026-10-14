import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'dennys-sterling',
    title: "Denny's Driveshafts: Ford 10.25 and 10.50 Sterling",
    kind: 'supplier',
    url: 'https://dennysdriveshaft.com/c512_ford_10.25_and_10.50_sterling.html',
    excerpt:
      'The Ford 10.25/10.50 has a 12 bolt rear cover and the Dana 60, 70, and 80 have a 10 bolt rear cover. 1985-1992: 10.25 in housing, 31-spline pinion, short yoke. 1993-1998: 10.25 in housing, 31-spline pinion, tall yoke.'
  },
  {
    id: 'usa-standard-1025',
    title: 'USA Standard Gear: Ford 10.25 inch ring and pinion set listing',
    kind: 'supplier',
    url: 'https://www.completewebsol.com/product/ford-ring-and-pinion-gear-set-ford-1025-inch-355-538-ratio-usa-standard-gear',
    excerpt: 'Ford 10.25 inch ring and pinion, 12 ring gear bolts.'
  },
  {
    id: 'lugnut-axle-id',
    title: 'LugNut4x4: How to know which 3/4 ton or one ton axle is on your 1968-2000 truck',
    kind: 'community',
    url: 'https://lugnut4x4.com/axles/which-axle-is-on-your-truck/',
    excerpt:
      '12 bolts: Sterling axle, made for Ford. Sterling 10.25 axles came with drum brakes, an 8 x 6.5 in lug pattern, and were used in 1997 and older trucks.'
  },
  {
    id: 'dieselhub-1025',
    title: 'DieselHub: Sterling 10.25 in differential specs',
    kind: 'community',
    url: 'https://dieselhub.com/maintenance/sterling-axle-fluid.html',
    excerpt:
      'Axle tube diameter 3.50 in. 31-spline pinion, 35-spline axle shafts. 12 cover bolts. Semi-float units are used in light-duty vehicles; all Super Duty and standard F-250/F-350 models are full floating.'
  },
  {
    id: 'wikipedia-sterling',
    title: 'Wikipedia: Sterling 10.5 axle (covers the 10.25 predecessor)',
    kind: 'community',
    url: 'https://en.wikipedia.org/wiki/Sterling_10.5_axle',
    excerpt:
      'Originally made as the Sterling 10.25 with a 10.25 in (260 mm) ring gear until upgraded in 1999. The semi-float variation is less common and was used in F-250 trucks with a lower GVWR (7200) through 1996.'
  },
  {
    id: 'tmr-sterling-truss',
    title: 'TMR Customs: JK 1 ton axle swap truss, rear Sterling 10.25/10.5',
    kind: 'supplier',
    url: 'https://tmrcustoms.com/products/jk-1-ton-axle-swap-truss-rear-sterling-10-5',
    excerpt:
      'The Sterling rear pinion is offset to the passenger side and will interfere with your stock gas tank.'
  },
  {
    id: 'nc4x4-pirate-1025',
    title: 'NC4x4 forum: Sterling 10.25 DRW (quoting Pirate4x4 owner measurements)',
    kind: 'community',
    url: 'https://nc4x4.com/forum/threads/sterling-10-25-drw.85685/',
    excerpt:
      'SRW, 1996 F350: spring perch center to center 45 in, WMS to WMS 65.5 in, backing plate inside to inside 53.5 in, 8 x 6.50 in lug-centric. DRW pickup, 1995 F350: WMS to WMS 72.5 in.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the published ring gear and tube sizes. Must be measured on a real housing before being trusted.'
  }
];

const wmsWidth = 65.5;
const wheelOffset = 0.25;

export const fordSterling1025Rear: AxleConfiguration = {
  id: 'ford-f250-f350-sterling-10-25-rear-1985-1998',
  name: 'Ford F-250/F-350 Sterling 10.25 rear (1985–1998)',
  shortName: 'Sterling 10.25',
  group: 'Ford',
  manufacturer: 'Ford (Sterling Axle Plant)',
  vehicle: 'Ford F-250 HD / F-350 4x4 and 4x2, SRW, full-float',
  years: { from: 1985, to: 1998 },
  kind: 'solid',
  position: 'rear',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        10.25,
        'verified',
        ['usa-standard-1025', 'dennys-sterling', 'wikipedia-sterling'],
        'Shown dashed. It is not the drop: the housing wall sits below the ring gear.'
      ),
      offsetFromVehicleCenter: dim(
        -3,
        'estimated',
        ['tmr-sterling-truss', 'engineering-estimate'],
        'Passenger-side offset is stated by an axle-swap supplier. The 3 in amount is an estimate; no published figure was found.'
      ),
      dropBelowCenterline: dim(
        6.5,
        'estimated',
        ['engineering-estimate', 'wikipedia-sterling'],
        'No published value found. 6.5 in is a 5.125 in ring gear radius plus housing wall and oil clearance. Measure before trusting.'
      ),
      riseAboveCenterline: dim(6, 'schematic', ['engineering-estimate'], 'Drawing only.'),
      width: dim(
        14.5,
        'estimated',
        ['engineering-estimate'],
        'Cast center section width, estimated to clear the cover. Drawing and fit check only.'
      ),
      cover: {
        width: dim(
          12,
          'estimated',
          ['engineering-estimate'],
          'No published cover dimension found.'
        ),
        height: dim(
          12.5,
          'estimated',
          ['engineering-estimate'],
          'No published cover dimension found.'
        ),
        boltCount: 12,
        boltCircle: dim(
          11,
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
      outerDiameter: dim(3.5, 'community', ['dieselhub-1025'])
    },
    wheelEnds: {
      kind: 'rear',
      floating: 'full-float',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['nc4x4-pirate-1025'],
        'Owner measurement of a 1996 F-350 SRW. A dual-rear-wheel pickup axle measures 72.5 in. Wide-track and cab-and-chassis versions are rumored but unconfirmed.'
      ),
      brakeDiameter: dim(
        12,
        'estimated',
        ['engineering-estimate'],
        'Rear drum brakes. Drum size not confirmed from a Ford source.'
      ),
      flangeDiameter: dim(7, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(8, 'schematic', ['engineering-estimate']),
      hubLength: dim(4.5, 'schematic', ['engineering-estimate']),
      boltPattern: '8x6.5 in'
    }
  },
  wheel: {
    diameter: dim(
      16,
      'estimated',
      ['engineering-estimate'],
      'Typical OE 16 in 8-lug steel wheel. 16.5 in wheels were also used.'
    ),
    width: dim(6, 'estimated', ['engineering-estimate'], 'Drawing only.'),
    offset: dim(
      wheelOffset,
      'estimated',
      ['engineering-estimate'],
      'OE offset not found. Near-zero offset assumed for a 16x6 single-rear-wheel steel wheel.'
    ),
    trackWidth: dim(
      wmsWidth - 2 * wheelOffset,
      'estimated',
      ['nc4x4-pirate-1025', 'engineering-estimate'],
      'Owner WMS (65.5 in) minus twice the assumed 0.25 in offset = 65.0 in. Ford track figure for these years was not found.'
    )
  },
  facts: [
    {
      label: 'Cover',
      value: '12-bolt (Dana 60/70/80 use 10)',
      status: 'verified',
      sourceIds: ['dennys-sterling']
    },
    { label: 'Ring gear bolts', value: '12', status: 'verified', sourceIds: ['usa-standard-1025'] },
    {
      label: 'Pinion splines',
      value: '31; short yoke 1985-1992, tall yoke 1993-1998',
      status: 'verified',
      sourceIds: ['dennys-sterling']
    },
    {
      label: 'Axle shafts',
      value: '35-spline, full-float',
      status: 'community',
      sourceIds: ['dieselhub-1025']
    },
    {
      label: 'Pinion offset',
      value: 'Passenger side',
      status: 'verified',
      sourceIds: ['tmr-sterling-truss']
    },
    { label: 'Brakes', value: 'Drum', status: 'community', sourceIds: ['lugnut-axle-id'] },
    {
      label: 'Bolt pattern',
      value: '8x6.5 in',
      status: 'community',
      sourceIds: ['lugnut-axle-id', 'nc4x4-pirate-1025']
    },
    {
      label: 'Semi-float version',
      value: 'Lighter F-250 (7200 lb GVWR) through 1996; less common',
      status: 'community',
      sourceIds: ['wikipedia-sterling']
    }
  ],
  sources,
  notes: [
    'This entry is the full-float 3/4 and 1 ton axle, which is the common one. A semi-float version with a shaft flange went under lighter F-250s through 1996 and is narrower at the hubs.',
    'Width comes from one owner measurement of a 1996 F-350 SRW (65.5 in WMS). Dually pickup axles are much wider at 72.5 in. Measure your own before trusting the track.',
    'Differential drop below the axle centerline has not been published by Ford. Calibrate it with a tape measure under a real axle.',
    'The 10.25 looks almost identical to the later 10.5 but has drum brakes and an 8x6.5 in pattern instead of discs and 8x170 mm.',
    'The pumpkin sits toward the passenger side, the opposite side from the Ford front differential.'
  ]
};
