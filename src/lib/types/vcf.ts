export interface VCFRecord {
  CHROM: string;
  POS: number;
  ID: string;
  REF: string;
  ALT: string[];
  QUAL: number | null;
  FILTER: string[];
  INFO: Record<string, any>;
  FORMAT?: string[];
  samples?: Record<string, any>[];
}

export interface VCFHeader {
  fileformat: string;
  INFO: Record<string, any>;
  FORMAT: Record<string, any>;
  samples: string[];
  contigs: Record<string, any>;
  meta: Record<string, any>;
}

export interface VCFData {
  header: VCFHeader;
  records: VCFRecord[];
}

export interface FilterState {
  [key: string]: {
    type: 'text' | 'number' | 'select' | 'range';
    value: any;
    operator?: 'contains' | 'equals' | 'gt' | 'lt' | 'gte' | 'lte' | 'in';
  };
}

export interface SortState {
  column: string;
  direction: 'asc' | 'desc';
  priority: number;
}

export interface ExportFormat {
  type: 'vcf' | 'csv' | 'json';
  filename: string;
  includeHeader: boolean;
  selectedColumns?: string[];
}