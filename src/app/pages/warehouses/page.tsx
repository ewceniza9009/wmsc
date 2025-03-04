"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";
import DataGrid from "@/components/DataGrid";
import { TableRow, TableCell } from "@/components/ui/table";
import usePage from "./usePage";
import Link from "next/link";

export default function WarehousesPage() {
  const {
    warehouses,
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedWarehouse,
    handleDelete,
    openDeleteDialog,
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

        <Link href="./warehouses/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <DataGrid
            data={warehouses}
            columns={[
              { header: "Code" },
              { header: "Name" },
              { header: "Address" },
              { header: "Contact" },
              { header: "Created" },
              { header: "Actions" },
            ]}
            searchFields={["warehouseCode", "warehouseName", "address"]}
            renderRow={(warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell>{warehouse.warehouseCode}</TableCell>
                <TableCell>{warehouse.warehouseName}</TableCell>
                <TableCell>{warehouse.address}</TableCell>
                <TableCell>{warehouse.contact}</TableCell>
                <TableCell>
                  {new Date(warehouse.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`./warehouses/${warehouse.id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(warehouse)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
          />
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the
              warehouse {selectedWarehouse?.warehouseName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
