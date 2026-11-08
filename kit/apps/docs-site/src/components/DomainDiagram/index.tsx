import type { ReactNode } from "react";

import styles from "./styles.module.css";

// A small UML-style picture of part of the Data model, for the landing page's "Domain model" card.
// Design: Figma "SHK – Landing", node 70:501 (components "Domain class" 67:263 and
// "Domain association" 67:268).
// It shows the part of the model behind the landing page's DeviceCard example:
// Module → Sensor → Reading, and under each one the list of values its field can take.
// The values the example uses are highlighted, so the three cards tell the same story.

interface Attribute {
  /** The field name or enum value, as it is written in code. */
  label: string;
  /** True when the landing page example uses this value. */
  isHighlighted?: boolean;
}

interface DomainClassProps {
  /** Entity or enum name, e.g. "Module". */
  name: string;
  /** Field names (for an entity) or values (for an enum), top to bottom. */
  attributes: Attribute[];
  /** The top row: entities, all the same height so the associations line up. */
  isEntity?: boolean;
}

function DomainClass({
  name,
  attributes,
  isEntity,
}: DomainClassProps): ReactNode {
  return (
    <div
      className={isEntity ? `${styles.class} ${styles.entity}` : styles.class}
    >
      <div className={styles.className}>{name}</div>
      <ul className={styles.attributes}>
        {attributes.map((attribute) => (
          <li
            key={attribute.label}
            className={attribute.isHighlighted ? styles.highlighted : undefined}
          >
            {attribute.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface AssociationProps {
  /** What the left entity does to the right one, e.g. "contains". */
  verb: string;
  /** Cardinality at the left end. */
  from: string;
  /** Cardinality at the right end. */
  to: string;
}

function Association({ verb, from, to }: AssociationProps): ReactNode {
  return (
    <div className={styles.association}>
      <span>{verb}</span>
      <span className={styles.line} />
      <span className={styles.cardinality}>
        <span>{from}</span>
        <span>{to}</span>
      </span>
    </div>
  );
}

interface ColumnProps {
  entity: DomainClassProps;
  /** The enum one of the entity's fields uses, drawn under the entity. */
  type: DomainClassProps;
}

function Column({ entity, type }: ColumnProps): ReactNode {
  return (
    <div className={styles.column}>
      <DomainClass {...entity} isEntity />
      <span className={styles.typeLink} />
      <DomainClass {...type} />
    </div>
  );
}

const plain = (...labels: string[]): Attribute[] =>
  labels.map((label) => ({ label }));

export default function DomainDiagram(): ReactNode {
  return (
    // A picture for sighted readers; the label says the same in words.
    <div
      className={styles.diagram}
      role="img"
      aria-label="Data model: a Module contains one or more Sensors, and a Sensor produces Readings. A Module has a name and a Connection Status, a Sensor has a Metric, and a Reading has a value and a Unit."
    >
      <Column
        entity={{
          name: "Module",
          attributes: plain("name", "connectionStatus"),
        }}
        type={{
          name: "ConnectionStatus",
          attributes: [
            { label: "connecting" },
            { label: "connected", isHighlighted: true },
            { label: "stale" },
            { label: "disconnected" },
          ],
        }}
      />
      <Association verb="contains" from="1" to="1..*" />
      <Column
        entity={{ name: "Sensor", attributes: plain("metric") }}
        type={{
          name: "Metric",
          attributes: [
            { label: "temperature", isHighlighted: true },
            { label: "humidity", isHighlighted: true },
            { label: "co2" },
            { label: "…" },
          ],
        }}
      />
      <Association verb="produces" from="1" to="0..*" />
      <Column
        entity={{ name: "Reading", attributes: plain("value", "unit") }}
        type={{
          name: "Unit",
          attributes: [
            { label: "celsius", isHighlighted: true },
            { label: "percent-rh", isHighlighted: true },
            { label: "ppm" },
            { label: "…" },
          ],
        }}
      />
    </div>
  );
}
