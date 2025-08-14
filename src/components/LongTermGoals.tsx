import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Target, Calendar } from 'lucide-react';

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

interface LongTermGoalsProps {
  goals: Goal[];
  onGoalsChange: (goals: Goal[]) => void;
}

const sevenHabitsLabels = {
  proactive: "Be Proactive",
  beginWithEnd: "Begin with the End in Mind",
  firstThingsFirst: "Put First Things First",
  winWin: "Think Win-Win",
  seekFirst: "Seek First to Understand",
  synergize: "Synergize",
  sharpenSaw: "Sharpen the Saw"
};

const LongTermGoals: React.FC<LongTermGoalsProps> = ({ goals, onGoalsChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: '',
      successMetric: '',
      whyItMatters: '',
      targetDate: '',
      sevenHabits: {
        proactive: false,
        beginWithEnd: false,
        firstThingsFirst: false,
        winWin: false,
        seekFirst: false,
        synergize: false,
        sharpenSaw: false
      }
    };
    onGoalsChange([...goals, newGoal]);
    setEditingId(newGoal.id);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    onGoalsChange(goals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = (id: string) => {
    onGoalsChange(goals.filter(goal => goal.id !== id));
  };

  const updateHabit = (goalId: string, habit: keyof Goal['sevenHabits'], value: boolean) => {
    updateGoal(goalId, {
      sevenHabits: {
        ...goals.find(g => g.id === goalId)?.sevenHabits!,
        [habit]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target className="h-6 w-6 text-hufflepuff-gold" />
          <h2 className="font-magical text-2xl font-bold">Long-Term Goals</h2>
        </div>
        <Button onClick={addGoal} variant="magical">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="grid gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="parchment-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <Input
                  value={goal.title}
                  onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                  placeholder="Goal title..."
                  className="text-lg font-semibold border-none bg-transparent p-0 focus:ring-0"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteGoal(goal.id)}
                  className="text-destructive hover:bg-destructive/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Success Metric
                </label>
                <Input
                  value={goal.successMetric}
                  onChange={(e) => updateGoal(goal.id, { successMetric: e.target.value })}
                  placeholder="How will you know you've achieved this goal?"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Why It Matters
                </label>
                <Textarea
                  value={goal.whyItMatters}
                  onChange={(e) => updateGoal(goal.id, { whyItMatters: e.target.value })}
                  placeholder="Why is this goal important to you?"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Target Date
                </label>
                <Input
                  type="date"
                  value={goal.targetDate}
                  onChange={(e) => updateGoal(goal.id, { targetDate: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">
                  7 Habits Alignment
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(sevenHabitsLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${goal.id}-${key}`}
                        checked={goal.sevenHabits[key as keyof Goal['sevenHabits']]}
                        onCheckedChange={(checked) => 
                          updateHabit(goal.id, key as keyof Goal['sevenHabits'], checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`${goal.id}-${key}`}
                        className="text-sm cursor-pointer"
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {goals.length === 0 && (
          <Card className="parchment-card">
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Goals Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first long-term goal to begin your magical journey.
              </p>
              <Button onClick={addGoal} variant="magical">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LongTermGoals;