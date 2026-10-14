import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'mb-portal-axles',
    title: 'Mercedes-Benz Trucks: Unimog portal axles',
    kind: 'manufacturer',
    url: 'https://mercedes-benz-trucks.com/en_GB/models/unimog-off-road/driving-concept/portal-axles.html',
    excerpt:
      'Axle tube and differential lie above the wheel centre. Describes the current Unimog, but the portal principle is the same one the 404 introduced. Gives no dimension.'
  },
  {
    id: 'wikipedia-404',
    title: 'Wikipedia: Unimog 404 (pointer to Kautz and the 1966 Unimog 404 user manual)',
    kind: 'community',
    url: 'https://en.wikipedia.org/wiki/Unimog_404',
    excerpt:
      'Track width 1630 mm. Ground clearance 400 mm, citing the Unimog 404 Gebruikershandleiding, October 1966, pp. 3-5. Tyres 10-20 or 10.5-20. Portal axles with reduction gears and coil springs. 64,242 built, 1955-1980.'
  },
  {
    id: 'irate-404-silverado',
    title: 'IRATE 4x4 forum: Unimog 404 axles under an 03 Silverado (build thread)',
    kind: 'community',
    url: 'https://irate4x4.com/threads/unimog-404-axles-under-a-03-silverado-build-thread.397438/',
    excerpt:
      'Center section 3.54, portals 2.13, 7.56 overall reduction. 205 mm stud circle, 18 mm studs, 161 mm hub diameter. The axles add about 5 in of ground clearance over stock. Read through a search summary; the thread blocks direct fetches.'
  },
  {
    id: 'forum-404-offset',
    title: 'IH8MUD forum: Good info on portals? (Unimog 404 axle swap discussion)',
    kind: 'community',
    url: 'https://forum.ih8mud.com/threads/good-info-on-portals.874',
    excerpt:
      'An owner reports the 404 front axle housing sits 3.5 in from center toward the driver side, with the rear mirrored to the passenger side. Read through a search summary; the exact post was not opened.'
  },
  {
    id: 'zukiworld-unimooki',
    title: 'Zukiworld: Project Unimooki (Unimog 404 axles under a Suzuki)',
    kind: 'community',
    url: 'https://www.zukiworld.com/forum/build-diaries-how-to-diy/project-unimooki',
    excerpt:
      'Cut 7.5 in from each axle. The front diff is offset toward the driver side. "An additional 2:1 reduction at the portal boxes."'
  },
  {
    id: 'tractor-il-portal',
    title: 'Israel tractor collection: Hanomag, on the origin of portal axles',
    kind: 'community',
    url: 'https://tractor.org.il/collection/item/301?lang=en',
    excerpt:
      'Portal axles: live axles that do not emerge from the center of the wheel, but about 15 cm above it. General description, not a 404 figure.'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be consistent with a small spherical Unimog diff, a 10.5-20 tire (about 39 in) and the 400 mm handbook clearance once tire squat is allowed for. Must be measured before being trusted.'
  }
];

const trackWidth = 1630 * MM;
const wheelOffset = 0;
const wmsWidth = trackWidth + 2 * wheelOffset;

export const unimogRear: AxleConfiguration = {
  id: 'mercedes-unimog-404-portal-rear-1955-1980',
  name: 'Mercedes-Benz Unimog 404 portal rear (1955–1980)',
  shortName: 'Unimog 404 portal rear',
  group: 'Mercedes-Benz',
  manufacturer: 'Mercedes-Benz (Daimler-Benz)',
  vehicle: 'Unimog 404 (404.0 and 404.1, also called Unimog S), 2700 and 2900 mm wheelbase',
  years: { from: 1955, to: 1980 },
  kind: 'solid',
  position: 'rear',
  housing: {
    centerSection: {
      style: 'third-member',
      ringGearDiameter: dim(
        200 * MM,
        'estimated',
        ['engineering-estimate'],
        'No published size found. Shown dashed. It is not the drop.'
      ),
      offsetFromVehicleCenter: dim(
        -3.5,
        'community',
        ['forum-404-offset', 'zukiworld-unimooki'],
        'Passenger side, about 3.5 in, by owner report: the rear housing is the front one mirrored. One owner centered his rear by cutting the long side.'
      ),
      dropBelowCenterline: dim(
        6.5,
        'estimated',
        ['engineering-estimate', 'wikipedia-404'],
        'Axle shaft centerline to diff low point. Not published. Check: 19.5 in nominal radius + 5 in portal drop - 6.5 in = 18 in (457 mm) unloaded, against the handbook 400 mm, which fits about 2 in of tire squat under a 3 ton truck. Measure before trusting.'
      ),
      riseAboveCenterline: dim(5.5, 'schematic', ['engineering-estimate'], 'Drawing only.'),
      width: dim(
        11,
        'estimated',
        ['engineering-estimate'],
        'Diff casting width seen from behind. Not published.'
      ),
      cover: {
        width: dim(9, 'estimated', ['engineering-estimate'], 'Closed rear of the diff housing.'),
        height: dim(9, 'estimated', ['engineering-estimate'], 'Closed rear of the diff housing.'),
        boltCount: 0,
        boltCircle: dim(0, 'schematic', ['engineering-estimate'], 'No bolt-on cover.')
      },
      coverCenterHeight: dim(0, 'estimated', ['engineering-estimate'])
    },
    tubes: {
      outerDiameter: dim(
        3.5,
        'estimated',
        ['engineering-estimate'],
        'Axle tube OD. Not published. Measure with calipers.'
      )
    },
    wheelEnds: {
      kind: 'rear',
      floating: 'full-float',
      wmsWidth: dim(
        wmsWidth,
        'estimated',
        ['wikipedia-404', 'engineering-estimate'],
        'Set equal to the 1630 mm track by assuming a zero-offset wheel. Not published.'
      ),
      brakeDiameter: dim(
        14,
        'estimated',
        ['engineering-estimate', 'zukiworld-unimooki'],
        'Drum brake. Owners describe the drums as very heavy; diameter not published.'
      ),
      flangeDiameter: dim(8, 'schematic', ['engineering-estimate'], 'Drawing only.'),
      hubDiameter: dim(161 * MM, 'community', ['irate-404-silverado']),
      hubLength: dim(
        5,
        'schematic',
        ['engineering-estimate'],
        'Housing end to wheel mounting surface, including the portal box. Drawing only.'
      ),
      boltPattern: '6 studs on a 205 mm circle, 18 mm studs (owner report)'
    }
  },
  wheel: {
    diameter: dim(20, 'community', ['wikipedia-404'], '10-20 or 10.5-20 tires, about 39 in tall.'),
    width: dim(8, 'estimated', ['engineering-estimate'], 'Split military rim. Not confirmed.'),
    offset: dim(
      wheelOffset,
      'estimated',
      ['engineering-estimate'],
      'Assumed zero. No figure found for the stock Unimog rim.'
    ),
    trackWidth: dim(
      trackWidth,
      'community',
      ['wikipedia-404'],
      '1630 mm, from a spec table that cites a German enthusiast reference. Same front and rear.'
    )
  },
  portal: {
    drop: dim(
      5,
      'estimated',
      ['engineering-estimate', 'irate-404-silverado', 'tractor-il-portal'],
      'Shaft centerline to wheel centerline. Not published by Mercedes for the 404. Swappers report about 5 in more clearance than the axles they replaced, and portals are generally described as about 15 cm. Measure hub center to tube center before trusting.'
    ),
    boxWidth: dim(4, 'schematic', ['engineering-estimate'], 'Drawing only.'),
    boxHeight: dim(11, 'schematic', ['engineering-estimate'], 'Drawing only.'),
    reductionRatio: 2.13
  },
  facts: [
    {
      label: 'Gear reduction',
      value: 'Diff 3.54, portals 2.13, 7.56 overall (owner report; another owner says about 2:1)',
      status: 'community',
      sourceIds: ['irate-404-silverado', 'zukiworld-unimooki']
    },
    {
      label: 'Portal hubs',
      value: 'Axle tube and diff above the wheel centre, spur-gear drop at each wheel',
      status: 'verified',
      sourceIds: ['mb-portal-axles']
    },
    {
      label: 'Suspension',
      value: 'Coil springs with hydraulic shocks, front and rear; axles located by torque tubes',
      status: 'community',
      sourceIds: ['wikipedia-404', 'engineering-estimate']
    },
    {
      label: 'Wheel end',
      value:
        'Portal box on the housing end; hub carried by the box, shaft only drives (modeled as full-float)',
      status: 'estimated',
      sourceIds: ['engineering-estimate']
    },
    {
      label: 'Published ground clearance',
      value: '400 mm (1966 user manual, as cited); measuring point not stated',
      status: 'community',
      sourceIds: ['wikipedia-404']
    },
    {
      label: 'Pumpkin side',
      value: 'Rear passenger side about 3.5 in, the front mirrored to the driver side',
      status: 'community',
      sourceIds: ['forum-404-offset', 'zukiworld-unimooki']
    },
    {
      label: 'Bolt pattern',
      value: '6 on 205 mm, 18 mm studs; 161 mm hub',
      status: 'community',
      sourceIds: ['irate-404-silverado']
    }
  ],
  sources,
  notes: [
    'The 404 was picked over the 435 (U1300L) because its axles are the ones people actually swap under Jeeps, Suzukis and pickups. 64,242 were built and they are light enough to use. The 435 axles are much heavier and mostly stay under 435s.',
    'This is a solid portal axle: the drop is measured from the axle shaft centerline, and the app adds the portal drop to the tire radius before subtracting it.',
    'Neither the portal drop nor the diff drop is published for the 404. Both are estimates checked against the 400 mm handbook clearance. Measure hub center to tube center and tube center to diff bottom before trusting the number.',
    'Swappers usually narrow these axles. Builds cut about 7.5 in out of each housing, so the track and diff offset here apply to a stock-width axle only.',
    'Track is a secondary-source figure and the wheel offset is assumed zero, so wheel placement is good to about an inch.'
  ]
};
