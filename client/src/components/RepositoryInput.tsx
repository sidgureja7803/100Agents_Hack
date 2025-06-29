import { Github } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RepositoryInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RepositoryInput = ({ value, onChange, placeholder }: RepositoryInputProps) => {
  const isValidUrl = value && (value.includes('github.com') || value.includes('gitlab.com') || value.includes('bitbucket.org'));

  return (
    <div className="space-y-3">
      <Label htmlFor="repo-url" className="text-base font-semibold text-slate-700 flex items-center gap-2">
        <Github className="h-5 w-5" />
        Repository URL
      </Label>
      <div className="relative">
        <Input
          id="repo-url"
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-12 text-base pl-4 pr-12 border-2 transition-all duration-200 ${
            value && !isValidUrl 
              ? 'border-red-300 focus:border-red-500' 
              : value && isValidUrl
              ? 'border-green-300 focus:border-green-500'
              : 'border-slate-200 focus:border-blue-500'
          }`}
        />
        {value && (
          <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${
            isValidUrl ? 'bg-green-500' : 'bg-red-500'
          }`} />
        )}
      </div>
      {value && !isValidUrl && (
        <p className="text-sm text-red-600">Please enter a valid GitHub, GitLab, or Bitbucket URL</p>
      )}
    </div>
  );
};