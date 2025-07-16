<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Grid, GridApi, ColumnApi, type GridOptions } from 'ag-grid-community';
  import { vcfData, filteredRecords, loading } from '../stores/data-store';
  import type { VCFRecord } from '../types/vcf';
  
  let gridContainer: HTMLElement;
  let gridApi: GridApi;
  let columnApi: ColumnApi;
  
  $: records = $filteredRecords;
  $: if (gridApi && records) {
    updateGridData(records);
  }
  
  function updateGridData(data: VCFRecord[]) {
    if (!gridApi) return;
    
    const rowData = data.map(record => {
      const row: any = {
        CHROM: record.CHROM,
        POS: record.POS,
        ID: record.ID,
        REF: record.REF,
        ALT: Array.isArray(record.ALT) ? record.ALT.join(',') : record.ALT,
        QUAL: record.QUAL,
        FILTER: Array.isArray(record.FILTER) ? record.FILTER.join(';') : record.FILTER
      };
      
      // Add INFO fields
      if (record.INFO) {
        Object.entries(record.INFO).forEach(([key, value]) => {
          row[`INFO_${key}`] = value;
        });
      }
      
      // Add sample data
      if (record.samples && record.FORMAT) {
        record.samples.forEach((sample, index) => {
          record.FORMAT!.forEach(format => {
            row[`SAMPLE_${index}_${format}`] = sample[format];
          });
        });
      }
      
      return row;
    });
    
    gridApi.setRowData(rowData);
  }
  
  function createColumnDefs() {
    if (!$vcfData) return [];
    
    const baseColumns = [
      {
        headerName: 'Chromosome',
        field: 'CHROM',
        width: 120,
        pinned: 'left',
        sortable: true,
        filter: 'agTextColumnFilter',
        resizable: true
      },
      {
        headerName: 'Position',
        field: 'POS',
        width: 110,
        pinned: 'left',
        sortable: true,
        filter: 'agNumberColumnFilter',
        resizable: true,
        cellRenderer: (params: any) => {
          return params.value ? params.value.toLocaleString() : '';
        }
      },
      {
        headerName: 'ID',
        field: 'ID',
        width: 120,
        sortable: true,
        filter: 'agTextColumnFilter',
        resizable: true
      },
      {
        headerName: 'Reference',
        field: 'REF',
        width: 100,
        sortable: true,
        filter: 'agTextColumnFilter',
        resizable: true
      },
      {
        headerName: 'Alternative',
        field: 'ALT',
        width: 120,
        sortable: true,
        filter: 'agTextColumnFilter',
        resizable: true
      },
      {
        headerName: 'Quality',
        field: 'QUAL',
        width: 100,
        sortable: true,
        filter: 'agNumberColumnFilter',
        resizable: true
      },
      {
        headerName: 'Filter',
        field: 'FILTER',
        width: 100,
        sortable: true,
        filter: 'agTextColumnFilter',
        resizable: true
      }
    ];
    
    // Add INFO columns
    const infoColumns = Object.keys($vcfData.header.INFO).map(key => ({
      headerName: key,
      field: `INFO_${key}`,
      width: 100,
      sortable: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      headerTooltip: $vcfData!.header.INFO[key]
    }));
    
    // Add sample columns
    const sampleColumns: any[] = [];
    if ($vcfData.header.samples.length > 0) {
      $vcfData.header.samples.forEach((sample, index) => {
        Object.keys($vcfData!.header.FORMAT).forEach(format => {
          sampleColumns.push({
            headerName: `${sample}_${format}`,
            field: `SAMPLE_${index}_${format}`,
            width: 100,
            sortable: true,
            filter: 'agTextColumnFilter',
            resizable: true,
            headerTooltip: `${sample} - ${$vcfData!.header.FORMAT[format]}`
          });
        });
      });
    }
    
    return [...baseColumns, ...infoColumns, ...sampleColumns];
  }
  
  function initializeGrid() {
    if (!gridContainer) return;
    
    const gridOptions: GridOptions = {
      columnDefs: createColumnDefs(),
      rowData: [],
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        minWidth: 80
      },
      animateRows: true,
      enableRangeSelection: true,
      enableCellTextSelection: true,
      suppressMenuHide: true,
      rowSelection: 'multiple',
      suppressRowClickSelection: true,
      pagination: true,
      paginationPageSize: 100,
      onGridReady: (params) => {
        gridApi = params.api;
        columnApi = params.columnApi;
        
        // Auto-size columns on initial load
        params.api.sizeColumnsToFit();
        
        // Update with current data
        if (records) {
          updateGridData(records);
        }
      },
      onFirstDataRendered: (params) => {
        params.api.sizeColumnsToFit();
      }
    };
    
    new Grid(gridContainer, gridOptions);
  }
  
  onMount(() => {
    initializeGrid();
  });
  
  onDestroy(() => {
    if (gridApi) {
      gridApi.destroy();
    }
  });
  
  // Reactive update when data changes
  $: if ($vcfData && gridApi) {
    // Update column definitions when data changes
    const newColumnDefs = createColumnDefs();
    gridApi.setColumnDefs(newColumnDefs);
    updateGridData(records);
  }
  
  export function exportData() {
    if (gridApi) {
      return gridApi.getSelectedRows();
    }
    return [];
  }
  
  export function selectAll() {
    if (gridApi) {
      gridApi.selectAll();
    }
  }
  
  export function deselectAll() {
    if (gridApi) {
      gridApi.deselectAll();
    }
  }
  
  export function autoSizeColumns() {
    if (columnApi) {
      columnApi.autoSizeAllColumns();
    }
  }
</script>

<div class="w-full h-full">
  {#if $loading}
    <div class="flex items-center justify-center h-64">
      <div class="flex items-center space-x-2">
        <div class="spinner"></div>
        <span class="text-gray-600">Loading data...</span>
      </div>
    </div>
  {:else if !$vcfData}
    <div class="flex items-center justify-center h-64">
      <div class="text-center">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No data loaded</h3>
        <p class="text-gray-500">Upload a VCF file to view the data</p>
      </div>
    </div>
  {:else}
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <!-- Grid Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center space-x-4">
          <h3 class="text-lg font-semibold text-gray-900">VCF Data</h3>
          <div class="text-sm text-gray-500">
            {records.length} records | {$vcfData.header.samples.length} samples
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            on:click={selectAll}
            class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Select All
          </button>
          <button
            on:click={deselectAll}
            class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Deselect All
          </button>
          <button
            on:click={autoSizeColumns}
            class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Auto-size Columns
          </button>
        </div>
      </div>
      
      <!-- Grid Container -->
      <div 
        bind:this={gridContainer}
        class="ag-theme-alpine h-full"
        style="height: calc(100% - 65px);"
      ></div>
    </div>
  {/if}
</div>

<style>
  :global(.ag-theme-alpine) {
    --ag-header-height: 40px;
    --ag-row-height: 32px;
    --ag-font-size: 12px;
    --ag-font-family: system-ui, -apple-system, sans-serif;
    --ag-header-background-color: #f8fafc;
    --ag-header-cell-hover-background-color: #e2e8f0;
    --ag-row-hover-color: #f1f5f9;
    --ag-selected-row-background-color: #dbeafe;
  }
  
  :global(.ag-theme-alpine .ag-header-cell) {
    font-weight: 600;
    color: #374151;
  }
  
  :global(.ag-theme-alpine .ag-cell) {
    border-right: 1px solid #e5e7eb;
  }
  
  :global(.ag-theme-alpine .ag-pinned-left-cols-container) {
    border-right: 2px solid #d1d5db;
  }
</style>