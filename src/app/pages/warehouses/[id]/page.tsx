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
import usePage from "../usePage";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function WarehouseDetailPage() {
  const { form, handleChange, handleSubmit, companies, isLoading, isSaving } = usePage();
  const { id } = useParams();
  const isEdit = id !== "new";

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
          <h1 className="text-2xl font-bold">
            {isEdit ? "Edit Warehouse" : "Add New Warehouse"}
          </h1>
          <p>Warehouse detail section</p>
        </div>
        <div className="flex gap-5">
          <Button form="mainForm" type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Add Warehouse"}
          </Button>
          <div>
            <Link href="./">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
        </div>
      </div>

      <form id="mainForm" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="warehouseCode">Warehouse Code</Label>
          <Input
            id="warehouseCode"
            value={form.warehouseCode}
            onChange={(e) => handleChange("warehouseCode", e.target.value)}
            placeholder="e.g. WH001"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="warehouseName">Warehouse Name</Label>
          <Input
            id="warehouseName"
            value={form.warehouseName}
            onChange={(e) => handleChange("warehouseName", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="companyId">Company</Label>
          <Select
            value={form.companyId}
            onValueChange={(value) => handleChange("companyId", value)}
          >
            <SelectTrigger>
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
        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contact">Contact Person</Label>
          <Input
            id="contact"
            value={form.contact}
            onChange={(e) => handleChange("contact", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            value={form.contactNumber}
            onChange={(e) => handleChange("contactNumber", e.target.value)}
          />
        </div>
      </form>
    </div>
  );
}
