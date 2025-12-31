export interface ExportInput {
  itemType: string;
  category: string;
  destination: string;
}

export interface ExportResult {
  framework: 'ITAR' | 'EAR';
  licenseRequired: 'Yes' | 'No' | 'Conditional';
  flags: string[];
  confidence: number;
}