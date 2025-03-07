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

export default function CustomersPage() {
  const {
    customers,
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedCustomer,
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
          <h1 className="text-2xl font-bold">Customers</h1>
          <p>Manage customers and their information</p>
        </div>

        <Link href="./customers/new">
          <Button className="cursor-pointer hover:bg-accent-foreground hover:scale-105 transition transform duration-200 text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <DataGrid
            viewportHeight="60vh"
            data={customers}
            columns={[
              { header: "Customer No." },
              { header: "Name" },
              { header: "Company" },
              { header: "Contact Person" },
              { header: "Contact Number" },
              { header: "Created" },
              { header: "Actions" },
            ]}
            searchFields={["customerNumber", "customerName", "companyName", "contactPerson"]}
            renderRow={(customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.customerNumber}</TableCell>
                <TableCell>{customer.customerName}</TableCell>
                <TableCell>{customer.companyName}</TableCell>
                <TableCell>{customer.contactPerson}</TableCell>
                <TableCell>{customer.contactNumber}</TableCell>
                <TableCell>
                  {new Date(customer.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`./customers/${customer.id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(customer)}
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
              customer {selectedCustomer?.customerName}.
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

