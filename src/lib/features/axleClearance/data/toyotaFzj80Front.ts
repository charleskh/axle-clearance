import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'rcv-80-front',
    title:
      'RCV Performance: Ultimate 30-spline CV front axle set, Land Cruiser 80 Series (1991-1997), via LCE Performance',
    kind: 'supplier',
    url: 'https://www.lceperformance.com/rcv-ultimate-30-spline-cv-front-axle-set-for-land-cruiser-80-series-1991-1997/',
    excerpt:
      'OEM/RCV right inner axle length: 17.75 in. OEM/RCV left inner axle length: 34.125 in. 30-spline at the differential; OEM CV inner end is 24-spline. FZJ80, HDJ80, HDJ81, HZJ80.'
  },
  {
    id: 'nitro-80-front-gears',
    title:
      'Nitro Gear & Axle: Toyota 8 in reverse ring and pinion, 4.56 (Low Range Off-Road listing)',
    kind: 'supplier',
    url: 'https://lowrangeoffroad.com/toyota-8-inch-4-56-ratio-reverse-ring-and-pinion-nitro-gear-and-axle.html',
    excerpt:
      'Toyota 8 in reverse, 41/9 teeth, 29 pinion splines, 10 ring gear bolts. Fits 1990-1997 Land Cruiser FJ80.'
  },
  {
    id: 'yukon-tlcf',
    title:
      'Yukon YG TLCF ring and pinion: Toyota 8 in high pinion, reverse rotation, Land Cruiser front',
    kind: 'supplier',
    url: 'https://ok4wd.com/yukon-ring-pinion-set-for-toyota-8-high-pinion-in-reverse-4-88-with-yoke-kit',
    excerpt:
      '1991-1997 Toyota Land Cruiser, 8 in. front, reverse rotation. 29-spline pinion with yoke kit; earlier 27-spline pinions need the kit.'
  },
  {
    id: 'lror-fj80-knuckle',
    title: 'Low Range Off-Road: Toyota Land Cruiser FJ80 knuckle rebuild kit',
    kind: 'supplier',
    url: 'https://lowrangeoffroad.com/toyota-land-cruiser-fj80-knuckle-rebuild-kit-with-wheel-bearings-and-oem-inner-axle-seals.html',
    excerpt:
      'Includes Koyo wheel bearings and knuckle king pin bearings, plus shims for the trunnion/kingpin bearing preload. 1990-1997 FJ80.'
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
    id: 'ih8mud-front-width',
    title: 'IH8MUD forum: FZJ80 front axle width (owner measurements)',
    kind: 'community',
    url: 'https://forum.ih8mud.com/threads/fzj80-front-axle-width.4465',
    excerpt: "Two owners: it's 63 in wheel mount surface to wheel mount surface."
  },
  {
    id: 'zukiworld-widths',
    title: 'Zukiworld forum: axle width list (Shredder, 2006)',
    kind: 'community',
    url: 'https://www.zukiworld.com/forum/general-suzuki-forum/tracker-width/',
    excerpt: '\'90-97 FJ80 and FZJ80 Landcruisers: Width: 63.5" / passenger side differential.'
  },
  {
    id: 'ih8mud-lockers',
    title: 'IH8MUD forum: FZJ80 factory locker threads',
    kind: 'community',
    url: 'https://forum.ih8mud.com/threads/fzj-80-info.604676',
    excerpt:
      'US trucks had factory front and rear lockers as an option from 1993 through 1997, on roughly 7 percent of US FZJ80s.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the 8 in ring gear. Must be measured on a real housing before being trusted.'
  }
];

const trackWidth = 1595 * MM;

export const toyotaFzj80Front: AxleConfiguration = {
  id: 'toyota-land-cruiser-80-front-1991-1997',
  name: 'Toyota Land Cruiser FJ80 / FZJ80 8 in front (1991–1997)',
  shortName: 'LC80 8 in front',
  group: 'Toyota',
  manufacturer: 'Toyota',
  vehicle: 'Toyota Land Cruiser FJ80 / FZJ80 and Lexus LX 450 (US)',
  years: { from: 1991, to: 1997 },
  kind: 'solid',
  position: 'front',
  housing: {
    centerSection: {
      style: 'third-member',
      ringGearDiameter: dim(
        8.0,
        'verified',
        ['nitro-80-front-gears', 'yukon-tlcf'],
        'Shown dashed. Reverse-rotation (high pinion) 8 in set, not the 9.5 in used in the rear.'
      ),
      offsetFromVehicleCenter: dim(
        -(34.125 - 17.75) / 2,
        'derived',
        ['rcv-80-front', 'zukiworld-widths'],
        'Passenger side. OEM inner shafts are 34.125 in (left, driver) and 17.75 in (right, passenger), so the carrier sits (34.125 - 17.75) / 2 = 8.19 in toward the passenger side.'
      ),
      dropBelowCenterline: dim(
        5.25,
        'estimated',
        ['engineering-estimate'],
        'No published value found. 4.0 in ring gear radius plus about 1.25 in of banjo wall and clearance on a heavier housing than the mini truck 8 in. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        6,
        'schematic',
        ['engineering-estimate'],
        'High-pinion nose sits higher than a low-pinion banjo. Drawing only.'
      ),
      width: dim(
        12,
        'estimated',
        ['engineering-estimate'],
        'Width of the banjo bulge across the tubes. Not published.'
      ),
      cover: {
        width: dim(
          10,
          'estimated',
          ['engineering-estimate'],
          'Welded rear dome. No published size.'
        ),
        height: dim(
          10,
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
        'No published tube size found. The 80 front runs 30-spline shafts in a housing visibly heavier than the 65 mm mini truck tube. Measure before trusting.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'closed-knuckle',
      wmsWidth: dim(
        63,
        'community',
        ['ih8mud-front-width', 'zukiworld-widths', 'carexpert-80', 'koleso-80'],
        'Two owners measured 63 in; another listing says 63.5 in. The published 1595 mm track plus the ET0 OE wheel gives 62.8 in, which agrees.'
      ),
      cEndWidth: dim(3, 'schematic', ['engineering-estimate'], 'Tube flange at the knuckle ball.'),
      pivotSpan: dim(8, 'schematic', ['engineering-estimate'], 'Upper to lower kingpin bearing.'),
      knuckleWidth: dim(
        8,
        'schematic',
        ['engineering-estimate'],
        'Knuckle ball diameter. Drawing only.'
      ),
      hubDiameter: dim(5.5, 'schematic', ['engineering-estimate']),
      hubLength: dim(4, 'schematic', ['engineering-estimate']),
      boltPattern: '6x139.7 mm (6x5.5 in)'
    }
  },
  wheel: {
    diameter: dim(
      16,
      'community',
      ['koleso-80', 'carexpert-80'],
      '1993-1997 16 in wheel. 1991-1992 trucks came on 15 in.'
    ),
    width: dim(8, 'community', ['koleso-80', 'carexpert-80']),
    offset: dim(0, 'community', ['koleso-80'], 'ET0.'),
    trackWidth: dim(
      trackWidth,
      'community',
      ['carexpert-80'],
      '1595 mm, Australian-market GXL listing with 275/70R16 on 16x8. No US Toyota brochure figure was found.'
    )
  },
  facts: [
    {
      label: 'Pumpkin side',
      value: 'Passenger side (left inner shaft is the long one)',
      status: 'verified',
      sourceIds: ['rcv-80-front']
    },
    {
      label: 'Ring gear',
      value: '8 in, reverse rotation (high pinion), 10 ring gear bolts',
      status: 'verified',
      sourceIds: ['nitro-80-front-gears', 'yukon-tlcf']
    },
    {
      label: 'Pinion spline',
      value: '27 (earlier) or 29, check before buying gears',
      status: 'verified',
      sourceIds: ['yukon-tlcf', 'nitro-80-front-gears']
    },
    {
      label: 'Axle shafts',
      value: '30-spline inner, Birfield-type CV with 24-spline outer stub',
      status: 'verified',
      sourceIds: ['rcv-80-front']
    },
    {
      label: 'Steering pivots',
      value: 'Closed knuckle on upper and lower kingpin (trunnion) bearings',
      status: 'verified',
      sourceIds: ['lror-fj80-knuckle']
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
    'The pumpkin is on the passenger side, about 8 in off center, worked out from the OEM inner shaft lengths RCV publishes.',
    'This front uses a reverse-rotation 8 in gear set. It does not share gears with the 9.5 in rear.',
    'Track and wheel figures come from Australian listings and owner measurements. They agree with each other within half an inch.',
    'Differential drop and tube size are not published. The absolute clearance is an estimate until you calibrate it with a measurement from a real axle.',
    'Clearance gained from a taller tire does not depend on the drop: it is half the diameter change, assuming the same loaded-radius deflection.'
  ]
};
