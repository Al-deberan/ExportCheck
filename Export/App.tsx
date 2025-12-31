import { useState } from 'react';
import { InputForm } from './components/InputForm';
import { DecisionOutput } from './components/DecisionOutput';
import { ExportInput, ExportResult } from './types/export';
import { evaluateExportRules } from './utils/evaluateRule';

function App() {
  const [input, setInput] = useState<ExportInput>({
    itemType: '',
    category: '',
    destination: ''
  });
  
  const [result, setResult] = useState<ExportResult | null>(null);

  const handleSubmit = (newInput: ExportInput) => {
    setInput(newInput);
    const evaluation = evaluateExportRules(newInput);
    setResult(evaluation);
  };

  const handleReset = () => {
    setInput({ itemType: '', category: '', destination: '' });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">ExportCheck</h1>
              <p className="text-slate-600">Export Control Decision Engine</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> ExportCheck provides educational guidance only and is not legal advice. 
              Always consult official regulations (22 CFR 120, 15 CFR 730) and legal counsel for compliance decisions.
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <InputForm 
              input={input} 
              onSubmit={handleSubmit} 
              onReset={handleReset}
            />
          </div>

          {/* Decision Output */}
          <div>
            <DecisionOutput result={result} />
          </div>
        </div>

        {/* Footer Disclaimer */}
        <footer className="mt-12 pt-8 border-t border-slate-200">
          <div className="text-center text-sm text-slate-500">
            <p>© 2024 ExportCheck. Educational tool for U.S. export control compliance.</p>
            <p className="mt-1">Not affiliated with U.S. Department of State or Commerce.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;