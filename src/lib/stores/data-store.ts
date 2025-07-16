import { writable, derived } from 'svelte/store';
import type { VCFData, VCFRecord, FilterState, SortState } from '../types/vcf';

// Core data store
export const vcfData = writable<VCFData | null>(null);
export const loading = writable<boolean>(false);
export const error = writable<string | null>(null);
export const progress = writable<number>(0);

// Filter and sort state
export const filterState = writable<FilterState>({});
export const sortState = writable<SortState[]>([]);
export const searchTerm = writable<string>('');

// Derived stores for processed data
export const filteredRecords = derived(
  [vcfData, filterState, sortState, searchTerm],
  ([$vcfData, $filterState, $sortState, $searchTerm]) => {
    if (!$vcfData) return [];
    
    let records = $vcfData.records;
    
    // Apply search filter
    if ($searchTerm) {
      const term = $searchTerm.toLowerCase();
      records = records.filter(record => 
        Object.values(record).some(value => 
          String(value).toLowerCase().includes(term)
        )
      );
    }
    
    // Apply column filters
    Object.entries($filterState).forEach(([column, filter]) => {
      if (!filter.value) return;
      
      records = records.filter(record => {
        const value = (record as any)[column];
        
        switch (filter.type) {
          case 'text':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'number':
            const numValue = Number(value);
            const filterValue = Number(filter.value);
            switch (filter.operator) {
              case 'gt': return numValue > filterValue;
              case 'lt': return numValue < filterValue;
              case 'gte': return numValue >= filterValue;
              case 'lte': return numValue <= filterValue;
              case 'equals': return numValue === filterValue;
              default: return true;
            }
          case 'select':
            return Array.isArray(filter.value) ? 
              filter.value.includes(value) : 
              value === filter.value;
          default:
            return true;
        }
      });
    });
    
    // Apply sorting
    if ($sortState.length > 0) {
      records.sort((a, b) => {
        for (const sort of $sortState.sort((s1, s2) => s1.priority - s2.priority)) {
          const aVal = (a as any)[sort.column];
          const bVal = (b as any)[sort.column];
          
          let comparison = 0;
          if (aVal < bVal) comparison = -1;
          else if (aVal > bVal) comparison = 1;
          
          if (comparison !== 0) {
            return sort.direction === 'asc' ? comparison : -comparison;
          }
        }
        return 0;
      });
    }
    
    return records;
  }
);

// Column definitions derived from data
export const columns = derived(
  vcfData,
  ($vcfData) => {
    if (!$vcfData) return [];
    
    const baseColumns = [
      { field: 'CHROM', headerName: 'Chromosome', type: 'text' },
      { field: 'POS', headerName: 'Position', type: 'number' },
      { field: 'ID', headerName: 'ID', type: 'text' },
      { field: 'REF', headerName: 'Reference', type: 'text' },
      { field: 'ALT', headerName: 'Alternative', type: 'text' },
      { field: 'QUAL', headerName: 'Quality', type: 'number' },
      { field: 'FILTER', headerName: 'Filter', type: 'text' }
    ];
    
    // Add INFO field columns
    const infoColumns = Object.keys($vcfData.header.INFO).map(key => ({
      field: `INFO_${key}`,
      headerName: key,
      type: 'text'
    }));
    
    return [...baseColumns, ...infoColumns];
  }
);

// Utility functions
export function resetFilters() {
  filterState.set({});
  searchTerm.set('');
}

export function clearData() {
  vcfData.set(null);
  resetFilters();
  sortState.set([]);
  error.set(null);
}