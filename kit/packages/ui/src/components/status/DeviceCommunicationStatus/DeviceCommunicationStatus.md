# DeviceCommunicationStatus

### Purpose

A small status indicator that shows a Device's connection status.

### Component in domain model context

This component will cover Connection Status from the domain model
[device lifecycle](/docs/architecture/domain-model/device-lifecycle.md)

### Anatomy of component

1. **Label**: status text ("Disconnected", "Connecting", "Connected", "Stale")
2. **Indicator**: color mapped to status

### API

```ts
type ConnectionStatus = "connecting" | "connected" | "stale" | "disconnected";

interface DeviceCommunicationStatusProps {
  status: ConnectionStatus;
}
```

### Status mapping

| Status         | Label        | Indicator token               |
| -------------- | ------------ | ----------------------------- |
| `disconnected` | Disconnected | `--shk-status-neutral-solid`  |
| `connecting`   | Connecting   | `--shk-status-progress-solid` |
| `connected`    | Connected    | `--shk-status-success-solid`  |
| `stale`        | Stale        | `--shk-status-warning-solid`  |
