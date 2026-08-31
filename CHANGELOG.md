# Changelog

Significant NetSec Atlas milestones are recorded here. Historical Technical Insights generator notes remain below for operational context.

## Phase 5B — Batch 8: CrowdStrike vs SentinelOne, First Recovered-Comparison Content Review

- Reworked `crowdstrike-falcon-vs-sentinelone`, the first content review from the 25 comparisons recovered by the REMOVE-list audit-tool fix (previously misclassified, never actually content-reviewed).
- Handled the biased-source problem directly: both vendors' own comparison pages (`crowdstrike.com/.../compare/...`, `sentinelone.com/vs/crowdstrike/`) are self-promotional and each claims superiority. Used independent sources instead for anything stated as fact.
- Added the July 19, 2024 CrowdStrike Falcon outage (a faulty sensor update causing a global crash of ~8.5 million Windows devices, disrupting airlines, hospitals, and point-of-sale systems) as a genuine, independently-documented trust/risk factor relevant to any kernel-level EDR agent evaluation.
- Added an explicit caution that MITRE ATT&CK Evaluation percentages cited by either vendor are that vendor's own interpretation of MITRE's raw data, not an official MITRE ranking -- stated directly rather than repeating either vendor's headline figure as settled fact.
- Noted SentinelOne's native ransomware rollback (Storyline Active Response) against CrowdStrike's independently-documented managed-response results as a genuine two-sided capability tradeoff.
- 66 comparisons remain in REWORK; 24 of 25 newly-recovered comparisons still need this same review.

## Phase 5B — Major Audit-Tool Fix: 30 of 47 REMOVE Items Were Misclassified (64%)

- **Acted directly on Batch 7's own recommendation** to spot-check the REMOVE list for other missing-vocabulary domains before trusting it for cleanup. Reviewed all 47 items by title and found the problem was far larger than the single IAM gap already fixed: **30 of 47 (64%) were unambiguously professional/security tooling or content by title alone** -- SIEM tools (Splunk, Wazuh, Elastic/ELK), IDS/IPS (Snort, Suricata), pentest tools (Metasploit, Burp Suite, Nikto, OWASP ZAP), EDR/XDR (CrowdStrike, SentinelOne, Microsoft Defender), password managers (1Password, Bitwarden, Keeper), disk encryption (BitLocker, VeraCrypt), CI/CD (Jenkins, GitHub Actions, GitLab), observability (Grafana, Prometheus, Datadog), firewalls, enterprise Windows management, and core security-concept articles (threat modeling/STRIDE, honeypots, TLS handshake, data classification, dual control).
- **Root cause**: confirmed directly (`snort-vs-suricata`) that short comparison excerpts often name a well-known security product without ever using a generic keyword ("security", "network") the regex was scanning for -- naming a product is not the same as using a matching keyword, and no free-text regex alone can bridge that for every short-excerpt comparison.
- **Fix**: expanded the `professional` regex with previously-absent domain vocabulary (IDS/IPS, pentest, threat modeling, encryption, CI/CD, observability, and more), and added a `KNOWN_PROFESSIONAL_PRODUCTS` name list checked directly against product/title/slug fields -- not an exhaustive vendor database, just enough to close this specific gap.
- **Verified with precision, not assumed**: diffed the full audit JSON against the pre-fix version via `git show`. Exactly 30 items reclassified (5 to KEEP, 25 to REWORK). Spot-checked the remaining 17-item REMOVE list -- every one is genuine consumer content (phone/laptop battery guides, iPhone vs. Galaxy, PS5 vs. Xbox) with zero false positives.
- Disposition counts: **114 KEEP / 73 REWORK (67 comparisons) / 17 REMOVE** (was 109/48/47 after Batch 7, 104/47/53 before it). Nothing was ever actually deleted at any point in this process -- this project requires explicit owner review before any REMOVE action -- but this closes a large accuracy gap before any future cleanup pass would have trusted a list that was wrong for nearly two-thirds of its entries.
- See `docs/content-audit/phase5b-audit-tool-fix-remove-list.md` for the full list of reclassified items and verification detail. The 25 newly-recovered comparisons are the next content-review priority -- their classification is now correct, but their actual excerpt/verdict content hasn't been reviewed or expanded yet.

## Phase 5B — Batch 7: Okta vs Entra ID + Critical Audit-Tool Classification Fix

- Expanded `okta-vs-microsoft-entra-id`'s excerpt and verdict with cited detail: both products' Gartner Magic Quadrant "Leader" status (Okta's ninth consecutive year per Okta's own 2025 announcement), Okta's 18,000+ integrations, Entra ID's 700,000+ paid customers, real E3-bundled licensing economics, and a balanced, carefully-worded mention of Okta's October 2023 support-system breach (confirmed by Okta itself and affected customers) as a legitimate identity-vendor risk factor -- explicitly scoped as affecting the support system, not the core platform.
- **Found and fixed a significant classification bug**: the content update caused this article to flip from REWORK to REMOVE in the automated audit. Root cause: `content-audit-phase3.mjs`'s `professional` relevance regex had zero identity/access-management vocabulary -- not even the word "identity". Fixed by adding identity/SSO/MFA/authentication terms.
- **This fix's impact reached far beyond one article**: re-running the audit reclassified 6 items total. Five genuinely valuable, professionally-written security articles (2FA guide, password manager guide, least-privilege guide, NIST password guidelines, authentication-vs-authorization) had been sitting in the REMOVE list purely because of this missing vocabulary, not because of any actual content problem. One comparison (`auth0-vs-firebase-authentication`) moved from REMOVE to REWORK. Nothing was ever deleted -- this project's rules require explicit owner review before any REMOVE action -- but this closes a real gap in the audit tool's accuracy before any future cleanup pass.
- Disposition counts updated: 109 KEEP / 48 REWORK / 47 REMOVE (previously 104/47/53). 38 comparisons remain in REWORK.
- **Recommended follow-up**: spot-check the REMOVE list for other missing-vocabulary domains (e.g. cloud-native/Kubernetes, OT/ICS security) before trusting it for a large cleanup pass -- this exact bug class may recur elsewhere.

## Phase 5B — Batch 6: WireGuard vs OpenVPN, Cited Technical Depth

- Expanded `wireguard-vs-openvpn`'s excerpt and verdict with real, cited technical detail: codebase size comparison (~4,000 vs. ~100,000 lines, per both projects' own docs), the official Linux kernel 5.6 merge date (March 2020, per The Register and Linux Kernel Newbies -- third-party validation, not just the project's own claim), specific cryptographic primitives (Curve25519, ChaCha20-Poly1305, BLAKE2s) and the deliberate no-cipher-negotiation tradeoff, and real-world commercial VPN provider adoption context.
- Unlike Batch 5, this comparison's existing spec table was already directionally accurate -- the fix here was purely expanding the excerpt/verdict with sourced depth, not correcting wrong claims.
- Preserved the stable slug; kept independently written Arabic and English content at conservative technical/translation review states.
- wordCount for this article: 239 → 282; `potentiallyThin`: true → false. 39 comparisons remain in REWORK.

## Phase 5B — Batch 5: Source-Grounded Firewall Comparison + Word-Count Metric Fix

- Reworked `palo-alto-ngfw-vs-forcepoint-ngfw`'s excerpt and verdict with content grounded in cited sources (G2.com verified user ratings: Palo Alto NGFW 4.5/5 across 155 reviews vs. Forcepoint NGFW 4.4/5 across 35 reviews; PeerSpot's 2026 enterprise pricing/licensing comparison) rather than unsourced generic claims.
- Updated the market-share/support spec row to state the actual cited review counts and ratings directly.
- Found and fixed a structural bug in `content-audit-phase3.mjs`'s word-count calculation: it used `body ?? excerpt` for every content type, but comparisons have no `body` field by design, making every comparison on the site structurally register as thin (confirmed: even the one comparison already classified KEEP had wordCount 23). Fixed comparison-type word counts to sum excerpt + verdict + all spec rows instead -- a metric fix that benefits all 75 comparisons' diagnostic accuracy, not just this one.
- Preserved the stable slug and kept independently written Arabic and English content at conservative technical/translation review states.
- Improved the deterministic audit's diagnostic accuracy; disposition counts remain 104 KEEP / 47 REWORK / 53 REMOVE (`proposedDisposition` is driven by strategic fit, not the word-count metric alone). Confirmed all 40 remaining REWORK comparisons are still genuinely thin under the corrected metric, not just artifacts of the old bug.

## Phase 5B — Batch 4: Enterprise AI Image Controls

- Reworked generic image-generation content into an enterprise security and publishing workflow.
- Added data classification, managed access, rights review, synthetic impersonation response, provenance limitations, and auditable approval.
- Preserved the stable slug and synchronized independently written Arabic and English content with the lightweight index.
- Improved the deterministic audit to 104 KEEP / 47 REWORK / 53 REMOVE.

## Phase 5B — Batch 3: LLM Trust Boundaries for Enterprise IT

- Reworked a generic LLM explainer into practical guidance for IT and security teams.
- Added operational coverage of tokens, context windows, RAG validation, data boundaries, evidence, rollback, and measurable verification.
- Preserved the stable article slug and synchronized independently written Arabic and English content with the lightweight index.
- Improved the deterministic audit to 103 KEEP / 48 REWORK / 53 REMOVE.

## Phase 5B — Batch 2: Evidence-Led AI Troubleshooting Prompts

- Reworked generic AI prompting advice into a structured engineering troubleshooting workflow.
- Required observed facts, declared assumptions, read-only checks, state-change labeling, risks, rollback, and measurable verification.
- Preserved the stable slug and synchronized independently written Arabic and English content with the lightweight index.
- Improved the deterministic audit to 102 KEEP / 49 REWORK / 53 REMOVE.

## Phase 5B — Batch 1: Safe AI-Assisted Technical Training

- Reworked the first priority REWORK article from generic study advice into a professional workflow for safe AI-assisted technical training.
- Added data-sanitization, official-source verification, read-only diagnosis, lab testing, rollback, and outcome-verification guidance in independently written Arabic and English.
- Preserved the stable article slug and synchronized the full article and lightweight index.
- Improved the deterministic audit to 101 KEEP / 50 REWORK / 53 REMOVE without claiming human technical or translation approval.

## Phase 5A — Explicit Metadata for KEEP Content

- Applied explicit Phase 3 audit taxonomy metadata to 100 KEEP records: 99 articles and one comparison.
- Synchronized article metadata between the full content source and lightweight listing index.
- Kept technical and translation states conservative (`needs-review` and `unreviewed`) and did not invent difficulty or review dates.
- Added a reproducible migration script and tests that verify exact audit parity and index/source consistency.

## Phase 4E — Routing and Indexing Validation

- Repaired the corrupted Arabic 404 copy and made its home link language- and base-path-aware.
- Marked not-found responses `noindex, nofollow` and removed stale canonical, hreflang, and JSON-LD signals while the not-found view is active.
- Added automated validation for the complete route surface, catch-all ordering, 404 indexing policy, sitemap uniqueness/localization, RSS output, and production-domain consistency.
- Closed Phase 4 with 32 focused routing, redirect, canonical, hreflang, sitemap, and indexing tests passing alongside the full workspace typecheck and production build.

## Phase 4D — Backward-Compatible Legacy Route Migration

- Added a centralized allowlisted migration from maintained unprefixed routes to their Arabic localized equivalents.
- Preserved route slugs, query strings, fragments, and deployment base paths without redirecting unknown, asset, API, or already-localized URLs.
- Used history-replacing browser navigation as the GitHub Pages-compatible migration layer; direct cross-domain HTTP 301 rules remain reserved for the production-domain migration.
- Added focused redirect tests covering discovery, dynamic content, unknown routes, language prefixes, and repository base paths.

## Phase 4C-3 — Localized Sitemap and Alternates

- Replaced transitional unprefixed sitemap locations with localized production canonicals.
- Added reciprocal XHTML Arabic/English/x-default alternates only for the 26 approved discovery routes.
- Kept all 213 unreviewed/invalid editorial records Arabic-only in sitemap discovery without falsely declaring translation equivalence.
- Removed nine noncanonical query-filter URLs and added the 15 existing vendor detail routes.
- Generated 267 unique canonical URLs: 241 Arabic and 26 English; legacy URL count is zero.

## Phase 4C-2 — Central Hreflang Infrastructure and Eligibility

- Added typed, centralized translation status and hreflang URL generation with Arabic, English, and Arabic-canonical `x-default` targets.
- Kept all 213 content records ineligible by default; only an explicit `translationStatus: reviewed` can activate content alternates.
- Approved a conservative set of maintained application/discovery route classes separately from editorial content; query-driven search and videos remain excluded.
- Added SPA-safe alternate-link replacement so eligible/ineligible navigation cannot retain stale or duplicate tags.
- Preserved user language navigation independently from search-engine hreflang eligibility.

## Phase 4C-1 — Translation Pair Audit

- Added a deterministic, build-time-only translation audit for articles, comparisons, static pages, and discovery routes.
- Distinguished field completeness, automated candidacy, and explicit human review instead of treating bilingual fields as proof of a correct technical translation.
- Recorded the owner's finding that current translations are literal and technically unreliable; unreviewed pairs remain excluded from hreflang eligibility.
- Generated machine-readable and readable reports under `docs/i18n/` without adding production-bundle code.

## Phase 4B — Localized Canonicals, Metadata and Structured Data

- Centralized production canonical generation for Arabic and English routes on `netsecatlas.com`.
- Synchronized canonical and Open Graph URLs, localized WebSite/SearchAction URLs, and Article JSON-LD URLs with the active URL prefix.
- Established deterministic `/ar/...` canonicals for legacy unprefixed routes without adding redirects.
- Removed the static SPA-shell canonical and `og:url` so hydration cannot inherit a knowingly wrong language URL.
- Verified the current inventory exposes complete Arabic and English fields for 129 articles, 75 comparisons, and 9 static pages; editorial equivalence remains a Phase 4C review concern.

## Phase 4A — Bilingual Routing Foundation

- Added centralized Arabic/English route-prefix handling without duplicating page components.
- `/ar/...` and `/en/...` now select the URL language ahead of saved browser preference.
- Language switching keeps the equivalent route, query string, and hash; legacy unprefixed routes remain available.
- Added focused routing tests, including deployment base paths and unsupported-language behavior.
- Preserved the Phase 3 sitemap/RSS scope at 235 URLs and 50 items; localized SEO expansion remains Phase 4B/4C work.

## Phase 3 — Content Model and Automated Audit

- Commit: `4524d8f548cc5ed3e20b038ba3aacb76a050ed18`.
- Added backward-compatible explicit metadata and explicit-over-inference discovery rules.
- Audited 213 inventory items and produced machine-readable, readable, and first-100 roadmap reports under `docs/content-audit/`.
- Established a 74% reusable-content assessment without deleting or rewriting legacy content.

## Phase 2 Repair

- Commit: `3c0dae768788135ca0e5cb95c6d5ecbb5b190b7a`.
- Repaired an incomplete Phase 2 merge, restored Phase 1.5 typing behavior, and revalidated 235 sitemap URLs and 50 RSS items.

## Phase 2 — Information Architecture

- Added multidimensional domains, topics, content types, vendor/product registry, discovery helpers, vendor hubs, and new professional routes.
- A partial merge reached `main`; the subsequent repair above is the validated baseline.

## Phase 1.5 — Technical Baseline

- Corrected TypeScript errors and formalized the `Article`/`ArticleListItem` split.
- Established passing typecheck and production-build baselines.

## Phase 1 — Brand Foundation

- Pivoted Technical Insights to NetSec Atlas.
- Centralized site identity and established `netsecatlas.com` in SEO, sitemap, and RSS generation.

---

# Historical Technical Insights Content Generator Audit & Fixes

**التاريخ:** 3 أغسطس 2026
**بواسطة:** Claude (تحليل + إصلاح)، بالتنسيق مع شغل متزامن من جلسة/جلسات تانية على نفس الـ repo

هدف الملف ده: أي حد (إنسان أو AI) يكمل الشغل على المشروع ده يفهم بسرعة إيه اللي كان غلط، إيه اللي اتصلح، وإيه اللي لسه محتاج قرار.

---

## المشكلة الأصلية (قبل أي إصلاح)

نظام التوليد في `artifacts/techpulse-ar/scripts/generator/` كان مصمم يولّد أعداد كبيرة (1000 فيديو، 1000 مقارنة) عن طريق **تكرار مجموعة صغيرة جدًا من المواضيع الحقيقية** (20-30 موضوع بس) بأشكال مختلفة شكليًا:

- **فيديوهات:** 1000 عنصر من 20 موضوع و30 معرّف يوتيوب حقيقي بس → نفس الفيديو الحقيقي كان بيظهر تحت ~33 عنوان مختلف
- **مقارنات:** 1000 عنصر من 30 زوج منتجات بس، بدرجات تقييم **مُلفّقة بالكامل** (مش من بيانات حقيقية) — مثال: البطارية كانت درجتها ثابتة `8 مقابل 8` لكل مقارنة بغض النظر عن المنتجات، ومع ده بيتحدد "فائز"!
- **كل الـ1000 مقارنة كانت بتعرض نفس الصورة بالظبط للمنتجين المتقارَنين** (bug تأكد وجوده حتى في النسخة الحية المصغّرة لاحقًا: 12/12 مقارنة حية كان فيها نفس المشكلة)
- **Collections:** 1000 عنصر من 10 مواضيع بس، وكل عنصر **فاضي تمامًا** (`itemSlugs: []`) — صفحات "أفضل كذا" بدون أي محتوى فعلي جواها

النتيجة: تاريخ الكوميتات بيوثّق دورات متكررة من "توليد كمية كبيرة → اكتشاف المشكلة → حذف/تقليل" (`remove oversized broken comparisons.json`، `replace 100 template articles with 20 unique guides`، `prune live comparisons to 30 quality items`).

---

## الإصلاحات اللي اتعملت

### 1. مشكلة الصور المكررة في المقارنات (الأهم، كانت حية فعليًا)
**السبب الجذري:** `themeImage()` في `images.mjs` بترجع صورة واحدة بس لكل تصنيف (theme)، فأي مقارنة بين منتجين من نفس التصنيف (زي هاتفين، أو لابتوبين) كانت بتاخد نفس الصورة بالظبط.

**الحل:** أضفنا `themeImagePaired(theme, otherTheme)` — بتضمن صورتين مختلفتين فعليًا حتى لو المنتجين من نفس التصنيف، عن طريق mapping احتياطي (`FALLBACK_PARTNER`) لتصنيف تاني قريب. اتطبّقت على `comparisons.mjs` وعلى كل المقارنات الحية.

**الحالة الحالية:** 0 من 15 مقارنة حية فيها صور مكررة (كانت 12 من 12).

### 2. Collections الوهمية (1000 عنصر فاضي)
كانت مش موصولة بالموقع الفعلي (`grep` تأكد إن مفيش أي component بيستوردها) — يعني مش بتضر حاليًا، بس قنبلة موقوتة لو حد وصّلها من غير ما ينتبه للمشكلة.

**الحل:** قلّلناها لـ10 عناصر بس (بعدد المواضيع الحقيقية بالظبط، بدون أي تكرار).

### 3. تنظيف مساحة تخزين ميتة
مجلد `content/generated/` (والنسخة المصغّرة في `src/content/generated/`) كان لسه فيه بقايا التوليد الأصلي (4 ميجا: 1000 فيديو + 1000 مقارنة + تقارير) — اتأكد إنه مش مستخدم في أي مكان، واتحذف بالكامل.

### 4. محتوى IT/أمن الشبكات (شغل متزامن، مش مني)
حصل تحول واضح في اتجاه المحتوى ناحية **الخبرة الحقيقية بتاعت صاحب المشروع** (Forcepoint, FortiGate, Palo Alto, Active Directory PowerShell) — 12 مقال حاليًا، كلهم بعناوين ومحتوى مختلف فعليًا (مش قوالب). ده الاتجاه الصحيح ومفروض يستمر.

---

## الحالة الحالية (بعد كل الإصلاحات)

| المحتوى | العدد | الحالة |
|---|---|---|
| مقالات | 12 | حقيقية ومتنوعة، أغلبها IT/أمن شبكات |
| مقارنات | 15 | صور مصلّحة، بس درجات التقييم لسه جزء منها تقريبي |
| فيديوهات | 12 | معرّفات يوتيوب حقيقية، مفيش تكرار |
| Collections | 10 | مصغّرة، بس فاضية من جوّه (مش مستخدمة في الموقع أصلًا) |

---

## قرارات لسه معلّقة (محتاجة قرار من صاحب المشروع)

1. **درجات التقييم في المقارنات (`device1Score`/`device2Score`):** لسه فيها منطق مُبسّط مش مبني على بحث حقيقي لكل عنصر. لو هتتستخدم المقارنات دي فعليًا للنشر، محتاجة مراجعة بحث حقيقي لكل زوج منتجات (كام ساعة شغل بحث، مش كود).
2. **مستقبل المولّد نفسه:** المولّد بصيغته الأصلية (توليد أعداد ضخمة من مجموعة صغيرة) **غير آمن للاستخدام تاني**. لو هيتستخدم لاحقًا، لازم يتقيّد بقاعدة: العدد المولَّد ميتعديش عدد المصادر الحقيقية المتاحة (بدون تكرار)، وأي بيانات رقمية (درجات، إحصائيات) لازم تيجي من بحث حقيقي مش صيغة حسابية.
3. **اتجاه المحتوى:** الاتجاه ناحية IT/أمن شبكات (بدل الأخبار التقنية العامة) قرار استراتيجي صح في رأيي — موصى بالاستمرار فيه بدل التوسع في مجالات فيها منافسة أقوى بكتير.

---

## للمرجعية: أوامر تحقق سريعة

---

## تحديث: إعادة تصميم كاملة لـ comparisons/videos/collections (نفس اليوم، بعد المراجعة الأولى)

بعد ما راجعنا `articles.mjs` ولقيناه بقى صح (محتوى حقيقي مكتوب يدويًا لكل موضوع + رفض التوليد لو المحتوى مش موجود)، طبّقنا نفس المعيار بالضبط على باقي المولّدات:

### `comparisons.mjs` — أعيد كتابته بالكامل
- **21 مقارنة**، كل واحدة بمواصفات حقيقية **مناسبة لنوع المنتج فعليًا** (مقارنة جدران حماية بقت بمواصفات زي "عمق فحص التطبيقات" و"سهولة الإدارة"، مش "الكاميرا" و"البطارية" اللي كانت مفروضة على الكل بالغلط من قبل)
- الدرجات الرقمية بقت **حكم معلوماتي حقيقي** (مش صيغة حسابية `7 + (abs % 3)`)، وبتوافق فعليًا مع النص المكتوب جنبها
- **التعادل الحقيقي بقى مسموح** (`overallWinner: 0`) بدل إجبار كل مقارنة تعلن فائز وهمي حتى لو كانت متقاربة فعلًا — وده احتاج تعديل بسيط في `validation.mjs` كان بيرفض القيمة 0
- اتأكد إن الواجهة الأمامية (`ComparisonDetail.tsx`) بتقرأ المفاتيح ديناميكيًا (`Object.keys(comp.specs)`)، فمفيش أي تعديل مطلوب في الواجهة رغم تغيير بنية الـ specs بالكامل

### `videos.mjs` — أعيد كتابته، بس فيه فجوة حقيقية لازم تتقفل يدويًا
- **9 فيديوهات حقيقية بس**، كل واحد بعنوان ووصف يطابق فعليًا محتوى الفيديو (مش عنوان مُخترع فوق فيديو حقيقي غير مرتبط)
- **⚠️ فجوة مهمة:** مفيش ولا فيديو واحد مؤكد عن Firewall/VPN/Active Directory/EDR — يعني بالظبط الاتجاه الاستراتيجي بتاع الموقع (IT/أمن شبكات) مالوش تغطية فيديو حاليًا. السبب: التأكد من صحة أي معرّف يوتيوب جديد يحتاج مشاهدة فعلية للفيديو، وده مش ممكن من بيئة العمل دي. **محتاج حد يدخل يوتيوب فعليًا، يختار فيديوهات حقيقية مناسبة، ويضيفها لـ`VIDEO_CONTENT`.**

### `collections.mjs` — أعيد كتابته بالكامل
- **7 قوائم "أفضل كذا" حقيقية**، كل واحدة `itemSlugs` فيها بترجع لمقالات/مقارنات حقيقية موجودة فعلًا في الموقع (اتأكد يدويًا من كل slug مقابل `articles.json` و`comparisons.json`)
- مواضيع مالهاش محتوى حقيقي كفاية دلوقتي (زي "أفضل توزيعات لينكس" أو "أفضل IDEs") **اتشالت من القائمة بدل ما تتسيب فاضية**

### التحقق
كل الملفات الأربعة عدّت `validateAll()` و`uniquenessReport()` من `validation.mjs` نفسها بدون أي خطأ، وده أول مرة يحصل ده من غير ما نحتاج نستثني/نتجاهل حاجة.

---

## تحديث حرج: قفل ثغرة "طلب عدد أكبر من المحتوى الحقيقي" (نفس اليوم)

سؤال من صاحب المشروع كشف ثغرة حقيقية: **رغم كل الإصلاحات فوق، طلب `generateArticles({count: 1000})` كان لسه بيرجّع 1000 عنصر فعليًا** — بيلفّ على نفس المحتوى الحقيقي (12 مقال) ويضيف `(2)`, `(3)`... لحد ما يوصل للعدد المطلوب. يعني **نفس مشكلة التكرار الأصلية بالظبط**، بس بمحتوى حقيقي هالمرة بدل الوهمي — لسه مشكلة حقيقية لأن "دليل 2FA (47)" مفيش له أي معنى ولا قيمة.

**السبب:** قاعدة "رفض التوليد لو المحتوى الحقيقي خلص" كانت مطبّقة صح على `collections.mjs` بس (كان فيها `Math.min(count, pool.length)` من الأول)، ونسيت تتطبّق بنفس الصرامة على الثلاثة التانيين.

**الإصلاح:** أضفنا `Math.min(count, pool.length)` (مع تحذير واضح في الـ console) لكل من `articles.mjs` و`comparisons.mjs` و`videos.mjs`. دلوقتي:

```bash
generateArticles({count: 1000})     # → 12 (مش 1000)
generateComparisons({count: 1000})  # → 21 (مش 1000)
generateVideos({count: 1000})       # → 9 (مش 1000)
generateCollections({count: 1000})  # → 7 (كانت مظبوطة من الأول)
```

**القاعدة النهائية للمولّد كله دلوقتي:** مفيش أي مولّد في المشروع ده قادر ينتج عدد عناصر أكبر من عدد المحتوى الحقيقي الموجود فعليًا في مصفوفة `*_CONTENT` بتاعته — بغض النظر عن العدد المطلوب. لو عايز عدد أكبر، الحل الوحيد الصحيح هو إضافة محتوى حقيقي جديد لمصفوفة `*_CONTENT`، مش رفع رقم `count`.


---

## دفعة محتوى حقيقي جديدة: 8 مقالات + 6 مقارنات (نفس اليوم)

بعد ما اتأكد إن المولّد آمن (بيرفض التوليد الوهمي ومش بيتخطى حجم المحتوى الحقيقي)، أضفنا محتوى حقيقي جديد فعليًا كإثبات على إن العدد بيزيد بالطريقة الصحيحة (كتابة محتوى، مش رفع رقم count):

**8 مقالات جديدة** (كلها IT/أمن شبكات، بمعرفة تقنية حقيقية):
Kaspersky Security Center tagging، RDP/RDS licensing، Windows Server Evaluation→Standard، DNS Reverse Lookup Zones، Group Policy أساسيات، قاعدة النسخ الاحتياطي 3-2-1، Zero Trust عمليًا، بوابات أمان البريد الإلكتروني.

**6 مقارنات جديدة:**
Kaspersky vs Bitdefender (endpoint)، Windows RDS vs Citrix، Group Policy vs Intune، Veeam vs Acronis (نسخ احتياطي)، Splunk vs Wazuh (SIEM)، Forcepoint vs Proofpoint (أمان بريد).

**العدد الحالي:** 20 مقال (كان 12)، 27 مقارنة (كانت 21)، 9 فيديو، 7 مجموعات.

**تحقق:** كل المحتوى الجديد عدّى `validateAll()` و`uniquenessReport()` بدون أخطاء، واتأكد إن حد الأمان (`Math.min(count, pool.length)`) لسه شغال صح مع الحجم الجديد — طلب 1000 مقال لسه بيرجّع 20 بالظبط، مش أكتر.

---

## مراجعة شاملة للتصنيفات (نفس اليوم، بناءً على طلب مباشر)

راجعت **كل عنصر في الموقع** (20 مقال + 27 مقارنة + 9 فيديو + collections) مقابل التصنيفات الرسمية المعتمدة في `src/data/subcategories.ts` (اتأكد إنها متطابقة تمامًا مع `categories.mjs` بدون أي انحراف بينهم).

**النتيجة التقنية:** صفر أخطاء تصنيف (كل العناصر تصنيفها "صالح" رسميًا).

**لكن الفحص اليدوي لقى 3 حالات كانت "صالحة تقنيًا بس غلط منطقيًا"** (الـ validator بيتأكد إن التصنيف موجود في القائمة المسموحة، مش إنه التصنيف الأنسب فعليًا):

| العنصر | كان | بقى |
|---|---|---|
| مقال "RDP/RDS Licensing" | `identity` | `vpn-remote` (ده وصول عن بُعد، مش هوية) |
| مقارنة "Windows RDS vs Citrix" | `network-security` | `software-services` (أدوات تسليم تطبيقات، مش أمن شبكات) |
| مقارنة "Veeam vs Acronis" | `network-security` | `software-services` (أدوات نسخ احتياطي، مش أمن شبكات) |

**كمان حسّنت التنظيم:** ربطت المقالات/المقارنات الجديدة بالـcollections المناسبة، وأضفت **collection جديدين** كان عندهم محتوى حقيقي كفاية دلوقتي ومكانوش موجودين:
- "أفضل ممارسات النسخ الاحتياطي" (Backup & DR)
- "أفضل أدوات مراقبة الأمن SIEM"

**العدد النهائي:** collections من 7 → **9**، كل شيء متحقق منه صفر مرات (schema + تصنيف + عدم تكرار + كل itemSlugs بترجع لمحتوى حقيقي موجود فعلًا).

---

## دفعة فيديوهات 1 من 10: دعم قوائم التشغيل (Playlists) + 7 عناصر حقيقية جديدة

صاحب المشروع بعت أول دفعة من فيديوهات حقيقية (بيجمعها 10 في كل رسالة لحد ما توصل 100). من فحص الروابط:

- **3 روابط فيديو مباشرة** (Jeremy's IT Lab Day 0 + OSI Model، TCM Security Ethical Hacking)
- **4 روابط قوائم تشغيل كاملة** (CCNA من Jeremy's IT Lab وNetworkChuck، Security+ وNetwork+ من Professor Messer)
- **3 روابط بحث** (مش فيديو محدد) — اتشالوا، محتاجين رابط مباشر فعلي في الدفعة الجاية

### مشكلة تقنية حقيقية اكتشفناها: الموقع مكانش بيدعم قوائم التشغيل خالص

الـ schema والواجهة الأمامية كانوا مبنيين على افتراض إن كل فيديو له معرّف واحد (11 حرف). أي رابط قائمة تشغيل (زي `?list=PLxxx...`) كان هيتحذف بصمت من غير أي خطأ ظاهر — الكود كان بيرجع `null` ويفلترها.

**الإصلاح (تغيير حقيقي في الكود، مش بس بيانات):**
- `mediaUrls.ts`: أضفنا `extractYouTubePlaylistId()` و`youtubePlaylistEmbedUrl()`
- `cmsTypes.ts`: أضفنا حقل `youtubePlaylistId` اختياري لنوع `CmsVideo`
- `Videos.tsx`: الصفحة دلوقتي بتفرّق بين فيديو مفرد وقائمة تشغيل — تضمين مختلف (`videoseries?list=`)، وشارة "قائمة تشغيل كاملة" على الصورة المصغّرة، وصورة غلاف بديلة (مش thumbnail يوتيوب لأن القوائم مالهاش thumbnail واحد)
- `validation.mjs`: عدّلنا الشرط ليقبل إما `youtubeId` أو `youtubePlaylistId` (مش يشترط الأول بس)

**العدد:** 9 → **16** فيديو (7 حقيقيين جداد: 3 فيديو + 4 قائمة تشغيل).

**⚠️ ملاحظة أمانة:** مقدرش أشغّل `pnpm install`/`typecheck` كامل من بيئتي (pnpm مش متاح، وnpm بيرفض بروتوكول `catalog:` بتاع pnpm workspaces). اتأكدت يدويًا من توازن الأقواس وتطابق كل import/export، بس التأكيد الكامل (`npm run typecheck` أو `npm run build`) لازم يتعمل من عندك قبل ما تثق في التغيير ده 100%.

**محتاج من صاحب المشروع:** روابط مباشرة (مش بحث) للعناصر التالتة الأخيرة في الدفعة (Nmap، Wireshark، Active Directory Fundamentals) في الدفعة الجاية.

---

## اكتشاف مهم: لوحة التحكم (Admin Dashboard) مسار منفصل تمامًا عن المولّد

صاحب المشروع سأل هل ينفع يستخدم لوحة التحكم بدل ما يطلب مني أدفع الكود مباشرة، عشان يوفر وقت. فحصت اللوحة بالكامل ولقيت حقيقتين مهمتين:

### 1. اللوحة موجودة وشغالة، وفكرتها مطابقة لطلبه بالظبط
`src/pages/Admin.tsx` فيه textarea بتقبل JSON خام (مش نموذج بحقول منفصلة)، بيتفحص عن طريق `server/admin/validate.ts`، وبيتكتب مباشرة على `src/content/*.json` عبر GitHub API. يعني فعلاً ممكن أجهز JSON جاهز، والمستخدم يلزقه في اللوحة بدل ما يستنى دفع كود مني.

### 2. لكن لقيت مسارين منفصلين تمامًا بيكتبوا على نفس الملفات، وده خطر حقيقي
- **مسار المولّد** (اللي بنستخدمه طول اليوم): `scripts/generator/*.mjs` + `*_CONTENT` arrays + `validation.mjs` — فيه كل قواعد الأمان اللي بنينها (رفض التكرار، فحص التصنيف، دعم قوائم التشغيل).
- **مسار اللوحة**: `server/admin/validate.ts` — **نسخة منفصلة تمامًا** من نفس منطق الفحص، **كانت ناقصة حمايتين حقيقيتين**:
  1. **مفيش فحص للـ subcategory خالص** — أي نص كان بيتقبل كـ subcategoryId حتى لو مش موجود في القائمة المسموحة (عكس المولّد اللي بيرفضه بـ `assertSubcategory`)
  2. **مفيش دعم لقوائم التشغيل خالص** — أي رابط playlist كان هيترفض برسالة خطأ، حتى بعد ما ضفنا الدعم في المولّد النهاردة

**الإصلاح:** أضفنا نفس الحمايتين لـ `server/admin/validate.ts`:
- نسخة من `ALLOWED_SUBCATEGORIES` بترفض أي تصنيف فرعي غير مسموح لنفس الفئة
- `extractYouTubePlaylistId()` ودعم `youtubePlaylistId` في فحص الفيديو، بنفس منطق المولّد

**تحقق حقيقي هالمرة (مش مراجعة يدوية بس):** قدرت أشغّل `npx tsc --noEmit` فعليًا على الملفات المعدَّلة بشكل منعزل (بدون pnpm الكامل) وعدّت من غير أخطاء تركيبية.

### ⚠️ تحذير مهم لازم يُراعى مستقبلًا
**لسه فيه خطر تعارض حقيقي بين المسارين:** لو حد ضاف محتوى عن طريق اللوحة، وبعدين أنا شغّلت سكريبت المولّد وكتبت فوق `src/content/*.json` بالكامل (زي ما كنت بعمل النهاردة)، **هينمسح أي حاجة اتضافت عن طريق اللوحة** لأنها مش موجودة في `TOPIC_CONTENT`/`VIDEO_CONTENT` بتاعتي. **الحل الآمن مستقبلًا:** أي تحديث للملفات لازم يستخدم منطق الدمج الموجود في `merge.mjs` (`loadExisting` + `mergeLists`) بدل الكتابة الكاملة المباشرة، أو نتفق على قاعدة واضحة مين بيضيف فين.

---

## اكتشاف أخطر: النسخة الحية فعليًا من اللوحة (على Vercel) مش نفس اللي صلّحتها

بعد الإصلاح السابق مباشرة، لقيت إن `server/admin/validate.ts` **مش الكود اللي شغال فعليًا على الموقع**. Vercel بيشغّل `api/cms/[...path].ts` بدل منه — وهو **نسخة منفصلة مكررة يدويًا بالكامل** من كل منطق اللوحة (بسبب قيود في bundler الخاص بـVercel مع استيراد ملفات فرعية، حسب تعليق في الكود نفسه). يعني عندنا **نفس المنطق الحرج مكرر في مكانين مختلفين قابلين للانحراف عن بعض بصمت** — وده بالظبط اللي حصل: نفس الثغرتين (فحص subcategory، ودعم القوائم) موجودين في النسخة الحية بعد ما صلّحتهم في النسخة التانية.

**التوصية:** إزالة لوحة التحكم بالكامل والاعتماد على الموقع static 100% — القرار النهائي لصاحب المشروع.

## استخدام الأداة الآمنة الموجودة أصلًا للدمج (`index.mjs --append`)

لاحظ صاحب المشروع (بحق) إن المولّد المفروض "يزود على الموجود مش يمسحه". اكتشفت إن `scripts/generator/index.mjs` **فيه أصلًا وضع دمج آمن جاهز** (`--append` بيحمّل المحتوى الموجود عبر `loadExisting()`/`mergeLists()` من `merge.mjs` قبل ما يضيف أي حاجة جديدة)، وكنت بستخدم بدله سكريبتات يدوية بسيطة (`generateArticles()` + الكتابة المباشرة) طول اليوم — دي كانت آمنة بس لأن المصفوفات كانت المصدر الوحيد للمحتوى، مش لأنها الطريقة الصح.

**من دلوقتي فصاعدًا:** أي إضافة محتوى هتستخدم `node scripts/generator/index.mjs --type=X --append --apply` بدل الكتابة المباشرة، عشان الدمج يبقى مضمون دايمًا بغض النظر عن أي حاجة تانية ضافت محتوى.

أضفنا `artifacts/techpulse-ar/content/generated/` لـ`.gitignore` (مجلد staging مؤقت بيتولّد من الأداة دي، مش المفروض يتحفظ في git).

---

## تنفيذ التوصية: إزالة لوحة التحكم بالكامل — الموقع static 100% الآن

بعد التوضيح الكامل لصاحب المشروع (ثغرتين أمان + نسخة الكود المكررة اللي بتنحرف بصمت + خطر التعارض مع المولّد)، تم الاتفاق على إزالة اللوحة بالكامل.

**اتشال:**
- `src/pages/Admin.tsx`, `src/pages/adminTabs.tsx`, `src/lib/adminApi.ts`, `src/components/admin/`
- `server/admin/` بالكامل (cookies, github, router, store, token, validate)
- `api/cms/` بالكامل (الدالة الفعلية اللي كانت شغالة على Vercel)

**اتصلّح تبعًا لكده (عشان الموقع يفضل شغال بدون أي كسر):**
- `src/App.tsx`: حذف route `/admin` واستيراد `Admin`
- `src/components/layout/Footer.tsx`: حذف رابط اللوحة من الفوتر
- `src/hooks/useAllArticles.ts`: كان بيحاول يجيب المقالات من `/api/cms/public/articles` أولًا (مع fallback للملف الثابت) — بقى يعتمد على الملف الثابت مباشرة بس، مطابق تمامًا لقرار "static بالكامل"
- `server/render-server.ts`: حذف كل منطق التعامل مع `/cms/api/*` (لسيرفرات زي Render اللي مش Vercel)
- `vercel.json`: حذف قاعدة إعادة التوجيه لـ`/api/cms/*`
- `package.json`: حذف تبعية `@vercel/node` (كانت مستخدمة بس لدالة اللوحة)

**تحقق:** فحص شامل (`grep`) للتأكد من عدم وجود أي إشارة متبقية لـ`api/cms` أو `/admin` أو `adminApi` في أي مكان بالكود — صفر نتائج. فحص TypeScript معزول على الملفات المعدَّلة الرئيسية أكّد عدم وجود أخطاء تركيبية حقيقية (الأخطاء الوحيدة الظاهرة كانت بسبب عدم توفر إعداد الـpath-aliases في الاختبار المعزول، مش أخطاء منطقية).

**الموقع دلوقتي مصدر حقيقة واحد بس:** `scripts/generator/*.mjs` (بوضع `--append --apply`) → `src/content/*.json` → مبني ومنشور. مفيش أي مسار كتابة تاني، فمفيش أي احتمال تعارض أو انحراف بين نسختين من نفس المنطق تاني.

---

## استباق مشكلة نمو الحجم: فصل بيانات القوائم عن نص المقال الكامل

صاحب المشروع سأل سؤال استباقي مهم: هل ملفات المحتوى (خصوصًا المقالات) هتكبر مع نمو المحتوى وتسبب مشكلة؟

**الوضع الحالي:** `articles.json` = 40 كيلوبايت لـ20 مقال (صغير جدًا، مفيش مشكلة الآن). **لكن المشكلة الحقيقية:** الملف ده بيتحمّل بالكامل (بما فيه نص كل مقال كامل) في **كل صفحة** بتستخدم `useAllArticles()` — بما فيها صفحات القوائم اللي بتعرض عنوان وملخص بس، مش النص الكامل. مع مقالات أطول وأكتر (الهدف الفعلي)، ده هيبقى ميجا بايتات بتتحمّل لكل زائر حتى لو مفتحش أي مقال، وهيبطّئ الموقع كله.

**الحل (مطبَّق الآن، قبل ما يبقى مشكلة فعلية):**
- المولّد دلوقتي بيكتب ملفين لكل تشغيلة `--apply`: `articles.json` (كامل، فيه النص) و**`articles-index.json`** (خفيف، بدون حقل `body`) — `writeJsonIndex()` جديدة في `utils.mjs`
- `useAllArticles()` بقى بيستخدم النسخة الخفيفة بس (مستخدمة في كل صفحات القوائم والصفحة الرئيسية)
- Hook جديد `useArticleBody(slug)` بيعمل `import()` ديناميكي لملف المقالات الكامل **بس لما حد يفتح مقال محدد فعليًا** — Vite بيقسّمه لملف JS منفصل تلقائيًا، فمحتوى كل المقالات الكاملة مش جزء من الحزمة الأساسية للموقع خالص

**النتيجة:** حجم الحزمة الأساسية للموقع دلوقتي بيكبر بس مع عدد المقالات وملخصاتها (صغير جدًا)، مش مع طول كل مقال. لو وصلنا لـ500 مقال بمتوسط 2000 كلمة، النص الكامل هيتحمّل بس لمين فاتح المقال ده تحديدًا، مش لكل زائر.

**التحقق:** فحصت كل الكود ولقيت صفر أماكن تانية بتستخدم حقل `body` غير صفحة تفاصيل المقال نفسها، فالتغيير آمن 100% لباقي الصفحات. اختبرت التوليد الفعلي (20 مقال → 20 كيلوبايت index مقابل 38 كيلوبايت كامل).

---

## خطة التوسع لحجم كبير جدًا (100 ألف مقال+) — للمرجعية المستقبلية

صاحب المشروع وضّح هدفه: موقع أشمل من المنافسين، بمحتوى متخصص قد يصل لـ100,000 مقال. الخطة موثّقة هنا عشان أي جلسة شغل جاية تكمل منها بدل ما تعيد التفكير من الصفر.

### نقاط التحوّل بالأرقام (مش قرارات فورية، بس خريطة طريق)

| الحجم | الإجراء |
|---|---|
| **لحد ~500 مقال إجمالي** (الوضع الحالي) | لا تغيير — `articles.json` + `articles-index.json` كافيين تمامًا |
| **~500 – 5,000 مقال** | تقسيم لملف منفصل **لكل فئة رئيسية** (`articles-cybersecurity.json`, `articles-windows.json`...)، مع pagination جوه كل فئة (مش تحميل الفئة كاملة مرة واحدة) |
| **آلاف لعشرات آلاف** | تقسيم أعمق (لكل subcategory، أو نطاق زمني)، + إعادة نظر في استضافة static بالكامل |
| **عشرات آلاف فأكثر (الهدف النهائي: 100,000)** | **خدمة بحث متخصصة إلزامية** (Algolia / Meilisearch / Typesense) — البحث النصي السريع على هذا الحجم مستحيل من غير index بحث حقيقي منفصل عن تخزين المحتوى، ومحاولة عمله بملفات JSON فقط هترجّع نفس مشكلة "تحميل حاجة ضخمة لكل زائر" اللي حلّيناها بس على المقالات |

### الرسالة الأهم
**العنق الحقيقي للزجاجة عند الحجم ده هو إنتاج محتوى حقيقي متخصص وغير مكرر، مش الكود أو التخزين.** المعمارية قابلة للتوسع خطوة بخطوة زي الجدول فوق، لكن الوصول لـ100,000 مقال حقيقي (مش مولَّد آليًا بنفس أخطاء بداية المشروع) هدف طويل المدى يحتاج إنتاج محتوى مستمر، مش قرار تقني واحد.

**لما يوصل عدد المقالات الفعلي لـ~200-300 مقال حقيقي، دي نقطة تنفيذ فعلي أول خطوة (التقسيم حسب الفئة) بعينة حقيقية بدل التخمين المبكر دلوقتي.**

---

## دفعة محتوى جديدة: 8 مقالات + 6 مقارنات (باستخدام أداة الدمج الآمنة `--append --apply`)

أول استخدام فعلي للأداة الصح (`scripts/generator/index.mjs --append --apply`) بدل السكريبتات اليدوية — نتائج نظيفة: `+8 new, ~0 merged` للمقالات و`+6 new, ~0 merged` للمقارنات (يعني كل المحتوى القديم اتحافظ عليه صح، مفيش أي دمج غير متوقع).

**8 مقالات جديدة** (IT/أمن شبكات): VLAN أساسيات، مراقبة SNMP، مصادقة 802.1X، الاحتفاظ بالسجلات، استراتيجية تحديثات Windows، DHCP Failover، خادم Syslog مركزي، تقسيم الشبكة للامتثال.

**6 مقارنات جديدة:** VMware vSphere vs Proxmox VE، pfSense vs OPNsense، Zabbix vs Nagios، UniFi vs Meraki، Ansible vs PowerShell DSC، Cloudflare vs Akamai.

**العدد الحالي:** 28 مقال، 33 مقارنة، 16 فيديو، 9 مجموعات.

**مراجعة تصنيف يدوية (زي المعتاد):** لقيت مقارنتين (VMware/Proxmox وAnsible/DSC) اتحطوا تلقائيًا تحت "أمن الشبكات" بس هما فعليًا أدوات بنية تحتية/برمجيات، مش أدوات أمان بالمعنى الحرفي — صلّحتهم لـ"برمجيات وخدمات" بنفس المنطق اللي اتطبّق قبل كده على RDS/Citrix وVeeam/Acronis.

**ملاحظة تقنية مهمة:** التصحيح ده اتعمل بتعديل مباشر على الملف الحي، **مش عن طريق إعادة تشغيل أداة الدمج** — لأن منطق الدمج (`mergeRecord`) بيفضّل القيمة الموجودة أصلًا لو كانت متاحة، يعني إعادة التوليد كانت هتتجاهل التصحيح وتسيب القيمة القديمة الغلط. الدرس: **أداة الدمج مصممة لإضافة محتوى جديد، مش لتصحيح محتوى موجود** — أي تصحيح على بيانات حية لازم يتعمل بتعديل مباشر ومقصود، مش عبر إعادة التوليد.

**التحقق:** صفر أخطاء تحقق، صفر تكرار، صفر روابط مكسورة في الـcollections، صفر صور مكررة في كل الـ6 مقارنات الجديدة.

---

## دفعة محتوى إضافية: 7 مقالات + 6 مقارنات (تنفيذًا لـ"كمل")

**7 مقالات جديدة** (خطة كانت 8، لقيت نفسي كتبت 7 فعليًا — والنظام أمسك الفرق ده تلقائيًا برسالة تحذير واضحة `capping at 7 instead of 8` بدل ما يفترض العدد المطلوب، بالظبط الحماية اللي بنينها): Hyper-V Checkpoints، هجمات MFA Fatigue، قراءة Event Viewer، Wi-Fi 6 مقابل 5، مراقبة الدارك ويب، SSD مقابل HDD للسيرفرات، مبدأ أقل الصلاحيات.

**6 مقارنات جديدة:** Duo Security vs Microsoft Authenticator، Terraform vs Ansible، Datto vs Veeam، Qualys vs Nessus، Google Workspace vs Microsoft 365، Tailscale vs VPN تقليدي.

**تحديث الـcollections:** ربطت المحتوى الجديد المناسب بـ"أفضل أدوات IAM" و"أفضل أدوات SIEM ومراقبة الأمن".

**العدد الحالي:** 35 مقال، 39 مقارنة، 16 فيديو، 9 مجموعات — صفر أخطاء تحقق، صفر تكرار، صفر روابط مكسورة، صفر صور مكررة.

---

## إصلاح عاجل: كسرت النشر (Vercel Build) بسبب حذف تبعية بدون تحديث lockfile

**المشكلة (مسؤوليتي بالكامل):** لما شلت لوحة التحكم، شلت `@vercel/node` من `package.json` — بس معنديش `pnpm` في بيئة العمل عشان أحدّث `pnpm-lock.yaml` بنفس الوقت. النتيجة: **كل نشر بعد كوميت الإزالة كان بيفشل فورًا** بخطأ `ERR_PNPM_OUTDATED_LOCKFILE` لأن Vercel بيستخدم `--frozen-lockfile` (بيرفض أي عدم تطابق بين الملفين).

**اكتشفتها من صاحب المشروع بعد ما بعتلي لوج الخطأ الفعلي من Vercel.**

**الإصلاح:** رجّعت `@vercel/node@^3.2.0` لـ`package.json` بالظبط زي ما `pnpm-lock.yaml` متوقّع (نفس الـspecifier). التبعية دلوقتي مش مستخدمة فعليًا (الكود اللي كانت بتخدمه اتشال)، لكن إبقاؤها موجودة كتبعية غير مستخدمة أهون بكتير من كسر النشر بالكامل.

**الدرس للمستقبل:** أي تعديل على `package.json` في مشروع بيستخدم `pnpm` **لازم يتحقق منه بتشغيل `pnpm install` فعليًا** قبل الدفع، مش بس بمراجعة الكود يدويًا — ومفيش `pnpm` في بيئة العمل دي، فأي تعديل تبعيات مستقبلي **لازم يتفحص من صاحب المشروع محليًا قبل الدفع**، أو يُتجنّب تمامًا لو ممكن.

---

## دفعة محتوى: 7 مقالات + 6 مقارنات (بعد تصليح مشكلة النشر)

**7 مقالات جديدة:** أول ساعة بعد اكتشاف Ransomware، تقليل فاتورة السحابة، أمان الطابعات، عزل المتصفح، Shadow IT، التحكم في USB، مراقبة انتهاء الشهادات.

**6 مقارنات جديدة:** Bitwarden Business vs Keeper، Rapid7 InsightVM vs Tenable.io، Postman vs Insomnia، GitHub Actions vs Jenkins، Grafana vs Kibana، AnyDesk vs TeamViewer.

**العدد الحالي:** 42 مقال، 45 مقارنة، 16 فيديو، 9 مجموعات — صفر أخطاء، صفر تكرار، صفر صور مكررة.

---

## توضيح ورّد على ملاحظة الصور: مش لوجوهات، مجرد "صورة ذات صلة"

صاحب المشروع وضّح إن قصده مش شعارات حقيقية إلزامية — بس صورة "ذات صلة" بالمحتوى، الشعار كان مجرد مثال للتبسيط.

**راجعت الموضوع من الزاوية الصح:** فحصت الحالات اللي كان الطرفين فيها بنفس الـtheme بالظبط (يعني احتمال يحصل تعارض ويرجع صورة عامة غير مرتبطة):
- **PS5 vs Xbox** (console+console): طلعت فعلًا صورة **غير مرتبطة خالص** (لوحة دوائر إلكترونية عامة) — **صلّحتها** بإضافة ربط منطقي (`console → gpu`، كرت الشاشة له علاقة حقيقية بمكونات أجهزة الألعاب).
- **الساعات** (Apple Watch vs Galaxy Watch): طلعت **مظبوطة فعلًا من غير تدخل** — النظام بيلاقي "Apple" و"Samsung" في الاسم نفسه ويرجّع شعاراتهم الحقيقية تلقائيًا.
- **ChatGPT vs Claude**: طلعت صورة تقنية عامة مقبولة (مرتبطة بالبرمجة/التقنية)، مش مثالية 100% بس مش غلط بالكامل.

**الخلاصة:** من كل الحالات اللي فيها خطر تعارض، حالة واحدة بس كانت فعلًا محتاجة تصليح، وده يعطي طمأنينة إن النظام شغال صح في معظم الحالات — مش محتاج مراجعة شاملة لكل الـ45 مقارنة.

---

## دفعة محتوى: 7 مقالات + 6 مقارنات (اتفقنا على "كمل" في كل جلسة)

**7 مقالات جديدة:** تمارين محاكاة الحوادث (Tabletop)، إرشادات NIST لكلمات المرور، NAC أساسيات، النسخ الاحتياطي السحابي مقابل المحلي، فحص الثغرات مقابل اختبار الاختراق، أمان DNS، تشفير الأقراص بـBitLocker.

**6 مقارنات جديدة:** BitLocker vs VeraCrypt، Burp Suite vs OWASP ZAP، Snort vs Suricata، GitLab vs GitHub، Docker vs Podman، Cisco ISE vs Aruba ClearPass.

**تحديث الـcollections:** ربطت المحتوى الجديد بـ"أفضل أدوات IAM" و"أفضل أدوات SIEM والمراقبة".

**فحص خاص (بعد درس PS5/Xbox):** راجعت كل المقارنات الجديدة للتأكد إن مفيش طرفين بنفس الـtheme بالظبط (السبب اللي أدى لمشكلة الصورة غير المرتبطة قبل كده) — كل الـ6 مقارنات دي كل طرف فيها بـtheme مختلف عن التاني، فمفيش خطر تعارض من الأساس.

**العدد الحالي:** 49 مقال، 51 مقارنة، 16 فيديو، 9 مجموعات — صفر أخطاء، صفر تكرار، صفر روابط مكسورة، صفر صور مكررة.

---

## دفعة محتوى: 7 مقالات + 6 مقارنات

**7 مقالات جديدة:** قواعد Windows Firewall المتقدمة، برامج محاكاة التصيد، ثغرات XSS، Server Core مقابل Desktop Experience، إدارة مفاتيح API بأمان، الأمان الفيزيائي لغرفة السيرفرات، هجمات سلسلة التوريد.

**6 مقارنات جديدة:** Sysmon vs Windows Default Auditing، Have I Been Pwned vs خدمات مراقبة مؤسسية، Nextcloud vs ownCloud، Prometheus vs Datadog، Metasploit vs الاستغلال اليدوي، Microsoft Purview vs أدوات DLP تقليدية.

**العدد الحالي:** 56 مقال، 57 مقارنة، 16 فيديو، 9 مجموعات — صفر أخطاء، صفر تكرار، صفر صور مكررة.

---

## دفعة محتوى: 7 مقالات + 6 مقارنات

**7 مقالات جديدة:** فحص أمان صور الحاويات، عزل شبكة الضيوف، SPF/DKIM/DMARC، التأمين السيبراني (إيه اللي بيغطيه فعليًا)، إدارة التغيير في IT، تصنيف البيانات، مقارنة طرق المصادقة الثنائية (SMS/تطبيق/مفتاح مادي).

**6 مقارنات جديدة:** YubiKey vs تطبيق مصادقة، Palo Alto Prisma Access vs Zscaler، Elastic Stack vs Splunk، Rclone vs rsync، Netskope vs Prisma SaaS، WSUS vs Intune.

**العدد الحالي:** 63 مقال، 63 مقارنة، 16 فيديو، 9 مجموعات — صفر أخطاء، صفر تكرار، صفر صور مكررة.

---

## تحسين الصفحة الرئيسية: مقدمة نصية قبل صورة المقال المميز

**المشكلة:** أول حاجة زائر جديد بيشوفها في الموقع كانت صورة مقال محدد (مثلًا "دليل 2FA") مع نص متراكب فوقها — صورة ضيقة الموضوع مش بتعبّر عن الموقع ككل (أمن شبكات، Windows، سحابة، مقارنات...). اتأكدت كمان إن مفيش أي صور فاضية أو مكسورة في البيانات نفسها (فحصت كل الـ138 عنصر) — المشكلة كانت في العرض، مش في البيانات.

**الحل:** أضفنا قسم مقدمة نصية واضح **قبل** قسم المقال المميز مباشرة — اسم الموقع + الوصف التعريفي الموجود بالفعل في الفوتر (لضمان اتساق النص عبر الموقع، مش نص جديد مُخترع). كده أول حاجة الزائر بيشوفها هوية الموقع نفسه، بعدين المحتوى.

**ملاحظة تحقق:** الملف بيستخدم JSX، ومقدرش أعمل `pnpm install` كامل للتحقق النهائي — راجعت الكود يدويًا وعملت فحص TypeScript معزول (نفس القيود المعروفة من قبل)، محتاج `npm run typecheck` أو معاينة فعلية بعد النشر للتأكد الكامل.

---

## دفعة محتوى: 6 مقالات + 6 مقارنات

**6 مقالات جديدة:** حقن SQL، أتمتة المهام بـTask Scheduler، التهديد الداخلي، SD-WAN، قائمة تحقق للعمل عن بُعد الآمن، تدوير كلمة مرور المدير المحلي (LAPS).

**6 مقارنات جديدة:** LAPS vs الإدارة اليدوية، Wazuh vs OSSEC، Twingate vs VPN تقليدي، SolarWinds NPM vs PRTG، Burp Suite vs Nikto، Wireshark vs tcpdump.

**العدد الحالي:** 69 مقال، 69 مقارنة، 16 فيديو، 9 مجموعات — صفر أخطاء، صفر تكرار، صفر صور مكررة.

---

## إصلاح Bug حقيقي: المساحة الفاضية تحت صورة المقال المميز

صاحب المشروع بعت صور فعلية من الموقع الحي، وده كشف مشكلة أوضح بكتير مما كنا نتخيل.

**السبب الجذري (اتأكد منه بالكود مباشرة):** صورة المقال المميز كان لها ارتفاع ثابت (400-500 بكسل)، لكن عمود "الأخبار الشائعة" جنبها بيحتوي على 3 مقالات وبيطلع أطول من كده. CSS Grid بيمدّ العمودين ليتساووا في الطول تلقائيًا (السلوك الافتراضي)، فالحاوية اللي حوالين الصورة بتتمدد، لكن **الصورة نفسها كانت مثبّتة بارتفاع محدد ومبتكبرش معاها** — فبيفضل فراغ فاضي بالظبط بقد الفرق، وده اللي ظهر في الصورة التانية.

**الإصلاح:** غيّرنا ارتفاع الصورة من قيمة ثابتة (`h-[400px] md:h-[500px]`) إلى `h-full` (تمتلئ الحاوية بالكامل مهما كان ارتفاعها) مع `min-h-[400px]` كحد أدنى أمان. دلوقتي الصورة هتتمدد تلقائيًا لتطابق ارتفاع عمود الأخبار الشائعة، مفيش فراغ.

**بخصوص كون الصورة "معبّرة عن الموقع":** الصورة الحالية (قفل أحمر على لوحة مفاتيح بإضاءة خضراء) صورة نمطية معروفة لمواقع الأمن السيبراني/التقنية عمومًا — أعتقد إنها مقبولة كصورة عامة تمثيلية، مش لازم تكون "صورة الموقع الرسمية" بقدر ما هي انطباع بصري أول مناسب. لو لسه حاسس إنها مش مناسبة بعد ما تشوف الإصلاح، قولّي وأغيّرها لصورة تانية.

**تحقق:** فحص تركيبي معزول لملف `ArticleCard.tsx` — لا أخطاء حقيقية (الأخطاء الظاهرة كلها بسبب عدم توفر أنواع React في بيئة الاختبار المعزولة، نفس القيد المعروف من قبل).

---

## تصحيح الإصلاح السابق: `h-full` كان حل غلط، صلّحناه صح

صاحب المشروع نبّهني (وكان محق تمامًا): خلي الصورة تتمدد (`h-full`) عشان تطابق ارتفاع عمود الأخبار الشائعة كان **حل أسوأ من المشكلة الأصلية** — لو عمود الأخبار الشائعة طويل، الصورة كانت هتطول معاه بشكل غير طبيعي وتاخد طول الصفحة كله.

**الحل الصح:** بدل ما نخلي أي عمود "يتمدد" ليطابق التاني، خلينا الاتنين ياخدوا ارتفاعهم الطبيعي بس (`items-start` بدل السلوك الافتراضي `items-stretch` في CSS Grid). كده:
- صورة المقال المميز ترجع لحجمها الثابت المعقول (400-500 بكسل) زي الأصل
- عمود الأخبار الشائعة ياخد طوله الطبيعي (سواء أطول أو أقصر من الصورة)
- **مفيش تمدد قسري لأي حاجة، ومفيش فراغ فاضي** — كل عمود مستقل بطوله الحقيقي

ده حل أنضف وأصح هندسيًا من الفكرة الأولى، وشلنا الـ`h-full` الزيادة من الكود بعد ما بقى غير محتاج.

---

## تنفيذ اقتراحات تحسين الصفحة الرئيسية

**1. قائمة "الأخبار الشائعة" أصبحت مدمجة:** بدل 3 كروت كاملة (صورة كبيرة + عنوان + ملخص + بيانات)، بقت قائمة مرقّمة مدمجة (صورة مصغّرة 64×64 + عنوان بس). الطول الإجمالي دلوقتي ~300-325 بكسل تقريبًا، قريب جدًا من طول صورة المقال المميز (400-500 بكسل) — توازن بصري أفضل بكتير، مفيش عمود أطول بكتير من التاني.

**2. قسم المقارنات:** اتأكدت إنه **موجود بالفعل** في الصفحة الرئيسية (قسم منفصل تحت "أحدث المقالات" مباشرة)، فمكانش محتاج إضافة قسم مكرر — بس اتأكدت من مكانه ومحتواه.

**تحقق:** فحص توازن الأقواس + فحص TypeScript معزول لملف `Home.tsx` — لا أخطاء حقيقية جديدة (بعد استبعاد نفس أخطاء البيئة المعزولة المعروفة من قبل).

---

## أول دفعة أخبار حقيقية حالية + إصلاح جوهري في منطق "الشائع الآن"

صاحب المشروع طلب نركّز على "أحدث الأخبار" — ده استراتيجية التميّز اللي اتفقنا عليها من البداية. بحثت فعليًا في مصادر أمن سيبراني حقيقية (SecurityWeek، بتاريخ 1-3 أغسطس 2026) وكتبت **5 مقالات إخبارية حقيقية** (مش أدلة عامة)، كل واحدة بمصدر حقيقي مذكور ورابط للمقال الأصلي:

1. ثغرات SonicWall SMA1000 مُستغلة فعليًا في هجمات فدية (عصابة INC)
2. ثغرة N-central (CVE-2026-18577) استُغلّت بعد تجاوز الترقيع الأول
3. ثغرة CosmosEscape في Azure Cosmos DB
4. حملة رش كلمات مرور ضخمة ضد Azure CLI
5. Ruby on Rails تُصلح ثغرة RCE حرجة غير مُصادَق عليها

كل مقال فيه: الخبر نفسه (بارافريز كامل، مفيش اقتباس مباشر طويل)، ليه مهم لمدير النظام، خطوات عملية فورية، ورابط المصدر الأصلي للشفافية.

### اكتشاف واكتشاف مهم أثناء الإضافة

**المشكلة 1:** المولّد بيوزّع التواريخ بالتساوي حسب ترتيب الإضافة في المصفوفة، مش حسب التاريخ الحقيقي — فالأخبار دي طلعت بتواريخ من مارس-يونيو 2026 بدل التاريخ الحقيقي (1-3 أغسطس). صلّحتها بإضافة حقل `realDate` اختياري لعناصر المحتوى الإخباري تحديدًا، يتجاوز التوزيع التلقائي.

**المشكلة 2 (الأهم):** "الشائع الآن" على الصفحة الرئيسية كان بيتحدد حسب **ترتيب المقال في المصفوفة**، مش حسب التاريخ الفعلي! يعني مقالات من 2022 كانت لسه معلّمة "شائع الآن" بينما أخبار اليوم الحقيقية مكانتش هتظهر خالص. **صلّحت المنطق بالكامل**: دلوقتي المقال المميز و"الشائع الآن" بيتحددوا بترتيب التاريخ الفعلي (الأحدث أولًا)، مش بموضع المقال في الكود — إصلاح جذري يضمن إن أي خبر حقيقي جديد نضيفه هيظهر فورًا كـ"شائع" تلقائيًا من غير أي تعديل يدوي إضافي مستقبلًا.

**النتيجة الحالية:** المقال المميز والـ3 "شائع الآن" كلهم أخبار حقيقية من 1-3 أغسطس 2026.

**العدد الحالي:** 74 مقال (منهم أول 5 أخبار حقيقية)، 69 مقارنة، 16 فيديو، 9 مجموعات.

---

## إصلاح جزئي: صور المقالات المتكررة (4 أغسطس 2026)

صاحب المشروع لاحظ إن صور المقالات متكررة وبعضها مش مرتبط بالمحتوى. فحصت وأكدت المشكلة رقميًا: **74 مقال بيرجعوا لـ10 صور بس فعليًا** (صورة واحدة اتكررت 14 مرة).

### السبب الجذري
- المخزون الحقيقي للصور المُتحقّق منها (`P` object في `images.mjs`) فيه **19 صورة فعلية بس**
- أسوأ من كده: 34 اسم "theme" مختلف كانوا بيترجموا لنفس الصور دي بتكرار كبير (مثلًا 4 أسماء themes مختلفة كانوا بيرجعوا **نفس الصورة بالظبط**)
- بما إن كل مقال كتبته له `theme` ثابت، ومعظم مقالات IT/أمن الشبكات بتستخدم themes متشابهة (security, network, windows)، النتيجة كانت تكرار شديد وواضح

### الإصلاح المُنفَّذ
- أضفت نظام "تجميعات" (`THEME_POOLS`): بدل ما كل theme يرجّع صورة واحدة ثابتة، بيختار من مجموعة صور مرتبطة بصريًا (2-4 صور) باستخدام hash ثابت من الـslug — نفس المقال دايمًا بياخد نفس الصورة (ثبات عند إعادة البناء)، لكن مقالات مختلفة بنفس الـtheme بتتوزع على صور مختلفة
- أضفت صورة حقيقية جديدة واحدة (تم التحقق منها فعليًا عبر فتح صفحتها على Unsplash والتأكد إنها **مجانية** مش Unsplash+ مدفوعة) لموضوعات التصيد/البريد الإلكتروني

### النتيجة الصادقة
تحسّن من **10 صور فريدة إلى 13** من أصل 74 مقال. **تحسين حقيقي لكنه جزئي، مش حل كامل.**

### ليه مكملتش لحل كامل
التحقق من كل صورة جديدة يدويًا (فتح صفحتها على Unsplash، التأكد إنها مجانية مش مدفوعة، استخراج رابط CDN الحقيقي) عملية بطيئة جدًا لكل صورة — جربتها 4 مرات، اتنين طلعوا صور موجودة أصلًا أو مدفوعة، واحدة بس كانت جديدة وصالحة فعليًا.

### الحل الكامل يحتاج قرار
1. **الأسرع:** مفتاح API حقيقي من Unsplash (مجاني، بيدّي بحث آلي عن صور مجانية بالفعل بدون تحقق يدوي لكل صورة) — يحتاج تسجيل حساب مطور على unsplash.com
2. **البديل:** استمرار في التحقق اليدوي صورة بصورة على عدة جلسات (بطيء لكن ممكن)
3. **الأبسط:** تقليل الاعتماد على صور "عامة" أصلًا، والتركيز على صور مرتبطة حرفيًا بموضوع كل مقال (يحتاج نفس عملية البحث اليدوي بس بتنويع أكبر)

**التوصية:** لو حابب حل كامل وسريع، الحصول على مفتاح Unsplash API (مجاني للاستخدام غير التجاري بحجم معقول) هو الأنسب.

---

## دفعة محتوى: 7 مقالات + 6 مقارنات

**7 مقالات جديدة:** الفخاخ الرقمية (Honeypots)، قياس فعالية تدريب الوعي الأمني، الشبكات المعزولة فيزيائيًا، أخطاء إعداد التخزين السحابي (S3)، تحديد معدل طلبات API، الرقابة المزدوجة، نمذجة التهديدات بـSTRIDE.

**6 مقارنات جديدة:** Okta vs JumpCloud، CrowdStrike vs Microsoft Sentinel، AWS GuardDuty vs Defender for Cloud، HashiCorp Vault vs AWS Secrets Manager، Datadog vs New Relic، Auth0 vs Firebase Authentication.

**العدد الحالي:** 81 مقال، 75 مقارنة، 16 فيديو، 9 مجموعات — صفر أخطاء، صفر تكرار slugs، صفر صور مكررة في المقارنات الجديدة. (79/81 صورة مقال فريدة — تكرار بسيط 2x لصورتين بس، مقبول عند هذا الحجم بدون استخدام API.)

---

## تحوّل استراتيجي: محتوى أعمق بدل محتوى أكتر (4 أغسطس 2026)

صاحب المشروع طلب تحوّل واضح: الهدف مش عدد أكبر من المقالات/المقارنات، الهدف موقع يبقى **مرجع حقيقي (Knowledge Base)** — محتوى الناس فعلًا ترجعله، مش ملخص سريع. حتى لو ده معناه دفعات أصغر لكل مقال.

**أول مقال بالمعيار الجديد:** "الدليل الشامل لإعداد وإدارة Active Directory من الصفر" — **~6000 حرف** (مقابل متوسط 597 حرف للمقالات السابقة، يعني أطول بـ10 أضعاف تقريبًا). بيغطي: المتطلبات، خطوات تثبيت تفصيلية بأوامر PowerShell حقيقية، تصميم هيكل OU، أساسيات Group Policy، ممارسات أمان، **3 مشاكل شائعة حقيقية وحلولها**، وقسم أسئلة شائعة (FAQ) كامل.

**الخطة القادمة:** لو المستوى ده مناسب، هستمر بنفس العمق (دفعات أصغر عددًا، 1-3 مقالات لكل دفعة بدل 6-7، لكن كل واحد بعمق مماثل) بدل التوسع الأفقي السريع.

---

## 🔴 إصلاح حرج: صفحات المقالات كانت فاضية لكل المستخدمين (مش مشكلة إنترنت)

صاحب المشروع بلّغ إن صفحات المقالات فاضية، وافترض إنها مشكلة إنترنت عنده. **راجعت الكود ولقيت الحقيقة: bug برمجي حقيقي مني، بيأثر على كل مستخدم بيفتح أي صفحة مقال.**

### السبب بالتفصيل

قاعدة أساسية في React: أي Hook (`useState`, `useEffect`, `useSEO`...) **لازم يتنادى بنفس الترتيب في كل مرة يترندر فيها الكومبوننت، من غير أي شرط**. لما بنيت `useArticleBody` (التحميل الديناميكي لنص المقال الكامل) قبل كده، ضفت شرطين `return` مبكرين (لو لسه بيحمّل، أو لو المقال مش موجود) — **لكن نداء `useSEO(...)` كان موجود أصلًا في الكود من قبل، تحت الشرطين دول**.

النتيجة: أول مرة الصفحة بتترندر، `isLoading` بيكون `true`، فالكومبوننت بيرجع (return) قبل ما يوصل لـ`useSEO` خالص. لما التحميل يخلص، الكومبوننت بيترندر تاني وهالمرة بيوصل لـ`useSEO` — **يعني عدد الـHooks المستدعاة اختلف بين الرندرين**. React بيرفض ده تمامًا وبيوقع (crash) — وفي بيئة الإنتاج (production build)، الخطأ ده غالبًا بيظهر كصفحة فاضية بدل رسالة خطأ واضحة.

### الإصلاح

نقلت `useSEO(...)` لأول الكومبوننت، **قبل** أي شرط return، واستخدمت `article?.title?.[language]` (استعلام آمن) بدل `article.title[language]` عشان يشتغل حتى قبل ما يتحمّل المقال. راجعت باقي صفحات الموقع (المقارنات، الفيديوهات، الفئات، البحث، الصفحات العامة) — **كلها كانت صح من الأساس**، المشكلة كانت في `ArticleDetail.tsx` بس.

### الاعتذار والدرس

المشكلة دي بسببي أنا، مش الإنترنت عندك. الدرس: أي تعديل مستقبلي على كومبوننت فيه Hooks لازم يتراجع بعناية للتأكد إن كل الـHooks بتتنادى بنفس الترتيب في كل الحالات (تحميل، خطأ، نجاح) — مش بس نتأكد من التركيب اللغوي للكود.

---

## ترقية أول 4 مقالات أساسية لمعيار "المرجع" الجديد

بعد موافقة صاحب المشروع على معيار مقال Active Directory، بدأنا فعليًا نرفّع مستوى المقالات القديمة (مش بس المحتوى الجديد) — ابتدأنا بأهم 4 مقالات أساسية (الأكتر احتمالًا لزيارات بحث عضوية):

| المقال | قبل | بعد |
|---|---|---|
| المصادقة الثنائية (2FA) | 629 حرف | 2942 حرف |
| التصيد الإلكتروني | 388 حرف | 2084 حرف |
| مديرو كلمات المرور | 384 حرف | 2274 حرف |
| VPN أساسيات | 186 حرف | 2306 حرف |

كل مقال دلوقتي فيه أقسام حقيقية متعددة (مش بس مقدمة وخلاصة)، تفاصيل تقنية دقيقة (زي أنواع بروتوكولات VPN، معمارية Zero-Knowledge لمديري كلمات المرور، أنواع التصيد المختلفة)، وأسئلة شائعة حقيقية.

**ملاحظة تقنية:** التحديث ده كان **تصحيح لمحتوى موجود**، مش إضافة جديدة — يعني اتطبّق بتعديل مباشر على `TOPIC_CONTENT` في المصدر + تصحيح مباشر للملف الحي (نفس الدرس من قبل كده: أداة الدمج بتفضّل القيمة الموجودة، فمش تصلح للتصحيحات).

**الخطة القادمة:** هنكمل ترقية باقي المقالات القديمة تدريجيًا على دفعات، بالتوازي مع كتابة محتوى جديد بنفس المعيار من الأساس.

---

## دفعة "الاتنين مع بعض": ترقية 3 مقالات قديمة + مقال جديد عميق

**3 مقالات اتترقّوا لمعيار المرجع الجديد:**
- Zero Trust: 278 → 2395 حرف (ركائز NIST الست، خطة تطبيق تدريجية على 3 مراحل)
- أساسيات Group Policy: 316 → 2792 حرف (LSDOU بالتفصيل، Security/WMI Filtering، أدوات تشخيص، أشهر الأخطاء)
- قاعدة النسخ الاحتياطي 3-2-1: 296 → 2224 حرف (تطبيق حسب 3 مستويات ميزانية، أخطر أخطاء النسخ الاحتياطي)

**مقال جديد بمعيار العمق من الأول:** "الدليل الشامل لاستخدام PowerShell في إدارة الأنظمة" — 3591 حرف، بأمثلة كود PowerShell حقيقية قابلة للنسخ مباشرة (فحص خدمات متوقفة، إدارة AD، معالجة أخطاء بـTry/Catch).

**ملاحظة تقنية مهمة:** واجهت مشكلة escaping حقيقية وأنا بكتب كود PowerShell (علامات اقتباس متداخلة جوه نص JS) — أول محاولة كسرت الملف. الحل: استخدمت `json.dumps()` في بايثون لتوليد الـstring الجاهز للـJS بدل الكتابة اليدوية، وده ضمن عدم وجود أي مشكلة escaping تانية.

**العدد الحالي:** 83 مقال — 7 منهم دلوقتي بمعيار المرجع العميق (AD، 2FA، تصيد، مديرو كلمات مرور، VPN، Zero Trust، Group Policy، النسخ الاحتياطي، PowerShell).

---

## دفعة تانية "الاتنين مع بعض": 3 ترقيات + مقال جديد

**3 مقالات اتترقّوا:**
- Forcepoint SSL VPN + RADIUS: توسّع بخطوات تفصيلية لكل مرحلة، وقسم "التحقق من نجاح الإعداد"
- FortiGate SSL VPN: تشخيص مفصّل لكل عطل شائع بدل قائمة مختصرة
- أمان الراوتر المنزلي: 259 → 1788 حرف (7 خطوات مرتبة بالأولوية + علامات اختراق حقيقية)

**مقال جديد:** "كيف تبني خطة استجابة للحوادث الأمنية من الصفر" — المراحل الست حسب NIST، قائمة تحقق لأول ساعة، وأشهر خطأ (إعادة تشغيل الجهاز بسرعة بيمسح أدلة التحقيق).

**ملاحظة تقنية:** استخدمت أسلوب `json.dumps()` الآمن من البداية هالمرة (مش بعد ما يحصل خطأ زي المرة اللي فاتت) — صفر مشاكل escaping.

**العدد الحالي:** 84 مقال — 11 منهم دلوقتي بمعيار المرجع العميق.

---

## دفعة تالتة "الاتنين مع بعض": 3 ترقيات + دليل Wireshark جديد

**3 مقالات اتترقّوا:**
- Palo Alto Security Policy: 512 → 2354 حرف (ترتيب القواعد بالتفصيل، مثال قاعدة كاملة، أشهر الأخطاء)
- مهام AD اليومية بـPowerShell: 493 → 2521 حرف (سكريبتات دفعية جاهزة من CSV، تعطيل حسابات غير نشطة تلقائيًا)
- منطقة DNS العكسية: 412 → 2185 حرف (أوامر تحقق PowerShell حقيقية، تشخيص مشاكل شائعة)

**مقال جديد:** "الدليل الشامل لتحليل حركة الشبكة باستخدام Wireshark" — فلاتر التقاط وعرض حقيقية، 4 سيناريوهات تشخيص عملية (بطء، DNS مشبوه، فشل TLS، تتبع محادثات).

**العدد الحالي:** 85 مقال — 15 منهم دلوقتي بمعيار المرجع العميق.

---

## دفعة رابعة "الاتنين مع بعض": 3 ترقيات + دليل Kerberos جديد

**3 مقالات اتترقّوا:**
- Kaspersky Security Center Tags: 430 → 2137 حرف (الفرق بين Administration Groups وTags، خطوات تطبيق كاملة)
- RDP/RDS Licensing: 406 → 2390 حرف (الفرق بين Per User وPer Device بالتفصيل، مكونات RDS)
- Windows Server Evaluation→Standard: 390 → 2498 حرف (أوامر DISM كاملة مع شرح كل خطوة)

**مقال جديد:** "فهم Kerberos: كيف تعمل المصادقة فعليًا في Active Directory" — تسلسل العملية كامل (AS، TGS، TGT، Service Ticket)، ليه مزامنة الوقت حرجة، وشرح توعوي لهجمات Pass-the-Ticket وGolden Ticket.

**العدد الحالي:** 86 مقال — 19 منهم دلوقتي بمعيار المرجع العميق.

---

## دفعة خامسة "الاتنين مع بعض": 3 ترقيات + دليل PKI جديد

**3 مقالات اتترقّوا:**
- بوابة أمان البريد الإلكتروني: 312 → 1971 حرف (4 وظائف أساسية بالتفصيل، متى الاستثمار الإضافي يستاهل)
- خادم Syslog مركزي: 533 → 1978 حرف (مقارنة أدوات حسب حجم البيئة، تحذير من "التجميع بدون مراجعة")
- مراقبة انتهاء الشهادات: 538 → 1968 حرف (شرح ACME/Let's Encrypt، أمر تحقق OpenSSL جاهز)

**مقال جديد:** "فهم PKI وسلسلة الثقة: كيف تعرف أن الشهادة حقيقية فعلًا" — زوج المفاتيح، سلسلة الثقة كاملة (Root CA → وسيطة → شهادة الموقع)، أنواع DV/OV/EV، وليه تحذير "شهادة غير موثوقة" خطير فعلًا.

**العدد الحالي:** 87 مقال — 23 منهم دلوقتي بمعيار المرجع العميق.

---

## دفعة سادسة "الاتنين مع بعض": 3 ترقيات + دليل DRP جديد

**3 مقالات اتترقّوا:**
- أساسيات VLAN: 585 → 2209 حرف (شرح Access/Trunk بالتفصيل، Inter-VLAN Routing)
- تقسيم الشبكة للامتثال: 564 → 2163 حرف (الفرق بين العزل الكامل والمنطقي، فايدة تقليل نطاق المراجعة)
- أمان الطابعات: 561 → 2009 حرف (3 مخاطر ملموسة بالتفصيل، 5 خطوات حماية)

**مقال جديد:** "أساسيات خطة التعافي من الكوارث (DRP)" — الفرق بين النسخ الاحتياطي وDRP كاملة، RTO/RPO بالمثال، 3 مستويات استراتيجية (Cold/Warm/Hot Site).

**العدد الحالي:** 88 مقال — 27 منهم دلوقتي بمعيار المرجع العميق.

---

## دفعة سابعة: أخيرًا رقّينا أقصر 3 مقالات في الموقع + دليل Nmap جديد

**3 أقصر مقالات في الموقع اتترقّوا أخيرًا** (كانوا قابعين في القاع من أول جلسة "المرجع الجديد"):
- تنظيف قرص Windows: 215 → 1849 حرف
- مواصفات لابتوب الطالب: 138 → 1922 حرف (أقصر مقال في الموقع كله)
- ChatGPT في المذاكرة: 175 → 1891 حرف

**مقال جديد:** "الدليل الشامل لاستخدام Nmap في فحص الشبكة" — أنواع فحص حقيقية بأوامر جاهزة، مع تحذير قانوني واضح قبل أي استخدام.

**العدد الحالي:** 89 مقال — 31 منهم دلوقتي بمعيار المرجع العميق. أقصر مقال متبقي دلوقتي 562 حرف (`log-retention-siem-basics`)، لسه فيه ~15 مقال تحت 700 حرف محتاجين ترقية في الدفعات الجاية.

---

## دفعة ثامنة: 3 ترقيات + دليل إدارة الثغرات الجديد

**3 مقالات اتترقّوا:**
- الاحتفاظ بالسجلات: 562 → 1835 حرف (استراتيجية التخزين المتدرج ساخن/بارد)
- DHCP Failover: 571 → 2001 حرف (الفرق بين Hot Standby وLoad Balance بالتفصيل، أمر PowerShell للتحقق)
- هجمات MFA Fatigue: 586 → 1903 حرف (5 طرق حماية عملية بدل 4)

**مقال جديد:** "بناء برنامج إدارة ثغرات ناجح" — دورة الحياة الكاملة (اكتشاف/تقييم/إصلاح/تحقق)، نظام أولويات غير CVSS بس (استغلال فعلي، تعرّض للإنترنت)، وجدول أطر زمنية مقترحة.

**العدد الحالي:** 90 مقال — 37 منهم دلوقتي فوق 1500 حرف (تقريبًا 41% من المحتوى كله).

---

## دفعة تاسعة: 3 ترقيات + دليل EDR جديد

**3 مقالات اتترقّوا:**
- مراقبة SNMP: 574 → 2378 حرف (الفرق بين v1/v2c وv3 بالتفصيل، أشهر 3 أخطاء أمنية)
- استراتيجية Patch Management: 587 → 1972 حرف (نظام الحلقات بالتفصيل، استثناء Zero-Day، مقارنة أدوات WSUS/SaaS/Intune)
- Hyper-V Checkpoints: 567 → 1887 حرف (تأثير التراكم على الأداء والتخزين، خطوات استخدام آمنة)

**مقال جديد:** "كيف يعمل EDR فعليًا" — الفرق التقني بين التوقيعات الثابتة والتحليل السلوكي، ليه بيكتشف الهجمات بدون ملفات، وقيوده الواقعية.

**العدد الحالي:** 91 مقال — 41 منهم فوق 1500 حرف (~45% من المحتوى، تحقق مباشر).

---

## دفعة عاشرة: 3 ترقيات + دليل أمان الحاويات الجديد

**3 مقالات اتترقّوا:**
- قراءة سجلات Event Viewer: 609 → 1867 حرف (شرح تفصيلي لكل Event ID، ليه 1102 أقوى علامة تحذير)
- مراقبة الدارك ويب: 571 → 1876 حرف (الفرق بين اكتشاف ومنع، ليه التنبيه بدون خطة استجابة استثمار ضائع)
- SSD مقابل HDD: 591 → 1889 حرف (استراتيجية الهجين Hybrid، سيناريو تطبيقي واضح)

**مقال جديد:** "أساسيات أمان الحاويات (Container Security)" — 4 مخاطر مختلفة عن أمان الأجهزة الافتراضية التقليدي، 5 خطوات حماية من فحص الصور لسياسات الشبكة.

**العدد الحالي:** 92 مقال — 45 منهم فوق 1500 حرف (~49% من المحتوى، تحقق مباشر).

---

## دفعة حادية عشر: 3 ترقيات + دليل BYOD جديد

**3 مقالات اتترقّوا:**
- تقليل فاتورة السحابة: 584 → 2125 حرف (4 أسباب شائعة، خصومات الالتزام طويل المدى)
- عزل المتصفح: 605 → 1901 حرف (ليه فعّال ضد يوم الصفر تحديدًا)
- سياسة USB: 617 → 1999 حرف (4 مستويات تحكم متدرّج، خطوات Group Policy)

**مقال جديد:** "سياسة BYOD (استخدام الجهاز الشخصي للعمل)" — الفرق بين MDM وMAM، وعناصر سياسة عملية موثّقة.

**العدد الحالي:** 93 مقال — 49 منهم فوق 1500 حرف (~53% من المحتوى، أكتر من نص الموقع دلوقتي).

---

## دفعة ثانية عشر: 3 ترقيات + دليل SSDLC جديد

**3 مقالات اتترقّوا:**
- Shadow IT: 636 → 1851 حرف (ليه المنع بيغيّر مكان المخاطرة، مثال عملي كامل)
- الشبكات المعزولة فيزيائيًا: 604 → 1809 حرف (لماذا التهديد الداخلي لسه موجود رغم العزل)
- أخطاء إعداد التخزين السحابي: 615 → 1887 حرف (5 خطوات وقاية تفصيلية بدل 4)

**مقال جديد:** "دورة تطوير البرمجيات الآمنة (SSDLC)" — الست مراحل ودمج الأمان في كل واحدة، DevSecOps وربط الفحص بـCI/CD.

**العدد الحالي:** 94 مقال — 53 منهم فوق 1500 حرف (~56% من المحتوى، تحقق مباشر).

---

## دفعة ثالثة عشر: 3 ترقيات + دليل SIEM جديد

**3 مقالات اتترقّوا:**
- أول ساعة بعد Ransomware: 645 → 1895 حرف (خطوات مرقّمة بالتفصيل، 3 أخطاء بتزود الضرر)
- الأمان الفيزيائي لغرفة السيرفرات: 629 → 1761 حرف (سيناريو توضيحي لموظف سابق بمفتاح قديم)
- قياس فعالية تدريب الوعي الأمني: 615 → 1821 حرف (خطوات عملية لبرنامج قياس أفضل)

**مقال جديد:** "كيف يعمل SIEM فعليًا" — الفرق بين تجميع السجلات والقيمة الحقيقية (الربط الذكي)، سيناريو Impossible Travel كمثال واضح.

**العدد الحالي:** 95 مقال — 57 منهم فوق 1500 حرف (~60% من المحتوى، تحقق مباشر).

---

## دفعة رابعة عشر: 3 ترقيات + دليل WAF جديد

**3 مقالات اتترقّوا:**
- المصادقة بالشهادات 802.1X: 639 → 2235 حرف (الفرق بين EAP-TLS وPEAP، خطوات تطبيق كاملة)
- مبدأ أقل الصلاحيات: 650 → 2161 حرف (5 خطوات تطبيق آمن بدل 4، Role-Based Access)
- النسخ الاحتياطي السحابي مقابل المحلي: 655 → 1929 حرف (5 عوامل مقارنة تفصيلية بدل 3)

**مقال جديد:** "جدار حماية تطبيقات الويب (WAF)" — الفرق الجوهري عن جدار الحماية الشبكي التقليدي، 4 أنواع هجمات، وضعي المراقبة والحجب.

**العدد الحالي:** 96 مقال — 61 منهم فوق 1500 حرف (~64% من المحتوى، تحقق مباشر).

---

## دفعة خامسة عشر: 3 ترقيات + دليل DLP جديد

**3 مقالات اتترقّوا:**
- Wi-Fi 6 مقابل Wi-Fi 5: 624 → 1987 حرف (تقنية OFDMA بالتفصيل، نصيحة عملية قبل الشراء)
- تحديد معدل طلبات API: 645 → 1938 حرف (أين تطبّق التحديد فنيًا: Gateway مقابل التطبيق)
- الرقابة المزدوجة: 642 → 2087 حرف (آلية موافقة سريعة كشرط أساسي للنجاح)

**مقال جديد:** "منع تسريب البيانات (DLP)" — 4 طرق كشف، 3 نقاط تطبيق (شبكة/جهاز/سحابة)، وتحدي التنبيهات الكاذبة.

**العدد الحالي:** 97 مقال — 65 منهم فوق 1500 حرف (~67% من المحتوى، تحقق مباشر).

---

## دفعة سادسة عشر: 3 ترقيات + دليل إدارة التهديد الداخلي الجديد

**3 مقالات اتترقّوا:**
- برامج محاكاة التصيد: 655 → 2163 حرف (سيناريو مقارنة بين فريقين يوضّح ليه القياس مش بس نسبة الوقوع)
- عزل شبكة الضيوف: 673 → 1858 حرف (5 خطوات إعداد بدل 4، تغيير كلمة مرور دوري)
- نمذجة التهديدات STRIDE: 654 → 2246 حرف (أمثلة حقيقية لكل فئة، مثال تطبيقي كامل لنظام تسجيل دخول)

**مقال جديد:** "بناء برنامج إدارة التهديد الداخلي" — 3 فئات مختلفة (خبيث/مهمل/مخترق)، علامات تحذيرية سلوكية، والتوازن الحساس بين الأمان والثقة.

**ملاحظة تقنية:** واجهت عدم تطابق نصي دقيق في واحدة من عمليات الاستبدال (Python matching) — استخدمت أداة `str_replace` المباشرة كبديل موثوق بدل التصحيح اليدوي للنص.

**العدد الحالي:** 98 مقال — 69 منهم فوق 1500 حرف (~70% من المحتوى، تحقق مباشر).

---

## دفعة سابعة عشر: 3 ترقيات + دليل Authentication vs Authorization جديد

**3 مقالات اتترقّوا:**
- NAC: 677 → 2091 حرف (سيناريو عملي مفصّل، ليه التفعيل المفاجئ أشهر خطأ)
- فحص الثغرات مقابل اختبار الاختراق: 677 → 2193 حرف (مثال عملي للفرق في النتائج، إزاي يكمّلوا بعض)
- Honeypots: 686 → 2344 حرف (الفرق بين Low/High-Interaction، نصيحة العزل الصارم)

**مقال جديد:** "المصادقة مقابل التفويض (Authentication vs Authorization)" — الفرق الجوهري بين "مين إنت" و"مسموح لك تعمل إيه"، نماذج RBAC/ABAC/ACL، ومثال عملي يوضّح ليه الخلط بينهم يسبب ثغرات حقيقية.

**العدد الحالي:** 99 مقال — 73 منهم فوق 1500 حرف (~74% من المحتوى، تحقق مباشر).

---

## دفعة ثامنة عشر: 3 ترقيات + دليل OWASP Top 10 جديد — 🎉 وصلنا لـ100 مقال

**3 مقالات اتترقّوا:**
- إرشادات NIST لكلمات المرور: 694 → 2293 حرف (مثال عملي يقارن قوة كلمة معقدة قصيرة مقابل عبارة طويلة)
- ثغرات XSS: 697 → 2395 حرف (3 أنواع بدل 2 — أضفنا DOM-based، مثال كامل خطوة بخطوة)
- فحص أمان صور الحاويات: 692 → 2222 حرف (سياسة واضحة لمستويات الخطورة)

**مقال جديد:** "نظرة شاملة على OWASP Top 10" — أهم الفئات بالتفصيل، ليه القائمة بتتغيّر كل بضع سنين، وإزاي تستخدمها كأداة أولويات عملية.

**العدد الحالي:** 🎉 **100 مقال بالظبط** — 77 منهم فوق 1500 حرف (77% من المحتوى، تحقق مباشر).

---

## دفعة تاسعة عشر: 3 ترقيات + دليل CVSS جديد

**3 مقالات اتترقّوا:**
- تمارين المحاكاة: 706 → 2163 حرف (5 خطوات تنظيم بدل 4)
- Windows Server Core مقابل Desktop Experience: 706 → 2303 حرف (استراتيجية انتقال تدريجي، Windows Admin Center كجسر)
- التأمين ضد المخاطر السيبرانية: 707 → 2406 حرف (نصيحة مراجعة البوليصة مع خبير أمني، مش بس قانوني)

**مقال جديد:** "فهم درجة CVSS" — 4 مكونات أساسية بتشكّل الدرجة، ليه السياق أهم من الرقم المجرد، ودور قوائم KEV.

**العدد الحالي:** 101 مقال — 81 منهم فوق 1500 حرف (~80% من المحتوى، تحقق مباشر).

---

## دفعة عشرون: 3 ترقيات + دليل SOC جديد

**3 مقالات اتترقّوا:**
- أمان DNS: 733 → 2321 حرف (ليه DNS نقطة تحكم استراتيجية، إزاي فلترة DNS بتشتغل تقنيًا)
- SD-WAN: 732 → 2227 حرف (التوجيه الذكي حسب نوع التطبيق، نقطة حرجة عن الخلط بين إدارة الشبكة والأمان)
- LAPS: 731 → 2311 حرف (ليه صلاحية قراءة كلمات المرور المخزّنة أهم نقطة في التطبيق كله)

**مقال جديد:** "مركز العمليات الأمنية (SOC)" — 3 مستويات فريق تقليدية، تحدي التغطية الزمنية 24/7 (داخلي مقابل MSSP)، ومقاييس MTTD/MTTR.

**العدد الحالي:** 102 مقال — 85 منهم فوق 1500 حرف (~83% من المحتوى، تحقق مباشر).

---

## دفعة واحدة وعشرون: 3 ترقيات + دليل Immutable Backups جديد

**3 مقالات اتترقّوا:**
- قواعد Windows Firewall المتقدمة: 740 → 2356 حرف (ليه الترافيك الصادر مهم بنفس قدر الوارد)
- هجمات سلسلة التوريد: 741 → 2230 حرف (3 أمثلة حقيقية موثّقة بالتفصيل)
- SPF/DKIM/DMARC: 736 → 2300 حرف (شرح تقني لكل سجل، تسلسل آمن للتطبيق التدريجي)

**مقال جديد:** "النسخ الاحتياطية غير القابلة للتعديل (Immutable Backups)" — ليه المهاجمين بيستهدفون النسخ الاحتياطية نفسها عمدًا، وإزاي القفل التقني على مستوى التخزين مختلف عن مجرد صلاحيات الوصول.

**العدد الحالي:** 103 مقال — 89 منهم فوق 1500 حرف (~86% من المحتوى، تحقق مباشر).

---

## دفعة اثنان وعشرون: 3 ترقيات + دليل TLS Handshake جديد

**3 مقالات اتترقّوا:**
- إدارة مفاتيح API: 743 → 2328 حرف (ليه مسح المفتاح من الكود مش كافٍ إطلاقًا بسبب طبيعة Git)
- إدارة التغيير في IT: 755 → 2154 حرف (نصيحة التطبيق التدريجي بدل التعقيد من أول يوم)
- التهديد الداخلي: 755 → 2451 حرف (فرّقناه عن مقال "بناء برنامج إدارة التهديد الداخلي" الأشمل بالتركيز على علامات الاكتشاف تحديدًا)

**مقال جديد:** "فهم TLS Handshake" — 5 خطوات بالتفصيل، ليه TLS 1.3 أسرع تقنيًا، وإزاي الفهم ده بيساعد في تشخيص مشاكل الشهادات.

**العدد الحالي:** 104 مقال — 93 منهم فوق 1500 حرف (~89% من المحتوى، تحقق مباشر). الباقي أساسًا 5 مقالات إخبارية قصيرة بالتصميم (أخبار أمنية عاجلة، مش أدلة).

---

## دفعة ثلاث وعشرون: 3 ترقيات + دليل Zero-Day جديد

**3 مقالات اتترقّوا:**
- BitLocker: 783 → (دور TPM بالتفصيل، ليه نسيان مفتاح الاستعادة كارثة حقيقية)
- تصنيف البيانات: 799 → (نظام 4 مستويات بالتفصيل، ليه التصنيف الشامل من أول يوم بيفشل المشروع)
- Task Scheduler: 768 → (ليه استخدام حساب المستخدم الشخصي أشهر سبب فشل صامت)

**مقال جديد:** "ثغرات يوم الصفر (Zero-Day)" — دورة الحياة الكاملة، ليه الحماية التقليدية عاجزة عن اكتشافها، و3 استراتيجيات دفاعية رغم استحالة المنع الكامل.

**العدد الحالي:** 105 مقال — 97 منهم فوق 1500 حرف (~92% من المحتوى). الباقي أساسًا مقالات إخبارية عاجلة (قصيرة بالتصميم).

---

## تنويع المجالات: 8 مقالات جديدة خارج cybersecurity

صاحب الموقع طلب تنويع المحتوى عبر باقي فئات الموقع (مش تركيز حصري على cybersecurity)، فحصت التوزيع الفعلي ولقيت: cybersecurity 84 مقال، windows 12، لكن mobile وai وtechnology وlaptops كانت شبه فاضية.

**8 مقالات جديدة عميقة عبر 5 فئات مختلفة:**
- **mobile (2):** إطالة عمر بطارية الهاتف، Wi-Fi مقابل بيانات الموبايل
- **ai (2):** كتابة طلبات فعّالة (Prompt Engineering)، كيف تعمل النماذج اللغوية الكبيرة (LLM)
- **technology (2):** كيف يعمل GPS فعليًا، كيف تعمل رموز QR
- **laptops (1):** اختيار لابتوب للمبرمجين
- **howto (1):** نظام تنظيم الملفات الرقمية

كل مقال بنفس معيار العمق المُتبع (شرح تقني حقيقي، أمثلة عملية، خلاصة واضحة) — مش محتوى سطحي "تعبئة" بس عشان الرقم.

**التوزيع الجديد:** cybersecurity 84، windows 12، howto 6، technology 4، ai 3، laptops 2، mobile 2.

**العدد الكلي:** 113 مقال — صفر أخطاء تحقق، صفر تكرار slugs.

---

## دفعة تنويع ثانية: 4 مقالات إضافية

- **howto:** مدير كلمات المرور المدمج مقابل المستقل
- **ai:** كيف يعمل توليد الصور بالذكاء الاصطناعي
- **technology:** كيف يعمل التخزين السحابي فعليًا
- **mobile:** iOS مقابل Android للاختيار

**التوزيع المحدّث:** cybersecurity 84، windows 12، howto 7، technology 5، ai 4، mobile 3، laptops 2.

**العدد الكلي:** 117 مقال — صفر أخطاء تحقق، صفر تكرار slugs.
