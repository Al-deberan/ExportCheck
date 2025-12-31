import { ExportInput, ExportResult } from '../types/export';

const EMBARGOED_COUNTRIES = [
  'Cuba', 'Iran', 'North Korea', 'Syria', 'Crimea', 'Sevastopol', 
  'Donetsk', 'Luhansk', 'Afghanistan', 'Belarus', 'Myanmar', 'Russia'
];

const ITAR_KEYWORDS = [
  'F-35', 'M4 Carbine', 'Javelin', 'Patriot', 'M1 Abrams', 'AH-64', 
  'AN/PVS', 'AN/APG', 'Tomahawk', 'SM-3', 'THAAD', 'AIM-120', 'Hellfire',
  'Fire Control', 'Bradley', 'Stryker', 'HMMWV', 'MRAP', 'JLTV',
  'Aegis', 'Mk 92', 'TADS/PNVS', 'SAASM', 'Military'
];

const ENCRYPTION_KEYWORDS = [
  'Encryption', 'OpenSSL', 'PGP', 'GPG', 'BitLocker', 'VeraCrypt', 'AES',
  'Cryptography', 'HSM', 'TPM', 'nShield', 'CloudHSM', 'YubiHSM'
];

const CHINA_SENITIVE_ITEMS = [
  'SMIC', 'HiSilicon', 'Kirin', 'Quantum', 'Satellite', 'Advanced Semiconductor',
  '5nm', '7nm', '14nm', 'FinFET', 'GPU', 'Processor', 'CPU', 'Chip'
];

const HIGH_TECH_ITEMS = [
  'Quantum', 'Supercomputer', 'Advanced Semiconductor', 'AI Chip', 
  'Machine Learning', 'Neural Network', 'Advanced Materials'
];

export function evaluateExportRules(input: ExportInput): ExportResult {
  const { itemType, category, destination } = input;
  const itemLower = itemType.toLowerCase();
  
  // Check for embargoed countries first
  if (EMBARGOED_COUNTRIES.includes(destination)) {
    return {
      framework: 'ITAR',
      licenseRequired: 'Yes',
      flags: ['Embargoed Country', 'High Risk'],
      confidence: 95
    };
  }

  // Check for ITAR items using keywords
  const isITAR = ITAR_KEYWORDS.some(keyword => 
    itemLower.includes(keyword.toLowerCase())
  );
  
  if (isITAR) {
    const flags = ['Military End-Use', 'Defense Article'];
    if (destination === 'China' || destination === 'Russia' || destination === 'Iran') {
      flags.push('High Risk', 'Strategic Control');
    }
    return {
      framework: 'ITAR',
      licenseRequired: 'Yes',
      flags,
      confidence: 95
    };
  }

  // Check for encryption items
  const isEncryption = ENCRYPTION_KEYWORDS.some(keyword => 
    itemLower.includes(keyword.toLowerCase())
  );
  
  if (isEncryption) {
    const flags = ['Encryption'];
    if (category === 'Software') {
      flags.push('Dual-Use', 'Deemed Export');
    }
    if (destination === 'China' || destination === 'Russia') {
      flags.push('High Risk');
    }
    return {
      framework: 'EAR',
      licenseRequired: 'Conditional',
      flags,
      confidence: 90
    };
  }

  // Check for China-sensitive items
  if (destination === 'China') {
    const isChinaSensitive = CHINA_SENITIVE_ITEMS.some(keyword => 
      itemLower.includes(keyword.toLowerCase())
    );
    
    if (isChinaSensitive) {
      return {
        framework: 'EAR',
        licenseRequired: 'Conditional',
        flags: ['Military End-Use', 'High Risk', 'Strategic Control'],
        confidence: 85
      };
    }
  }

  // Check for high-tech items
  const isHighTech = HIGH_TECH_ITEMS.some(keyword => 
    itemLower.includes(keyword.toLowerCase())
  );
  
  if (isHighTech) {
    const flags = ['Dual-Use'];
    if (destination === 'China' || destination === 'Russia' || destination === 'Iran') {
      flags.push('High Risk', 'Military End-Use');
    }
    return {
      framework: 'EAR',
      licenseRequired: 'Conditional',
      flags,
      confidence: 80
    };
  }

  // Check for aerospace/defense components
  if (itemLower.includes('aerospace') || itemLower.includes('turbine') || 
      itemLower.includes('engine') || itemLower.includes('radar') ||
      itemLower.includes('avionics') || itemLower.includes('propulsion')) {
    const flags = ['Dual-Use'];
    if (destination === 'China' || destination === 'Russia') {
      flags.push('Military End-Use');
    }
    return {
      framework: 'EAR',
      licenseRequired: 'Conditional',
      flags,
      confidence: 75
    };
  }

  // Check for chemical/biological items
  if (itemLower.includes('chemical') || itemLower.includes('biological') ||
      itemLower.includes('anthrax') || itemLower.includes('ricin') ||
      itemLower.includes('nuclear') || itemLower.includes('centrifuge')) {
    return {
      framework: 'ITAR',
      licenseRequired: 'Yes',
      flags: ['High Risk', 'Proliferation Concern'],
      confidence: 95
    };
  }

  // Check for technical data/software
  if (category === 'Technical Data' || category === 'Software') {
    return {
      framework: 'EAR',
      licenseRequired: 'Conditional',
      flags: ['Deemed Export'],
      confidence: 70
    };
  }

  // Default case - generally allowed
  return {
    framework: 'EAR',
    licenseRequired: 'No',
    flags: [],
    confidence: 60
  };
}