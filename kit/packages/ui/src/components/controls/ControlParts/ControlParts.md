# ControlParts

> Internal: not exported from `src/index.ts`. Shared by the Device Controls (`PowerControl`, `OpenCloseControl`, `StateSelectControl`, `ValueControl`, `OperationalStateControl`), so the Control pattern from [`PowerControl.md`](../PowerControl/PowerControl.md) looks and behaves the same everywhere.

- **`ControlMessage`**: the message line under a Control. Always rendered as a `role="status"` live region, so "Turning on…" and failures are announced when they appear. Caption text; `secondary` or `danger` tone; optional spinning loading icon or fault icon.
- **`ControlStatusIcon`**: the loading or disconnected icon that takes the place of the input.
- **`failedText(verb, failureMessage)`**: "Couldn't {verb}. {failureMessage, or "The device didn't respond."}".
- **`controlStyles`** (`ControlParts.module.css`): the shared root, row and name styles.
