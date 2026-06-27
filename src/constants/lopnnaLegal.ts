export type LopnnaLegalVariant =
  | 'identity'
  | 'registration'
  | 'timeline'
  | 'legalClosure'
  | 'compact';

export interface LopnnaLegalBlock {
  title: string;
  paragraphs: string[];
  articles?: string[];
}
