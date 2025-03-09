"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, SaveAll, Package } from "lucide-react";
import Link from "next/link";
import usePage from "../usePage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerCombobox } from "@/components/CustomerCombobox";
import { MaterialCategoryCombobox } from "@/components/MaterialCategoryCombobox";

export default function MaterialDetailPage() {
  const { form, units, handleChange, handleSubmit, isDetailLoading, isSaving } =
    usePage();
  const { id } = useParams();
  const isEdit = id !== "new";

  if (isDetailLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="../materials">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-teal-500" />
              {form.materialName ? form.materialName : "New Material"}
            </h1>
          </div>
        </div>
        <div className="flex gap-5">
          <Button variant="outline">{"Print"}</Button>
          <Button form="mainForm" type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isSaving && <SaveAll className="mr-2 h-4 w-4" />}
            {isEdit ? "Save Changes" : "Add Material"}
          </Button>
        </div>
      </div>

      <form id="mainForm" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Material Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="materialNumber">Material Number *</Label>
                <Input
                  id="materialNumber"
                  value={form.materialNumber}
                  onChange={(e) =>
                    handleChange("materialNumber", e.target.value)
                  }
                  placeholder="Enter material number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandCode">Brand Code *</Label>
                <Input
                  id="brandCode"
                  value={form.brandCode}
                  onChange={(e) => handleChange("brandCode", e.target.value)}
                  placeholder="Enter brand code"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materialName">Material Name *</Label>
                <Input
                  id="materialName"
                  value={form.materialName}
                  onChange={(e) => handleChange("materialName", e.target.value)}
                  placeholder="Enter material name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materialCategoryId">Material Category *</Label>
                <MaterialCategoryCombobox
                  value={form.materialCategoryId}
                  onValueChange={(value) =>
                    handleChange("materialCategoryId", value)
                  }
                  placeholder="Select category"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerId">Customer *</Label>
                <CustomerCombobox
                  value={form.customerId}
                  onValueChange={(value) => handleChange("customerId", value)}
                  placeholder="Select customer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitId">Unit *</Label>
                <Select
                  value={form.unitId}
                  onValueChange={(value) => handleChange("unitId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                       {unit.unitName} ({unit.unitCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfDaysToExpiry">Days to Expiry *</Label>
                <Input
                  id="numberOfDaysToExpiry"
                  type="number"
                  value={form.numberOfDaysToExpiry}
                  onChange={(e) =>
                    handleChange(
                      "numberOfDaysToExpiry",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="Enter number of days"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fixedWeight">Fixed Weight *</Label>
                <Input
                  id="fixedWeight"
                  type="number"
                  value={form.fixedWeight}
                  onChange={(e) =>
                    handleChange("fixedWeight", parseFloat(e.target.value))
                  }
                  placeholder="Enter fixed weight"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightType">Weight Type *</Label>
                <Select
                  value={form.weightType}
                  onValueChange={(value) => handleChange("weightType", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select weight type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Variable">Variable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
