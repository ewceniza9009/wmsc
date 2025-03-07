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
import { PlusCircle, Pencil, Trash2, Building2 } from "lucide-react";
import DataGrid from "@/components/DataGrid";
import { TableRow, TableCell } from "@/components/ui/table";
import usePage from "./usePage";
import Link from "next/link";

export default function CompaniesPage() {
  const {
    companies,
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedCompany,
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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Companies
          </h1>
          <p>Manage companies and their information</p>
        </div>

        <Link href="./companies/new">
          <Button className="cursor-pointer hover:bg-accent-foreground hover:scale-105 transition transform duration-200 text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <DataGrid
            viewportHeight="60vh"
            data={companies}
            columns={[
              { header: "Company Name" },
              { header: "Address" },
              { header: "Contact Person" },
              { header: "Contact No" },
              { header: "Created" },
              { header: "Actions" },
            ]}
            searchFields={["companyName", "companyAddress", "contactPerson"]}
            renderRow={(company) => (
              <TableRow key={company.id}>
                <TableCell>{company.companyName}</TableCell>
                <TableCell>{company.companyAddress}</TableCell>
                <TableCell>{company.contactPerson}</TableCell>
                <TableCell>{company.contactNo}</TableCell>
                <TableCell>
                  {new Date(company.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`./companies/${company.id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(company)}
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
              company {selectedCompany?.companyName}.
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