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
import { Pencil, PlusCircle, Trash2, Truck, Eye } from "lucide-react";
import Link from "next/link";
import numeral from "numeral";
import usePage from "./usePage";

export default function StorageRecevingsPage() {
  const {
    storageReceivings,
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedStorageReceving,
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
            Storage Receivings
          </h1>
          <p>Manage storage receivings and their information</p>
        </div>

        <Link href="./storage-receivings/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <ServerDataGrid
            viewportHeight="60vh"
            data={storageReceivings}
            columns={[
              { header: "Receiving No." },
              { header: "Receiving Date" },
              { header: "Customer" },
              { header: "Weight (Kg)" },
              { header: "Is Freezing" },
              { header: "Locked" },
              { header: "Actions" },
            ]}
            searchFields={["receivingNumber, customerName"]}
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onSearchChange={handleSearchChange}
            searchTerm={searchTerm}
            renderRow={(storageReceiving) => (
              <TableRow key={storageReceiving.id}>
                <TableCell>{storageReceiving.receivingNumber}</TableCell>
                <TableCell>
                  {new Date(storageReceiving.receivingDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{storageReceiving.customerName}</TableCell>
                <TableCell>
                  {numeral(storageReceiving.weight).format("0.00")}
                </TableCell>
                <TableCell>
                  <Checkbox checked={storageReceiving.isFreezing} />
                </TableCell>
                <TableCell>
                  <Checkbox checked={storageReceiving.isLocked} />
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/pages/storage-receivings/${storageReceiving.id}/page-detail`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/pages/storage-receivings/${storageReceiving.id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(storageReceiving)}
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
              material {selectedStorageReceving?.receivingNumber}.
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
