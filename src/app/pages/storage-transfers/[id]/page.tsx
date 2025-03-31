"use client"; // Needed for hooks like useState, useEffect

import { WarehouseComboBox } from '@/components/WarehouseComboBox'; // Import the new component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textArea"; // Corrected casing
import { format } from 'date-fns'; // For formatting dates
import React, { useEffect, useState } from 'react';

// Define the structure of the fetched storage transfer data (based on GET /api/storage-transfers/[id] response)
interface StorageTransferMaterialDetail {
    id: string;
    StorageStockTransferId: string;
    StorageReceivingPalletId: string; // Consider fetching pallet details if needed
    LocationId: string; // Consider fetching location details if needed
    MaterialId: string; // Consider fetching material details if needed
    Quantity: number;
    UnitId: string; // Consider fetching unit details if needed
    Weight: number;
    // Add names/codes if populated by API
    materialName?: string;
    unitName?: string;
    locationName?: string;
}

interface StorageTransferDetail {
    id: string;
    WarehouseId: string;
    WarehouseName?: string; // Included from population
    STNumber: string;
    STDate: string; // API returns string, might need Date conversion if needed
    ToWarehouseId: string;
    ToWarehouseName?: string; // Included from population
    Particulars: string;
    ManualSTNumber: string;
    IsLocked: boolean;
    CreatedById?: string;
    CreatedDateTime?: string;
    UpdatedById?: string;
    UpdatedDateTime?: string;
    materials: StorageTransferMaterialDetail[];
}

interface Props {
  params: { id: string };
}

const StorageTransferDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [transferData, setTransferData] = useState<StorageTransferDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTransferData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/storage-transfers/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch storage transfer: ${response.statusText}`);
        }
        const data: StorageTransferDetail = await response.json();
        setTransferData(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching storage transfer details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransferData();
  }, [id]); // Re-fetch if ID changes

  if (loading) {
    return <div className="p-4">Loading storage transfer details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!transferData) {
    return <div className="p-4">Storage transfer not found.</div>;
  }

  // Helper to format date strings
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
    } catch {
      return dateString; // Return original if formatting fails
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Storage Transfer Detail</h1>

      <Card>
        <CardHeader>
          <CardTitle>Transfer Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="stNumber">ST Number</Label>
            <Input id="stNumber" value={transferData.STNumber} readOnly disabled />
          </div>
          <div className="space-y-1">
            <Label htmlFor="stDate">ST Date</Label>
            <Input id="stDate" value={formatDate(transferData.STDate)} readOnly disabled />
          </div>
           <div className="space-y-1">
            <Label htmlFor="manualStNumber">Manual ST Number</Label>
            <Input id="manualStNumber" value={transferData.ManualSTNumber} readOnly disabled />
          </div>
          <div className="space-y-1">
            <Label htmlFor="fromWarehouse">From Warehouse</Label>
            {/* Use WarehouseComboBox for display, disable interaction */}
            <WarehouseComboBox
              value={transferData.WarehouseId}
              disabled={true}
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="toWarehouse">To Warehouse</Label>
             {/* Use WarehouseComboBox for display, disable interaction */}
            <WarehouseComboBox
              value={transferData.ToWarehouseId}
              disabled={true}
              className="w-full"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="particulars">Particulars</Label>
            <Textarea id="particulars" value={transferData.Particulars} readOnly disabled />
          </div>
           <div className="flex items-center space-x-2 md:col-span-2">
             <Checkbox id="isLocked" checked={transferData.IsLocked} disabled />
             <Label htmlFor="isLocked">Is Locked</Label>
           </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transferred Materials</CardTitle>
        </CardHeader>
        <CardContent>
          {transferData.materials && transferData.materials.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Pallet ID</TableHead>
                  <TableHead>Location ID</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transferData.materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>{material.materialName || material.MaterialId}</TableCell>
                    <TableCell>{material.StorageReceivingPalletId}</TableCell>
                    <TableCell>{material.locationName || material.LocationId}</TableCell>
                    <TableCell className="text-right">{material.Quantity}</TableCell>
                    <TableCell>{material.unitName || material.UnitId}</TableCell>
                    <TableCell className="text-right">{material.Weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No materials associated with this transfer.</p>
          )}
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Audit Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label>Created By</Label>
                <Input value={transferData.CreatedById || 'N/A'} readOnly disabled />
            </div>
            <div className="space-y-1">
                <Label>Created Date/Time</Label>
                <Input value={formatDate(transferData.CreatedDateTime)} readOnly disabled />
            </div>
            <div className="space-y-1">
                <Label>Last Updated By</Label>
                <Input value={transferData.UpdatedById || 'N/A'} readOnly disabled />
            </div>
            <div className="space-y-1">
                <Label>Last Updated Date/Time</Label>
                <Input value={formatDate(transferData.UpdatedDateTime)} readOnly disabled />
            </div>
        </CardContent>
       </Card>
    </div>
  );
};

export default StorageTransferDetailPage;
