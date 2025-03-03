'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { PlusCircle, Pencil, Trash2, AlertCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Warehouse {
  id: string;
  warehouseCode: string;
  warehouseName: string;
  companyId: string;
  address: string;
  contact: string;
  contactNumber: string;
  createdAt: string;
}

export default function WarehousesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  
  // Form states
  const [warehouseCode, setWarehouseCode] = useState('');
  const [warehouseName, setWarehouseName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Check if user has permission
  useEffect(() => {
    if (status === 'authenticated') {
      if (!['admin', 'manager'].includes(session.user.role)) {
        toast.error('You do not have permission to access this page');
        router.push('/pages');
      } else {
        fetchWarehouses();
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  const fetchWarehouses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/warehouses');
      if (!response.ok) {
        throw new Error('Failed to fetch warehouses');
      }
      const data = await response.json();
      setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      toast.error('Failed to load warehouses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWarehouse = async () => {
    try {
      const response = await fetch('/api/warehouses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          warehouseCode,
          warehouseName,
          companyId,
          address,
          contact,
          contactNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create warehouse');
      }

      toast.success('Warehouse created successfully');
      fetchWarehouses();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create warehouse');
    }
  };

  const handleEditWarehouse = async () => {
    if (!selectedWarehouse) return;

    try {
      const response = await fetch(`/api/warehouses/${selectedWarehouse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          warehouseCode,
          warehouseName,
          companyId,
          address,
          contact,
          contactNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update warehouse');
      }

      toast.success('Warehouse updated successfully');
      fetchWarehouses();
      resetForm();
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update warehouse');
    }
  };

  const handleDeleteWarehouse = async () => {
    if (!selectedWarehouse) return;

    try {
      const response = await fetch(`/api/warehouses/${selectedWarehouse.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete warehouse');
      }

      toast.success('Warehouse deleted successfully');
      fetchWarehouses();
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete warehouse');
    }
  };

  const openEditDialog = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setWarehouseCode(warehouse.warehouseCode);
    setWarehouseName(warehouse.warehouseName);
    setCompanyId(warehouse.companyId);
    setAddress(warehouse.address);
    setContact(warehouse.contact);
    setContactNumber(warehouse.contactNumber);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setWarehouseCode('');
    setWarehouseName('');
    setCompanyId('');
    setAddress('');
    setContact('');
    setContactNumber('');
    setSelectedWarehouse(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter warehouses based on search term
  const filteredWarehouses = warehouses.filter(warehouse => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      warehouse.warehouseCode.toLowerCase().includes(searchTermLower) ||
      warehouse.warehouseName.toLowerCase().includes(searchTermLower) ||
      warehouse.address.toLowerCase().includes(searchTermLower)
    );
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWarehouses = filteredWarehouses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWarehouses.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground">
            Manage warehouses and their information
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Warehouse</DialogTitle>
              <DialogDescription>
                Create a new warehouse with its details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="warehouseCode">Warehouse Code</Label>
                <Input
                  id="warehouseCode"
                  value={warehouseCode}
                  onChange={(e) => setWarehouseCode(e.target.value)}
                  placeholder="WH001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="warehouseName">Warehouse Name</Label>
                <Input
                  id="warehouseName"
                  value={warehouseName}
                  onChange={(e) => setWarehouseName(e.target.value)}
                  placeholder="Main Warehouse"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyId">Company</Label>
                <Select value={companyId} onValueChange={setCompanyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Company options will be populated from API */}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Warehouse St"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact Person</Label>
                <Input
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddWarehouse}>Create Warehouse</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        {/* <CardHeader>
          <CardTitle>Warehouses</CardTitle>
          <CardDescription>
            Manage warehouse locations and their details
          </CardDescription>
        </CardHeader> */}
        <CardContent>
          {/* Search input */}
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by code, name, or address..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="pl-8"
              />
            </div>
            <div className="ml-4">
              <Select 
                value={itemsPerPage.toString()} 
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentWarehouses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-10 w-10 mb-2" />
                      {searchTerm ? 'No warehouses match your search' : 'No warehouses found'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentWarehouses.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell>{warehouse.warehouseCode}</TableCell>
                    <TableCell>{warehouse.warehouseName}</TableCell>
                    <TableCell>{warehouse.address}</TableCell>
                    <TableCell>{warehouse.contact}</TableCell>
                    <TableCell>{formatDate(warehouse.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(warehouse)}
                        title="Edit Warehouse"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(warehouse)}
                        title="Delete Warehouse"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination controls */}
          {filteredWarehouses.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredWarehouses.length)} of {filteredWarehouses.length} warehouses
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Warehouse Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Warehouse</DialogTitle>
            <DialogDescription>
              Update warehouse information and details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-warehouseCode">Warehouse Code</Label>
              <Input
                id="edit-warehouseCode"
                value={warehouseCode}
                onChange={(e) => setWarehouseCode(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-warehouseName">Warehouse Name</Label>
              <Input
                id="edit-warehouseName"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-companyId">Company</Label>
              <Select value={companyId} onValueChange={setCompanyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {/* Company options will be populated from API */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-contact">Contact Person</Label>
              <Input
                id="edit-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-contactNumber">Contact Number</Label>
              <Input
                id="edit-contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditWarehouse}>Update Warehouse</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Warehouse Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the warehouse
              {selectedWarehouse && ` "${selectedWarehouse.warehouseName}"`} and remove its data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWarehouse} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}