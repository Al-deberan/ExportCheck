import { Lock, CheckCircle, AlertTriangle, Shield, AlertCircle } from 'lucide-react';
import { ExportResult } from '../types/export';

interface DecisionOutputProps {
  result: ExportResult | null;
}

export function DecisionOutput({ result }: DecisionOutputProps) {
  if (!result) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Enter export information to see compliance analysis</p>
      </div>
    );
  }

  const getFrameworkColor = (framework: string) => {
    return framework === 'ITAR' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getLicenseIcon = (license: string) => {
    switch (license) {
      case 'Yes':
        return <Lock className="w-5 h-5" />;
      case 'No':
        return <CheckCircle className="w-5 h-5" />;
      case 'Conditional':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getLicenseColor = (license: string) => {
    switch (license) {
      case 'Yes':
        return 'text-red-600 bg-red-50';
      case 'No':
        return 'text-green-600 bg-green-50';
      case 'Conditional':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getFlagTooltip = (flag: string) => {
    const tooltips: { [key: string]: string } = {
      'Embargoed Country': 'Export prohibited under comprehensive sanctions',
      'Military End-Use': 'Item may be used in weapons systems or military applications',
      'Encryption': 'Subject to additional encryption controls and reporting requirements',
      'Deemed Export': 'Technology transfer to foreign nationals within the U.S.',
      'University Research': 'May qualify for fundamental research exemption',
      'Dual-Use': 'Item has both civilian and military applications',
      'High Risk': 'Requires enhanced due diligence and documentation'
    };
    return tooltips[flag] || 'Additional compliance considerations may apply';
  };

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Compliance Analysis</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getFrameworkColor(result.framework)}`}>
            {result.framework}
          </span>
        </div>

        {/* License Status */}
        <div className={`flex items-center gap-3 p-4 rounded-lg ${getLicenseColor(result.licenseRequired)}`}>
          {getLicenseIcon(result.licenseRequired)}
          <div>
            <p className="font-medium">License Required: {result.licenseRequired}</p>
            <p className="text-sm opacity-75 mt-1">
              {result.licenseRequired === 'Yes' && 'Export authorization required before proceeding'}
              {result.licenseRequired === 'No' && 'No export authorization required'}
              {result.licenseRequired === 'Conditional' && 'License may be required based on specific circumstances'}
            </p>
          </div>
        </div>

        {/* Risk Flags */}
        {result.flags && result.flags.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Risk Indicators</h4>
            <div className="flex flex-wrap gap-2">
              {result.flags.map((flag, index) => (
                <div
                  key={index}
                  className="group relative inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm border border-amber-200 cursor-help"
                  title={getFlagTooltip(flag)}
                >
                  <AlertTriangle className="w-3 h-3" />
                  {flag}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {getFlagTooltip(flag)}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Level */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Confidence Level</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{result.confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Educational Guidance Only</p>
            <p className="leading-relaxed">
              ExportCheck provides educational guidance only and is not legal advice. 
              Consult official regulations (22 CFR 120 for ITAR, 15 CFR 730 for EAR) and 
              qualified legal counsel before making export decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}