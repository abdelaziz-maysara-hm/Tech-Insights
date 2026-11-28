import assert from 'node:assert/strict';
import test from 'node:test';
import { inferTopicIds, indexableTopicIds, knownTopicId } from '../src/lib/topicContent.ts';
import { getAdjacentLoop, getRelatedArticles, getRelatedGraph } from '../src/lib/relatedContent.ts';

test('maps informal playlist topics to taxonomy ids', () => {
  assert.equal(knownTopicId('siem'), 'siem-soc');
  assert.equal(knownTopicId('wifi'), 'wireless');
  assert.equal(knownTopicId('tls'), 'pki-certificates');
  assert.deepEqual(inferTopicIds({ topics: ['firewalls', 'vpn'] }).sort(), ['firewalls', 'vpn']);
});

test('infers topics from comparison slugs when topicIds are missing', () => {
  const ids = inferTopicIds({ slug: 'palo-alto-ngfw-vs-fortinet-fortigate', title: { en: 'Palo Alto vs FortiGate', ar: '' } });
  assert.ok(ids.includes('firewalls'), ids);
});

test('indexable topic hubs include article topics and skip unused ones', () => {
  const ids = indexableTopicIds({
    articles: [{ slug: 'a', topicIds: ['firewalls'] }, { slug: 'b', topicIds: ['linux'] }],
    comparisons: [],
    playlists: [],
    alternatives: [],
  });
  assert.ok(ids.includes('firewalls'));
  assert.ok(ids.includes('linux'));
  assert.ok(!ids.includes('storage'));
});

test('adjacent loop wraps so every item has two neighbours when n>=3', () => {
  const items = ['a', 'b', 'c'].map((slug) => ({ slug }));
  const first = getAdjacentLoop(items[0], items);
  assert.equal(first.previous.slug, 'c');
  assert.equal(first.next.slug, 'b');
  const last = getAdjacentLoop(items[2], items);
  assert.equal(last.previous.slug, 'b');
  assert.equal(last.next.slug, 'a');
});

test('related graph links a FortiGate article to firewalls topic, vendor and debug flow peers', () => {
  const groups = getRelatedGraph(
    {
      slug: 'fortigate-initial-setup-enterprise-guide',
      tags: ['fortigate', 'firewall'],
      topicIds: ['firewalls'],
      title: { ar: 'إعداد FortiGate', en: 'FortiGate setup' },
    },
    {
      articles: [
        {
          slug: 'fortigate-debug-flow-troubleshooting',
          tags: ['fortigate', 'debug-flow'],
          topicIds: ['firewalls'],
          title: { ar: 'تتبع التدفق', en: 'Debug flow' },
        },
        { slug: 'unrelated-cloud', tags: ['aws'], topicIds: ['cloud'], title: { ar: 'سحابة', en: 'Cloud' } },
      ],
      comparisons: [
        { slug: 'palo-alto-ngfw-vs-fortinet-fortigate', title: { ar: 'مقارنة', en: 'Palo Alto vs FortiGate' } },
      ],
      alternatives: [{ slug: 'fortigate-alternatives', vendor: 'fortinet', product: 'FortiGate', title: { ar: 'بدائل', en: 'FortiGate alternatives' } }],
      vendors: [{ id: 'fortinet', label: { ar: 'فورتينت', en: 'Fortinet' } }],
      tools: [],
      playlists: [{ slug: 'firewalls-vpn', topics: ['firewalls', 'vpn'], title: { ar: 'جدران نارية', en: 'Firewalls' }, relatedArticles: ['fortigate-initial-setup-enterprise-guide'] }],
    },
    3,
  );
  assert.ok(groups.articles.some((l) => l.slug === 'fortigate-debug-flow-troubleshooting'));
  assert.ok(groups.topics.some((l) => l.href === '/topic/firewalls'));
  assert.ok(groups.comparisons.some((l) => l.slug === 'palo-alto-ngfw-vs-fortinet-fortigate'));
  assert.ok(groups.alternatives.some((l) => l.slug === 'fortigate-alternatives'));
  assert.ok(groups.playlists.some((l) => l.slug === 'firewalls-vpn'));
});

test('getRelatedArticles still returns topical neighbours', () => {
  const related = getRelatedArticles(
    { slug: 'a', tags: ['vpn'], categoryId: 'cybersecurity', date: '2026-01-01' },
    [
      { slug: 'a', tags: ['vpn'], categoryId: 'cybersecurity', date: '2026-01-01' },
      { slug: 'b', tags: ['vpn'], categoryId: 'cybersecurity', date: '2026-02-01' },
      { slug: 'c', tags: ['email'], categoryId: 'cybersecurity', date: '2026-03-01' },
    ],
    3,
  );
  assert.equal(related[0].slug, 'b');
});
