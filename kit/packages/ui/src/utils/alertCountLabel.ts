/** What screen readers hear for a Badge of Active Alerts: "1 active Alert", "3 active Alerts". Used by SpaceListItem and SpaceCard, so both say it the same way. */
export function activeAlertsLabel(count: number): string {
  return count === 1 ? "1 active Alert" : `${count} active Alerts`;
}
