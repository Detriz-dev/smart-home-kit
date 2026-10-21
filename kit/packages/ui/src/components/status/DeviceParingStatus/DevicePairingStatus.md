# DevicePairingStatus

### Purpose
A small status indicator that shows a Device's pairing status.

### Component in domain model context
This component will cover Paring Status form domain model 
[device lifecycle](/docs/architecture/domain-model/device-lifecycle.md)

### Anatomy of component
1. **Label**: status text ("Unpaired", "Pairing", "Paired")
2. **Indicator**: color mapped to status


### API

```ts
type PairingStatus = 'unpaired' | 'pairing' | 'paired';

interface DevicePairingStatusProps {
  status: PairingStatus;
}
```

### Status mapping
| Status     | Label         | Indicator token                | 
|------------|---------------|--------------------------------|
| `unpaired` | Unpaired      | ` --shk-status-neutral-solid`  | 
| `pairing`  | Pairing       | `--shk-status-progress-solid`  | 
| `paired`   | Paired        | `--shk-status-success-solid`       | 
