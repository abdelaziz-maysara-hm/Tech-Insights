/**
 * Content catalogs for related-link scoring. Import only from content pages
 * (not Home / Navbar) so the comparisons catalog stays off the home LCP path.
 */
import articlesIndex from '@/content/articles-index.json';
import comparisonsJson from '@/content/comparisons.json';
import alternativesJson from '@/content/alternatives.json';
import { libraryPlaylists, libraryVideos } from '@/data/videoLibrary';
import { VENDORS } from '@/data/taxonomy';
import { allDesktopTools } from '@/lib/toolAnchors';
import type { RelatedCatalogs } from '@/lib/relatedContent';

export function siteCatalogs(): RelatedCatalogs {
  return {
    articles: articlesIndex as RelatedCatalogs['articles'],
    comparisons: comparisonsJson as RelatedCatalogs['comparisons'],
    videos: libraryVideos as unknown as RelatedCatalogs['videos'],
    playlists: libraryPlaylists as unknown as RelatedCatalogs['playlists'],
    alternatives: alternativesJson as RelatedCatalogs['alternatives'],
    tools: allDesktopTools(),
    vendors: VENDORS.map((v) => ({ id: v.id, label: v.label })),
  };
}
