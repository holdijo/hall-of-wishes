import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Users, Star } from 'lucide-react';
import sortingHatImage from '@/assets/sorting-hat.png';

interface Role {
  id: string;
  title: string;
  description: string;
  keyResponsibilities: string;
  weeklyGoals: string;
  isStarred: boolean;
}

interface RolesSectionProps {
  roles: Role[];
  onRolesChange: (roles: Role[]) => void;
}

const RolesSection: React.FC<RolesSectionProps> = ({ roles, onRolesChange }) => {
  const addRole = () => {
    const newRole: Role = {
      id: Date.now().toString(),
      title: '',
      description: '',
      keyResponsibilities: '',
      weeklyGoals: '',
      isStarred: false
    };
    onRolesChange([...roles, newRole]);
  };

  const updateRole = (id: string, updates: Partial<Role>) => {
    onRolesChange(roles.map(role => 
      role.id === id ? { ...role, ...updates } : role
    ));
  };

  const deleteRole = (id: string) => {
    onRolesChange(roles.filter(role => role.id !== id));
  };

  const toggleStar = (id: string) => {
    updateRole(id, { isStarred: !roles.find(r => r.id === id)?.isStarred });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-hufflepuff-gold" />
          <h2 className="font-magical text-2xl font-bold">Life Roles</h2>
        </div>
        <Button onClick={addRole} variant="magical">
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      {/* Sorting Hat Corner Decoration */}
      <div className="relative">
        <div className="absolute -top-4 -right-4 w-24 h-24 opacity-20 pointer-events-none z-0">
          <img 
            src={sortingHatImage} 
            alt="Sorting Hat" 
            className="w-full h-full object-contain floating"
          />
        </div>
        
        <div className="grid gap-6 relative z-10">
          {roles.map((role) => (
            <Card key={role.id} className="parchment-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStar(role.id)}
                      className={`${role.isStarred ? 'text-hufflepuff-gold' : 'text-muted-foreground'} hover:bg-hufflepuff-gold/20`}
                    >
                      <Star className={`h-4 w-4 ${role.isStarred ? 'fill-current' : ''}`} />
                    </Button>
                    <Input
                      value={role.title}
                      onChange={(e) => updateRole(role.id, { title: e.target.value })}
                      placeholder="Role title (e.g., Parent, Professional, Student...)"
                      className="text-lg font-semibold border-none bg-transparent p-0 focus:ring-0"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRole(role.id)}
                    className="text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Role Description
                  </label>
                  <Textarea
                    value={role.description}
                    onChange={(e) => updateRole(role.id, { description: e.target.value })}
                    placeholder="What does this role mean to you? Why is it important?"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Key Responsibilities
                  </label>
                  <Textarea
                    value={role.keyResponsibilities}
                    onChange={(e) => updateRole(role.id, { keyResponsibilities: e.target.value })}
                    placeholder="What are your main responsibilities in this role?"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Weekly Goals & Focus Areas
                  </label>
                  <Textarea
                    value={role.weeklyGoals}
                    onChange={(e) => updateRole(role.id, { weeklyGoals: e.target.value })}
                    placeholder="What do you want to accomplish this week in this role?"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {roles.length === 0 && (
            <Card className="parchment-card">
              <CardContent className="text-center py-12">
                <div className="relative">
                  <img 
                    src={sortingHatImage} 
                    alt="Sorting Hat" 
                    className="h-20 w-20 mx-auto mb-4 opacity-60"
                  />
                  <h3 className="font-semibold text-lg mb-2">Define Your Life Roles</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    The Sorting Hat sees all roles within you. Define the different roles you play in life 
                    to bring balance and clarity to your weekly planning.
                  </p>
                  <Button onClick={addRole} variant="magical">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Role
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {roles.length > 0 && (
        <Card className="parchment-card bg-hufflepuff-gold/5 border-hufflepuff-gold/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-hufflepuff-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">💡</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Sorting Hat's Wisdom:</p>
                <p>
                  "Balance in all things brings harmony to your magical journey. 
                  Star your most important roles this week and ensure each receives proper attention 
                  in your weekly planning."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RolesSection;