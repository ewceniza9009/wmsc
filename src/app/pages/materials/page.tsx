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
import { PlusCircle, Pencil, Trash2, Loader2, Package } from "lucide-react";
import ServerDataGrid from "@/components/ServerDataGrid";
import { TableRow, TableCell } from "@/components/ui/table";
import usePage from "./usePage";
import Link from "next/link";

export default function MaterialsPage() {
  const {
    materials,
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedMaterial,
    handleDelete,
    openDeleteDialog,
    // Server-side pagination and search props
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
            <Package className="h-6 w-6 text-teal-500" />
            Materials
          </h1>
          <p>Manage materials and their information</p>
        </div>

        <Link href="./materials/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <ServerDataGrid
            viewportHeight="60vh"
            data={materials}
            columns={[
              { header: "Material No." },
              { header: "Brand Code" },
              { header: "Material Name" },
              { header: "Weight Type" },
              { header: "Created" },
              { header: "Actions" },
            ]}
            searchFields={["materialNumber", "brandCode", "materialName"]}
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onSearchChange={handleSearchChange}
            searchTerm={searchTerm}
            renderRow={(material) => (
              <TableRow key={material.id}>
                <TableCell>{material.materialNumber}</TableCell>
                <TableCell>{material.brandCode}</TableCell>
                <TableCell>{material.materialName}</TableCell>
                <TableCell>{material.weightType}</TableCell>
                <TableCell>
                  {new Date(material.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`./materials/${material.id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(material)}
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
              material {selectedMaterial?.materialName}.
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
