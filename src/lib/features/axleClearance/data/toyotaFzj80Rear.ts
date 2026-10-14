import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'rcv-80-rear',
    title:
      'RCV Performance: Ultimate 300M rear full-float axle set, Toyota Land Cruiser 80 (LCE Performance listing)',
    kind: 'supplier',
    url: 'https://www.lceperformance.com/ultimate-300m-rear-full-float-axle-set-toyota-land-cruiser-80',
    excerpt:
      'Axle model: Toyota 9.5 (full float). Left shaft length 30.22 in. Right shaft length 37.76 in. 30-spline inner and outer. FJ80, FZJ80, HZJ80, HDJ80, HDJ81 (all years).'
  },
  {
    id: 'yukon-tlc-95',
    title: 'Yukon YG TLC ring and pinion, Toyota 9.5 in Land Cruiser',
    kind: 'supplier',
    url: 'https://completewebsol.com/product/high-performance-yukon-ring-pinion-gear-set-toyota-95-inch-488-ratio-yukon-gear-axle',
    excerpt:
      'Toyota 9.5 in Land Cruiser, 9.50 in ring gear diameter, 27-spline pinion, 10 ring gear bolts. Fits FJ80 Land Cruiser 1991-1997.'
  },
  {
    id: 'koleso-80',
    title: 'koleso.ee: Toyota Land Cruiser 80 Series (1989-1997) OE wheel and tire fitment',
    kind: 'community',
    url: 'https://koleso.ee/en/valuveljed/toyota/land-cruiser/4380/80-series-1989-1997/8958',
    excerpt:
      'PCD 6x139.7 (6x5.5), center bore 106.1 mm. OE 8Jx16 ET0 with 275/70R16; 7Jx15 ET10 with 265/75R15.'
  },
  {
    id: 'carexpert-80',
    title: 'CarExpert: 1995 and 1997 Toyota LandCruiser GXL (80 Series) specifications',
    kind: 'community',
    url: 'https://www.carexpert.com.au/toyota/landcruiser/1997-gxl-4-5l-suv-4x4-petrol-automatic-jj8ksagw19960915',
    excerpt:
      'Front track 1595 mm, rear track 1600 mm. Ground clearance 210 mm. 275/70 tires on 16 x 8 rims. Australian market.'
  },
  {
    id: 'ih8mud-rear-width',
    title: 'IH8MUD forum: Project 180 SAS 100 Series build thread',
    kind: 'community',
    url: 'https://forum.ih8mud.com/threads/project-180-sas.891669/',
    excerpt: '80 Series rear is 63.5 in WMS; a 100 Series rear is almost 69 in.'
  },
  {
    id: 'nc4x4-80-rear',
    title: 'NC4x4 forum: FJ80 axle notes',
    kind: 'community',
    url: 'https://nc4x4.com/forum/threads/our-new-toy.786/page-2',
    excerpt:
      'FJ80 rears are mostly full-float, and slightly offset to the right by a few inches. 30 spline shafts.'
  },
  {
    id: 'ih8mud-lockers',
    title: 'IH8MUD forum: FZJ80 factory locker threads',
    kind: 'community',
    url: 'https://forum.ih8mud.com/threads/fzj-80-info.604676',
    excerpt:
      'US trucks had factory front and rear lockers as an option from 1993 through 1997, on roughly 7 percent of US FZJ80s. The 1993-1997 disc brake trucks are full float; 1991-1992 are not.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the 9.5 in ring gear. Must be measured on a real housing before being trusted.'
  }
];

const trackWidth = 1600 * MM;
const wheelOffset = 0;

export const toyotaFzj80Rear: AxleConfiguration = {
  id: 'toyota-land-cruiser-80-rear-1993-1997',
  name: 'Toyota Land Cruiser FZJ80 9.5 in rear (1993–1997)',
  shortName: 'LC80 9.5 in rear',
  group: 'Toyota',
  manufacturer: 'Toyota',
  vehicle: 'Toyota Land Cruiser FZJ80 and Lexus LX 450 (US, full-float)',
  years: { from: 1993, to: 1997 },
  kind: 'solid',
  position: 'rear',
  housing: {
    centerSection: {
      style: 'third-member',
      ringGearDiameter: dim(9.5, 'verified', ['yukon-tlc-95'], 'Shown dashed. It is not the drop.'),
      offsetFromVehicleCenter: dim(
        (37.76 - 30.22) / 2,
        'derived',
        ['rcv-80-rear', 'nc4x4-80-rear'],
        'Driver side. RCV lists the left shaft at 30.22 in and the right at 37.76 in, which puts the carrier (37.76 - 30.22) / 2 = 3.77 in toward the left (driver) side. RCV uses left for the long front shaft too, which matches the known passenger-side front. One forum post says "offset to the right", so confirm on a real truck.'
      ),
      dropBelowCenterline: dim(
        6.3,
        'estimated',
        ['engineering-estimate', 'carexpert-80'],
        'No published value found. 4.75 in ring gear radius plus about 1.5 in of banjo wall and clearance. Cross-check: a 275/70R16 is 31.2 in nominal (15.6 in radius); minus the 210 mm (8.3 in) listed ground clearance gives 7.3 in at nominal radius, or about 6.3 in with an inch of tire squash. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        6,
        'schematic',
        ['engineering-estimate'],
        'Banjo top. Drawing only.'
      ),
      width: dim(
        13,
        'estimated',
        ['engineering-estimate'],
        'Width of the banjo bulge across the tubes. Not published.'
      ),
      cover: {
        width: dim(
          11.5,
          'estimated',
          ['engineering-estimate'],
          'Welded rear dome. No published size.'
        ),
        height: dim(
          11.5,
          'estimated',
          ['engineering-estimate'],
          'Welded rear dome. No published size.'
        ),
        boltCount: 0,
        boltCircle: dim(0, 'schematic', ['engineering-estimate'], 'Welded dome, no bolts.')
      },
      coverCenterHeight: dim(
        0,
        'estimated',
        ['engineering-estimate'],
        'The ring gear turns on the axle shaft axis, so the dome is drawn concentric with the axle centerline.'
      )
    },
    tubes: {
      outerDiameter: dim(
        3.25,
        'estimated',
        ['engineering-estimate'],
        'No published tube size found. Measure before trusting.'
      )
    },
    wheelEnds: {
      kind: 'rear',
      floating: 'full-float',
      wmsWidth: dim(
        trackWidth + 2 * wheelOffset,
        'community',
        ['carexpert-80', 'koleso-80', 'ih8mud-rear-width'],
        'The 1600 mm (63.0 in) listed rear track plus twice the ET0 OE wheel offset. One owner reports 63.5 in.'
      ),
      brakeDiameter: dim(
        12.3,
        'schematic',
        ['engineering-estimate'],
        'Rear disc on 1993-1997 trucks. Drawing only.'
      ),
      flangeDiameter: dim(6, 'schematic', ['engineering-estimate'], 'Drawing only.'),
      hubDiameter: dim(
        7,
        'schematic',
        ['engineering-estimate'],
        'Full-float hub on the housing spindle. Drawing only.'
      ),
      hubLength: dim(4.5, 'schematic', ['engineering-estimate']),
      boltPattern: '6x139.7 mm (6x5.5 in)'
    }
  },
  wheel: {
    diameter: dim(16, 'community', ['koleso-80', 'carexpert-80']),
    width: dim(8, 'community', ['koleso-80', 'carexpert-80']),
    offset: dim(wheelOffset, 'community', ['koleso-80'], 'ET0.'),
    trackWidth: dim(
      trackWidth,
      'community',
      ['carexpert-80'],
      '1600 mm, Australian-market GXL listing with 275/70R16 on 16x8. No US Toyota brochure figure was found.'
    )
  },
  facts: [
    {
      label: 'Pumpkin side',
      value: 'Driver side, about 3.8 in (from shaft lengths; one forum post disagrees)',
      status: 'derived',
      sourceIds: ['rcv-80-rear', 'nc4x4-80-rear']
    },
    {
      label: 'Ring gear',
      value: '9.5 in, 10 ring gear bolts',
      status: 'verified',
      sourceIds: ['yukon-tlc-95']
    },
    { label: 'Pinion spline', value: '27', status: 'verified', sourceIds: ['yukon-tlc-95'] },
    {
      label: 'Axle shafts',
      value: '30-spline inner and outer, full float',
      status: 'verified',
      sourceIds: ['rcv-80-rear']
    },
    {
      label: 'Floating',
      value: 'Full float on 1993-1997 disc brake trucks; 1991-1992 are semi-float',
      status: 'community',
      sourceIds: ['ih8mud-lockers', 'nc4x4-80-rear']
    },
    {
      label: 'Factory locker',
      value: 'Optional front and rear electric lockers, 1993-1997 US, about 7 percent of trucks',
      status: 'community',
      sourceIds: ['ih8mud-lockers']
    },
    {
      label: 'Bolt pattern',
      value: '6x139.7 mm (6x5.5 in), 106.1 mm center bore',
      status: 'community',
      sourceIds: ['koleso-80']
    }
  ],
  sources,
  notes: [
    'This record is the 1993-1997 full-float rear. The 1991-1992 rear is semi-float with drum brakes and may differ in width.',
    'Which side the pumpkin sits on is worked out from published shaft lengths and conflicts with one forum post. Check it on a real truck before cutting anything.',
    'The drop is an estimate that happens to agree with the listed 210 mm ground clearance. Calibrate it with a measurement from a real axle.',
    'Clearance gained from a taller tire does not depend on the drop: it is half the diameter change, assuming the same loaded-radius deflection.'
  ]
};
