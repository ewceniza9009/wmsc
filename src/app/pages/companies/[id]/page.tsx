"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, Loader2, Save, SaveAll } from "lucide-react";
import Link from "next/link";
import usePage from "../usePage";

export default function CompanyDetailPage() {
  const { form, handleChange, handleSubmit, isDetailLoading, isSaving } =
    usePage();
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
          <Link href="../companies">
            <Button variant="outline" size="icon" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              {form.companyName ? form.companyName : "New Company"}
            </h1>
          </div>
        </div>
        <div className="flex gap-5">
          <Button form="mainForm" type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isSaving && <SaveAll className="mr-2 h-4 w-4" />}
            {isEdit ? "Save Changes" : "Add Company"}
          </Button>
        </div>
      </div>

      <form id="mainForm" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="Enter company name]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address *</Label>
                <Input
                  id="companyAddress"
                  value={form.companyAddress}
                  onChange={(e) =>
                    handleChange("companyAddress", e.target.value)
                  }
                  placeholder="Enter address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={form.contactPerson}
                  onChange={(e) =>
                    handleChange("contactPerson", e.target.value)
                  }
                  placeholder="Enter contact person"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNo">Contact Number *</Label>
                <Input
                  id="contactNo"
                  value={form.contactNo}
                  onChange={(e) => handleChange("contactNo", e.target.value)}
                  placeholder="Enter contact number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiin">TIN</Label>
                <Input
                  id="tiin"
                  value={form.tiin}
                  onChange={(e) => handleChange("tiin", e.target.value)}
                  placeholder="Enter tin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bookNumber">Book Number</Label>
                <Input
                  id="bookNumber"
                  value={form.bookNumber}
                  onChange={(e) => handleChange("bookNumber", e.target.value)}
                  placeholder="Enter book number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accreditationNumber">
                  Accreditation Number
                </Label>
                <Input
                  id="accreditationNumber"
                  value={form.accreditationNumber}
                  onChange={(e) =>
                    handleChange("accreditationNumber", e.target.value)
                  }
                   placeholder="Enter accreditation number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={form.serialNumber}
                  onChange={(e) => handleChange("serialNumber", e.target.value)}
                   placeholder="Enter serial number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="permitNumber">Permit Number</Label>
                <Input
                  id="permitNumber"
                  value={form.permitNumber}
                  onChange={(e) => handleChange("permitNumber", e.target.value)}
                   placeholder="Enter permit number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Company Officials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="accountant">Accountant</Label>
                <Input
                  id="accountant"
                  value={form.accountant}
                  onChange={(e) => handleChange("accountant", e.target.value)}
                   placeholder="Enter accountant"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="financeManager">Finance Manager</Label>
                <Input
                  id="financeManager"
                  value={form.financeManager}
                  onChange={(e) =>
                    handleChange("financeManager", e.target.value)
                  }
                   placeholder="Enter finance manager"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operationsManager">Operations Manager</Label>
                <Input
                  id="operationsManager"
                  value={form.operationsManager}
                  onChange={(e) =>
                    handleChange("operationsManager", e.target.value)
                  }
                   placeholder="Enter operations manager"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="managingDirector">Managing Director</Label>
                <Input
                  id="managingDirector"
                  value={form.managingDirector}
                  onChange={(e) =>
                    handleChange("managingDirector", e.target.value)
                  }
                   placeholder="Enter managing director"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultApproveBy">Default Approve By</Label>
                <Input
                  id="defaultApproveBy"
                  value={form.defaultApproveBy}
                  onChange={(e) =>
                    handleChange("defaultApproveBy", e.target.value)
                  }
                   placeholder="Enter default approved by"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
