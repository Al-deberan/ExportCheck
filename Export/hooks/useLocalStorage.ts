import { useState, useEffect } from 'react';
import { ExportInput } from '../types/export';

export function useLocalStorage() {
  const [templates, setTemplates] = useState<ExportInput[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('exportcheck-templates');
    if (saved) {
      try {
        setTemplates(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load templates:', error);
      }
    }
  }, []);

  const saveTemplate = (template: ExportInput) => {
    const newTemplates = [...templates, template];
    setTemplates(newTemplates);
    localStorage.setItem('exportcheck-templates', JSON.stringify(newTemplates));
  };

  const getTemplates = () => templates;

  const clearTemplates = () => {
    setTemplates([]);
    localStorage.removeItem('exportcheck-templates');
  };

  return {
    templates,
    saveTemplate,
    getTemplates,
    clearTemplates
  };
}