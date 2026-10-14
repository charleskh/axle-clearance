import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'rcv-fj60-front',
    title:
      'RCV Performance: Ultimate 30-spline CV front axle set, Land Cruiser FJ60 (1981-1987) / FJ62 (1988-1990), via LCE Performance',
    kind: 'supplier',
    url: 'https://www.lceperformance.com/rcv-ultimate-30-spline-cv-front-axle-set-for-land-cruiser-fj60-1981-1987-fj62-1988-1990/',
    excerpt:
      'OEM/RCV right inner axle 17.13 in, left inner axle 31.31 in. OEM/RCV inner spline 30. OEM CV inner spline 27. Outer spline 30.'
  },
  {
    id: 'trailgear-longfield',
    title: 'Trail Gear: Longfield 30-spline long-side inner axles, FJ60 and FJ40',
    kind: 'supplier',
    url: 'https://trail-gear.com/longfield-30-spline-inner-axle-long-long-spline-e-locker-fj-60.html',
    excerpt:
      'FJ60 (1980-1990) long side shaft is 31-3/8 in long (301492-1-KIT). The FJ40 long side part (302090-1-KIT) is 28-15/16 in. Diff side spline length 4.75 in.'
  },
  {
    id: 'yukon-tlc-488',
    title:
      "Yukon YG TLC-488 ring and pinion, Toyota 9.5 in Land Cruiser (Dale's Super Store listing)",
    kind: 'supplier',
    url: 'https://dalessuperstore.com/i-23909492-yukon-high-performance-yukon-ring-pinion-gear-set-for-toyota-land-cruiser-in-a-4-88-ratio-yg-tlc-488-fdhc.html',
    excerpt:
      '9.50 inch ring gear diameter, 27 spline pinion, 10 ring gear bolts. Fits FJ-40 Land Cruiser (1960-1984), FJ-60 (1981-1990), FJ-80 (1991-1997).'
  },
  {
    id: 'ih8mud-60-under-40',
    title: 'IH8MUD tech article: how to put 60 series axles under a 40 or 55 series',
    kind: 'community',
    url: 'https://forum.ih8mud.com/showthread.php?p=1201703',
    excerpt:
      'The 60 housing is about 2.75 in wider. Toyota widened it by adding on one side only, the long side. This moves the pumpkin farther to the passenger side when put under a 40/55.'
  },
  {
    id: 'roversnorth-tlc-widths',
    title: "Rover's North forum: Land Cruiser axles (owner widths)",
    kind: 'community',
    url: 'https://forums.roversnorth.com/forum/land-rover-technical-forums/land-rover-series-i-ii-iia-iii/6968-land-cruiser-axles?p=113515',
    excerpt: 'FJ40 axles are 57 in front, 56 in rear. FJ60 are 60 in. FJ80 63 in.'
  },
  {
    id: 'autodata-j60',
    title: 'auto-data.net: Toyota Land Cruiser J60 wagon specifications',
    kind: 'community',
    url: 'https://www.auto-data.net/en/toyota-land-cruiser-j60-wagon-4.0-150hp-4wd-automatic-46708',
    excerpt: 'Front track 1475 mm (58.07 in). Rear track 1470 mm.'
  },
  {
    id: 'rpm-fj40',
    title: 'RPM Canada: 1977 Toyota Land Cruiser FJ40 feature (data tag)',
    kind: 'community',
    url: 'https://rpmcanada.ca/?p=13500',
    excerpt: 'Front tread: 55.3 in.'
  },
  {
    id: 'ih8mud-birfields',
    title: 'IH8MUD forum: Birfield interchange',
    kind: 'community',
    url: 'https://forum.ih8mud.com/threads/birfield-question.382669/',
    excerpt:
      '1979-1989 Land Cruiser (very late FJ40, FJ60, FJ62) birfields are the same as 1979-1985 mini truck. 1976-78 fine-spline birfields are odd and can be replaced with 79-up units.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the 9.5 in ring gear. Must be measured on a real housing before being trusted.'
  }
];

const wmsWidth = 60;
const trackWidth = 1475 * MM;
const wheelOffset = (wmsWidth - trackWidth) / 2;

export const toyotaFj40Fj60Front: AxleConfiguration = {
  id: 'toyota-land-cruiser-fj40-fj60-front-1975-1987',
  name: 'Toyota Land Cruiser FJ40 / FJ60 front (1975–1987, FJ60 widths)',
  shortName: 'FJ40/FJ60 front',
  group: 'Toyota',
  manufacturer: 'Toyota',
  vehicle:
    'Toyota Land Cruiser FJ60 (1981 to 1987) dimensions; FJ40 (to 1984) shares the center section on a narrower housing',
  years: { from: 1975, to: 1987 },
  kind: 'solid',
  position: 'front',
  housing: {
    centerSection: {
      style: 'third-member',
      ringGearDiameter: dim(
        9.5,
        'verified',
        ['yukon-tlc-488'],
        'Shown dashed. Land Cruiser 9.5 in gear set, the same size front and rear on the 40 and 60. It is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        -(31.31 - 17.13) / 2,
        'derived',
        ['rcv-fj60-front', 'trailgear-longfield', 'ih8mud-60-under-40'],
        'Passenger side. FJ60 OEM inner shafts are 31.31 in (left, driver) and 17.13 in (right, passenger), so the carrier sits (31.31 - 17.13) / 2 = 7.09 in toward the passenger side. On an FJ40 the long shaft is about 2.4 in shorter, so its offset is roughly 5.9 in.'
      ),
      dropBelowCenterline: dim(
        5.75,
        'estimated',
        ['engineering-estimate'],
        'No published value found. 4.75 in ring gear radius plus about 1 in of banjo wall and clearance. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        5.75,
        'schematic',
        ['engineering-estimate'],
        'Low-pinion banjo top. Drawing only.'
      ),
      width: dim(
        13,
        'estimated',
        ['engineering-estimate'],
        'Width of the banjo bulge across the tubes. Not published.'
      ),
      cover: {
        width: dim(
          11,
          'estimated',
          ['engineering-estimate'],
          'Welded rear dome. No published size.'
        ),
        height: dim(
          11,
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
        3,
        'estimated',
        ['engineering-estimate'],
        'No published tube size found. Measure before trusting.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'closed-knuckle',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['roversnorth-tlc-widths', 'ih8mud-60-under-40'],
        'Owners give 60 in for the FJ60 and 57 in for the FJ40. The extra width is all on the long (driver) side.'
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
    diameter: dim(15, 'estimated', ['engineering-estimate'], 'FJ60 OE 15 in wheel.'),
    width: dim(7, 'estimated', ['engineering-estimate'], 'Drawing only.'),
    offset: dim(
      wheelOffset,
      'community',
      ['roversnorth-tlc-widths', 'autodata-j60'],
      '(60 - 58.07) / 2 = 0.97 in, from owner WMS and the listed track. Not a Toyota wheel spec.'
    ),
    trackWidth: dim(
      trackWidth,
      'community',
      ['autodata-j60'],
      'FJ60 front track 1475 mm from a spec database. No Toyota brochure figure was found. FJ40 front tread is 55.3 in.'
    )
  },
  facts: [
    {
      label: 'Pumpkin side',
      value: 'Passenger side (left inner shaft is the long one)',
      status: 'verified',
      sourceIds: ['rcv-fj60-front']
    },
    {
      label: 'Ring gear',
      value: '9.5 in, 10 ring gear bolts, 27-spline pinion',
      status: 'verified',
      sourceIds: ['yukon-tlc-488']
    },
    {
      label: 'Axle shafts',
      value: '30-spline at the diff; OEM Birfield necks down to 27 spline',
      status: 'verified',
      sourceIds: ['rcv-fj60-front']
    },
    {
      label: 'Long inner shaft',
      value: 'FJ60 31-3/8 in, FJ40 28-15/16 in',
      status: 'verified',
      sourceIds: ['trailgear-longfield']
    },
    {
      label: 'Steering pivots',
      value: 'Closed knuckle on upper and lower kingpin (trunnion) bearings',
      status: 'estimated',
      sourceIds: ['engineering-estimate']
    },
    {
      label: 'Birfields',
      value: '1979 to 1989 interchange with 1979-1985 mini truck; 1976-78 fine spline is odd',
      status: 'community',
      sourceIds: ['ih8mud-birfields']
    },
    {
      label: 'FJ40 front tread',
      value: '55.3 in (1977 data tag)',
      status: 'community',
      sourceIds: ['rpm-fj40']
    },
    {
      label: 'Bolt pattern',
      value: '6x139.7 mm (6x5.5 in)',
      status: 'estimated',
      sourceIds: ['engineering-estimate']
    }
  ],
  sources,
  notes: [
    'Widths here are the FJ60. An FJ40 front shares the center section but is about 3 in narrower, all on the driver side, so its pumpkin sits nearer the middle.',
    'The pumpkin is on the passenger side, about 7 in off center on an FJ60, worked out from the OEM inner shaft lengths RCV publishes.',
    'Width and track are owner and database figures, not Toyota data. They agree with each other to within an inch.',
    'Differential drop and tube size are not published. The absolute clearance is an estimate until you calibrate it.',
    'Early FJ40s (1976 to 1978) used odd fine-spline Birfields and different hubs. Check yours before buying parts.'
  ]
};
