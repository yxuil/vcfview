<script lang="ts">
  import FileInput from '$lib/components/FileInput.svelte';
  import DataGrid from '$lib/components/DataGrid.svelte';
  import { vcfData, loading, error } from '$lib/stores/data-store';
  
  let dataGrid: DataGrid;
  let currentFile = '';
  let recordCount = 0;
  
  function handleFileLoaded(event: CustomEvent) {
    currentFile = event.detail.file;
    recordCount = event.detail.recordCount;
  }
  
  function clearData() {
    vcfData.set(null);
    currentFile = '';
    recordCount = 0;
  }
</script>

<svelte:head>
  <title>VCF Viewer</title>
  <meta name="description" content="A modern web application for viewing and analyzing VCF files" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">VCF Viewer</h1>
        </div>
        
        {#if $vcfData}
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              <span class="font-medium">{currentFile}</span> - {recordCount.toLocaleString()} records
            </div>
            <button
              on:click={clearData}
              class="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Clear Data
            </button>
          </div>
        {/if}
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 py-8">
    {#if !$vcfData}
      <!-- Welcome Section -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Analyze VCF Files in Your Browser
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload and explore genomic variant data with an intuitive, Excel-like interface. 
          No server required - everything runs locally in your browser.
        </p>
      </div>
      
      <!-- File Input -->
      <FileInput on:fileLoaded={handleFileLoaded} />
      
      <!-- Features Section -->
      <div class="mt-16">
        <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">Features</h3>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6 bg-white rounded-lg shadow-sm">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
            </div>
            <h4 class="text-lg font-semibold text-gray-900 mb-2">Advanced Filtering</h4>
            <p class="text-gray-600">Filter by any column with support for text, numeric, and range filters</p>
          </div>
          
          <div class="text-center p-6 bg-white rounded-lg shadow-sm">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h4 class="text-lg font-semibold text-gray-900 mb-2">Export Options</h4>
            <p class="text-gray-600">Export filtered data as VCF, CSV, or JSON formats</p>
          </div>
          
          <div class="text-center p-6 bg-white rounded-lg shadow-sm">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 class="text-lg font-semibold text-gray-900 mb-2">High Performance</h4>
            <p class="text-gray-600">Handle large datasets with smooth scrolling and fast interactions</p>
          </div>
        </div>
      </div>
      
      <!-- Project Reference Section -->
      <div class="mt-16 text-center">
        <div class="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
          <div class="flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
            </svg>
            <h4 class="text-lg font-semibold text-gray-900">Open Source Project</h4>
          </div>
          <p class="text-gray-600 mb-4">
            VCF Viewer is an open-source project. View the source code, contribute, or report issues on GitHub.
          </p>
          <a 
            href="https://github.com/yxuil/vcfview" 
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    {:else}
      <!-- Data Grid -->
      <div class="h-[calc(100vh-200px)] w-full">
        <DataGrid bind:this={dataGrid} />
      </div>
    {/if}
  </main>
</div>
