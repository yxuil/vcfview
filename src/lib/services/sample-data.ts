import type { VCFData } from '../types/vcf';

export const sampleVCFData: VCFData = {
  header: {
    fileformat: 'VCFv4.2',
    INFO: {
      'AC': 'Allele count in genotypes',
      'AF': 'Allele frequency',
      'AN': 'Total number of alleles',
      'DP': 'Total read depth',
      'MQ': 'Root mean square mapping quality'
    },
    FORMAT: {
      'GT': 'Genotype',
      'DP': 'Read depth',
      'GQ': 'Genotype quality'
    },
    samples: ['SAMPLE1', 'SAMPLE2', 'SAMPLE3'],
    contigs: {},
    meta: {}
  },
  records: [
    {
      CHROM: 'chr1',
      POS: 14370,
      ID: 'rs6054257',
      REF: 'G',
      ALT: ['A'],
      QUAL: 29,
      FILTER: ['PASS'],
      INFO: {
        AC: 2,
        AF: 0.333,
        AN: 6,
        DP: 14,
        MQ: 56
      },
      FORMAT: ['GT', 'DP', 'GQ'],
      samples: [
        { GT: '0/0', DP: '3', GQ: '49' },
        { GT: '0/1', DP: '5', GQ: '3' },
        { GT: '0/0', DP: '3', GQ: '41' }
      ]
    },
    {
      CHROM: 'chr1',
      POS: 17330,
      ID: '',
      REF: 'T',
      ALT: ['A'],
      QUAL: 3,
      FILTER: ['q10'],
      INFO: {
        AC: 1,
        AF: 0.167,
        AN: 6,
        DP: 11,
        MQ: 23
      },
      FORMAT: ['GT', 'DP', 'GQ'],
      samples: [
        { GT: '0/0', DP: '3', GQ: '54' },
        { GT: '0/1', DP: '5', GQ: '17' },
        { GT: '0/0', DP: '3', GQ: '40' }
      ]
    },
    {
      CHROM: 'chr1',
      POS: 1110696,
      ID: 'rs6040355',
      REF: 'A',
      ALT: ['G', 'T'],
      QUAL: 67,
      FILTER: ['PASS'],
      INFO: {
        AC: 2,
        AF: 0.333,
        AN: 6,
        DP: 10,
        MQ: 47
      },
      FORMAT: ['GT', 'DP', 'GQ'],
      samples: [
        { GT: '1/2', DP: '6', GQ: '35' },
        { GT: '0/1', DP: '4', GQ: '17' },
        { GT: '0/0', DP: '4', GQ: '40' }
      ]
    },
    {
      CHROM: 'chr2',
      POS: 1234567,
      ID: '',
      REF: 'GTCT',
      ALT: ['G'],
      QUAL: 50,
      FILTER: ['PASS'],
      INFO: {
        AC: 3,
        AF: 0.5,
        AN: 6,
        DP: 13,
        MQ: 50
      },
      FORMAT: ['GT', 'DP', 'GQ'],
      samples: [
        { GT: '0/1', DP: '4', GQ: '35' },
        { GT: '1/1', DP: '6', GQ: '17' },
        { GT: '0/1', DP: '3', GQ: '40' }
      ]
    },
    {
      CHROM: 'chr2',
      POS: 1234568,
      ID: 'rs1234',
      REF: 'C',
      ALT: ['T'],
      QUAL: 999,
      FILTER: ['PASS'],
      INFO: {
        AC: 6,
        AF: 1.0,
        AN: 6,
        DP: 20,
        MQ: 60
      },
      FORMAT: ['GT', 'DP', 'GQ'],
      samples: [
        { GT: '1/1', DP: '7', GQ: '99' },
        { GT: '1/1', DP: '6', GQ: '99' },
        { GT: '1/1', DP: '7', GQ: '99' }
      ]
    }
  ]
};

export async function loadSampleData(): Promise<VCFData> {
  // Simulate async loading
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleVCFData);
    }, 100);
  });
}

export function generateLargeSampleData(numRecords: number): VCFData {
  const chromosomes = ['chr1', 'chr2', 'chr3', 'chr4', 'chr5', 'chr6', 'chr7', 'chr8', 'chr9', 'chr10'];
  const bases = ['A', 'T', 'G', 'C'];
  const records = [];
  
  for (let i = 0; i < numRecords; i++) {
    const chrom = chromosomes[Math.floor(Math.random() * chromosomes.length)];
    const pos = Math.floor(Math.random() * 1000000) + 1;
    const ref = bases[Math.floor(Math.random() * bases.length)];
    const alt = [bases.filter(b => b !== ref)[Math.floor(Math.random() * 3)]];
    
    records.push({
      CHROM: chrom,
      POS: pos,
      ID: Math.random() > 0.7 ? `rs${Math.floor(Math.random() * 1000000)}` : '',
      REF: ref,
      ALT: alt,
      QUAL: Math.floor(Math.random() * 100),
      FILTER: Math.random() > 0.8 ? ['PASS'] : ['q10'],
      INFO: {
        AC: Math.floor(Math.random() * 6) + 1,
        AF: Math.random(),
        AN: 6,
        DP: Math.floor(Math.random() * 50) + 1,
        MQ: Math.floor(Math.random() * 60) + 1
      },
      FORMAT: ['GT', 'DP', 'GQ'],
      samples: [
        { GT: '0/0', DP: `${Math.floor(Math.random() * 10) + 1}`, GQ: `${Math.floor(Math.random() * 99) + 1}` },
        { GT: '0/1', DP: `${Math.floor(Math.random() * 10) + 1}`, GQ: `${Math.floor(Math.random() * 99) + 1}` },
        { GT: '1/1', DP: `${Math.floor(Math.random() * 10) + 1}`, GQ: `${Math.floor(Math.random() * 99) + 1}` }
      ]
    });
  }
  
  return {
    header: sampleVCFData.header,
    records
  };
}