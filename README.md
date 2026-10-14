# Axle Clearance Visualizer

An interactive elevation drawing of off-road axles on tires from 31 to 44 inches. Everything is drawn to one physical scale, so a taller tire visibly lifts the same housing. You can compare two tire sizes on one axle, or two different axles, side by side or overlaid on one ground line.

The stack matches the seethespecs web client: SvelteKit 2, Svelte 5, TypeScript, Vitest and Playwright. Styling uses the seethespecs design tokens, copied verbatim into `src/lib/styles/sts-design-tokens.css`, with light and dark themes. The feature lives under `src/lib/features/axleClearance` and `src/lib/components/axleClearance`, so it can move into `web/sts-client` as two folders plus one route. On that move, delete the copied token file.

## Axles

| Group         | Axles                                                                                                                                                                                                                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ford          | Super Duty Dana Super 60 front (2005 to 2016); kingpin Dana 60 front (1985 to 1991); F-250 high-pinion Dana 44 front (1977 to 1979); Bronco and F-150 high-pinion Dana 44 front (1978 to 1979); early Bronco Dana 30 and Dana 44 fronts (1966 to 1977); Sterling 10.25 rear (1985 to 1998); Sterling 10.5 rear (2005 to 2016) |
| Dodge         | W250/W350 kingpin Dana 60 front (1975 to 1993)                                                                                                                                                                                                                                                                                |
| GM            | K30/K3500 kingpin Dana 60 front (1977 to 1991)                                                                                                                                                                                                                                                                                |
| Jeep          | TJ/LJ Rubicon Dana 44 front and rear; JK Rubicon Dana 44 front and JK Dana 44 rear; JL/JT Rubicon Dana 44 M210 front and M220 rear (2018 to 2023); JL Rubicon Dana 44 HD full-float rear (2024 on)                                                                                                                            |
| Toyota        | Pickup and 4Runner 8 in front and rear (1979 to 1985); FJ40/FJ60 front (FJ60 widths); FJ80/FZJ80 front and 9.5 in full-float rear (1993 to 1997); IFS 7.5 in fronts on the 1986 to 1995 pickup/4Runner and the 1995 to 2004 Tacoma/4Runner                                                                                    |
| Suzuki        | Samurai front and rear (1986 to 1995)                                                                                                                                                                                                                                                                                         |
| AM General    | HMMWV (M998 family) geared-hub IFS front                                                                                                                                                                                                                                                                                      |
| Mercedes-Benz | Unimog 404 portal front and rear                                                                                                                                                                                                                                                                                              |
| Aftermarket   | Jeep JL/JT Currie 44 front and HD60 rear with 74Weld portal boxes                                                                                                                                                                                                                                                             |

Front axles are drawn from ahead of the truck and rear axles from behind, so you always see the cover side. Tags on the drawing name the driver and passenger sides.

## Running it

```sh
pnpm install
pnpm dev            # http://localhost:3000
pnpm check          # svelte-check (TypeScript)
pnpm test:unit      # Vitest: math, data and geometry invariants
pnpm build
pnpm test:integration   # Playwright: builds, previews, desktop Chrome + Pixel 5
```

`@playwright/test` is pinned to an exact version so the browser build it expects stays stable between runs.

## Publishing

Live at https://axle-clearance.seethespecs.com, served by GitHub Pages from this repository. `.github/workflows/ci.yml` runs the type check, unit tests and browser tests (desktop Chrome, Pixel 5 and iPhone 13 WebKit) on every push, and deploys `main` to Pages after they pass.

The build reads two environment variables:

- `VITE_SITE_URL`: the public origin, used for the canonical link and the share image. CI defaults it to the seethespecs subdomain.
- `BASE_PATH`: a subpath such as `/axle-clearance`. Leave it empty while the custom domain is attached.

## Reporting a measurement

Every housing drop in the data is an estimate until someone measures a real axle. Each axle's data section has a "Report a measurement" link that opens a prefilled GitHub issue. Nothing is sent unless you submit it.

## License

MIT. See `LICENSE`. The design tokens in `src/lib/styles/sts-design-tokens.css` come from seethespecs, by the same author.

## How it is built

### Domain, no UI

- `types.ts` holds the domain models: axle configuration, housing geometry, tire spec, measurement source, verification status and clearance results.
- `clearance.ts` implements the clearance math:
  - `effectiveTireRadius = nominalDiameter / 2 - loadedRadiusDeflection`
  - `differentialClearance = effectiveTireRadius - housingDrop`
  - It also decides whether an absolute clearance can be trusted.
- `tires.ts` holds the supported diameters, the presets and the typical section widths (used for drawing only).
- `data/danaSuper60Ford.ts` defines the axle. Every dimension carries a value in inches, a status, its source ids and a note. Sources are stored with URLs and excerpts.
- `data/index.ts` is the axle registry, plus `validateAxle`, which rejects things like a "verified" value with no manufacturer or supplier source, or a housing drop smaller than the ring gear radius.

### Rendering engine, no Svelte

- `render/path.ts` provides path primitives in inches. It uses lines and cubic curves only, so a single point transform maps them into SVG.
- `render/assembly.ts` builds the axle front view from the data:
  - Parts: housing, cover and bolts, hidden ring gear, tubes, inner C-ends, knuckles, hubs, rotors and tires.
  - Coordinates: y = 0 is the axle centerline.
  - Only `buildTire` takes a tire, which is why the housing cannot change size when the tire does.
- `render/scene.ts` places the assembly on the ground at the loaded radius:
  - It applies a fixed `SCALE` of 10 drawing units per inch inside a viewport sized for the 44 inch tire.
  - It emits the dimension lines and the side-by-side or overlay layout.

### Components

- `ClearanceVisualizer.svelte` is the whole feature and holds the state.
- `AxleDrawing.svelte` turns a scene into SVG. It sizes text in screen pixels so labels stay legible without touching the geometry.
- The panels: `TireControls`, `MeasurementPanel`, `CalibrationPanel`, `AxleDataTable` and `StatusBadge`.

### Adding an axle

Add a configuration file under `data/` and list it in `data/index.ts`; `danaSuper60Ford.ts` is the template. A solid axle needs no other change: the renderer already draws ball-joint, kingpin and closed-knuckle fronts, semi- and full-float rears, and integral (bolt-on cover) or third-member (welded dome) housings. `validateAxle` checks the data, and `render/styles.test.ts` runs every registered axle through the scale and low-point checks automatically. IFS fronts set `kind: 'ifs'` and an `ifs` linkage (carrier height, control arm pivots, ball joints, half-shaft). Their housing drop is measured from the wheel centerline at stock ride height, because the diff hangs from the frame. Portal hubs are an optional `portal` block on either kind. On a solid portal axle the tubes ride above the wheel by the portal drop, so clearance = loaded radius + portal drop - housing drop; the gain from a taller tire is still exactly half the diameter change. On a geared-hub IFS (Humvee) the drop is already measured from the wheel centerline, so the hubs only change the drawing.

### Comparing two axles

With one axle, the housing drop cancels: the clearance change is exactly half the diameter change, even when the drop is only an estimate. With two different axles it does not cancel, so the app marks the difference with the weaker of the two axles' verification statuses instead of "Exact", shows a drop input for each axle, and breaks the difference into its tire part and its drop part.

## Measurement status

The in-app data table is the source of truth: every dimension and specification carries its status (verified, derived, owner-reported, estimated, or schematic) with linked sources and notes.

The pattern across all 31 axles:

- **No axle has a verified housing drop** (axle centerline to the lowest point of the housing). Manufacturers and suppliers do not publish it. Each drop is an estimate checked against ring gear size and, where one exists, a published ground clearance with a stated tire. The JK and JL drops are bounded by Jeep's own figures; the rest are engineering estimates. This is the number to measure, and the app takes a measured value per axle.
- **Verified figures** are mostly ring gear diameters, cover sizes, spline counts, pinion position, and the Ford Super Duty, JK and JL tracks.
- **Owner-reported or estimated:** most older tracks and wheel mounting surface widths, nearly all tube diameters, and the amount of differential offset (the side is usually sourced).
- **Schematic:** knuckle, C-end, hub, brake and spring-seat shapes. They are never used in a calculation.

Known open questions from the research:

- **Which side the Samurai front pumpkin sits on.** No source states it.
- **FZJ80 rear pumpkin side.** Shaft lengths and an owner report disagree.
- **Which side the 1995 to 2004 Tacoma IFS carrier sits on.** Forum hints point both ways.
- **Dodge and GM kingpin Dana 60 tracks.** No published figure was found, so both are estimated from owner-measured widths.
- **Real Toyota track figures.** Every Toyota track came from aggregators, not Toyota.
- **Portal drops for the HMMWV and Unimog.** Neither maker publishes one; both are estimates. 74Weld does publish theirs (3.88 in).
- **The HMMWV 16 in ground clearance.** It comes from secondary sources, and where it is measured is unconfirmed.
