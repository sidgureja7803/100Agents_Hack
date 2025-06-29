import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Code, Database, Globe, Server } from 'lucide-react';

interface TechStackSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const techStacks = [
  { value: 'react', label: 'React', icon: Code, description: 'Frontend React application' },
  { value: 'nextjs', label: 'Next.js', icon: Globe, description: 'Full-stack React framework' },
  { value: 'nodejs', label: 'Node.js', icon: Server, description: 'Backend Node.js application' },
  { value: 'express', label: 'Express.js', icon: Server, description: 'Node.js web framework' },
  { value: 'django', label: 'Django', icon: Database, description: 'Python web framework' },
  { value: 'flask', label: 'Flask', icon: Database, description: 'Lightweight Python framework' },
  { value: 'vue', label: 'Vue.js', icon: Code, description: 'Progressive JavaScript framework' },
  { value: 'angular', label: 'Angular', icon: Code, description: 'TypeScript-based framework' },
  { value: 'spring', label: 'Spring Boot', icon: Server, description: 'Java application framework' },
  { value: 'laravel', label: 'Laravel', icon: Database, description: 'PHP web framework' },
];

export const TechStackSelector = ({ value, onChange }: TechStackSelectorProps) => {
  const selectedStack = techStacks.find(stack => stack.value === value);

  return (
    <div className="space-y-3">
      <Label htmlFor="tech-stack" className="text-base font-semibold text-slate-700 flex items-center gap-2">
        <Code className="h-5 w-5" />
        Technology Stack
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 text-base border-2 border-slate-200 focus:border-blue-500">
          <SelectValue placeholder="Select your technology stack" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {techStacks.map((stack) => {
            const Icon = stack.icon;
            return (
              <SelectItem key={stack.value} value={stack.value} className="py-3">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-slate-600" />
                  <div>
                    <div className="font-medium">{stack.label}</div>
                    <div className="text-sm text-slate-500">{stack.description}</div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {selectedStack && (
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
          <selectedStack.icon className="h-4 w-4" />
          <span>Selected: {selectedStack.label} - {selectedStack.description}</span>
        </div>
      )}
    </div>
  );
};