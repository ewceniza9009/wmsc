"use client";

import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textArea";
import usePage from "../usePage";
import Link from "next/link";
import { ArrowLeft, Loader2, SaveAll, Warehouse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WarehouseDetailPage() {
  const {
    form,
    handleChange,
    handleSubmit,
    companies,
    isDetailLoading,
    isSaving,
  } = usePage();
  const { id } = useParams();
  const isEdit = id !== "new";

  if (isDetailLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="../warehouses">
            <Button variant="outline" size="icon" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Warehouse className="h-6 w-6 text-primary" />
              {form.warehouseName ? form.warehouseName : "New Warehouse"}
            </h1>
          </div>
        </div>
        <Button
          form="mainForm"
          type="submit"
          disabled={isSaving}          
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <SaveAll className="mr-2 h-4 w-4" />
          )}
          {isEdit ? "Save Changes" : "Add Warehouse"}
        </Button>
      </div>

      <form id="mainForm" onSubmit={handleSubmit} className="space-y-4">
        <Card className="min-h-[77vh]">
          <CardHeader>
            <CardTitle>Warehouse Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="warehouseCode">Warehouse Code</Label>
                <Input
                  id="warehouseCode"
                  value={form.warehouseCode}
                  onChange={(e) =>
                    handleChange("warehouseCode", e.target.value)
                  }
                  placeholder="e.g. WH001"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouseName">Warehouse Name</Label>
                <Input
                  id="warehouseName"
                  value={form.warehouseName}
                  onChange={(e) =>
                    handleChange("warehouseName", e.target.value)
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyId">Company</Label>
                <Select
                  value={form.companyId}
                  onValueChange={(value) => handleChange("companyId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Enter address"
                  rows={4}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Person</Label>
                <Input
                  id="contact"
                  value={form.contact}
                  onChange={(e) => handleChange("contact", e.target.value)}
                  placeholder="Enter contact person"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={form.contactNumber}
                  onChange={(e) =>
                    handleChange("contactNumber", e.target.value)
                  }
                  placeholder="Enter contact number"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
