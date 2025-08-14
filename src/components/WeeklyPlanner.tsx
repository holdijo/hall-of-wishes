import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Calendar, Users, CheckSquare } from 'lucide-react';

interface WeeklyItem {
  id: string;
  type: 'role' | 'big-rock' | 'task';
  title: string;
  description: string;
  dayOfWeek: string;
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface WeeklyPlannerProps {
  weeklyItems: WeeklyItem[];
  onWeeklyItemsChange: (items: WeeklyItem[]) => void;
}

const daysOfWeek = [
  { value: '', label: 'Week Start (Default)' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

const priorityColors = {
  high: 'border-red-500 bg-red-50 dark:bg-red-950/20',
  medium: 'border-hufflepuff-gold bg-hufflepuff-gold/10',
  low: 'border-green-500 bg-green-50 dark:bg-green-950/20'
};

const typeIcons = {
  role: Users,
  'big-rock': Calendar,
  task: CheckSquare
};

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ weeklyItems, onWeeklyItemsChange }) => {
  const [selectedType, setSelectedType] = useState<WeeklyItem['type']>('task');

  const addItem = (type: WeeklyItem['type']) => {
    const newItem: WeeklyItem = {
      id: Date.now().toString(),
      type,
      title: '',
      description: '',
      dayOfWeek: '',
      isCompleted: false,
      priority: 'medium'
    };
    onWeeklyItemsChange([...weeklyItems, newItem]);
  };

  const updateItem = (id: string, updates: Partial<WeeklyItem>) => {
    onWeeklyItemsChange(weeklyItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id: string) => {
    onWeeklyItemsChange(weeklyItems.filter(item => item.id !== id));
  };

  const toggleCompletion = (id: string) => {
    const item = weeklyItems.find(item => item.id === id);
    if (item) {
      updateItem(id, { isCompleted: !item.isCompleted });
    }
  };

  const groupedItems = weeklyItems.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<WeeklyItem['type'], WeeklyItem[]>);

  const getCompletionStats = (type: WeeklyItem['type']) => {
    const items = groupedItems[type] || [];
    const completed = items.filter(item => item.isCompleted).length;
    const total = items.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-hufflepuff-gold" />
          <h2 className="font-magical text-2xl font-bold">Weekly Planner</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as WeeklyItem['type'])}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="role">Role</SelectItem>
              <SelectItem value="big-rock">Big Rock</SelectItem>
              <SelectItem value="task">Task</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => addItem(selectedType)} variant="magical">
            <Plus className="h-4 w-4 mr-2" />
            Add {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(['role', 'big-rock', 'task'] as const).map((type) => {
          const Icon = typeIcons[type];
          const stats = getCompletionStats(type);
          
          return (
            <Card key={type} className="parchment-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-hufflepuff-gold" />
                    <span className="capitalize">{type === 'big-rock' ? 'Big Rocks' : `${type}s`}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stats.completed}/{stats.total}
                  </div>
                </CardTitle>
                {stats.total > 0 && (
                  <div className="w-full bg-stone-medium/30 rounded-full h-2">
                    <div 
                      className="bg-hufflepuff-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {groupedItems[type]?.map((item) => (
                  <Card 
                    key={item.id} 
                    className={`bg-background/50 border transition-all duration-200 ${
                      item.isCompleted ? 'opacity-60' : ''
                    } ${priorityColors[item.priority]}`}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Checkbox
                            checked={item.isCompleted}
                            onCheckedChange={() => toggleCompletion(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <Input
                              value={item.title}
                              onChange={(e) => updateItem(item.id, { title: e.target.value })}
                              placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} title...`}
                              className={`font-semibold border-none bg-transparent p-0 focus:ring-0 ${
                                item.isCompleted ? 'line-through' : ''
                              }`}
                            />
                            <Textarea
                              value={item.description}
                              onChange={(e) => updateItem(item.id, { description: e.target.value })}
                              placeholder="Description..."
                              rows={2}
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteItem(item.id)}
                          className="text-destructive hover:bg-destructive/20 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">
                            Day of Week
                          </label>
                          <Select
                            value={item.dayOfWeek}
                            onValueChange={(value) => updateItem(item.id, { dayOfWeek: value })}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {daysOfWeek.map((day) => (
                                <SelectItem key={day.value} value={day.value}>
                                  {day.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">
                            Priority
                          </label>
                          <Select
                            value={item.priority}
                            onValueChange={(value) => updateItem(item.id, { priority: value as WeeklyItem['priority'] })}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No {type}s added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {weeklyItems.length === 0 && (
        <Card className="parchment-card">
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Weekly Items Yet</h3>
            <p className="text-muted-foreground mb-4">
              Organize your week with roles, big rocks, and tasks to stay focused on what matters most.
            </p>
            <div className="flex justify-center space-x-2">
              <Button onClick={() => addItem('role')} variant="outline">
                Add Role
              </Button>
              <Button onClick={() => addItem('big-rock')} variant="outline">
                Add Big Rock
              </Button>
              <Button onClick={() => addItem('task')} variant="magical">
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeeklyPlanner;