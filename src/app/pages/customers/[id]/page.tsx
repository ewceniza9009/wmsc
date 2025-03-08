"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Loader2,
  Save,
  SaveAll,
  UserRoundSearch,
} from "lucide-react";
import Link from "next/link";
import usePage from "../usePage";
import { AccountCombobox } from "@/components/AccountCombobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomerDetailPage() {
  const { form, terms, handleChange, handleSubmit, isDetailLoading, isSaving } =
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
          <Link href="../customers">
            <Button variant="outline" size="icon" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UserRoundSearch className="h-6 w-6 text-primary" />
              {form.customerName ? form.customerName : "New Customer"}
            </h1>
          </div>
        </div>
        <div className="flex gap-5">
          <Button
            form="mainForm"
            type="submit"
            disabled={isSaving}
            className="cursor-pointer hover:bg-accent-foreground hover:scale-105 transition transform duration-200 text-white"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isSaving && <SaveAll className="mr-2 h-4 w-4" />}
            {isEdit ? "Save Changes" : "Add Customer"}
          </Button>
        </div>
      </div>

      <form id="mainForm" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customerNumber">Customer Number *</Label>
                <Input
                  id="customerNumber"
                  value={form.customerNumber}
                  onChange={(e) =>
                    handleChange("customerNumber", e.target.value)
                  }
                  placeholder="Enter customer number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={form.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountId">Account</Label>
                <AccountCombobox
                  value={form.accountId}
                  onValueChange={(value) => handleChange("accountId", value)}
                  placeholder="Select an account"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="termId">Terms</Label>
                <Select
                  value={form.termId}
                  onValueChange={(value) => handleChange("termId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map((term) => (
                      <SelectItem key={term.id} value={term.id}>
                        {term.terms}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="Enter company name"
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
                <Label htmlFor="contactPosition">Contact Position</Label>
                <Input
                  id="contactPosition"
                  value={form.contactPosition}
                  onChange={(e) =>
                    handleChange("contactPosition", e.target.value)
                  }
                  placeholder="Enter contact position"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  value={form.contactNumber}
                  onChange={(e) =>
                    handleChange("contactNumber", e.target.value)
                  }
                  placeholder="Enter contact number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  value={form.emailAddress}
                  onChange={(e) => handleChange("emailAddress", e.target.value)}
                  placeholder="Enter email address"
                  type="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tinNumber">TIN Number</Label>
                <Input
                  id="tinNumber"
                  value={form.tinNumber}
                  onChange={(e) => handleChange("tinNumber", e.target.value)}
                  placeholder="Enter TIN number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faxNumber">Fax Number</Label>
                <Input
                  id="faxNumber"
                  value={form.faxNumber}
                  onChange={(e) => handleChange("faxNumber", e.target.value)}
                  placeholder="Enter fax number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salesPerson">Sales Person</Label>
                <Input
                  id="salesPerson"
                  value={form.salesPerson}
                  onChange={(e) => handleChange("salesPerson", e.target.value)}
                  placeholder="Enter sales person"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditLimit">Credit Limit</Label>
                <Input
                  id="creditLimit"
                  value={form.creditLimit}
                  onChange={(e) => handleChange("creditLimit", e.target.value)}
                  placeholder="Enter credit limit"
                  type="number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="address">Primary Address *</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Enter primary address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Input
                  id="billingAddress"
                  value={form.billingAddress}
                  onChange={(e) =>
                    handleChange("billingAddress", e.target.value)
                  }
                  placeholder="Enter billing address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Input
                  id="shippingAddress"
                  value={form.shippingAddress}
                  onChange={(e) =>
                    handleChange("shippingAddress", e.target.value)
                  }
                  placeholder="Enter shipping address"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
