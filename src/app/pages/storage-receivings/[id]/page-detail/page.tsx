"use client";

import { CustomerCombobox } from "@/components/CustomerCombobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import DateSelector from "@/components/ui/date-selector";
import { Input } from "@/components/ui/input";
import InputNumber from "@/components/ui/input-number";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, SaveAll, Truck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import usePage from "../../usePage";

export default function StorageReceivingDetailPage() {
  const { form, handleChange, handleSubmit, isDetailLoading, isSaving } =
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
          <Link href="/pages/storage-receivings">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Truck className="h-6 w-6 text-teal-500" />
              {form.receivingNumber
                ? form.receivingNumber
                : "New Storage Receiving"}
            </h1>
          </div>
        </div>
        <div className="flex gap-5">
          <Button variant="outline">Print</Button>
          <Button form="mainForm" type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isSaving && <SaveAll className="mr-2 h-4 w-4" />}
            {isEdit ? "Save Changes" : "Add Storage Receiving"}
          </Button>
        </div>
      </div>

      <form id="mainForm" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Storage Receiving Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-rows-7 md:grid-flow-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="receivingNumber">Receiving Number *</Label>
                <Input
                  id="receivingNumber"
                  value={form.receivingNumber}
                  disabled
                  onChange={(e) =>
                    handleChange("receivingNumber", e.target.value)
                  }
                  placeholder="Enter receiving number"
                  required
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
                <Label htmlFor="receivingDate">Receiving Date *</Label>
                <DateSelector
                  date={
                    form.receivingDate
                      ? new Date(form.receivingDate)
                      : undefined
                  }
                  onSelect={(date) => handleChange("receivingDate", date)}
                  placeholder="Select date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="truckPlateNumber">Truck Plate Number</Label>
                <Input
                  id="truckPlateNumber"
                  value={form.truckPlateNumber}
                  onChange={(e) =>
                    handleChange("truckPlateNumber", e.target.value)
                  }
                  placeholder="Enter truck plate number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="containerNumber">Container Number</Label>
                <Input
                  id="containerNumber"
                  value={form.containerNumber}
                  onChange={(e) =>
                    handleChange("containerNumber", e.target.value)
                  }
                  placeholder="Enter container number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufactureDateHeader">Manufacture Date</Label>
                <DateSelector
                  date={
                    form.manufactureDateHeader
                      ? new Date(form.manufactureDateHeader)
                      : undefined
                  }
                  onSelect={(date) =>
                    handleChange("manufactureDateHeader", date)
                  }
                  placeholder="Select date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="noDaysToPrompAlertHeader">Days to Alert</Label>
                <Input
                  id="noDaysToPrompAlertHeader"
                  type="number"
                  value={form.noDaysToPrompAlertHeader}
                  onChange={(e) =>
                    handleChange(
                      "noDaysToPrompAlertHeader",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="Enter number of days"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <InputNumber
                  id="quantity"
                  value={form.quantity}
                  onChange={(value) => handleChange("quantity", value)}
                  disabled
                  placeholder="Enter quantity"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <InputNumber
                  id="weight"
                  value={form.weight}
                  onChange={(value) => handleChange("weight", value)}
                  disabled
                  placeholder="Enter weight"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  id="remarks"
                  value={form.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  placeholder="Enter remarks"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receivedBy">Received By</Label>
                <Input
                  id="receivedBy"
                  value={form.receivedBy}
                  onChange={(e) => handleChange("receivedBy", e.target.value)}
                  placeholder="Enter receiver name"
                />
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                  id="isFreezing"
                  checked={form.isFreezing}
                  onCheckedChange={(checked) =>
                    handleChange("isFreezing", checked)
                  }
                />
                <Label htmlFor="isFreezing">Is Freezing</Label>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                  id="isLocked"
                  checked={form.isLocked}
                  onCheckedChange={(checked) =>
                    handleChange("isLocked", checked)
                  }
                />
                <Label htmlFor="isLocked">Is Locked</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
