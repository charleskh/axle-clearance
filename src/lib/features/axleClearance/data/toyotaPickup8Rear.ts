import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'usastandard-t8',
    title: 'USA Standard Gear ZG T8-411-29 ring and pinion, Toyota 8 in (Jegs listing)',
    kind: 'supplier',
    url: 'https://www.jegs.com/i/yukon-gear-807-zg-t8-411-29-usa-standard-zg-t8-411-29-ring-pinion-gear-set-for-toyota-8-in-4-11-ratio',
    excerpt:
      '8.00 in. ring gear diameter, 29 spline pinion, 10 ring gear bolts. Fits 1979-1995 Toyota Pickup (rear, front).'
  },
  {
    id: 'revolution-t8-27',
    title: 'Revolution Gear T8-410-REV: Toyota 8.0 in 4-cylinder 4.10 ring and pinion, 27 spline',
    kind: 'supplier',
    url: 'https://ratchetsoffroad.com/product/toyota-80-inch-4cyl-ring-and-pinion-revolution-gear',
    excerpt: 'Toyota 8 in 4-cylinder, 4.10 ratio, 27-spline pinion.'
  },
  {
    id: 'yukon-yat35140',
    title: 'Yukon YA T35140 rear axle shaft, 1979-1985 Toyota Pickup and 4Runner',
    kind: 'supplier',
    url: 'https://completewebsol.com/product/yukon-axle-79-85-toyota-pickup-and-4runner-yukon-gear-axle',
    excerpt:
      '30 spline, 26.75 in long, 91 mm brake pilot. 1979-1985 Toyota Pickup and 4Runner. One part number, no left or right version.'
  },
  {
    id: 'toyota-42311-35080',
    title: 'Toyota OEM parts catalog (ToyotaPartsDeal): 42311-35080 Shaft, Rear Axle',
    kind: 'supplier',
    url: 'https://www.toyotapartsdeal.com/oem/toyota~shaft~rear~axle~42311-35080.html',
    excerpt:
      '1979-1981 Toyota Pickup, rear. Replaced by 42311-35140. Required quantity: 2. No left or right side given.'
  },
  {
    id: 'tuffcountry-rear-ubolts',
    title: 'Tuff Country 57750: rear axle U-bolts, 1979-1985 Toyota Truck 4WD',
    kind: 'supplier',
    url: 'https://bpsps.webshopmanager.com/i-23963655-1979-1985-toyota-truck-4wd-lifted-with-springs-or-add-a-leafs-rear-axle-u-bolts-tuff-country-57750.html',
    excerpt: 'Inside diameter 2-9/16 in (2.5625 in), 9/16 in bolt, square bend.'
  },
  {
    id: 'f150hub-toyota',
    title: 'F150 Hub: Toyota 7.5 in and 8 in differential guide',
    kind: 'community',
    url: 'https://www.f150hub.com/drivetrain/toyota-axles.html',
    excerpt:
      'Rear 8 in used in 1979-1995 pickups and 4Runners. Semi floating. Early housings had 65 mm (about 2.56 in) tubes; late housings 80 mm (about 3.15 in). Early housing 55 in flange to flange; late 58 in.'
  },
  {
    id: 'carsguide-4runner',
    title: 'CarsGuide Australia: 1984 and 1985 Toyota 4Runner 4x4 specifications',
    kind: 'community',
    url: 'https://www.carsguide.com.au/toyota/4runner/1984',
    excerpt:
      'Front track 1430 mm, rear track 1410 mm, wheelbase 2615 mm. Australian-market data aggregator, not a Toyota document.'
  },
  {
    id: 'threepiece-wheel',
    title: 'ThreePiece.us fitment page: 1984 Toyota Pickup (Base, DLX, SR5)',
    kind: 'community',
    url: 'https://vehicles.threepiece.us/vehicles/toyota/pickup/1984/dlx-4wd/',
    excerpt:
      'Stock wheel 15x6, offset +14, bolt pattern 6x139.7, center bore 106 mm. Not split by 2WD and 4WD.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the 8.0 in ring gear and 65 mm tubes. Must be measured on a real housing before being trusted.'
  }
];

const trackWidth = 1410 * MM;
/** Same wheel as the front record: -0.40 in implied by the community front width and track. */
const wheelOffset = (55.5 - 1430 * MM) / 2;

export const toyotaPickup8Rear: AxleConfiguration = {
  id: 'toyota-pickup-4runner-8in-rear-1979-1985',
  name: 'Toyota Pickup / 4Runner 8 in rear (1979–1985)',
  shortName: 'Toyota 8 in rear',
  group: 'Toyota',
  manufacturer: 'Toyota',
  vehicle: 'Toyota Pickup 4x4 (1979–1985) and 4Runner (1984–1985)',
  years: { from: 1979, to: 1985 },
  kind: 'solid',
  position: 'rear',
  housing: {
    centerSection: {
      style: 'third-member',
      ringGearDiameter: dim(
        8.0,
        'verified',
        ['usastandard-t8', 'f150hub-toyota'],
        'Shown dashed. It is not the drop: the banjo wall and oil clearance sit below the ring gear.'
      ),
      offsetFromVehicleCenter: dim(
        0,
        'estimated',
        ['yukon-yat35140', 'toyota-42311-35080', 'engineering-estimate'],
        'Drawn centered. Toyota lists one rear shaft part number at two per vehicle, and Yukon sells a single replacement with no left or right version, which points to equal-length shafts and a centered carrier. Neither source states the side outright.'
      ),
      dropBelowCenterline: dim(
        5.0,
        'estimated',
        ['engineering-estimate'],
        'No published value found. 4.0 in ring gear radius plus about 1 in of banjo wall and oil clearance. Measure before trusting.'
      ),
      riseAboveCenterline: dim(
        5.0,
        'schematic',
        ['engineering-estimate'],
        'Banjo top. Drawing only.'
      ),
      width: dim(
        11,
        'estimated',
        ['engineering-estimate'],
        'Width of the banjo bulge across the tubes, seen from behind. Not published.'
      ),
      cover: {
        width: dim(
          9.5,
          'estimated',
          ['engineering-estimate'],
          'Welded rear dome. No published size.'
        ),
        height: dim(
          9.5,
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
        2.5625,
        'derived',
        ['tuffcountry-rear-ubolts', 'f150hub-toyota'],
        'Square-bend U-bolts clamp the tube, so their 2-9/16 in inside width equals the tube OD. Matches the 65 mm (2.56 in) early tube F150 Hub gives.'
      )
    },
    wheelEnds: {
      kind: 'rear',
      floating: 'semi-float',
      wmsWidth: dim(
        55,
        'community',
        ['f150hub-toyota'],
        'Early housing listed at 55 in flange to flange. Track plus twice the assumed wheel offset gives 54.7 in, so the two agree within about 0.3 in.'
      ),
      brakeDiameter: dim(11.6, 'schematic', ['engineering-estimate'], 'Drum brake. Drawing only.'),
      flangeDiameter: dim(
        5.5,
        'schematic',
        ['engineering-estimate'],
        'Backing plate flange. Drawing only.'
      ),
      hubDiameter: dim(
        6.5,
        'schematic',
        ['engineering-estimate'],
        'Axle shaft flange. Drawing only.'
      ),
      hubLength: dim(3, 'schematic', ['engineering-estimate']),
      boltPattern: '6x139.7 mm (6x5.5 in)'
    }
  },
  wheel: {
    diameter: dim(15, 'community', ['threepiece-wheel']),
    width: dim(
      6,
      'community',
      ['threepiece-wheel'],
      'Base wheel. Many trucks had optional 15x7 wheels.'
    ),
    offset: dim(
      wheelOffset,
      'estimated',
      ['carsguide-4runner', 'threepiece-wheel'],
      'Same wheel as the front record, back-calculated there as about -0.40 in (-10 mm). A fitment site lists +14 mm for the 15x6 base wheel instead. Measure your wheel.'
    ),
    trackWidth: dim(
      trackWidth,
      'community',
      ['carsguide-4runner'],
      '1410 mm, from Australian-market 1984-1985 4Runner listings. No US Toyota brochure figure was found for the pickup.'
    )
  },
  facts: [
    {
      label: 'Ring gear',
      value: '8.0 in, 10 ring gear bolts',
      status: 'verified',
      sourceIds: ['usastandard-t8']
    },
    {
      label: 'Pinion spline',
      value: '27 (4-cylinder) or 29, check before buying gears',
      status: 'verified',
      sourceIds: ['usastandard-t8', 'revolution-t8-27']
    },
    {
      label: 'Axle shafts',
      value: '30-spline, 26.75 in, 91 mm brake pilot, semi-float',
      status: 'verified',
      sourceIds: ['yukon-yat35140']
    },
    {
      label: 'Carrier',
      value: 'Drop-out third member, same 8 in gear set as the solid front',
      status: 'verified',
      sourceIds: ['usastandard-t8']
    },
    {
      label: 'Later housing',
      value: '1986-1995 trucks use a wider (about 58 in) housing with 80 mm tubes',
      status: 'community',
      sourceIds: ['f150hub-toyota']
    },
    {
      label: 'Bolt pattern',
      value: '6x139.7 mm (6x5.5 in), 106 mm center bore',
      status: 'community',
      sourceIds: ['threepiece-wheel']
    }
  ],
  sources,
  notes: [
    'This record is the narrow 1979-1985 housing. The 1986-1995 rear 8 in is about 3 in wider with bigger tubes, so do not use these widths for it.',
    'The pumpkin is drawn centered. That is inferred from equal-length shafts, not from a measured housing.',
    'Differential drop below axle centerline is not published. The absolute clearance is an estimate until you calibrate it with a measurement from a real axle.',
    'Clearance gained from a taller tire does not depend on the drop: it is half the diameter change, assuming the same loaded-radius deflection.'
  ]
};
