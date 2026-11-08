import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpaceListItem } from "../../context/SpaceListItem";
import { List } from "../List";
import { FloorSection } from "./FloorSection";

// Two Spaces of the ground floor, as they'd appear on a Site overview.
const groundFloor = (
  <List>
    <SpaceListItem
      name="Kitchen"
      spaceType="kitchen"
      deviceCount={3}
      activeAlertCount={2}
      href="#/spaces/kitchen"
    />
    <SpaceListItem
      name="Living room"
      spaceType="living-room"
      deviceCount={2}
      href="#/spaces/living-room"
    />
  </List>
);

const meta = {
  title: "Layout/FloorSection",
  component: FloorSection,
  args: {
    name: "Ground floor",
    spaceCount: 2,
    headingLevel: 3,
    children: groundFloor,
  },
  argTypes: {
    headingLevel: { control: "inline-radio", options: [2, 3, 4] },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "calc(var(--shk-size-20) * 4.5)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FloorSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per heading level, matching the Figma variants. Level 3 is the default.
export const Level3: Story = {};

export const Level2: Story = { args: { headingLevel: 2 } };

export const Level4: Story = { args: { headingLevel: 4 } };

// A Site overview: one FloorSection per Floor.
export const SiteOverview: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--shk-space-6)" }}>
      <FloorSection name="Ground floor" spaceCount={2}>
        {groundFloor}
      </FloorSection>
      <FloorSection name="First floor" spaceCount={2}>
        <List>
          <SpaceListItem
            name="Bedroom"
            spaceType="bedroom"
            deviceCount={1}
            activeAlertCount={1}
            highestAlertLevel="warning"
            href="#/spaces/bedroom"
          />
          <SpaceListItem
            name="Bathroom"
            spaceType="bathroom"
            deviceCount={1}
            href="#/spaces/bathroom"
          />
        </List>
      </FloorSection>
    </div>
  ),
};

// Stress story: a long Floor name in a narrow container. It ends with "…"; the count stays whole.
export const LongText: Story = {
  args: { name: "Ground floor of the east wing by the garden", spaceCount: 12 },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "calc(var(--shk-size-20) * 3)" }}>
        <Story />
      </div>
    ),
  ],
};

// Stress story: the smallest case, no count.
export const Minimal: Story = {
  args: { name: "Attic", spaceCount: undefined },
};
