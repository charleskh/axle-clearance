import { describe, expect, it } from 'vitest';
import { calculateClearance, defaultSettings, portalLift } from '../clearance';
import type { AxleConfiguration, TireSpec } from '../types';
import { hmmwvFront } from './hmmwvFront';
import { validateAxle } from './index';
import { unimogFront } from './unimogFront';
import { unimogRear } from './unimogRear';
import { weld74PortalFront } from './weld74PortalFront';
import { weld74PortalRear } from './weld74PortalRear';

const portalAxles: AxleConfiguration[] = [
  hmmwvFront,
  unimogFront,
  unimogRear,
  weld74PortalFront,
  weld74PortalRear
];

/** Axles whose portal drop is stated by the portal maker or a supplier. */
const publishedPortalDrop = new Set([weld74PortalFront.id, weld74PortalRear.id]);

const tire37: TireSpec = { nominalDiameter: 37, sectionWidth: 12.5, label: '37x12.50' };

describe('Portal axle data', () => {
  for (const axle of portalAxles) {
    it(`${axle.id} passes validateAxle`, () => {
      expect(validateAxle(axle)).toEqual([]);
    });

    it(`${axle.id} has portal hubs`, () => {
      expect(axle.portal).toBeDefined();
      expect(axle.portal?.drop.value).toBeGreaterThan(0);
    });

    it(`${axle.id} does not claim a verified diff drop`, () => {
      // No maker or supplier source found states the diff low point for any of these.
      expect(axle.housing.centerSection.dropBelowCenterline.status).not.toBe('verified');
    });

    it(`${axle.id} only marks the portal drop verified when the maker publishes it`, () => {
      const verified = axle.portal?.drop.status === 'verified';
      expect(verified).toBe(publishedPortalDrop.has(axle.id));
    });

    it(`${axle.id} clearance math holds on a 37 in tire`, () => {
      const settings = defaultSettings(axle);
      const result = calculateClearance(axle, tire37, settings);
      const drop = axle.housing.centerSection.dropBelowCenterline.value;
      const lift = axle.kind === 'solid' ? (axle.portal?.drop.value ?? 0) : 0;
      expect(portalLift(axle)).toBe(lift);
      expect(result.axleCenterlineHeight).toBeCloseTo(18.5 + lift, 9);
      expect(result.differentialClearance).toBeCloseTo(18.5 + lift - drop, 9);
    });
  }

  it('uses unique ids', () => {
    expect(new Set(portalAxles.map((a) => a.id)).size).toBe(portalAxles.length);
  });

  it('keeps the HMMWV drop measured from the wheel centerline', () => {
    expect(hmmwvFront.kind).toBe('ifs');
    expect(portalLift(hmmwvFront)).toBe(0);
    // 37 in stock tire, 16 in published clearance.
    const r = calculateClearance(hmmwvFront, tire37, defaultSettings(hmmwvFront));
    expect(r.differentialClearance).toBeCloseTo(16, 9);
    expect(hmmwvFront.portal?.reductionRatio).toBe(1.92);
  });

  it('puts the Unimog 404 front diff on the driver side and the rear on the passenger side', () => {
    expect(unimogFront.housing.centerSection.offsetFromVehicleCenter.value).toBeGreaterThan(0);
    expect(unimogRear.housing.centerSection.offsetFromVehicleCenter.value).toBeLessThan(0);
  });

  it('uses the 74Weld 3.88 in portal drop on both Currie axles', () => {
    expect(weld74PortalFront.portal?.drop.value).toBe(3.88);
    expect(weld74PortalRear.portal?.drop.value).toBe(3.88);
  });

  it('groups the axles as assigned', () => {
    expect(hmmwvFront.group).toBe('AM General');
    expect(unimogFront.group).toBe('Mercedes-Benz');
    expect(unimogRear.group).toBe('Mercedes-Benz');
    expect(weld74PortalFront.group).toBe('Aftermarket');
    expect(weld74PortalRear.group).toBe('Aftermarket');
  });
});
