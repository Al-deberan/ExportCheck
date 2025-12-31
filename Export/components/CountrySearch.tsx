import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search } from 'lucide-react';

interface CountrySearchProps {
  value: string;
  onChange: (value: string) => void;
}

const EMBARGOED_COUNTRIES = ['Cuba', 'Iran', 'North Korea', 'Syria', 'Crimea'];

const COUNTRIES_BY_REGION = {
  'North America': ['United States', 'Canada', 'Mexico'],
  'Europe': ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Switzerland', 'Austria', 'Ireland', 'Portugal', 'Greece', 'Czech Republic', 'Hungary', 'Romania'],
  'Asia Pacific': ['China', 'Japan', 'South Korea', 'India', 'Australia', 'Singapore', 'Taiwan', 'Hong Kong', 'Malaysia', 'Thailand', 'Indonesia', 'Philippines', 'Vietnam', 'New Zealand'],
  'Middle East & Africa': ['United Arab Emirates', 'Saudi Arabia', 'Israel', 'Egypt', 'South Africa', 'Turkey', 'Qatar', 'Kuwait', 'Nigeria', 'Kenya'],
  'Latin America': ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador', 'Uruguay'],
  'Restricted': EMBARGOED_COUNTRIES
};

export function CountrySearch({ value, onChange }: CountrySearchProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <SelectValue placeholder="Search and select country..." />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {Object.entries(COUNTRIES_BY_REGION).map(([region, countries]) => (
          <div key={region}>
            <div className={`px-2 py-1.5 text-xs font-semibold ${
              region === 'Restricted' ? 'text-red-600 bg-red-50' : 'text-slate-500 bg-slate-50'
            }`}>
              {region}
            </div>
            {countries.map((country) => (
              <SelectItem 
                key={country} 
                value={country}
                className={EMBARGOED_COUNTRIES.includes(country) ? 'text-red-600' : ''}
              >
                {country}
                {EMBARGOED_COUNTRIES.includes(country) && (
                  <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                    EMBARGOED
                  </span>
                )}
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}