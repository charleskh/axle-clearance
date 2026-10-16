import { expect, test, type Page } from '@playwright/test';

// Reduced motion makes the drawing snap to each size, so geometry can be read immediately.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByTestId('axle-drawing')).toBeVisible();
  // Clicks before hydration are lost; wait for the app to say it is interactive.
  await page.locator('html[data-hydrated="true"]').waitFor();
});

async function setDiameter(page: Page, d: number) {
  await page.getByTestId('tire-slider').fill(String(d));
  await expect(page.getByTestId('tire-readout')).toContainText(String(d));
}

async function bbox(page: Page, part: string) {
  return page.locator(`[data-variant=selected] [data-part="${part}"]`).evaluate((el) => {
    if (!(el instanceof SVGGraphicsElement)) throw new Error('not an SVG element');
    const b = el.getBBox();
    return { x: b.x, y: b.y, width: b.width, height: b.height };
  });
}

test('shows the Dana Super 60 axle', async ({ page }) => {
  await expect(page.getByTestId('axle-select')).toContainText(
    'Ford Super Duty Dana Super 60 (2005–2016)'
  );
});

test('every tire diameter from 33 to 44 updates the measurements', async ({ page }) => {
  for (let d = 33; d <= 44; d++) {
    await setDiameter(page, d);
    await expect(page.getByTestId('m-diameter')).toHaveText(`${d.toFixed(1)}"`);
    await expect(page.getByTestId('m-radius')).toHaveText(`${(d / 2).toFixed(2)}"`);
    const gain = (d - 33) / 2;
    const sign = gain > 0 ? '+' : '±';
    await expect(page.getByTestId('m-gain')).toHaveText(`${sign}${gain.toFixed(2)}"`);
    await expect(page.getByTestId('m-clearance')).toHaveText(`≈ ${(d / 2 - 6.5).toFixed(2)}"`);
  }
});

test('presets select their size', async ({ page }) => {
  for (const d of [33, 35, 37, 38, 40, 42, 44]) {
    await page.getByTestId(`preset-${d}`).click();
    await expect(page.getByTestId('tire-readout')).toContainText(String(d));
    await expect(page.getByTestId(`preset-${d}`)).toHaveAttribute('aria-pressed', 'true');
  }
});

test('tires scale with diameter while the housing does not change', async ({ page }) => {
  await setDiameter(page, 33);
  const tire33 = await bbox(page, 'selected-driver-tire');
  const housing33 = await bbox(page, 'center-section');
  const tube33 = await bbox(page, 'passenger-tube');
  const viewBox = await page.getByTestId('axle-drawing').getAttribute('viewBox');

  await setDiameter(page, 44);
  const tire44 = await bbox(page, 'selected-driver-tire');
  const housing44 = await bbox(page, 'center-section');
  const tube44 = await bbox(page, 'passenger-tube');

  expect(await page.getByTestId('axle-drawing').getAttribute('viewBox')).toBe(viewBox);
  expect(tire44.height / tire33.height).toBeCloseTo(44 / 33, 2);
  expect(housing44.width).toBeCloseTo(housing33.width, 1);
  expect(housing44.height).toBeCloseTo(housing33.height, 1);
  expect(tube44.width).toBeCloseTo(tube33.width, 1);
  expect(tube44.height).toBeCloseTo(tube33.height, 1);
  // Same axle, raised by half the diameter change: 5.5 in at 10 units per inch.
  expect(housing33.y - housing44.y).toBeCloseTo(55, 0);
  expect(housing44.x).toBeCloseTo(housing33.x, 1);
});

test('unverified clearance is labelled and calibration changes it', async ({ page }) => {
  await setDiameter(page, 37);
  const hero = page.locator('.metric.hero');
  await expect(hero.locator('[data-status=estimated]')).toBeVisible();
  await expect(page.getByTestId('m-clearance')).toHaveText('≈ 12.00"');

  await page.getByTestId('drop-input').fill('6.25');
  await page.getByTestId('drop-input').blur();
  await expect(hero.locator('[data-status=calibrated]')).toBeVisible();
  await expect(page.getByTestId('m-clearance')).toHaveText('12.25"');
  // The gain does not depend on the drop.
  await expect(page.getByTestId('m-gain')).toHaveText('+2.00"');
});

test('loaded deflection lowers absolute clearance but not the gain', async ({ page }) => {
  await setDiameter(page, 44);
  await page.getByTestId('deflection-input').fill('1.4');
  await page.getByTestId('deflection-input').blur();
  await expect(page.getByTestId('m-radius')).toHaveText('20.60"');
  await expect(page.getByTestId('m-gain')).toHaveText('+5.50"');
});

test('verification table marks the housing drop as unverified', async ({ page }) => {
  const row = page.locator('[data-dimension-key=dropBelowCenterline]');
  await expect(row.locator('[data-status=estimated]')).toBeVisible();
  const track = page.locator('[data-dimension-key=trackWidth]');
  await expect(track.locator('[data-status=verified]')).toBeVisible();
});

test('overlay mode shows both configurations and the gain', async ({ page }) => {
  await setDiameter(page, 40);
  await page.getByTestId('mode-overlay').click();
  await expect(page.locator('[data-variant=baseline]')).toHaveCount(1);
  await expect(page.locator('[data-variant=selected]')).toHaveCount(1);
  await expect(page.getByTestId('dim-clearance-delta')).toContainText('+3.50"');
  await expect(page.getByTestId('cmp-clearance-delta')).toHaveText('+3.50"');
});

test('side by side shares one ground and one scale', async ({ page }) => {
  await setDiameter(page, 42);
  await page.getByTestId('mode-side-by-side').click();
  const svg = page.getByTestId('axle-drawing');
  await expect(svg).toHaveAttribute('data-mode', 'side-by-side');
  const heights = await svg.evaluate((el) => {
    const h = (sel: string) => {
      const n = el.querySelector(sel);
      if (!(n instanceof SVGGraphicsElement)) throw new Error(sel);
      const b = n.getBBox();
      return { bottom: b.y + b.height, height: b.height };
    };
    return {
      base: h('[data-variant=baseline] [data-part="baseline-driver-tire"]'),
      sel: h('[data-variant=selected] [data-part="selected-driver-tire"]'),
      baseHousing: h('[data-variant=baseline] [data-part="center-section"]'),
      selHousing: h('[data-variant=selected] [data-part="center-section"]')
    };
  });
  expect(heights.base.bottom).toBeCloseTo(heights.sel.bottom, 1);
  expect(heights.sel.height / heights.base.height).toBeCloseTo(42 / 33, 2);
  expect(heights.selHousing.height).toBeCloseTo(heights.baseHousing.height, 1);
  await expect(page.getByTestId('dim-clearance-baseline')).toContainText('10.00"');
});

test('page does not scroll sideways', async ({ page }) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('comparison tire is adjustable in side by side and overlay', async ({ page }) => {
  await expect(page.getByTestId('baseline-slider')).toHaveCount(0);
  await page.getByTestId('mode-side-by-side').click();
  await page.getByTestId('baseline-preset-35').click();
  await setDiameter(page, 40);
  await expect(page.getByTestId('m-gain')).toHaveText('+2.50"');
  await expect(page.getByTestId('cmp-diameter-delta')).toHaveText('+5.0"');
  await expect(page.getByTestId('dim-clearance-baseline')).toContainText('11.00"');

  await page.getByTestId('mode-overlay').click();
  await page.getByTestId('baseline-slider').fill('38');
  await expect(page.getByTestId('dim-clearance-delta')).toContainText('+1.00"');

  // A larger comparison tire reads as a loss, not a gain.
  await page.getByTestId('baseline-preset-44').click();
  await expect(page.getByTestId('m-gain')).toHaveText('−2.00"');
});

test('theme toggle switches and remembers the choice', async ({ page }) => {
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');
  await page.getByTestId('theme-toggle').click();
  const after = before === 'dark' ? 'light' : 'dark';
  await expect(html).toHaveAttribute('data-theme', after);
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', after);
});

test('compares two different axles with an honest status', async ({ page }) => {
  await page.getByTestId('mode-side-by-side').click();
  await expect(page.getByTestId('gain-exact')).toBeVisible();

  await page
    .getByTestId('baseline-axle-select')
    .selectOption('toyota-pickup-4runner-8in-front-1979-1985');
  await page.getByTestId('baseline-preset-35').click();
  await setDiameter(page, 37);

  // Different axles: the drops no longer cancel, so no "Exact" badge.
  await expect(page.getByTestId('gain-exact')).toHaveCount(0);
  await expect(page.locator('.metric.gain [data-status]')).toBeVisible();
  // Two drop inputs, one per axle.
  await expect(page.getByTestId('drop-input-baseline')).toBeVisible();
  await expect(page.getByTestId('comparison-table')).toContainText('Housing drop');

  // Calibrating both drops makes the delta trustworthy and exact to the math.
  await page.getByTestId('drop-input').fill('6.5');
  await page.getByTestId('drop-input').blur();
  await page.getByTestId('drop-input-baseline').fill('5');
  await page.getByTestId('drop-input-baseline').blur();
  await expect(page.getByTestId('m-gain')).toHaveText('−0.50"');
});

test('every registered axle renders in every mode', async ({ page }) => {
  const ids = await page
    .getByTestId('axle-select')
    .locator('option')
    .evaluateAll((opts) => opts.map((o) => (o instanceof HTMLOptionElement ? o.value : '')));
  expect(ids.length).toBeGreaterThan(5);
  for (const id of ids) {
    await page.getByTestId('axle-select').selectOption(id);
    for (const mode of ['single', 'side-by-side', 'overlay']) {
      await page.getByTestId(`mode-${mode}`).click();
      await expect(
        page.locator('[data-variant=selected] [data-part="center-section"]')
      ).toHaveCount(1);
    }
    await page.getByTestId('mode-single').click();
  }
});

test('report a measurement opens a prefilled issue for the selected axle', async ({ page }) => {
  const link = page.getByTestId('report-measurement');
  const href = await link.getAttribute('href');
  const url = new URL(href ?? '');
  expect(url.origin + url.pathname).toBe('https://github.com/charleskh/axle-clearance/issues/new');
  expect(url.searchParams.get('title')).toContain('Dana Super 60');
  expect(href).not.toContain('+');
  await expect(link).toHaveAttribute('rel', /noopener/);
});

test('rejected calibration values are reported, and clearing the field resets', async ({
  page
}) => {
  const drop = page.getByTestId('drop-input');
  await drop.fill('40');
  await expect(page.getByTestId('drop-error')).toBeVisible();
  // Not applied: still the stored estimate.
  await expect(page.locator('.metric.hero [data-status=estimated]')).toBeVisible();

  await drop.fill('7');
  await expect(page.getByTestId('drop-error')).toHaveCount(0);
  await expect(page.locator('.metric.hero [data-status=calibrated]')).toBeVisible();

  await drop.fill('');
  await expect(page.locator('.metric.hero [data-status=estimated]')).toBeVisible();
});

test('a smaller selected tire reads as a loss', async ({ page }) => {
  await setDiameter(page, 31);
  await expect(page.locator('.metric.gain dt')).toContainText('Lost versus');
  await page.getByTestId('mode-overlay').click();
  await expect(page.locator('[data-dimension="clearance-delta"]')).toContainText('lost');
});

test('a normal build has no staging banner', async ({ page }) => {
  await expect(page.getByTestId('staging-banner')).toHaveCount(0);
});
