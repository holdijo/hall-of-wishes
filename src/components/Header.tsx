import React from 'react';
import { Moon, Sun, Calendar, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  onExportData: () => void;
  onImportData: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExportData, onImportData }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-medium/30 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-hufflepuff-gold/20 flex items-center justify-center">
              <span className="text-hufflepuff-gold font-magical text-lg font-bold">RR</span>
            </div>
            <div>
              <h1 className="font-magical text-xl font-bold text-foreground">
                Room of Requirements
              </h1>
              <p className="text-xs text-muted-foreground">
                "Help will always be given to those who ask for it"
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open('/calendar.html', '_blank')}
            className="hover:bg-hufflepuff-gold/20"
            title="Open Calendar"
          >
            <Calendar className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onExportData}
            className="hover:bg-hufflepuff-gold/20"
            title="Export Backup"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onImportData}
            className="hover:bg-hufflepuff-gold/20"
            title="Import Backup"
          >
            <Upload className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-hufflepuff-gold/20"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;