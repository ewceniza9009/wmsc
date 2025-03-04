'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { IMstCompany } from '@/models/MstCompany';
import { IMstWarehouse } from '@/models/MstWarehouse';

export default function usePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [warehouses, setWarehouses] = useState<IMstWarehouse[]>([]);
  const [companies, setCompanies] = useState<IMstCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<IMstWarehouse | null>(null);

  // Form states
  const [warehouseCode, setWarehouseCode] = useState('');
  const [warehouseName, setWarehouseName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // Authenticate and fetch initial data
  useEffect(() => {
    if (status === 'authenticated') {
      if (!['admin', 'manager'].includes(session.user.role)) {
        toast.error('You do not have permission to access this page');
        router.push('/pages');
      } else {
        fetchWarehouses();
        fetchCompanies();
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (!response.ok) throw new Error('Failed to fetch companies');
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      toast.error('Failed to load companies');
    }
  };

  const fetchWarehouses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/warehouses');
      if (!response.ok) throw new Error('Failed to fetch warehouses');
      const data = await response.json();
      setWarehouses(data);
    } catch (error) {
      toast.error('Failed to load warehouses');
    } finally {
      setIsLoading(false);
    }
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

  const handleAddWarehouse = async () => {
    try {
      const response = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ warehouseCode, warehouseName, companyId, address, contact, contactNumber }),
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ warehouseCode, warehouseName, companyId, address, contact, contactNumber }),
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

  const openEditDialog = (warehouse: IMstWarehouse) => {
    setSelectedWarehouse(warehouse);
    setWarehouseCode(warehouse.warehouseCode);
    setWarehouseName(warehouse.warehouseName);
    setCompanyId(warehouse.companyId.toString());
    setAddress(warehouse.address);
    setContact(warehouse.contact);
    setContactNumber(warehouse.contactNumber);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (warehouse: IMstWarehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteDialogOpen(true);
  };

  return {
    warehouses,
    companies,
    isLoading,
    // Dialog states
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedWarehouse,
    // Form states and setters
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
    // Handlers
    handleAddWarehouse,
    hanldeSave: handleEditWarehouse,
    handleDeleteWarehouse,
    openEditDialog,
    openDeleteDialog,
    resetForm,
  };
}
