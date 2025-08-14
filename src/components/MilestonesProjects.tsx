import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Flag, Calendar, Link } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  eisenhowerQuadrant: 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';
  dueDate: string;
  linkedGoalId: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

interface Goal {
  id: string;
  title: string;
}

interface MilestonesProjectsProps {
  milestones: Milestone[];
  goals: Goal[];
  onMilestonesChange: (milestones: Milestone[]) => void;
}

const quadrantLabels = {
  'urgent-important': 'Urgent & Important (Do)',
  'not-urgent-important': 'Not Urgent & Important (Schedule)',
  'urgent-not-important': 'Urgent & Not Important (Delegate)',
  'not-urgent-not-important': 'Not Urgent & Not Important (Eliminate)'
};

const quadrantColors = {
  'urgent-important': 'border-red-500 bg-red-50 dark:bg-red-950/20',
  'not-urgent-important': 'border-hufflepuff-gold bg-hufflepuff-gold/10',
  'urgent-not-important': 'border-orange-500 bg-orange-50 dark:bg-orange-950/20',
  'not-urgent-not-important': 'border-gray-400 bg-gray-50 dark:bg-gray-950/20'
};

const statusColors = {
  'not-started': 'text-gray-500',
  'in-progress': 'text-blue-500',
  'completed': 'text-green-500'
};

const MilestonesProjects: React.FC<MilestonesProjectsProps> = ({ 
  milestones, 
  goals, 
  onMilestonesChange 
}) => {
  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: '',
      description: '',
      eisenhowerQuadrant: 'not-urgent-important',
      dueDate: '',
      linkedGoalId: '',
      status: 'not-started'
    };
    onMilestonesChange([...milestones, newMilestone]);
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    onMilestonesChange(milestones.map(milestone => 
      milestone.id === id ? { ...milestone, ...updates } : milestone
    ));
  };

  const deleteMilestone = (id: string) => {
    onMilestonesChange(milestones.filter(milestone => milestone.id !== id));
  };

  const groupedMilestones = milestones.reduce((acc, milestone) => {
    if (!acc[milestone.eisenhowerQuadrant]) {
      acc[milestone.eisenhowerQuadrant] = [];
    }
    acc[milestone.eisenhowerQuadrant].push(milestone);
    return acc;
  }, {} as Record<string, Milestone[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Flag className="h-6 w-6 text-hufflepuff-gold" />
          <h2 className="font-magical text-2xl font-bold">Milestones & Projects</h2>
        </div>
        <Button onClick={addMilestone} variant="magical">
          <Plus className="h-4 w-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(quadrantLabels).map(([quadrant, label]) => (
          <Card key={quadrant} className={`parchment-card ${quadrantColors[quadrant as keyof typeof quadrantColors]}`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupedMilestones[quadrant]?.map((milestone) => (
                <Card key={milestone.id} className="bg-background/50 border border-border/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <Input
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                          placeholder="Milestone title..."
                          className="font-semibold border-none bg-transparent p-0 focus:ring-0"
                        />
                        <Textarea
                          value={milestone.description}
                          onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                          placeholder="Description..."
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMilestone(milestone.id)}
                        className="text-destructive hover:bg-destructive/20 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due Date
                        </label>
                        <Input
                          type="date"
                          value={milestone.dueDate}
                          onChange={(e) => updateMilestone(milestone.id, { dueDate: e.target.value })}
                          className="text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          Status
                        </label>
                        <Select
                          value={milestone.status}
                          onValueChange={(value) => updateMilestone(milestone.id, { status: value as Milestone['status'] })}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-started">Not Started</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center">
                        <Link className="h-3 w-3 mr-1" />
                        Linked Goal
                      </label>
                      <Select
                        value={milestone.linkedGoalId}
                        onValueChange={(value) => updateMilestone(milestone.id, { linkedGoalId: value })}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select a goal..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No linked goal</SelectItem>
                          {goals.map((goal) => (
                            <SelectItem key={goal.id} value={goal.id}>
                              {goal.title || 'Untitled Goal'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No milestones in this quadrant</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {milestones.length === 0 && (
        <Card className="parchment-card">
          <CardContent className="text-center py-12">
            <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Milestones Yet</h3>
            <p className="text-muted-foreground mb-4">
              Break down your goals into actionable milestones using the Eisenhower Matrix.
            </p>
            <Button onClick={addMilestone} variant="magical">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Milestone
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MilestonesProjects;