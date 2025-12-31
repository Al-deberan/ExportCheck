import { useState, useEffect, useMemo } from 'react';
import { Search, AlertCircle, Shield, Target, Zap, Database } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface ItemClassification {
  category: string;
  subcategory: string;
  itarEccn: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  keywords: string[];
}

const COMPONENT_DATABASE: Record<string, ItemClassification> = {
  // Missile Systems
  'tomahawk': {
    category: 'Missile Systems',
    subcategory: 'Cruise Missile',
    itarEccn: 'USML Category IV',
    description: 'BGM-109 Tomahawk Land Attack Missile',
    riskLevel: 'critical',
    keywords: ['cruise', 'missile', 'bgm-109', 'land attack', 'naval strike']
  },
  'javelin': {
    category: 'Missile Systems', 
    subcategory: 'Anti-Tank Missile',
    itarEccn: 'USML Category IV',
    description: 'FGM-148 Javelin Anti-Armor Weapon System',
    riskLevel: 'critical',
    keywords: ['anti-tank', 'fgm-148', 'portable', 'fire-and-forget']
  },
  'patriot': {
    category: 'Defense Systems',
    subcategory: 'Air Defense',
    itarEccn: 'USML Category I',
    description: 'MIM-104 Patriot Surface-to-Air Missile System',
    riskLevel: 'critical',
    keywords: ['sam', 'air defense', 'mim-104', 'surface-to-air']
  },
  
  // Aircraft
  'f-35': {
    category: 'Aircraft',
    subcategory: 'Fighter Jet',
    itarEccn: 'USML Category VIII',
    description: 'F-35 Lightning II Multirole Fighter',
    riskLevel: 'critical',
    keywords: ['lightning ii', 'multirole', 'stealth', 'lockheed martin']
  },
  'f-22': {
    category: 'Aircraft',
    subcategory: 'Fighter Jet', 
    itarEccn: 'USML Category VIII',
    description: 'F-22 Raptor Air Superiority Fighter',
    riskLevel: 'critical',
    keywords: ['raptor', 'air superiority', 'stealth', 'lockheed martin']
  },
  'apache': {
    category: 'Aircraft',
    subcategory: 'Attack Helicopter',
    itarEccn: 'USML Category VIII',
    description: 'AH-64 Apache Attack Helicopter',
    riskLevel: 'critical',
    keywords: ['ah-64', 'attack helicopter', 'boeing']
  },
  
  // Small Arms
  'm4': {
    category: 'Small Arms',
    subcategory: 'Assault Rifle',
    itarEccn: 'USML Category I',
    description: 'M4 Carbine Assault Rifle',
    riskLevel: 'high',
    keywords: ['carbine', 'colt', '5.56mm', 'assault rifle']
  },
  'm16': {
    category: 'Small Arms',
    subcategory: 'Assault Rifle',
    itarEccn: 'USML Category I', 
    description: 'M16 Assault Rifle',
    riskLevel: 'high',
    keywords: ['ar-15', 'colt', '5.56mm', 'assault rifle']
  },
  'ak-47': {
    category: 'Small Arms',
    subcategory: 'Assault Rifle',
    itarEccn: 'USML Category I',
    description: 'AK-47 Kalashnikov Assault Rifle',
    riskLevel: 'high',
    keywords: ['kalashnikov', '7.62mm', 'russian', 'assault rifle']
  },
  
  // Vehicles
  'm1 abrams': {
    category: 'Ground Vehicles',
    subcategory: 'Main Battle Tank',
    itarEccn: 'USML Category I',
    description: 'M1A2 Abrams Main Battle Tank',
    riskLevel: 'critical',
    keywords: ['tank', 'main battle tank', 'general dynamics']
  },
  'bradley': {
    category: 'Ground Vehicles',
    subcategory: 'Infantry Fighting Vehicle',
    itarEccn: 'USML Category I',
    description: 'M2 Bradley Infantry Fighting Vehicle',
    riskLevel: 'critical',
    keywords: ['m2', 'ifv', 'infantry fighting', 'bae systems']
  },
  'humvee': {
    category: 'Ground Vehicles',
    subcategory: 'Utility Vehicle',
    itarEccn: 'USML Category I',
    description: 'HMMWV High Mobility Multipurpose Wheeled Vehicle',
    riskLevel: 'high',
    keywords: ['hmmwv', 'military', 'utility', 'am general']
  },
  
  // Electronics
  'apg-81': {
    category: 'Electronics',
    subcategory: 'Radar System',
    itarEccn: 'USML Category XI',
    description: 'AN/APG-81 AESA Radar System (F-35)',
    riskLevel: 'critical',
    keywords: ['aesa', 'radar', 'f-35', 'northrop grumman']
  },
  'gps': {
    category: 'Electronics',
    subcategory: 'Navigation System',
    itarEccn: 'USML Category XII',
    description: 'Military GPS Receiver System',
    riskLevel: 'high',
    keywords: ['navigation', 'satellite', 'positioning', 'garmin']
  },
  
  // Naval
  'arleigh burke': {
    category: 'Naval',
    subcategory: 'Destroyer',
    itarEccn: 'USML Category VII',
    description: 'Arleigh Burke-class Guided Missile Destroyer',
    riskLevel: 'critical',
    keywords: ['ddg-51', 'destroyer', 'guided missile', 'navy']
  },
  'virginia': {
    category: 'Naval',
    subcategory: 'Submarine',
    itarEccn: 'USML Category VII',
    description: 'Virginia-class Attack Submarine',
    riskLevel: 'critical',
    keywords: ['ssn-774', 'attack submarine', 'nuclear']
  },
  
  // Components/Parts
  'turbofan': {
    category: 'Components',
    subcategory: 'Aircraft Engine',
    itarEccn: 'USML Category VIII',
    description: 'Military Turbofan Jet Engine',
    riskLevel: 'high',
    keywords: ['jet engine', 'propulsion', 'ge', 'pratt whitney']
  },
  'armor': {
    category: 'Components',
    subcategory: 'Vehicle Armor',
    itarEccn: 'USML Category I',
    description: 'Ballistic Armor Plating',
    riskLevel: 'high',
    keywords: ['ballistic', 'plating', 'composite', 'steel']
  },
  'night vision': {
    category: 'Electronics',
    subcategory: 'Optical System',
    itarEccn: 'USML Category XI',
    description: 'Night Vision Device/System',
    riskLevel: 'high',
    keywords: ['image intensification', 'thermal', 'infrared', 'an/pvs']
  }
};

export function SmartItemSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const term = searchTerm.toLowerCase();
    const results: Array<{key: string; item: ItemClassification; score: number}> = [];
    
    Object.entries(COMPONENT_DATABASE).forEach(([key, item]) => {
      let score = 0;
      
      // Exact match
      if (key === term) score = 100;
      // Starts with
      else if (key.startsWith(term)) score = 80;
      // Contains
      else if (key.includes(term)) score = 60;
      // Keywords match
      else if (item.keywords.some(k => k.includes(term))) score = 40;
      // Partial match
      else if (term.split(' ').some(word => key.includes(word))) score = 20;
      
      if (score > 0) {
        results.push({ key, item, score });
      }
    });
    
    return results.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [searchTerm]);

  const selectedItem = useMemo(() => {
    if (!searchTerm) return null;
    
    const term = searchTerm.toLowerCase();
    for (const [key, item] of Object.entries(COMPONENT_DATABASE)) {
      if (key === term || key.includes(term)) {
        return { key, item };
      }
    }
    return null;
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleSelect = (selection: string) => {
    setSearchTerm(selection);
    onChange(selection);
    setIsFocused(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Missile Systems': return <Target className="w-4 h-4" />;
      case 'Defense Systems': return <Shield className="w-4 h-4" />;
      case 'Aircraft': return <Zap className="w-4 h-4" />;
      case 'Electronics': return <Database className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <Label htmlFor="itemSearch" className="text-sm font-medium">
        Component Search
      </Label>
      <div className="relative mt-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          id="itemSearch"
          type="text"
          placeholder="Enter any component name, model number, or keyword..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-10 pr-4 h-11"
        />
      </div>

      {/* Suggestions Dropdown */}
      {isFocused && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg border-gray-200">
          <CardContent className="p-0">
            <div className="max-h-64 overflow-y-auto">
              {suggestions.map(({ key, item }) => (
                <div
                  key={key}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelect(key)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.category)}
                        <span className="font-medium text-sm">{key}</span>
                        <Badge className={`text-xs ${getRiskColor(item.riskLevel)}`}>
                          {item.riskLevel}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {item.description}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{item.category}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{item.itarEccn}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Item Display */}
      {selectedItem && !isFocused && (
        <Card className="mt-2 border-blue-200 bg-blue-50">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(selectedItem.item.category)}
                  <span className="font-medium text-sm">{selectedItem.key}</span>
                  <Badge className={`text-xs ${getRiskColor(selectedItem.item.riskLevel)}`}>
                    {selectedItem.item.riskLevel}
                  </Badge>
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  {selectedItem.item.description}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div>
                    <span className="text-xs text-gray-500">Category:</span>
                    <span className="text-xs font-medium ml-1">{selectedItem.item.category}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Control:</span>
                    <span className="text-xs font-medium ml-1">{selectedItem.item.itarEccn}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      <div className="mt-2 text-xs text-gray-500">
        Try: "F-35", "Javelin", "M1 Abrams", "APG-81", "Night Vision", or any component name
      </div>
    </div>
  );
}