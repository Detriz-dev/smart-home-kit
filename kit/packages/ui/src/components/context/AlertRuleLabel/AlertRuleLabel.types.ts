import type {
  AlertRuleStateCondition,
  AlertRuleThresholdCondition,
} from "../../../types/alert";
import type { UnitLabelUnit } from "../../readings/UnitLabel";

/** How big the label is drawn: xs (caption text, 16px icon) under a Reading on a card, sm (body-sm, 20px icon) on a Sensor's own screen. */
export type AlertRuleLabelSize = "xs" | "sm";

interface AlertRuleLabelBaseProps {
  /** How big the label is drawn. Defaults to `xs`. */
  size?: AlertRuleLabelSize;
}

/** A rule on a Measured Metric: "Alert above 28 °C". */
interface AlertRuleLabelThresholdProps extends AlertRuleLabelBaseProps {
  /** The Alert Rule's condition, usually `rule.condition`. Shown as "Alert above/below {value} {Unit}". */
  condition: AlertRuleThresholdCondition;
  /** The Unit to show after the value, e.g. `celsius`. Use the same Unit as the Reading next to it; if it isn't the Metric's standard Unit, convert `condition.value` first. */
  unit: UnitLabelUnit;
}

/** A rule on a Two-state Metric: "Alert when Open". */
interface AlertRuleLabelStateProps extends AlertRuleLabelBaseProps {
  /** The Alert Rule's condition, usually `rule.condition`. Shown as "Alert when {State}". */
  condition: AlertRuleStateCondition;
  /** States have no Unit. */
  unit?: never;
}

/** Props of AlertRuleLabel. TypeScript asks for a `unit` only when the condition is a threshold. */
export type AlertRuleLabelProps =
  AlertRuleLabelThresholdProps | AlertRuleLabelStateProps;
