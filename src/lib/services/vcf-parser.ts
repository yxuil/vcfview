import { inflate } from 'fflate';
import type { VCFData, VCFRecord, VCFHeader } from '../types/vcf';
import { loading, error, progress } from '../stores/data-store';

export class VCFParser {
  private worker: Worker | null = null;
  
  constructor() {
    // Initialize web worker for background processing
    this.initWorker();
  }
  
  private initWorker() {
    // For now, we'll do main thread processing
    // TODO: Implement web worker for large files
  }
  
  async parseFile(file: File): Promise<VCFData> {
    loading.set(true);
    error.set(null);
    progress.set(0);
    
    try {
      let content: string;
      
      if (file.name.endsWith('.gz')) {
        content = await this.parseGzippedFile(file);
      } else {
        content = await this.parseTextFile(file);
      }
      
      progress.set(50);
      
      const vcfData = await this.parseVCFContent(content);
      
      progress.set(100);
      loading.set(false);
      
      return vcfData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      error.set(`Failed to parse VCF file: ${errorMessage}`);
      loading.set(false);
      throw err;
    }
  }
  
  async parseURL(url: string): Promise<VCFData> {
    loading.set(true);
    error.set(null);
    progress.set(0);
    
    try {
      const content = await this.fetchFromURL(url);
      
      progress.set(50);
      
      const vcfData = await this.parseVCFContent(content);
      
      progress.set(100);
      loading.set(false);
      
      return vcfData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      error.set(`Failed to load VCF from URL: ${errorMessage}`);
      loading.set(false);
      throw err;
    }
  }
  
  private async parseTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsText(file);
    });
  }
  
  private async parseGzippedFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          try {
            const compressed = new Uint8Array(e.target.result as ArrayBuffer);
            const decompressed = inflate(compressed, (err, data) => {
              if (err) {
                reject(new Error('Failed to decompress file'));
              } else {
                const content = new TextDecoder().decode(data);
                resolve(content);
              }
            });
          } catch (err) {
            reject(new Error('Failed to decompress file'));
          }
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsArrayBuffer(file);
    });
  }
  
  private async fetchFromURL(url: string): Promise<string> {
    try {
      progress.set(10);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain, application/octet-stream, */*'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      progress.set(30);
      
      const contentType = response.headers.get('content-type') || '';
      const isGzipped = url.endsWith('.gz') || contentType.includes('gzip') || contentType.includes('x-gzip');
      
      if (isGzipped) {
        // Handle gzipped content
        const arrayBuffer = await response.arrayBuffer();
        progress.set(40);
        
        return new Promise((resolve, reject) => {
          try {
            const compressed = new Uint8Array(arrayBuffer);
            const decompressed = inflate(compressed, (err, data) => {
              if (err) {
                reject(new Error('Failed to decompress file from URL'));
              } else {
                const content = new TextDecoder().decode(data);
                resolve(content);
              }
            });
          } catch (err) {
            reject(new Error('Failed to decompress file from URL'));
          }
        });
      } else {
        // Handle plain text content
        const content = await response.text();
        progress.set(40);
        return content;
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('CORS')) {
          throw new Error('CORS error: The server does not allow cross-origin requests. Try downloading the file and uploading it instead.');
        } else if (err.message.includes('Failed to fetch')) {
          throw new Error('Network error: Unable to fetch the file. Please check the URL and your internet connection.');
        } else {
          throw err;
        }
      } else {
        throw new Error('Unknown error occurred while fetching URL');
      }
    }
  }
  
  private async parseVCFContent(content: string): Promise<VCFData> {
    const lines = content.split('\n');
    
    // Parse header
    const header = this.parseHeader(lines);
    
    // Parse records
    const records: VCFRecord[] = [];
    let recordCount = 0;
    
    for (const line of lines) {
      if (line.startsWith('#') || !line.trim()) continue;
      
      try {
        const record = this.parseRecord(line, header);
        records.push(record);
        recordCount++;
        
        // Update progress periodically
        if (recordCount % 1000 === 0) {
          progress.set(50 + (recordCount / lines.length) * 50);
          // Allow UI to update
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      } catch (err) {
        console.warn(`Skipping malformed record: ${line}`, err);
      }
    }
    
    return { header, records };
  }
  
  private parseHeader(lines: string[]): VCFHeader {
    const header: VCFHeader = {
      fileformat: 'VCFv4.2',
      INFO: {},
      FORMAT: {},
      samples: [],
      contigs: {},
      meta: {}
    };
    
    for (const line of lines) {
      if (!line.startsWith('#')) break;
      
      if (line.startsWith('##fileformat=')) {
        header.fileformat = line.substring(13);
      } else if (line.startsWith('##INFO=')) {
        const match = line.match(/##INFO=<ID=([^,]+),[^>]*Description="([^"]+)"/);
        if (match) {
          header.INFO[match[1]] = match[2];
        }
      } else if (line.startsWith('##FORMAT=')) {
        const match = line.match(/##FORMAT=<ID=([^,]+),[^>]*Description="([^"]+)"/);
        if (match) {
          header.FORMAT[match[1]] = match[2];
        }
      } else if (line.startsWith('#CHROM')) {
        const fields = line.split('\t');
        if (fields.length > 9) {
          header.samples = fields.slice(9);
        }
      }
    }
    
    return header;
  }
  
  private parseRecord(line: string, header: VCFHeader): VCFRecord {
    const fields = line.split('\t');
    
    if (fields.length < 8) {
      throw new Error('Invalid VCF record: insufficient fields');
    }
    
    const record: VCFRecord = {
      CHROM: fields[0],
      POS: parseInt(fields[1]),
      ID: fields[2] === '.' ? '' : fields[2],
      REF: fields[3],
      ALT: fields[4] === '.' ? [] : fields[4].split(','),
      QUAL: fields[5] === '.' ? null : parseFloat(fields[5]),
      FILTER: fields[6] === '.' ? [] : fields[6].split(';'),
      INFO: this.parseInfo(fields[7])
    };
    
    // Parse FORMAT and sample data if present
    if (fields.length > 8 && fields[8] && header.samples.length > 0) {
      record.FORMAT = fields[8].split(':');
      record.samples = [];
      
      for (let i = 9; i < fields.length; i++) {
        const sampleData = fields[i].split(':');
        const sampleRecord: Record<string, any> = {};
        
        record.FORMAT.forEach((format, index) => {
          sampleRecord[format] = sampleData[index] || '.';
        });
        
        record.samples.push(sampleRecord);
      }
    }
    
    return record;
  }
  
  private parseInfo(infoString: string): Record<string, any> {
    if (infoString === '.') return {};
    
    const info: Record<string, any> = {};
    const pairs = infoString.split(';');
    
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (value === undefined) {
        info[key] = true; // Flag
      } else {
        // Try to parse as number, otherwise keep as string
        const numValue = parseFloat(value);
        info[key] = isNaN(numValue) ? value : numValue;
      }
    }
    
    return info;
  }
  
  validateVCFFile(file: File): boolean {
    const validExtensions = ['.vcf', '.vcf.gz'];
    return validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  }
  
  validateVCFURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const validProtocols = ['http:', 'https:'];
      const validExtensions = ['.vcf', '.vcf.gz'];
      
      // Check protocol
      if (!validProtocols.includes(urlObj.protocol)) {
        return false;
      }
      
      // Check file extension
      const pathname = urlObj.pathname.toLowerCase();
      return validExtensions.some(ext => pathname.endsWith(ext));
    } catch {
      return false;
    }
  }
  
  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}