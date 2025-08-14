import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import LongTermGoals from '@/components/LongTermGoals';
import MilestonesProjects from '@/components/MilestonesProjects';
import WeeklyPlanner from '@/components/WeeklyPlanner';
import RolesSection from '@/components/RolesSection';
import OwlPost from '@/components/OwlPost';

// Types
interface Goal {
  id: string;
  title: string;
  successMetric: string;
  whyItMatters: string;
  targetDate: string;
  sevenHabits: {
    proactive: boolean;
    beginWithEnd: boolean;
    firstThingsFirst: boolean;
    winWin: boolean;
    seekFirst: boolean;
    synergize: boolean;
    sharpenSaw: boolean;
  };
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  eisenhowerQuadrant: 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';
  dueDate: string;
  linkedGoalId: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

interface Role {
  id: string;
  title: string;
  description: string;
  keyResponsibilities: string;
  weeklyGoals: string;
  isStarred: boolean;
}

interface WeeklyItem {
  id: string;
  type: 'role' | 'big-rock' | 'task';
  title: string;
  description: string;
  dayOfWeek: string;
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface OwlPostItem {
  id: string;
  type: 'change' | 'deadline';
  title: string;
  description: string;
  timestamp: Date;
  dueDate?: Date;
  priority?: 'high' | 'medium' | 'low';
}

interface AppData {
  goals: Goal[];
  milestones: Milestone[];
  weeklyItems: WeeklyItem[];
  roles: Role[];
  owlPostItems: OwlPostItem[];
  lastModified: string;
}

const Index = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [weeklyItems, setWeeklyItems] = useState<WeeklyItem[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [owlPostItems, setOwlPostItems] = useState<OwlPostItem[]>([]);
  const [isOwlPostOpen, setIsOwlPostOpen] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('room-of-requirements-data');
    if (savedData) {
      try {
        const parsedData: AppData = JSON.parse(savedData);
        setGoals(parsedData.goals || []);
        setMilestones(parsedData.milestones || []);
        setWeeklyItems(parsedData.weeklyItems || []);
        setRoles(parsedData.roles || []);
        
        // Parse timestamps for owl post items
        const owlItems = (parsedData.owlPostItems || []).map(item => ({
          ...item,
          timestamp: new Date(item.timestamp),
          dueDate: item.dueDate ? new Date(item.dueDate) : undefined
        }));
        setOwlPostItems(owlItems);
      } catch (error) {
        console.error('Error loading saved data:', error);
        toast({
          title: "Data Loading Error",
          description: "There was an issue loading your saved data.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  // Auto-save data to localStorage
  const saveData = (newGoals?: Goal[], newMilestones?: Milestone[], newWeeklyItems?: WeeklyItem[], newRoles?: Role[]) => {
    const dataToSave: AppData = {
      goals: newGoals || goals,
      milestones: newMilestones || milestones,
      weeklyItems: newWeeklyItems || weeklyItems,
      roles: newRoles || roles,
      owlPostItems,
      lastModified: new Date().toISOString()
    };
    
    localStorage.setItem('room-of-requirements-data', JSON.stringify(dataToSave));
  };

  // Add change tracking
  const addOwlPostItem = (item: Omit<OwlPostItem, 'id' | 'timestamp'>) => {
    const newItem: OwlPostItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setOwlPostItems(prev => [newItem, ...prev]);
  };

  // Generate upcoming deadlines
  useEffect(() => {
    const now = new Date();
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    // Check for goal deadlines
    goals.forEach(goal => {
      if (goal.targetDate) {
        const targetDate = new Date(goal.targetDate);
        if (targetDate >= now && targetDate <= twoWeeksFromNow) {
          const existingDeadline = owlPostItems.find(
            item => item.type === 'deadline' && item.title.includes(goal.title)
          );
          
          if (!existingDeadline) {
            addOwlPostItem({
              type: 'deadline',
              title: `Goal Deadline: ${goal.title}`,
              description: `Your goal "${goal.title}" is due soon.`,
              dueDate: targetDate,
              priority: 'high'
            });
          }
        }
      }
    });

    // Check for milestone deadlines
    milestones.forEach(milestone => {
      if (milestone.dueDate) {
        const dueDate = new Date(milestone.dueDate);
        if (dueDate >= now && dueDate <= twoWeeksFromNow) {
          const existingDeadline = owlPostItems.find(
            item => item.type === 'deadline' && item.title.includes(milestone.title)
          );
          
          if (!existingDeadline) {
            addOwlPostItem({
              type: 'deadline',
              title: `Milestone Deadline: ${milestone.title}`,
              description: `Your milestone "${milestone.title}" is due soon.`,
              dueDate: dueDate,
              priority: milestone.eisenhowerQuadrant.includes('urgent') ? 'high' : 'medium'
            });
          }
        }
      }
    });
  }, [goals, milestones]);

  const handleGoalsChange = (newGoals: Goal[]) => {
    setGoals(newGoals);
    saveData(newGoals, milestones, weeklyItems, roles);
    addOwlPostItem({
      type: 'change',
      title: 'Goals Updated',
      description: 'Your long-term goals have been modified.',
      priority: 'medium'
    });
  };

  const handleMilestonesChange = (newMilestones: Milestone[]) => {
    setMilestones(newMilestones);
    saveData(goals, newMilestones, weeklyItems, roles);
    addOwlPostItem({
      type: 'change',
      title: 'Milestones Updated',
      description: 'Your milestones and projects have been modified.',
      priority: 'medium'
    });
  };

  const handleRolesChange = (newRoles: Role[]) => {
    setRoles(newRoles);
    saveData(goals, milestones, weeklyItems, newRoles);
    addOwlPostItem({
      type: 'change',
      title: 'Life Roles Updated',
      description: 'Your life roles have been modified.',
      priority: 'medium'
    });
  };

  const handleWeeklyItemsChange = (newWeeklyItems: WeeklyItem[]) => {
    setWeeklyItems(newWeeklyItems);
    saveData(goals, milestones, newWeeklyItems, roles);
    addOwlPostItem({
      type: 'change',
      title: 'Weekly Plan Updated',
      description: 'Your weekly planner has been modified.',
      priority: 'low'
    });
  };

  const handleExportData = () => {
    try {
      const dataToExport: AppData = {
        goals,
        milestones,
        weeklyItems,
        roles,
        owlPostItems,
        lastModified: new Date().toISOString()
      };
      
      const dataString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([dataString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `room-of-requirements-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData: AppData = JSON.parse(event.target?.result as string);
          
          setGoals(importedData.goals || []);
          setMilestones(importedData.milestones || []);
          setWeeklyItems(importedData.weeklyItems || []);
          setRoles(importedData.roles || []);
          
          // Parse timestamps for owl post items
          const owlItems = (importedData.owlPostItems || []).map(item => ({
            ...item,
            timestamp: new Date(item.timestamp),
            dueDate: item.dueDate ? new Date(item.dueDate) : undefined
          }));
          setOwlPostItems(owlItems);
          
          saveData(importedData.goals, importedData.milestones, importedData.weeklyItems, importedData.roles);
          
          toast({
            title: "Import Successful",
            description: "Your data has been imported successfully.",
          });
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "There was an error importing your data. Please check the file format.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header 
          onExportData={handleExportData}
          onImportData={handleImportData}
        />
        
        <main className="container mx-auto px-4 py-8 space-y-16">
          <RolesSection 
            roles={roles}
            onRolesChange={handleRolesChange}
          />
          
          <LongTermGoals 
            goals={goals}
            onGoalsChange={handleGoalsChange}
          />
          
          <MilestonesProjects 
            milestones={milestones}
            goals={goals.map(g => ({ id: g.id, title: g.title }))}
            onMilestonesChange={handleMilestonesChange}
          />
          
          <WeeklyPlanner 
            weeklyItems={weeklyItems}
            onWeeklyItemsChange={handleWeeklyItemsChange}
          />
        </main>

        {/* Floating Owl Post Button */}
        <Button
          onClick={() => setIsOwlPostOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full floating shadow-lg"
          variant="magical"
          size="icon"
        >
          <span className="text-2xl">🦉</span>
        </Button>

        <OwlPost 
          isOpen={isOwlPostOpen}
          onClose={() => setIsOwlPostOpen(false)}
          changes={owlPostItems}
        />
      </div>
    </AuthGuard>
  );
};

export default Index;
