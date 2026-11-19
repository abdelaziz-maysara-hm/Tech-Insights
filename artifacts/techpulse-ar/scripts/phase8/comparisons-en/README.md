# Independent English comparison editions

One `<slug>.json` per comparison, written as a native English piece (not a translation of the Arabic):

```json
{
  "title": "…",
  "excerpt": "…",
  "verdict": "…",
  "specs": { "spec1": { "label": "…", "device1Value": "…", "device2Value": "…" } }
}
```

`scripts/phase8/apply-content.mjs` applies these to `src/content/comparisons.json` and sets `englishEdition: 'independent'`. That flag is not a human review.
