'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import DataGrid from '@/components/DataGrid';
import { TableRow, TableCell } from '@/components/ui/table';
import usePage from './usePage';

export default function WarehousesPage() {
  const {
    warehouses,
    companies,
    isLoading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedWarehouse,
    warehouseCode,
    setWarehouseCode,
    warehouseName,
    setWarehouseName,
    companyId,
    setCompanyId,
    address,
    setAddress,
    contact,
    setContact,
    contactNumber,
    setContactNumber,
    handleAddWarehouse,
    hanldeSave: handleSave,
    handleDeleteWarehouse,
    openEditDialog,
    openDeleteDialog,
    resetForm,
  } = usePage();

  if (isLoading) {
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
          <h1 className="text-2xl font-bold">Warehouses</h1>
          <p>Manage warehouses and their information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Warehouse</DialogTitle>
              <DialogDescription>
                Create a new warehouse with its details.
              </DialogDescription>
            </DialogHeader>
            {/* Warehouse add form inputs */}
            <div className="grid gap-4 py-4">
              {/* Example input field – replicate as needed */}
              {/* <Input value={warehouseCode} onChange={e => setWarehouseCode(e.target.value)} placeholder="WH001" /> */}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddWarehouse}>Create Warehouse</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <DataGrid
            data={warehouses}
            columns={[
              { header: 'Code' },
              { header: 'Name' },
              { header: 'Address' },
              { header: 'Contact' },
              { header: 'Created' },
              { header: 'Actions' },
            ]}
            searchFields={['warehouseCode', 'warehouseName', 'address']}
            renderRow={(warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell>{warehouse.warehouseCode}</TableCell>
                <TableCell>{warehouse.warehouseName}</TableCell>
                <TableCell>{warehouse.address}</TableCell>
                <TableCell>{warehouse.contact}</TableCell>
                <TableCell>{new Date(warehouse.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(warehouse)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(warehouse)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
          />
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
                  {
                    companies.map((company) => (
                    <SelectItem value={company._id as string}>{company.companyName}</SelectItem>
                    )) 
                  }                  
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the warehouse{' '}
              {selectedWarehouse?.warehouseName}.
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
