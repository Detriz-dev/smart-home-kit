

## Primitive
1. palette
2. typography
3. space
4. size
5. radius
6. border
7. Elevation





## Naming convention
**Primitives**: --{prefix}-{category}-{name}-{scale}

**Semantic**: --{prefix}-{category}-{context}-{variant}-{property}-{state}

**Component**: --{prefix}-{component}-{part}-{property}-{state}


## 1.Pallete
#### Requirements
- Meets WCAG 2.2 AA: 4.5:1 contrast for body text, 3:1 for large text.
- 3:1 for non-text elements: gauge arcs, chart lines, status dots, focus rings, input borders. This one is easy to miss and matters a lot for a dashboard product.
- Dark mode has its own tuned values, not inverted light-mode colors.


Primitives 

- white
- gray
- blue
- green
- amber
- red

Semantic 

--status-neutral: gray
--status-progress: blue
--status-succes: green
--status-warning: amber
--status-danger: red


