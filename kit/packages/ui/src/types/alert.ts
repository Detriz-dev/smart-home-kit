import type { MeasuredMetric, TwoStateMetric } from "./metric";
import type { StateOf } from "./state";

/** How urgent an Alert is. From the Glossary. Built-in Alert Rules (Smoke, CO) are `critical`. */
export type AlertLevel = "critical" | "warning" | "info";

/** Where an Alert is in its life. From the Glossary: `ended` when the condition is no longer true, `closed` when the user closed it while it was Active. */
export type AlertStatus = "active" | "ended" | "closed";

/** A condition on a Measured Metric: the Reading is above or below a value, in the Metric's standard Unit. */
export interface AlertRuleThresholdCondition {
  /** The Metric of the Sensor the rule checks. */
  metric: MeasuredMetric;
  /** Whether the Alert is raised above or below `value`. */
  comparison: "above" | "below";
  /** The limit, in the Metric's standard Unit (°C for Temperature, ppm for CO₂). */
  value: number;
}

/** A condition on a Two-state Metric: the Reading is in one of that Metric's own States. */
export type AlertRuleStateCondition = {
  [M in TwoStateMetric]: {
    /** The Metric of the Sensor the rule checks. */
    metric: M;
    /** The State that raises the Alert. Only this Metric's own States are allowed: a Power rule can't use `open`. */
    state: StateOf<M>;
  };
}[TwoStateMetric];

/** What makes an Alert Rule raise an Alert. TypeScript checks Data model rule 21: thresholds only for Measured Metrics, States only for Two-state Metrics. */
export type AlertRuleCondition =
  AlertRuleThresholdCondition | AlertRuleStateCondition;

/** An Alert Rule as the UI shows it. The app's developer defines Alert Rules in code. */
export interface AlertRule {
  /** What raises the Alert. */
  condition: AlertRuleCondition;
  /** How urgent the Alerts this rule raises are. */
  alertLevel: AlertLevel;
  /** True for the Built-in Alert Rule of a Smoke or CO Sensor. Defaults to `false`. */
  isBuiltIn?: boolean;
}
