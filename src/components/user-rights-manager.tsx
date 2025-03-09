'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Route {
  id: string;
  path: string;
  name: string;
  description?: string;
}

interface UserRight {
  id?: string;
  userId: string;
  routeId: string;
  routePath?: string;
  routeName?: string;
  routeDescription?: string;
  canAdd: boolean;
  canEdit: boolean;
  canSave: boolean;
  canDelete: boolean;
  canPrint: boolean;
}

interface UserRightsManagerProps {
  userId: string;
  onClose?: () => void;
}

export default function UserRightsManager({ userId, onClose }: UserRightsManagerProps) {
  const [userRights, setUserRights] = useState<UserRight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch routes and user rights
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all routes
        const routesResponse = await fetch('/api/routes');
        if (!routesResponse.ok) {
          throw new Error('Failed to fetch routes');
        }
        const routesData = await routesResponse.json();
        
        // Fetch user rights for this user
        const userRightsResponse = await fetch(`/api/user-rights?userId=${userId}`);
        if (!userRightsResponse.ok) {
          throw new Error('Failed to fetch user rights');
        }
        const userRightsData = await userRightsResponse.json();
        setUserRights(userRightsData);
        
        // If no rights exist for some routes, create empty rights objects
        const existingRouteIds = userRightsData.map((right: UserRight) => right.routeId);
        const missingRoutes = routesData.filter((route: Route) => !existingRouteIds.includes(route.id));
        
        if (missingRoutes.length > 0) {
          const newRights = missingRoutes.map((route: Route) => ({
            userId,
            routeId: route.id,
            routePath: route.path,
            routeName: route.name,
            routeDescription: route.description,
            canAdd: false,
            canEdit: false,
            canSave: false,
            canDelete: false,
            canPrint: false,
          }));
          
          setUserRights([...userRightsData, ...newRights]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load user rights data');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchData();
    }
  }, [userId]);
  
  // Handle checkbox changes
  const handleRightChange = (routeId: string, field: keyof UserRight, value: boolean) => {
    setUserRights(prevRights => 
      prevRights.map(right => 
        right.routeId === routeId ? { ...right, [field]: value } : right
      )
    );
  };
  
  // Save user rights
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const rightsToSave = userRights.map(right => ({
        routeId: right.routeId,
        canAdd: right.canAdd,
        canEdit: right.canEdit,
        canSave: right.canSave,
        canDelete: right.canDelete,
        canPrint: right.canPrint,
      }));
      
      const response = await fetch('/api/user-rights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          rights: rightsToSave,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user rights');
      }
      
      toast.success('User rights updated successfully');
      if (onClose) onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user rights');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Permissions</CardTitle>
          <CardDescription>
            Manage access rights for each route in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-4 font-medium text-sm border-b pb-2">
              <div className="col-span-2">Route</div>
              <div className="text-center">Add</div>
              <div className="text-center">Edit</div>
              <div className="text-center">Save</div>
              <div className="text-center">Delete</div>
              <div className="text-center">Print</div>
            </div>
            
            {userRights.sort((a, b) => (a.routeName || '').localeCompare(b.routeName || '')).map((right) => (
              <div key={right.routeId} className="grid grid-cols-7 gap-4 items-center py-2 border-b border-gray-100">
                <div className="col-span-2">
                  <div className="font-medium">{right.routeName}</div>
                  <div className="text-xs text-muted-foreground">{right.routePath}</div>
                </div>
                
                <div className="flex justify-center">
                  <Checkbox 
                    id={`${right.routeId}-add`}
                    checked={right.canAdd}
                    onCheckedChange={(checked) => handleRightChange(right.routeId, 'canAdd', checked === true)}
                  />
                </div>
                
                <div className="flex justify-center">
                  <Checkbox 
                    id={`${right.routeId}-edit`}
                    checked={right.canEdit}
                    onCheckedChange={(checked) => handleRightChange(right.routeId, 'canEdit', checked === true)}
                  />
                </div>
                
                <div className="flex justify-center">
                  <Checkbox 
                    id={`${right.routeId}-save`}
                    checked={right.canSave}
                    onCheckedChange={(checked) => handleRightChange(right.routeId, 'canSave', checked === true)}
                  />
                </div>
                
                <div className="flex justify-center">
                  <Checkbox 
                    id={`${right.routeId}-delete`}
                    checked={right.canDelete}
                    onCheckedChange={(checked) => handleRightChange(right.routeId, 'canDelete', checked === true)}
                  />
                </div>
                
                <div className="flex justify-center">
                  <Checkbox 
                    id={`${right.routeId}-print`}
                    checked={right.canPrint}
                    onCheckedChange={(checked) => handleRightChange(right.routeId, 'canPrint', checked === true)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Permissions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}