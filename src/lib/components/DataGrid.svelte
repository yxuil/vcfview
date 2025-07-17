<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Grid, type GridOptions } from 'ag-grid-community';
  import { vcfData, filteredRecords, loading } from '../stores/data-store';
  import type { VCFRecord } from '../types/vcf';
  
  let gridContainer: HTMLElement;
  let gridApi: any;
  let columnApi: any;
  let showExpandedInfo = false;
  let showExpandedSamples = false;
  
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
        if (showExpandedInfo) {
          // Expanded: separate columns for each INFO field
          Object.entries(record.INFO).forEach(([key, value]) => {
            row[`INFO_${key}`] = value;
          });
        } else {
          // Collapsed: single INFO column with original VCF format
          const infoString = Object.entries(record.INFO)
            .map(([key, value]) => value === true ? key : `${key}=${value}`)
            .join(';');
          row['INFO'] = infoString;
        }
      }
      
      // Add sample data
      if (record.samples && record.FORMAT) {
        if (showExpandedSamples) {
          // Expanded: separate columns for each sample and format
          record.samples.forEach((sample, index) => {
            record.FORMAT!.forEach(format => {
              row[`SAMPLE_${index}_${format}`] = sample[format];
            });
          });
        } else {
          // Collapsed: single column per sample with original VCF format
          record.samples.forEach((sample, index) => {
            const sampleString = record.FORMAT!
              .map(format => sample[format] || '.')
              .join(':');
            row[`SAMPLE_${index}`] = sampleString;
          });
        }
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
        width: 100,
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
        width: 80,
        sortable: true,
        filter: 'agTextColumnFilter',
        resizable: true
      },
      {
        headerName: 'Reference',
        field: 'REF',
        width: 80,
        sortable: true,
        filter: 'agTextColumnFilter',
        resizable: true
      },
      {
        headerName: 'Alternative',
        field: 'ALT',
        width: 80,
        sortable: true,
        filter: 'agTextColumnFilter',
        resizable: true
      },
      {
        headerName: 'Quality',
        field: 'QUAL',
        width: 80,
        sortable: true,
        filter: 'agNumberColumnFilter',
        resizable: true
      },
      {
        headerName: 'Filter',
        field: 'FILTER',
        width: 80,
        sortable: true,
        filter: 'agTextColumnFilter',
        resizable: true
      }
    ];
    
    // Add INFO columns with hierarchical grouping
    const infoColumns = showExpandedInfo 
      ? {
          headerName: 'INFO',
          headerClass: 'info-group-header',
          headerGroupComponent: InfoHeaderComponent(),
          children: Object.keys($vcfData.header.INFO).map(key => ({
            headerName: key,
            field: `INFO_${key}`,
            width: 80,
            sortable: true,
            filter: 'agTextColumnFilter',
            resizable: true,
            headerTooltip: $vcfData!.header.INFO[key]
          })),
          headerGroupComponentParams: {
            showExpandedInfo: showExpandedInfo,
            toggleFunction: toggleInfoColumns,
            timestamp: Date.now()
          }
        }
      : {
          headerName: 'INFO',
          field: 'INFO',
          width: 200,
          sortable: true,
          filter: 'agTextColumnFilter',
          resizable: true,
          headerTooltip: 'INFO fields in original VCF format (click to expand)',
          headerClass: 'info-header-collapsed',
          headerComponent: InfoHeaderComponent(),
          headerComponentParams: {
            showExpandedInfo: showExpandedInfo,
            toggleFunction: toggleInfoColumns,
            timestamp: Date.now()
          }
        };
    
    // Add sample columns with hierarchical grouping
    const sampleColumns: any[] = [];
    if ($vcfData.header.samples.length > 0) {
      $vcfData.header.samples.forEach((sample, index) => {
        if (showExpandedSamples) {
          // Expanded: hierarchical grouping with sample as parent
          sampleColumns.push({
            headerName: sample,
            headerClass: 'sample-group-header',
            headerGroupComponent: SampleHeaderComponent(),
            children: Object.keys($vcfData!.header.FORMAT).map(format => ({
              headerName: format,
              field: `SAMPLE_${index}_${format}`,
              width: 80,
              sortable: true,
              filter: 'agTextColumnFilter',
              resizable: true,
              headerTooltip: `${sample} - ${format}: ${$vcfData!.header.FORMAT[format]}`
            })),
            headerGroupComponentParams: {
              showExpandedSamples: showExpandedSamples,
              toggleFunction: toggleSampleColumns,
              sampleName: sample,
              timestamp: Date.now()
            }
          });
        } else {
          // Collapsed: single column per sample
          sampleColumns.push({
            headerName: sample,
            field: `SAMPLE_${index}`,
            width: 120,
            sortable: true,
            filter: 'agTextColumnFilter',
            resizable: true,
            headerTooltip: `${sample} - Format: ${$vcfData!.header.FORMAT ? Object.keys($vcfData!.header.FORMAT).join(':') : ''} (click to expand)`,
            headerClass: 'sample-header-collapsed',
            headerComponent: SampleHeaderComponent(),
            headerComponentParams: {
              showExpandedSamples: showExpandedSamples,
              toggleFunction: toggleSampleColumns,
              sampleName: sample,
              timestamp: Date.now()
            }
          });
        }
      });
    }
    
    // Return all columns with INFO as grouped or single column
    return [...baseColumns, infoColumns, ...sampleColumns];
  }
  
  function initializeGrid() {
    if (!gridContainer) return;
    
    const gridOptions: GridOptions = {
      columnDefs: createColumnDefs(),
      rowData: [],
      defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true
      },
      onGridReady: (params) => {
        gridApi = params.api;
        columnApi = params.columnApi;
        
        // Update with current data
        if (records) {
          updateGridData(records);
        }
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
    updateGridColumns();
  }
  
  // Reactive update when INFO expansion state changes
  $: if (gridApi && showExpandedInfo !== undefined) {
    updateGridColumns();
  }
  
  // Reactive update when sample expansion state changes
  $: if (gridApi && showExpandedSamples !== undefined) {
    updateGridColumns();
  }
  
  function updateGridColumns() {
    if (!gridApi) return;
    
    const newColumnDefs = createColumnDefs();
    gridApi.setColumnDefs(newColumnDefs);
    updateGridData(records);
    
    // Force refresh of all headers after a short delay
    setTimeout(() => {
      if (gridApi) {
        gridApi.refreshHeader();
      }
    }, 10);
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
    if (gridApi) {
      // Use sizeColumnsToFit which is the most reliable method
      gridApi.sizeColumnsToFit();
    }
  }
  
  function toggleInfoColumns() {
    showExpandedInfo = !showExpandedInfo;
  }
  
  function toggleSampleColumns() {
    showExpandedSamples = !showExpandedSamples;
  }
  
  // Custom header component for INFO column
  function InfoHeaderComponent() {
    return class {
      private eGui!: HTMLElement;
      private iconElement!: HTMLElement;
      private params!: any;
      
      init(params: any) {
        this.params = params;
        this.eGui = document.createElement('div');
        this.eGui.style.display = 'flex';
        this.eGui.style.alignItems = 'center';
        this.eGui.style.gap = '8px';
        this.eGui.style.cursor = 'pointer';
        this.eGui.style.padding = '0 8px';
        this.eGui.style.height = '100%';
        
        this.iconElement = document.createElement('span');
        this.iconElement.innerHTML = params.showExpandedInfo ? '▼' : '▶';
        this.iconElement.style.fontSize = '12px';
        this.iconElement.style.color = '#666';
        
        const text = document.createElement('span');
        text.innerHTML = params.displayName || 'INFO';
        text.style.fontWeight = '600';
        
        this.eGui.appendChild(this.iconElement);
        this.eGui.appendChild(text);
        
        this.eGui.addEventListener('click', () => {
          if (params.toggleFunction) {
            params.toggleFunction();
          }
        });
      }
      
      refresh(params: any) {
        this.params = params;
        if (this.iconElement) {
          this.iconElement.innerHTML = params.showExpandedInfo ? '▼' : '▶';
        }
        return true;
      }
      
      getGui() {
        return this.eGui;
      }
      
      destroy() {
        if (this.eGui && this.eGui.parentElement) {
          this.eGui.parentElement.removeChild(this.eGui);
        }
      }
    };
  }
  
  // Custom header component for Sample columns
  function SampleHeaderComponent() {
    return class {
      private eGui!: HTMLElement;
      private iconElement!: HTMLElement;
      private params!: any;
      
      init(params: any) {
        this.params = params;
        this.eGui = document.createElement('div');
        this.eGui.style.display = 'flex';
        this.eGui.style.alignItems = 'center';
        this.eGui.style.gap = '8px';
        this.eGui.style.cursor = 'pointer';
        this.eGui.style.padding = '0 8px';
        this.eGui.style.height = '100%';
        
        this.iconElement = document.createElement('span');
        this.iconElement.innerHTML = params.showExpandedSamples ? '▼' : '▶';
        this.iconElement.style.fontSize = '12px';
        this.iconElement.style.color = '#666';
        
        const text = document.createElement('span');
        text.innerHTML = params.displayName || params.sampleName;
        text.style.fontWeight = '600';
        
        this.eGui.appendChild(this.iconElement);
        this.eGui.appendChild(text);
        
        this.eGui.addEventListener('click', () => {
          if (params.toggleFunction) {
            params.toggleFunction();
          }
        });
      }
      
      refresh(params: any) {
        this.params = params;
        if (this.iconElement) {
          this.iconElement.innerHTML = params.showExpandedSamples ? '▼' : '▶';
        }
        return true;
      }
      
      getGui() {
        return this.eGui;
      }
      
      destroy() {
        if (this.eGui && this.eGui.parentElement) {
          this.eGui.parentElement.removeChild(this.eGui);
        }
      }
    };
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
          <a
            href="https://github.com/yxuil/vcfview/blob/main/README.md#usage"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            title="View usage documentation"
          >
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Help
          </a>
        </div>
      </div>
      
      <!-- Grid Container -->
      <div 
        bind:this={gridContainer}
        class="ag-theme-alpine"
        style="height: calc(100% - 65px); width: 100%; min-height: 400px;"
      ></div>
    </div>
  {/if}
</div>

