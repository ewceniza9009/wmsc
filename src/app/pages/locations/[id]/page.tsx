"use client";

import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, SaveAll, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomCombobox } from "@/components/RoomCombobox";
import usePage from "../usePage";
import Link from "next/link";

export default function LocationDetailPage() {
  const {
    form,
    handleChange,
    handleSubmit,
    isDetailLoading,
    isSaving,
  } = usePage();
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
          <Link href="../locations">
            <Button variant="outline" size="icon" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6 text-teal-500" />
              {form.locationName ? form.locationName : "New Location"}
            </h1>
          </div>
        </div>
        <Button
          form="mainForm"
          type="submit"
          disabled={isSaving}
          className="bg-teal-600 hover:bg-teal-700"          
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <SaveAll className="mr-2 h-4 w-4" />
          )}
          {isEdit ? "Save Changes" : "Add Location"}
        </Button>
      </div>

      <form id="mainForm" onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="locationNumber">Location Number *</Label>
                <Input
                  id="locationNumber"
                  value={form.locationNumber}
                  onChange={(e) =>
                    handleChange("locationNumber", e.target.value)
                  }
                  placeholder="e.g. LOC001"
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationName">Location Name *</Label>
                <Input
                  id="locationName"
                  value={form.locationName}
                  onChange={(e) =>
                    handleChange("locationName", e.target.value)
                  }
                  placeholder="e.g. Aisle 1"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomId">Room *</Label>
                <RoomCombobox
                  value={form.roomId}
                  onValueChange={(value) => handleChange("roomId", value)}
                  placeholder="Select a room"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={form.capacity}
                  onChange={(e) =>
                    handleChange("capacity", parseFloat(e.target.value))
                  }
                  placeholder="e.g. 100"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalWeight">Total Weight (kg)</Label>
                <Input
                  id="totalWeight"
                  type="number"
                  value={form.totalWeight}
                  onChange={(e) =>
                    handleChange("totalWeight", parseFloat(e.target.value))
                  }
                  placeholder="e.g. 500"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="palletCount">Pallet Count</Label>
                <Input
                  id="palletCount"
                  type="number"
                  value={form.palletCount}
                  onChange={(e) =>
                    handleChange("palletCount", parseInt(e.target.value))
                  }
                  placeholder="e.g. 50"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locBay">Bay</Label>
                <Input
                  id="locBay"
                  value={form.locBay}
                  onChange={(e) =>
                    handleChange("locBay", e.target.value)
                  }
                  placeholder="e.g. Bay 1"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locColumn">Column</Label>
                <Input
                  id="locColumn"
                  value={form.locColumn}
                  onChange={(e) =>
                    handleChange("locColumn", e.target.value)
                  }
                  placeholder="e.g. Col 1"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locRow">Row</Label>
                <Input
                  id="locRow"
                  value={form.locRow}
                  onChange={(e) =>
                    handleChange("locRow", e.target.value)
                  }
                  placeholder="e.g. Row 1"
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isLocked"
                  checked={form.isLocked}
                  onCheckedChange={(checked: boolean) =>
                    handleChange("isLocked", checked)
                  }
                />
                <Label htmlFor="isLocked">Lock Location</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
