"use client";

import ServerDataGrid from "@/components/ServerDataGrid";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { Grid2X2Plus, Pencil, PlusCircle, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import usePage from "./usePage";

export default function StorageTransfersPage() {
  const {
    storageTransfers,
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedStorageTransfer,
    handleDelete,
    openDeleteDialog,
    totalItems,
    currentPage,
    itemsPerPage,
    searchTerm,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
  } = usePage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="h-6 w-6 text-teal-500" />
            Storage Transfers
          </h1>
          <p>Manage storage transfers and their information</p>
        </div>

        <Link href={`/pages/storage-transfers/new/page-detail`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <ServerDataGrid
            viewportHeight="60vh"
            data={storageTransfers}
            columns={[
              { header: "Transfer No." },
              { header: "Transfer Date" },
              { header: "Warehouse" },
              { header: "Warehouse To" },
              { header: "Particulars" },
              { header: "Locked" },
              { header: "Actions" },
            ]}
            searchFields={["transferNumber, customerName"]}
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onSearchChange={handleSearchChange}
            searchTerm={searchTerm}
            renderRow={(storageTransfer) => (
              <TableRow key={storageTransfer.id}>
                <TableCell>{storageTransfer.STNumber}</TableCell>
                <TableCell>
                  {new Date(storageTransfer.STDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {storageTransfer.WarehouseName}
                </TableCell>
                <TableCell>
                  {storageTransfer.ToWarehouseName}
                </TableCell>
                <TableCell>{storageTransfer.Particulars}</TableCell>

                <TableCell>
                  <Checkbox checked={storageTransfer.IsLocked} />
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/pages/storage-transfers/${storageTransfer.id}`}
                  >
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/pages/storage-transfers/${storageTransfer.id}`}>
                    <Button variant="ghost" size="icon">
                      <Grid2X2Plus className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(storageTransfer)}
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
              material {selectedStorageTransfer?.STNumber}.
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
