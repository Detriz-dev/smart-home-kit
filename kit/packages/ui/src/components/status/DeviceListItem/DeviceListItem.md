# DeviceListItem

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/status/device-list-item.mdx). Props are defined in [`DeviceListItem.types.ts`](./DeviceListItem.types.ts).

### Purpose

One Device (a Hub, a Module or a Standalone Device) as a row in a [`List`](../../layout/List/List.md): its Device Kind icon, its name, its Space, its status on the right and any Faults under the name. It answers "is everything OK?" for a list of Devices, like a Devices screen or the Modules of one Hub.

It is [`ListItem`](../../layout/ListItem/ListItem.md) with typed props: the parent passes domain values (`pairingStatus`, `connectionStatus`, `faults`) instead of components, so every Device row in every app shows its status the same way.

Takes props only, never fetches data.

Figma: `DeviceListItem` component set in _DeTriz - Smart Home Kit_ (node `529:2138`), page `DeviceListItem`. Variant properties `state` and `hasFault`. Each variant holds an exposed `ListItem` instance, so its title, description, icon and clickable look are set on it. The `DeviceListItem examples` frame (node `529:2355`) shows a List of five Devices, `LongText` and `Minimal`.

### Component in domain model context

Category: **Status** ("Is everything OK?"). Its main job is a Device's health, so it's Status even though it's built on a Layout component (see "Composites keep the category of their main job").

It shows these terms from the [Glossary](/kit/apps/docs-site/docs/domain-model/glossary.mdx) and [Device lifecycle](/kit/apps/docs-site/docs/domain-model/device-lifecycle.mdx):

| Part        | Domain term                                      | Example                    | Shown by                                         |
| ----------- | ------------------------------------------------ | -------------------------- | ------------------------------------------------ |
| icon        | **Device Kind**                                  | Module → `developer_board` | `Icon`                                           |
| title       | the Device's name (**Module Name** for a Module) | Climate Module             | `ListItem` title                                 |
| description | **Space** (its name)                             | Bedroom                    | `ListItem` description                           |
| end         | **Pairing Status** or **Connection Status**      | Stale                      | `DevicePairingStatus` / `DeviceConnectionStatus` |
| details     | **Fault**                                        | CO₂ sensor failure         | `DeviceFaultStatus`                              |

Domain rules behind it:

- **Three separate fields.** Pairing Status, Connection Status and Fault are three props, never one "status".
- **Connection Status and Fault only exist while Paired.** The types enforce it: `connectionStatus` is required when `pairingStatus` is `paired`, and not allowed otherwise. `faults` is only allowed when Paired.
- **The right side shows one status.** Unpaired or Pairing: `DevicePairingStatus`. Paired: `DeviceConnectionStatus` (a Paired Device always has a Connection Status, so "Paired" itself isn't shown).
- **Faults are independent of Connection Status**, so a row can be Connected and have a Fault. Each Fault gets its own line under the Space.
- **A Hub without Capabilities is never Stale** (only Devices with Capabilities send Readings). The types don't block it; the docs say so.

What it does **not** show, and why:

- **Readings.** That's `DeviceCard` or `SpaceCard`.
- **Site, Floor.** `LocationPath` shows where a Device is in full. The row shows only its Space.
- **Actions** (pair, remove, rename). Those are Controls, on the Device's own screen. A row can be clickable to open that screen.

### Visual idea

A `ListItem` row:

```
┌──────────────────────────────────────────────┐
│ [▦]  Air Quality Module          ● Connected │
│      Office                                  │
│      (!) CO₂ sensor calibration required     │
└──────────────────────────────────────────────┘
 icon  title / description / details      end
```

| Question              | Answer                                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| Icons?                | One per Device Kind, 24px: Hub `router`, Module `developer_board`. Plus those of the statuses. |
| More than one layout? | No. Parts and statuses change; the layout is `ListItem`'s.                                     |
| Text size             | `ListItem`'s: title body, description body-sm.                                                 |

### States

Figma variant property `state` (and `hasFault`). In code there is no `state` prop: it follows from `pairingStatus` and `connectionStatus`.

| `state`        | Props                                                         | Right side                          |
| -------------- | ------------------------------------------------------------- | ----------------------------------- |
| `unpaired`     | `pairingStatus="unpaired"`                                    | `DevicePairingStatus` Unpaired      |
| `pairing`      | `pairingStatus="pairing"`                                     | `DevicePairingStatus` Pairing       |
| `connecting`   | `pairingStatus="paired"`, `connectionStatus="connecting"`     | `DeviceConnectionStatus` Connecting |
| `connected`    | `… connectionStatus="connected"`                              | Connected                           |
| `stale`        | `… connectionStatus="stale"` (Devices with Capabilities only) | Stale                               |
| `disconnected` | `… connectionStatus="disconnected"`                           | Disconnected                        |

`hasFault=true` exists for the four Paired states: one `DeviceFaultStatus` per Fault under the Space.

Target states:

| Target state | Applies? | How                                                                 |
| ------------ | -------- | ------------------------------------------------------------------- |
| loading      | no       | The row shows no value. Connecting covers "not reachable yet".      |
| Connected    | yes      | `state=connected`                                                   |
| Stale        | yes      | `state=stale`                                                       |
| Disconnected | yes      | `state=disconnected`. There's no value to hide; the status says it. |
| Fault        | yes      | `hasFault=true`, with any Connection Status.                        |

### Anatomy

`ListItem`'s, filled in:

```
ListItem (li)
├── start        Icon: router | developer_board (md, decorative)
├── text
│   ├── title    the Device's name
│   ├── description  the Space's name (optional)
│   └── details  ul of DeviceFaultStatus, one per Fault (only with Faults)
└── end          DevicePairingStatus or DeviceConnectionStatus
```

This needed one addition to `ListItem`: an optional `details` slot under the description (Figma: `details` slot, `hasDetails`). A Fault message is too long for the right side, and the description is plain text.

### API

The props are defined in [`DeviceListItem.types.ts`](./DeviceListItem.types.ts). Decisions behind them:

- `name`, `deviceKind` and `pairingStatus` are required. `deviceKind` is the shared `DeviceKind` type (`"hub" | "module"`, in `src/types/deviceKind.ts`).
- `spaceName` is optional: a Hub's row on the Hub's own Space screen doesn't need it.
- Clickable with `href` or `onClick`, the same as `ListItem`. The name is always there, so no extra title rule.
- The Device Kind → icon map is inside the component for now. When `DeviceLabel` is built, move it there and export it, like `SPACE_TYPE_ICONS`.

### Example values

| Case               | deviceKind | name                          | spaceName                   | Status               | Faults                     |
| ------------------ | ---------- | ----------------------------- | --------------------------- | -------------------- | -------------------------- |
| Default            | module     | Climate Module                | Bedroom                     | paired, connected    | –                          |
| Hub                | hub        | Kitchen Hub                   | Kitchen                     | paired, connected    | –                          |
| Stale              | module     | Climate Module                | Bedroom                     | paired, stale        | –                          |
| Disconnected       | module     | Light Module                  | Living room                 | paired, disconnected | –                          |
| Fault              | module     | Air Quality Module            | Office                      | paired, connected    | calibration_required (co2) |
| Unpaired           | module     | Climate Module                | Garage                      | unpaired             | –                          |
| Pairing            | module     | Climate Module                | Garage                      | pairing              | –                          |
| `LongText` (240px) | module     | Kitchen climate by the window | Living room and dining area | paired, disconnected | sensor_failure (co2)       |
| `Minimal`          | hub        | Kitchen Hub                   | –                           | paired, connected    | –                          |

### Tokens

No tokens of its own: `ListItem`, `Icon` and the status components bring theirs. `details` (in `ListItem`) uses `--shk-space-1` above and between Faults.

### Accessibility

- An `<li>` (from `ListItem`), so it must be inside a `List`.
- Read in order: name, Space, Faults, status: "Air Quality Module, Office, CO₂ sensor calibration required, Connected".
- The Device Kind icon is decorative: the name says what it is.
- The statuses keep their own accessibility (text + icon, not colour alone).
- Faults are a nested list, so screen readers count them ("list, 2 items").
- Clickable: the name is the link ("Air Quality Module, link"), the same as `ListItem`.

### Open questions

- **Several Faults on a narrow row.** Each Fault takes a line. A Module with three Faults makes a tall row; a `FaultCount` badge might be better in long lists. Wait for real use.
- **Should a Hub show how many Modules it has** ("3 Modules") in its description? Not a Glossary rule yet.
