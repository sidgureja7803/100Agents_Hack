import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Code, Database, Globe, Server } from 'lucide-react';

interface TechStack {
  value: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface TechStackSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TechStackSelector: React.FC<TechStackSelectorProps> = ({ value, onChange }) => {
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechStacks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APPWRITE_FUNCTION_URL}/tech-stacks`, {
          headers: {
            'X-Appwrite-Project': import.meta.env.VITE_APPWRITE_PROJECT_ID,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // Map the icons to the corresponding components
        const iconMap: { [key: string]: React.ElementType } = {
          code: Code,
          database: Database,
          globe: Globe,
          server: Server,
        };

        const formattedStacks = data.map((stack: any) => ({
          value: stack.id,
          label: stack.name,
          icon: iconMap[stack.icon] || Code,
          description: stack.description,
        }));

        setTechStacks(formattedStacks);
      } catch (error) {
        console.error('Failed to fetch tech stacks:', error);
        // Fallback to some basic options in case of error
        setTechStacks([
          { value: 'react', label: 'React', icon: Code, description: 'Frontend React application' },
          { value: 'nodejs', label: 'Node.js', icon: Server, description: 'Backend Node.js application' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechStacks();
  }, []);

  return (
    <div className="space-y-2">
      <Label>Tech Stack</Label>
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue placeholder="Select a tech stack" />
        </SelectTrigger>
        <SelectContent>
          {techStacks.map((stack) => {
            const Icon = stack.icon;
            return (
              <SelectItem key={stack.value} value={stack.value}>
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{stack.label}</div>
                    <div className="text-xs text-slate-500">{stack.description}</div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};