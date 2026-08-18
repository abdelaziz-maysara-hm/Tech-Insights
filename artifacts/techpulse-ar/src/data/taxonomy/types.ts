import type { BilingualText } from '../mockData';

/** Primary domain / area of the site (not a flat exclusive category). */
export type DomainId =
  | 'cybersecurity'
  | 'networking'
  | 'infrastructure'
  | 'troubleshooting'
  | 'tools'
  | 'vendors'
  | 'comparisons'
  | 'guides';

/** Content type is independent of domain/topic. */
export type ContentTypeId =
  | 'troubleshooting'
  | 'guide'
  | 'how-to'
  | 'comparison'
  | 'reference'
  | 'concept';

export interface TaxonomyLabel {
  id: string;
  label: BilingualText;
  shortLabel?: BilingualText;
  description?: BilingualText;
}

export interface DomainDef extends TaxonomyLabel {
  id: DomainId;
  navOrder: number;
  showInPrimaryNav: boolean;
  route: string;
}

export interface TopicDef extends TaxonomyLabel {
  domainId: DomainId;
}

export interface ContentTypeDef extends TaxonomyLabel {
  id: ContentTypeId;
}

export interface ProductDef {
  id: string;
  vendorId: string;
  label: BilingualText;
  aliases?: string[];
}

export interface VendorDef {
  id: string;
  label: BilingualText;
  shortLabel?: BilingualText;
  description?: BilingualText;
  products: ProductDef[];
  matchKeywords: string[];
}

export interface ContentDimensions {
  domainIds?: DomainId[];
  topicIds?: string[];
  contentType?: ContentTypeId;
  vendorIds?: string[];
  productIds?: string[];
}
