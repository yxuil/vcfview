import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import type { VCFRecord, VCFHeader, ExportFormat } from '../types/vcf';

export class ExportService {
  static exportData(records: VCFRecord[], header: VCFHeader, format: ExportFormat) {
    switch (format.type) {
      case 'vcf':
        this.exportVCF(records, header, format);
        break;
      case 'csv':
        this.exportCSV(records, format);
        break;
      case 'json':
        this.exportJSON(records, format);
        break;
      default:
        throw new Error(`Unsupported export format: ${format.type}`);
    }
  }
  
  private static exportVCF(records: VCFRecord[], header: VCFHeader, format: ExportFormat) {
    let content = '';
    
    if (format.includeHeader) {
      // Add VCF header
      content += `##fileformat=${header.fileformat}\n`;
      
      // Add INFO headers
      Object.entries(header.INFO).forEach(([key, info]) => {
        content += `##INFO=<ID=${key},${info}>\n`;
      });
      
      // Add FORMAT headers
      Object.entries(header.FORMAT).forEach(([key, fmt]) => {
        content += `##FORMAT=<ID=${key},${fmt}>\n`;
      });
      
      // Add column header
      let columnHeader = '#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO';
      if (header.samples.length > 0) {
        columnHeader += '\tFORMAT\t' + header.samples.join('\t');
      }
      content += columnHeader + '\n';
    }
    
    // Add records
    records.forEach(record => {
      const line = [
        record.CHROM,
        record.POS,
        record.ID || '.',
        record.REF,
        record.ALT.length > 0 ? record.ALT.join(',') : '.',
        record.QUAL !== null ? record.QUAL : '.',
        record.FILTER.length > 0 ? record.FILTER.join(';') : '.',
        this.formatInfo(record.INFO)
      ];
      
      if (record.FORMAT && record.samples) {
        line.push(record.FORMAT.join(':'));
        record.samples.forEach(sample => {
          const sampleValues = record.FORMAT!.map(fmt => sample[fmt] || '.');
          line.push(sampleValues.join(':'));
        });
      }
      
      content += line.join('\t') + '\n';
    });
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, format.filename);
  }
  
  private static exportCSV(records: VCFRecord[], format: ExportFormat) {
    // Flatten the data for CSV export
    const flattenedData = records.map(record => {
      const row: Record<string, any> = {
        CHROM: record.CHROM,
        POS: record.POS,
        ID: record.ID,
        REF: record.REF,
        ALT: record.ALT.join(','),
        QUAL: record.QUAL,
        FILTER: record.FILTER.join(';')
      };
      
      // Add INFO fields
      Object.entries(record.INFO).forEach(([key, value]) => {
        row[`INFO_${key}`] = value;
      });
      
      // Add sample data if present
      if (record.samples && record.FORMAT) {
        record.samples.forEach((sample, index) => {
          record.FORMAT!.forEach(fmt => {
            row[`SAMPLE_${index}_${fmt}`] = sample[fmt];
          });
        });
      }
      
      return row;
    });
    
    // Filter columns if specified
    let filteredData = flattenedData;
    if (format.selectedColumns && format.selectedColumns.length > 0) {
      filteredData = flattenedData.map(row => {
        const filtered: Record<string, any> = {};
        format.selectedColumns!.forEach(col => {
          if (row[col] !== undefined) {
            filtered[col] = row[col];
          }
        });
        return filtered;
      });
    }
    
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, format.filename);
  }
  
  private static exportJSON(records: VCFRecord[], format: ExportFormat) {
    let data: any = records;
    
    if (format.selectedColumns && format.selectedColumns.length > 0) {
      data = records.map(record => {
        const filtered: Record<string, any> = {};
        format.selectedColumns!.forEach(col => {
          if ((record as any)[col] !== undefined) {
            filtered[col] = (record as any)[col];
          }
        });
        return filtered;
      });
    }
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    saveAs(blob, format.filename);
  }
  
  private static formatInfo(info: Record<string, any>): string {
    const pairs: string[] = [];
    
    Object.entries(info).forEach(([key, value]) => {
      if (value === true) {
        pairs.push(key);
      } else {
        pairs.push(`${key}=${value}`);
      }
    });
    
    return pairs.length > 0 ? pairs.join(';') : '.';
  }
  
  static getSupportedFormats(): ExportFormat['type'][] {
    return ['vcf', 'csv', 'json'];
  }
  
  static getDefaultFilename(format: ExportFormat['type']): string {
    const timestamp = new Date().toISOString().split('T')[0];
    return `vcf_export_${timestamp}.${format}`;
  }
}