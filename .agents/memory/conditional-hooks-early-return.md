---
name: Conditional hooks after early return
description: React "Rendered more hooks than during the previous render" crash caused by placing an early return before hooks defined later in the component.
---

## The problem
A component that does a lookup (e.g. find an item by slug/id from a list) and then does:

```
const item = list.find(...);
if (!item) return <NotFound />;
// ...later...
useEffect(() => { ... }, [...]);
```

runs a different number of hooks depending on whether `item` is found. React requires the same hooks in the same order on every render of the same component instance. Navigating between a "found" route and a "not found" route (or between two routes where the lookup momentarily fails during data reload) reuses the component instance and crashes with "Rendered more hooks than during the previous render."

**Why:** This surfaced as intermittent "some links error out" complaints in a bilingual article-detail page — some article slugs crashed the whole page while others worked, seemingly at random depending on navigation order.

**How to apply:** Whenever a component conditionally returns early based on derived data (not found / loading / error), audit that ALL hooks (useState, useEffect, useMemo, custom hooks) are declared before that early return — never after it. Guard the hook bodies internally (e.g. `if (!item) return;` inside the effect, or ternaries feeding safe fallback values) rather than skipping the hook call itself.
