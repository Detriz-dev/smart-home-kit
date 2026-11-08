# AlertRuleLabel

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/context/alert-rule-label.mdx). Props are defined in [`AlertRuleLabel.types.ts`](./AlertRuleLabel.types.ts).

### Purpose

Shows an [Alert Rule](/kit/apps/docs-site/docs/domain-model/glossary.mdx#alerts) in a few words, next to the Reading it watches: 🔔 **Alert above 28 °C** under a Temperature, 🔔 **Alert when Open** under a front door. People see what the app is watching for before anything happens.

Showing a rule is optional (scope decision 3): the developer decides. For Smoke, CO or an open door the rule usually goes without saying, so it is left out.

Figma: `AlertRuleLabel` component set in _DeTriz - Smart Home Kit_ (node `614:48`, page `AlertRuleLabel` in the Context section after AssetLabel). The `AlertRuleLabel examples` frame (node `614:49`) shows each kind of rule, the label under a SensorReading and a LongText case.

### Component in domain model context

Category: **Context** ("What is it?"): it describes a setting of the Sensor, not what is happening now. An Alert Rule is not an Alert, so the label has no status colour.

| Part | Domain term              | Example           | Rule                                                                        |
| ---- | ------------------------ | ----------------- | --------------------------------------------------------------------------- |
| icon | Alert Rule               | `notifications`   | `ALERT_ICONS.default`, the same bell as the Alerts tab.                     |
| text | the rule's **condition** | Alert above 28 °C | Threshold: "Alert above/below {value} {Unit}". State: "Alert when {State}". |

Thresholds are in the Metric's standard Unit (Data model). The parent passes the `unit` to show; if it shows °F, it converts the value first, like it does for the Reading.

### Variants

Figma variant property `size` (xs, sm), text property `rule`. Context, so the target states don't apply: a rule stays the same when the Module is Stale or Disconnected.

| `size` | Text style | Icon    | Use                                |
| ------ | ---------- | ------- | ---------------------------------- |
| `xs`   | caption    | xs 16px | Under a Reading on a card. Default |
| `sm`   | body-sm    | sm 20px | A Sensor's own screen              |

The Alert Level is **not** shown: the label isn't an Alert, and a red label under a normal Reading would look like a problem.

### Anatomy

```
AlertRuleLabel
├── icon   ALERT_ICONS.default (decorative)
└── text   "Alert above 28 °C"   color-text/secondary, wraps
```

Gap `space/1`. No padding or background.

### Accessibility

- Plain text; the icon is decorative because the text starts with "Alert".
- Units are read by their spoken name ("Alert above 28 degrees Celsius"), through `UnitLabel`'s rule.

### Open questions

- Mark Built-in Alert Rules ("Built-in")? Not in the MVP: they're Smoke and CO, where the rule is usually not shown.
- An `alertRule` prop on `SensorReading`, `SensorState`, `DeviceCard` and `SpaceCard`? For now the parent places the label under the Reading.
