# EmptyState

> Spec for the team: decisions, Figma mapping and open questions. For how to use the component, see the [user docs page](/kit/apps/docs-site/docs/ui-components/feedback/empty-state.mdx). Props are defined in [`EmptyState.types.ts`](./EmptyState.types.ts).

### Purpose

What a list or screen shows when there is nothing in it yet, instead of a blank area: a large grey icon, **No Spaces yet**, a short message on why, and optionally one action. People should never wonder whether something is still loading or broken.

Examples: a Site with no Spaces, a Space with no Paired Modules, an Alerts screen with no Alerts ("All clear"), a Floor with no Spaces.

Figma: `EmptyState` component in _DeTriz - Smart Home Kit_ (node `611:2`, page `EmptyState` in the Feedback section after AlertBanner). The `EmptyState examples` frame (node `611:11`) shows No Spaces yet, All clear and a title-only case.

### Component in domain model context

Category: **Feedback** ("Does this need my attention?"): it tells people why there is nothing to see. It shows no domain data; the parent writes the words.

Mapping a Site is display only in the MVP (scope decision 5): the developer builds Sites, Floors and Spaces in code. So the action is for moving on (e.g. "View setup guide"), never a form to create a Space.

### Variants

One component, no variant property. Booleans `hasIcon`, `hasMessage`, `hasAction`; text properties `title`, `message`; the `icon` is an exposed instance (any purpose icon, e.g. `NavIcon` spaces, `AlertIcon` default). Feedback, so the target states don't apply. **Not for loading or errors**: loading is each component's own state, errors are `InlineMessage`.

### Visual idea and anatomy

Centred, no background or border: it sits inside the list or card that is empty.

```
EmptyState
├── icon      32px (lg), color-text/secondary   optional
├── title     "No Spaces yet"                   h4, color-text/primary
├── message   "Spaces you add in code …"        body-sm, color-text/secondary   optional
└── action    Button secondary                  optional
```

Padding `space/6` block, `space/4` inline. Gap `space/2` between icon, title and message; `space/4` above the action. Text is centred and wraps.

### Accessibility

- The title is a plain paragraph, not a heading: it sits inside a section that already has one. The parent can wrap it if needed.
- The icon is decorative.
- Not `role="status"`: an empty list isn't news. It's read in order like any other content.

### Open questions

- An illustration instead of an icon for whole-screen empty states? Not in the MVP.
