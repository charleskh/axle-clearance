import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'trailgear-longfield-inner',
    title: 'Trail Gear: Longfield Toyota 30-spline inner axle shafts, length chart',
    kind: 'supplier',
    url: 'https://trail-gear.com/longfield-30-spline-inner-axle-long-fj-40.html',
    excerpt:
      '30-spline long side, Pickup/4Runner (and FJ60): 31-7/16 in. Short side, Pickup/4Runner: 15-7/16 in. Fits 1979-1985 Toyota Pickup (all engines) and 1984-1985 4Runner solid front axle.'
  },
  {
    id: 'fatbobs-ds-long',
    title:
      "Fat Bob's Garage: Toyota Land Cruiser/Pickup front inner axle, driver side, chromoly 27 spline",
    kind: 'supplier',
    url: 'https://4x4.fatbobsgarage.com/mobile/toyota-land-cruiserpickup-axle-ds-chromoly-27-spline-p31180.aspx',
    excerpt:
      'Driver Side Long Axle. 31.5 in. overall length. 1979-1985 Toyota Pickup; 8/1980-1/1990 Toyota FJ60 Land Cruiser.'
  },
  {
    id: 'tuffcountry-front-ubolts',
    title:
      'Tuff Country 57700: front axle U-bolts, 1979-1985 Toyota Truck 4WD, 1984-1985 4Runner 4WD',
    kind: 'supplier',
    url: 'https://completewebsol.com/product/front-axle-u-bolts-79-85-toyota-truck-84-85-4runner-4wd-tuff-country',
    excerpt: 'Inside Diameter: 2.5625 Inch. Length: 9.625 Inch.'
  },
  {
    id: 'usastandard-t8',
    title: 'USA Standard Gear ZG T8-411-29 ring and pinion, Toyota 8 in (Jegs listing)',
    kind: 'supplier',
    url: 'https://www.jegs.com/i/yukon-gear-807-zg-t8-411-29-usa-standard-zg-t8-411-29-ring-pinion-gear-set-for-toyota-8-in-4-11-ratio',
    excerpt:
      '8.00 in. ring gear diameter, 29 spline pinion, 10 ring gear bolts. Fits 1979-1995 Toyota Pickup (rear, front).'
  },
  {
    id: 'nitro-30-30-front',
    title: 'Nitro Gear & Axle: Toyota 8 in front axle upgrade kit, solid axle 30/30/30 spline',
    kind: 'supplier',
    url: 'https://suspensionconnection.com/toyota-8-inch-front-axle-upgrade-kit-solid-axle-30-30-30-spline-chromomoly-nitro-gear-and-axle',
    excerpt:
      'The factory axles are 30 spline at the diff, but neck down to 27 spline at the Birfield. Fits 1979-1985 Pickup and 4Runner with solid front axles.'
  },
  {
    id: 'trailgear-knuckle-kit',
    title: 'Trail Gear: Toyota knuckle rebuild kit (solid axle)',
    kind: 'supplier',
    url: 'https://trail-gear.com/toyota-knuckle-rebuild-kit.html',
    excerpt:
      'Includes trunnion bearings. For 1979-1995 Pickup and 1985-1995 4Runner solid axle housings, not IFS.'
  },
  {
    id: 'revolution-t8-27',
    title: 'Revolution Gear T8-410-REV: Toyota 8.0 in 4-cylinder 4.10 ring and pinion, 27 spline',
    kind: 'supplier',
    url: 'https://ratchetsoffroad.com/product/toyota-80-inch-4cyl-ring-and-pinion-revolution-gear',
    excerpt: 'Toyota 8 in 4-cylinder, 4.10 ratio, 27-spline pinion.'
  },
  {
    id: 'trailgear-sas-kit',
    title: 'Trail Gear: 1986-1995 Toyota solid axle swap (SAS) kit',
    kind: 'supplier',
    url: 'https://trail-gear.com/brands/86-95-toyota-solid-axle-swap-sas-kit.html',
    excerpt:
      'The 1984 and 1985 axles are the best choice because they have an extra truss at the bottom.'
  },
  {
    id: 'f150hub-toyota',
    title: 'F150 Hub: Toyota 7.5 in and 8 in differential guide',
    kind: 'community',
    url: 'https://www.f150hub.com/drivetrain/toyota-axles.html',
    excerpt:
      'Ring gear 8.0 in. Solid front axle in 1979-1985 4-cylinder trucks. Early housings had 65 mm (about 2.56 in) axle tubes. Overall width: front 55.5 in (early). Removable third member.'
  },
  {
    id: 'zukiworld-widths',
    title: 'Zukiworld forum: axle width list (Shredder, 2006)',
    kind: 'community',
    url: 'https://www.zukiworld.com/forum/general-suzuki-forum/tracker-width/',
    excerpt:
      '\'79-85 Toyota PU/4runner: Width: 55.5" / passenger side differential. Lug pattern 6 x 5-1/2 in.'
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

const trackWidth = 1430 * MM;
const wmsWidth = 55.5;
/** Implied by the two community figures: (55.5 - 56.30) / 2. */
const wheelOffset = (wmsWidth - trackWidth) / 2;

export const toyotaPickup8Front: AxleConfiguration = {
  id: 'toyota-pickup-4runner-8in-front-1979-1985',
  name: 'Toyota Pickup / 4Runner 8 in front (1979–1985)',
  shortName: 'Toyota 8 in front',
  group: 'Toyota',
  manufacturer: 'Toyota',
  vehicle: 'Toyota Pickup 4x4 (1979–1985) and 4Runner (1984–1985)',
  years: { from: 1979, to: 1985 },
  kind: 'solid',
  position: 'front',
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
        -(31 + 7 / 16 - (15 + 7 / 16)) / 2,
        'derived',
        ['trailgear-longfield-inner', 'fatbobs-ds-long', 'zukiworld-widths'],
        'Passenger side. Inner shafts are 31-7/16 in (driver, long) and 15-7/16 in (passenger, short), so the carrier sits (31.44 - 15.44) / 2 = 8.0 in toward the passenger side. Assumes both Birfields and knuckles are mirror images.'
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
        'Width of the banjo bulge across the tubes, seen from the front. Not published.'
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
        ['tuffcountry-front-ubolts', 'f150hub-toyota'],
        'Square-bend U-bolts clamp the tube, so their 2.5625 in inside width equals the tube OD. Matches the 65 mm (2.56 in) tube F150 Hub gives.'
      )
    },
    wheelEnds: {
      kind: 'steer',
      knuckle: 'closed-knuckle',
      wmsWidth: dim(
        wmsWidth,
        'community',
        ['zukiworld-widths', 'f150hub-toyota'],
        'Two independent listings give 55.5 in. Neither is a Toyota figure, and neither says exactly where it was measured.'
      ),
      cEndWidth: dim(
        2.5,
        'schematic',
        ['engineering-estimate'],
        'Tube flange at the knuckle ball.'
      ),
      pivotSpan: dim(
        7,
        'schematic',
        ['engineering-estimate'],
        'Upper to lower trunnion (kingpin) bearing.'
      ),
      knuckleWidth: dim(
        7,
        'schematic',
        ['engineering-estimate'],
        'Knuckle ball diameter. Drawing only.'
      ),
      hubDiameter: dim(5, 'schematic', ['engineering-estimate']),
      hubLength: dim(4, 'schematic', ['engineering-estimate']),
      boltPattern: '6x139.7 mm (6x5.5 in)'
    }
  },
  wheel: {
    diameter: dim(15, 'community', ['threepiece-wheel', 'zukiworld-widths']),
    width: dim(
      6,
      'community',
      ['threepiece-wheel'],
      'Base wheel. Many trucks had optional 15x7 wheels.'
    ),
    offset: dim(
      wheelOffset,
      'estimated',
      ['zukiworld-widths', 'carsguide-4runner', 'threepiece-wheel'],
      'Back-calculated as (55.5 in WMS - 56.30 in track) / 2 = -0.40 in (about -10 mm). A fitment site lists +14 mm for the 15x6 base wheel instead, which would put the track near 54.4 in. Measure your wheel.'
    ),
    trackWidth: dim(
      trackWidth,
      'community',
      ['carsguide-4runner'],
      '1430 mm, from Australian-market 1984-1985 4Runner listings. No US Toyota brochure figure was found for the pickup.'
    )
  },
  facts: [
    {
      label: 'Pumpkin side',
      value: 'Passenger side (driver inner shaft is the long one)',
      status: 'verified',
      sourceIds: ['fatbobs-ds-long', 'trailgear-longfield-inner']
    },
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
      value: '30-spline at the differential, necked to 27-spline at the Birfield',
      status: 'verified',
      sourceIds: ['nitro-30-30-front']
    },
    {
      label: 'Steering pivots',
      value: 'Closed knuckle on upper and lower trunnion (kingpin) bearings, Birfield CV joint',
      status: 'verified',
      sourceIds: ['trailgear-knuckle-kit', 'nitro-30-30-front']
    },
    {
      label: 'Gear set',
      value: 'Same 8 in ring and pinion as the rear, in a drop-out third member',
      status: 'verified',
      sourceIds: ['usastandard-t8']
    },
    {
      label: 'Factory truss',
      value: '1984-1985 housings have an extra truss under the tubes',
      status: 'verified',
      sourceIds: ['trailgear-sas-kit']
    },
    {
      label: 'Bolt pattern',
      value: '6x139.7 mm (6x5.5 in), 106 mm center bore',
      status: 'community',
      sourceIds: ['threepiece-wheel', 'zukiworld-widths']
    }
  ],
  sources,
  notes: [
    'The pumpkin is on the passenger side, about 8 in off center. That comes from Trail Gear inner shaft lengths, not a direct measurement of a housing.',
    'Track, axle width and the wheel offset all come from community or aggregator listings, and they do not fully agree. Treat wheel placement as good to about an inch.',
    'Differential drop below axle centerline is not published. The absolute clearance is an estimate until you calibrate it with a measurement from a real axle.',
    'Clearance gained from a taller tire does not depend on the drop: it is half the diameter change, assuming the same loaded-radius deflection.',
    'The 1984-1985 housings have an extra factory truss under the tubes, which makes them the usual donor for 1986-1995 solid axle swaps.'
  ]
};
