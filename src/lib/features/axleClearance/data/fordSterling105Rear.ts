import type { AxleConfiguration, MeasurementSource } from '../types';
import { dim, MM } from './helpers';

const sources: MeasurementSource[] = [
  {
    id: 'ford-bblb-2014',
    title:
      'Ford 2014 Super Duty Body Builders Layout Book, Axle/Tire/Vehicle Height Data and Model Lineup',
    kind: 'manufacturer',
    url: 'https://irp.cdn-website.com/8e9b3e0f/files/uploaded/2014_SD_F-Series_v1-1.pdf',
    excerpt:
      'F-250/F-350 SRW 4x4 Regular Cab, LT245/75R17E: rear track (RW, SRW) 1706 mm [67.2 in]; static loaded radius 371 mm [14.6 in]; tire diameter 814 mm [32.0 in]. Rear spring/GAWR 6100 to 6290 lb on SRW pickups.'
  },
  {
    id: 'torqueking-idn141',
    title: 'Torque King: 1999-2016 Ford Sterling 10.5" rear axle identification (IDN-141)',
    kind: 'supplier',
    url: 'https://torqueking.com/products/sku-1999-2016-ford-sterling-10-5-rear-axle-identification-idn-141',
    excerpt:
      'The 10-1/2" Sterling rear full-floating axle arrived in 1999 with the new Super Duty F250 and F350. Used in Excursions and F250/F350 single rear wheel trucks. Both open and limited slip units were available. Major engineering changes for 2011.'
  },
  {
    id: 'dennys-sterling',
    title: "Denny's Driveshafts: Ford 10.25 and 10.50 Sterling",
    kind: 'supplier',
    url: 'https://dennysdriveshaft.com/c512_ford_10.25_and_10.50_sterling.html',
    excerpt:
      'The Ford 10.25/10.50 has a 12 bolt rear cover and the Dana 60, 70, and 80 have a 10 bolt rear cover. 1999-2010: 10.50 in housing, 31-spline pinion. 2011-2015: 10.50 in housing, 37-spline pinion.'
  },
  {
    id: 'dieselhub-1050',
    title: 'DieselHub: Sterling 10.50 inch rear differential service',
    kind: 'community',
    url: 'https://www.dieselhub.com/maintenance/sterling-10.50-differential.html',
    excerpt: 'Axle tube diameter 3.50 inches. 35 spline axle shafts. 12 cover bolts, 29-39 ft-lb.'
  },
  {
    id: 'wikipedia-sterling',
    title: 'Wikipedia: Sterling 10.5 axle',
    kind: 'community',
    url: 'https://en.wikipedia.org/wiki/Sterling_10.5_axle',
    excerpt:
      'Ring gear measures 10.5 inches (270 mm). 35 spline axle shafts, 1.5 in diameter. 8x170 mm lug pattern from 1999. Currently only made as a full floating axle.'
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
    id: 'wheel-sizes-sd',
    title: 'wheel-sizes.com: Ford F-250/F-350 Super Duty 2005-2016 OE wheel specs',
    kind: 'community',
    url: 'https://www.wheel-sizes.com/',
    excerpt:
      '8x170 bolt pattern, 124.9 mm center bore, OE offset listed as ET34 (not split by year).'
  },
  {
    id: 'width-chart-community',
    title:
      'Forum and chart figures for Sterling 10.5 width (fordmasterx.com chart, Expedition Portal)',
    kind: 'community',
    url: 'https://fordmasterx.com/ford-rear-axle-width-chart/',
    excerpt:
      '1999-2004 SRW about 68.5 to 68.9 in WMS to WMS. 2005 and later reported about 70.5 to 72 in, not confirmed against a Ford drawing.'
  },
  {
    id: 'drivingline-sterling',
    title: 'Drivingline: When feature shoots go bad, a lesson in Sterling 10.5 axles',
    kind: 'community',
    url: 'https://www.drivingline.com/articles/when-feature-shoots-go-bad-a-lesson-in-sterling-105-axles/',
    excerpt: '2005 through 2012 have 13.38 in (340 mm) disc brakes; 2013 have 14.29 in (363 mm).'
  },
  {
    id: 'engineering-estimate',
    title: 'Engineering estimate for this project',
    kind: 'engineering',
    excerpt:
      'Values chosen to be geometrically consistent with the published ring gear, tube and track figures. Must be measured on a real housing before being trusted.'
  }
];

const trackWidth = 1706 * MM;
const wheelOffset = 34 * MM;

export const fordSterling105Rear: AxleConfiguration = {
  id: 'ford-sd-sterling-10-5-rear-2005-2016',
  name: 'Ford Super Duty Sterling 10.5 rear (2005–2016)',
  shortName: 'Sterling 10.5',
  group: 'Ford',
  manufacturer: 'Ford (Sterling Axle Plant)',
  vehicle: 'Ford F-250 / F-350 Super Duty, SRW',
  years: { from: 2005, to: 2016 },
  kind: 'solid',
  position: 'rear',
  housing: {
    centerSection: {
      style: 'integral',
      ringGearDiameter: dim(
        10.5,
        'verified',
        ['torqueking-idn141', 'dennys-sterling', 'wikipedia-sterling'],
        'Shown dashed. It is not the drop: the housing wall sits below the ring gear.'
      ),
      offsetFromVehicleCenter: dim(
        -3,
        'estimated',
        ['tmr-sterling-truss', 'engineering-estimate'],
        'Passenger-side offset is stated by an axle-swap supplier. The 3 in amount is an estimate; no published figure was found.'
      ),
      dropBelowCenterline: dim(
        6.75,
        'estimated',
        ['engineering-estimate', 'wikipedia-sterling'],
        'No published value found. 6.75 in is a 5.25 in ring gear radius plus housing wall and oil clearance. Measure before trusting.'
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
      outerDiameter: dim(3.5, 'community', ['dieselhub-1050'])
    },
    wheelEnds: {
      kind: 'rear',
      floating: 'full-float',
      wmsWidth: dim(
        trackWidth + 2 * wheelOffset,
        'community',
        ['ford-bblb-2014', 'wheel-sizes-sd', 'width-chart-community'],
        'Ford rear track (67.2 in) plus twice the OE wheel offset (ET34) = 69.8 in. Forum reports for 2005 and later run 70.5 to 72 in. The offset input is not manufacturer-verified.'
      ),
      brakeDiameter: dim(
        340 * MM,
        'community',
        ['drivingline-sterling'],
        '2005 to 2012 rotor. 2013 and later use a 363 mm rotor.'
      ),
      flangeDiameter: dim(7, 'schematic', ['engineering-estimate']),
      hubDiameter: dim(8, 'schematic', ['engineering-estimate']),
      hubLength: dim(4.5, 'schematic', ['engineering-estimate']),
      boltPattern: '8x170 mm'
    }
  },
  wheel: {
    diameter: dim(17, 'verified', ['ford-bblb-2014'], 'Base tire LT245/75R17E.'),
    width: dim(
      7.5,
      'estimated',
      ['engineering-estimate'],
      'Typical OE 17 in steel wheel width. Drawing only.'
    ),
    offset: dim(wheelOffset, 'community', ['wheel-sizes-sd']),
    trackWidth: dim(
      trackWidth,
      'verified',
      ['ford-bblb-2014'],
      'F-250/F-350 SRW rear track, 1706 mm.'
    )
  },
  facts: [
    {
      label: 'Cover',
      value: '12-bolt (Dana 60/70/80 use 10)',
      status: 'verified',
      sourceIds: ['dennys-sterling']
    },
    {
      label: 'Pinion splines',
      value: '31 through 2010, 37 from 2011',
      status: 'verified',
      sourceIds: ['dennys-sterling']
    },
    {
      label: 'Axle shafts',
      value: '35-spline, 1.5 in, full-float',
      status: 'community',
      sourceIds: ['wikipedia-sterling', 'dieselhub-1050']
    },
    {
      label: 'Pinion offset',
      value: 'Passenger side',
      status: 'verified',
      sourceIds: ['tmr-sterling-truss']
    },
    {
      label: 'Rear GAWR (2014 SRW pickup)',
      value: '6100 to 6290 lb',
      status: 'verified',
      sourceIds: ['ford-bblb-2014']
    },
    {
      label: 'Bolt pattern',
      value: '8x170 mm',
      status: 'community',
      sourceIds: ['wikipedia-sterling', 'wheel-sizes-sd']
    },
    {
      label: 'Locker',
      value: 'Open or limited slip from the factory',
      status: 'verified',
      sourceIds: ['torqueking-idn141']
    }
  ],
  sources,
  notes: [
    'Track is the Ford-published 67.2 in for 2014 SRW trucks. The 1999 to 2004 axle is about 1 in narrower per owner reports.',
    'Most 2011 and later internal parts do not interchange with 2010 and earlier axles, and the pinion spline changed from 31 to 37.',
    'Differential drop below the axle centerline has not been published by Ford. Calibrate it with a tape measure under a real axle before trusting the absolute clearance.',
    'The pumpkin sits toward the passenger side, the opposite side from a Ford front differential. Swappers into Jeeps often have to move the fuel tank.',
    'Clearance gained from a taller tire does not depend on the drop: it is half the diameter change.'
  ]
};
