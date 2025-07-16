<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { VCFParser } from '../services/vcf-parser';
  import { loadSampleData } from '../services/sample-data';
  import { vcfData, loading, error, progress } from '../stores/data-store';
  
  const dispatch = createEventDispatcher();
  const parser = new VCFParser();
  
  let dragOver = false;
  let fileInput: HTMLInputElement;
  let urlInput = '';
  let inputMode: 'file' | 'url' = 'file';
  
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dragOver = true;
  }
  
  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
  }
  
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }
  
  function handleFileInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      handleFileSelect(target.files[0]);
    }
  }
  
  async function handleFileSelect(file: File) {
    if (!parser.validateVCFFile(file)) {
      error.set('Invalid file format. Please select a .vcf or .vcf.gz file.');
      return;
    }
    
    try {
      const data = await parser.parseFile(file);
      vcfData.set(data);
      dispatch('fileLoaded', { file: file.name, recordCount: data.records.length });
    } catch (err) {
      console.error('Error parsing file:', err);
    }
  }
  
  async function handleURLLoad() {
    if (!urlInput.trim()) {
      error.set('Please enter a URL');
      return;
    }
    
    if (!parser.validateVCFURL(urlInput.trim())) {
      error.set('Invalid URL format. Please enter a valid HTTP/HTTPS URL pointing to a .vcf or .vcf.gz file.');
      return;
    }
    
    try {
      const data = await parser.parseURL(urlInput.trim());
      vcfData.set(data);
      const filename = urlInput.split('/').pop() || 'remote-file.vcf';
      dispatch('fileLoaded', { file: filename, recordCount: data.records.length });
    } catch (err) {
      console.error('Error loading URL:', err);
    }
  }
  
  function switchInputMode(mode: 'file' | 'url') {
    inputMode = mode;
    error.set(null);
    urlInput = '';
  }
  
  async function loadSample() {
    try {
      loading.set(true);
      const data = await loadSampleData();
      vcfData.set(data);
      dispatch('fileLoaded', { file: 'sample-data.vcf', recordCount: data.records.length });
    } catch (err) {
      error.set('Failed to load sample data');
    } finally {
      loading.set(false);
    }
  }
  
  function openFileDialog() {
    fileInput.click();
  }
</script>

<div class="w-full max-w-2xl mx-auto p-6">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-2">Load VCF File</h2>
    <p class="text-gray-600">Upload a VCF file or load from URL to explore genomic variant data</p>
  </div>
  
  <!-- Input Mode Toggle -->
  <div class="flex rounded-lg bg-gray-100 p-1 mb-6 max-w-md mx-auto">
    <button
      on:click={() => switchInputMode('file')}
      class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 {inputMode === 'file' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
    >
      📁 Upload File
    </button>
    <button
      on:click={() => switchInputMode('url')}
      class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 {inputMode === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
    >
      🌐 Load from URL
    </button>
  </div>
  
  {#if inputMode === 'file'}
  <!-- File Drop Zone -->
  <div
    class="file-drop-zone rounded-lg p-8 text-center border-2 border-dashed transition-all duration-300 {dragOver ? 'drag-over' : 'border-gray-300'}"
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    role="button"
    tabindex="0"
    on:click={openFileDialog}
    on:keydown={(e) => e.key === 'Enter' && openFileDialog()}
  >
    <div class="flex flex-col items-center space-y-4">
      <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Drop your VCF file here</h3>
        <p class="text-sm text-gray-500 mt-1">or click to browse</p>
      </div>
      
      <div class="text-xs text-gray-400">
        Supports .vcf and .vcf.gz files up to 500MB
      </div>
    </div>
  </div>
  
  <!-- Hidden File Input -->
  <input
    bind:this={fileInput}
    type="file"
    accept=".vcf,.vcf.gz"
    on:change={handleFileInputChange}
    class="hidden"
    aria-label="Upload VCF file"
  />
  
  <!-- Action Buttons -->
  <div class="flex justify-center space-x-4 mt-6">
    <button
      on:click={openFileDialog}
      class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
      disabled={$loading}
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <span>Upload File</span>
    </button>
    
    <button
      on:click={loadSample}
      class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
      disabled={$loading}
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>Load Sample Data</span>
    </button>
  </div>
  
  {:else}
  <!-- URL Input Section -->
  <div class="space-y-4">
    <div class="flex flex-col space-y-2">
      <label for="url-input" class="text-sm font-medium text-gray-700">
        VCF File URL
      </label>
      <input
        id="url-input"
        bind:value={urlInput}
        type="url"
        placeholder="https://example.com/data.vcf or https://example.com/data.vcf.gz"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        disabled={$loading}
        on:keydown={(e) => e.key === 'Enter' && !$loading && handleURLLoad()}
      />
      <p class="text-xs text-gray-500">
        Enter a direct URL to a VCF file (.vcf or .vcf.gz). Note: The server must support CORS for cross-origin requests.
      </p>
    </div>
    
    <!-- URL Action Buttons -->
    <div class="flex justify-center space-x-4">
      <button
        on:click={handleURLLoad}
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        disabled={$loading || !urlInput.trim()}
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Load from URL</span>
      </button>
      
      <button
        on:click={loadSample}
        class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
        disabled={$loading}
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>Load Sample Data</span>
      </button>
    </div>
  </div>
  
  {/if}
  
  <!-- Progress Bar -->
  {#if $loading}
    <div class="mt-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">Processing file...</span>
        <span class="text-sm text-gray-500">{$progress}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="progress-bar bg-blue-600 h-2 rounded-full" 
          style="width: {$progress}%"
        ></div>
      </div>
    </div>
  {/if}
  
  <!-- Error Message -->
  {#if $error}
    <div class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span class="text-red-800 font-medium">Error</span>
      </div>
      <p class="text-red-700 mt-1">{$error}</p>
      <button
        on:click={() => error.set(null)}
        class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
      >
        Dismiss
      </button>
    </div>
  {/if}
</div>

<style>
  .file-drop-zone {
    cursor: pointer;
  }
  
  .file-drop-zone:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
  }
  
  .drag-over {
    border-color: #3b82f6 !important;
    background-color: #f0f9ff !important;
    transform: scale(1.02);
  }
</style>