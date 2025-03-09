"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Container, Loader2, SaveAll } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import usePage from "../usePage";

export default function RoomDetailPage() {
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
          <Link href="../rooms">
            <Button variant="outline" size="icon" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Container className="h-6 w-6 text-teal-500" />
              {form.roomName ? form.roomName : "New Room"}
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
          {isEdit ? "Save Changes" : "Add Room"}
        </Button>
      </div>

      <form id="mainForm" onSubmit={handleSubmit} className="space-y-4">
        <Card className="min-h-[77vh]">
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  value={form.roomNumber}
                  onChange={(e) =>
                    handleChange("roomNumber", e.target.value)
                  }
                  placeholder="e.g. R001"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                  id="roomName"
                  value={form.roomName}
                  onChange={(e) =>
                    handleChange("roomName", e.target.value)
                  }
                  placeholder="e.g. Cold Storage Room"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperatureFrom">Minimum Temperature (°C)</Label>
                <Input
                  id="temperatureFrom"
                  type="number"
                  value={form.temperatureFrom}
                  onChange={(e) =>
                    handleChange("temperatureFrom", parseFloat(e.target.value))
                  }
                  placeholder="e.g. -5"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperatureTo">Maximum Temperature (°C)</Label>
                <Input
                  id="temperatureTo"
                  type="number"
                  value={form.temperatureTo}
                  onChange={(e) =>
                    handleChange("temperatureTo", parseFloat(e.target.value))
                  }
                  placeholder="e.g. 5"
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
