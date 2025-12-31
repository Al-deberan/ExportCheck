import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ExportInput } from '../types/export';
import { CountrySearch } from './CountrySearch';
import { SmartItemSearch } from './SmartItemSearch';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Save, RefreshCw } from 'lucide-react';

interface InputFormProps {
  input: ExportInput;
  onSubmit: (input: ExportInput) => void;
  onReset: () => void;
}

const CATEGORIES = [
  'Hardware',
  'Software', 
  'Firmware',
  'Technical Data',
  'Services'
];

export function InputForm({ input, onSubmit, onReset }: InputFormProps) {
  const [formData, setFormData] = useState<ExportInput>(input);
  const { saveTemplate } = useLocalStorage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.itemType && formData.category && formData.destination) {
      onSubmit(formData);
    }
  };

  const handleSaveTemplate = () => {
    if (formData.itemType && formData.category && formData.destination) {
      saveTemplate(formData);
    }
  };

  const isFormValid = formData.itemType && formData.category && formData.destination;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Export Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Smart Item Search */}
          <div className="space-y-2">
            <SmartItemSearch 
              value={formData.itemType} 
              onChange={(value) => setFormData({ ...formData, itemType: value })}
            />
          </div>

          {/* Component Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Component Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destination Country */}
          <div className="space-y-2">
            <Label htmlFor="destination">Destination Country</Label>
            <CountrySearch
              value={formData.destination}
              onChange={(value) => setFormData({ ...formData, destination: value })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!isFormValid}
            >
              Analyze Export
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onReset}
              className="px-4"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSaveTemplate}
              disabled={!isFormValid}
              className="px-4"
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}