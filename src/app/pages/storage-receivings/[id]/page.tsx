"use client";

import { MaterialCombobox } from "@/components/MaterialCombobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stepper } from "@/components/ui/stepper";
import { StorageReceiving } from "@/models/TrnStorageReceiving";
import { StorageReceivingPallet } from "@/models/TrnStorageReceivingPallet";
import axios from "axios";
import { ListPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function StorageReceivingDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [storageReceiving, setStorageReceiving] =
    useState<StorageReceiving | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [palletData, setPalletData] = useState({
    palletNumber: "",
    locationId: "",
    materialId: "",
    quantity: 0,
    unitId: "",
    grossWeight: 0,
    packageTareWeight: 0,
    palletTareWeight: 0,
    netWeight: 0,
    barCode: "",
  });

  const [units, setUnits] = useState([]);

  const steps = [
    {
      id: "pallet-info",
      title: "Pallet Information",
      description: "Enter pallet details",
    },
    { id: "weighing", title: "Weighing", description: "Weigh the pallet" },
    {
      id: "barcode",
      title: "Barcode Generation",
      description: "Generate barcode",
    },
    {
      id: "confirmation",
      title: "Confirmation",
      description: "Confirm and save",
    },
  ];

  useEffect(() => {
    if (status === "authenticated") {
      if (!id) {
        toast.error("No storage receiving ID provided");
        router.push("/pages/storage-receivings");
        return;
      }

      fetchStorageReceiving();
      fetchUnits();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, id]);

  const fetchStorageReceiving = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/storage-receivings/${id}`);
      setStorageReceiving(data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load storage receiving"
      );
      router.push("/pages/storage-receivings");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const { data } = await axios.get("/api/units");
      setUnits(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load units");
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setPalletData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Calculate net weight when any weight field changes
    if (
      ["grossWeight", "packageTareWeight", "palletTareWeight"].includes(field)
    ) {
      const updatedData = { ...palletData, [field]: value };
      const netWeight =
        Number(updatedData.grossWeight) -
        Number(updatedData.packageTareWeight) -
        Number(updatedData.palletTareWeight);

      setPalletData((prev) => ({
        ...prev,
        [field]: value,
        netWeight: netWeight > 0 ? netWeight : 0,
      }));
    }
  };

  const generateBarcode = () => {
    if (!storageReceiving) return;

    // Format current date as YYYYMMDD
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");

    // Generate barcode based on receivingNumber, customerNumber, materialNumber, date, weight, and storageReceivingPalletId
    // Using a simple concatenation with separators for demonstration
    // In a real application, you might want to use a more sophisticated barcode generation algorithm
    const barcode = [
      storageReceiving.receivingNumber,
      storageReceiving.customerId,
      palletData.materialId,
      formattedDate,
      palletData.netWeight.toString(),
      `PAL${Date.now().toString().slice(-6)}`, // Simple unique ID for the pallet
    ].join("-");

    setPalletData((prev) => ({
      ...prev,
      barCode: barcode,
    }));

    // Move to the next step
    setActiveStep(3);
  };

  const savePallet = async () => {
    if (!storageReceiving) return;

    try {
      // Create a new pallet object
      const newPallet: Partial<StorageReceivingPallet> = {
        storageReceivingId: storageReceiving.id,
        palletNumber: palletData.palletNumber,
        locationId: palletData.locationId,
        materialId: palletData.materialId,
        quantity: palletData.quantity,
        unitId: palletData.unitId,
        grossWeight: palletData.grossWeight,
        packageTareWeight: palletData.packageTareWeight,
        palletTareWeight: palletData.palletTareWeight,
        netWeight: palletData.netWeight,
        barCode: palletData.barCode,
      };

      // Get existing pallets
      const existingPallets = storageReceiving.pallets || [];

      // Update the storage receiving with the new pallet
      await axios.put(`/api/storage-receivings/${id}`, {
        ...storageReceiving,
        pallets: [...existingPallets, newPallet],
      });

      toast.success("Pallet added successfully");

      // Reset form and go back to first step for adding another pallet
      setPalletData({
        palletNumber: "",
        locationId: "",
        materialId: "",
        quantity: 0,
        unitId: "",
        grossWeight: 0,
        packageTareWeight: 0,
        palletTareWeight: 0,
        netWeight: 0,
        barCode: "",
      });
      setActiveStep(0);

      // Refresh storage receiving data
      fetchStorageReceiving();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save pallet");
    }
  };

  const handleNextStep = () => {
    // Validate current step before proceeding
    if (activeStep === 0) {
      // Validate pallet information
      if (
        !palletData.locationId ||
        !palletData.materialId ||
        !palletData.quantity ||
        !palletData.unitId
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (activeStep === 1) {
      // Validate weighing information
      if (palletData.grossWeight <= 0) {
        toast.error("Please enter a valid gross weight");
        return;
      }
    } else if (activeStep === 2) {
      // Generate barcode
      generateBarcode();
      return;
    } else if (activeStep === 3) {
      // Save pallet
      savePallet();
      return;
    }

    // Move to the next step
    setActiveStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!storageReceiving) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold mb-2">
          Storage Receiving Not Found
        </h2>
        <Button onClick={() => router.push("/pages/storage-receivings")}>
          Back to Storage Receivings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
          <ListPlus className="h-6 w-6 text-teal-500" />Storage Receiving Pallet</h1>
          <p>Receiving Number: {storageReceiving.receivingNumber}</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/pages/storage-receivings")}>
          Back to List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receive Pallet</CardTitle>
        </CardHeader>
        <CardContent>
          <Stepper steps={steps} activeStep={activeStep} className="mb-8" />

          <div className="mt-8">
            {activeStep === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pallet Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="locationId">Location ID *</Label>
                    <Input
                      id="locationId"
                      value={palletData.locationId}
                      onChange={(e) =>
                        handleInputChange("locationId", e.target.value)
                      }
                      placeholder="Enter location ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="materialId">Material *</Label>
                    <MaterialCombobox
                      value={palletData.materialId}
                      onValueChange={(value) =>
                        handleInputChange("materialId", value)
                      }
                      placeholder="Select material"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={palletData.quantity}
                      onChange={(e) =>
                        handleInputChange(
                          "quantity",
                          parseFloat(e.target.value)
                        )
                      }
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitId">Unit *</Label>
                    <Select
                      value={palletData.unitId}
                      onValueChange={(value) =>
                        handleInputChange("unitId", value)
                      }
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
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Weighing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grossWeight">Gross Weight (kg) *</Label>
                    <Input
                      id="grossWeight"
                      type="number"
                      value={palletData.grossWeight}
                      onChange={(e) =>
                        handleInputChange(
                          "grossWeight",
                          parseFloat(e.target.value)
                        )
                      }
                      placeholder="Enter gross weight"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="packageTareWeight">
                      Package Tare Weight (kg)
                    </Label>
                    <Input
                      id="packageTareWeight"
                      type="number"
                      value={palletData.packageTareWeight}
                      onChange={(e) =>
                        handleInputChange(
                          "packageTareWeight",
                          parseFloat(e.target.value)
                        )
                      }
                      placeholder="Enter package tare weight"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="palletTareWeight">
                      Pallet Tare Weight (kg)
                    </Label>
                    <Input
                      id="palletTareWeight"
                      type="number"
                      value={palletData.palletTareWeight}
                      onChange={(e) =>
                        handleInputChange(
                          "palletTareWeight",
                          parseFloat(e.target.value)
                        )
                      }
                      placeholder="Enter pallet tare weight"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="netWeight">Net Weight (kg)</Label>
                    <Input
                      id="netWeight"
                      type="number"
                      value={palletData.netWeight}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Barcode Generation</h3>
                <div className="space-y-2">
                  <Label htmlFor="palletNumber">Pallet Number *</Label>
                  <Input
                    id="palletNumber"
                    value={palletData.palletNumber}
                    disabled
                    onChange={(e) =>
                      handleInputChange("palletNumber", e.target.value)
                    }
                    placeholder="Generated..."
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Click "Generate Barcode" to create a barcode based on the
                  receiving number, customer ID, material ID, date, weight, and
                  a unique pallet ID.
                </p>
                <div className="flex justify-center">
                  <Button onClick={generateBarcode}>Generate Barcode</Button>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  Review the pallet information before saving.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="font-medium">Pallet Number:</p>
                    <p>{palletData.palletNumber}</p>
                  </div>
                  <div>
                    <p className="font-medium">Location ID:</p>
                    <p>{palletData.locationId}</p>
                  </div>
                  <div>
                    <p className="font-medium">Material ID:</p>
                    <p>{palletData.materialId}</p>
                  </div>
                  <div>
                    <p className="font-medium">Quantity:</p>
                    <p>{palletData.quantity}</p>
                  </div>
                  <div>
                    <p className="font-medium">Unit ID:</p>
                    <p>{palletData.unitId}</p>
                  </div>
                  <div>
                    <p className="font-medium">Gross Weight:</p>
                    <p>{palletData.grossWeight} kg</p>
                  </div>
                  <div>
                    <p className="font-medium">Package Tare Weight:</p>
                    <p>{palletData.packageTareWeight} kg</p>
                  </div>
                  <div>
                    <p className="font-medium">Pallet Tare Weight:</p>
                    <p>{palletData.palletTareWeight} kg</p>
                  </div>
                  <div>
                    <p className="font-medium">Net Weight:</p>
                    <p>{palletData.netWeight} kg</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium">Barcode:</p>
                    <p className="font-mono bg-gray-100 p-2 rounded">
                      {palletData.barCode}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={activeStep === 0}
              >
                Previous
              </Button>
              <Button onClick={handleNextStep}>
                {activeStep === steps.length - 1 ? "Save Pallet" : "Next"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {storageReceiving.pallets && storageReceiving.pallets.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Received Pallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {storageReceiving.pallets.map((pallet, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Pallet Number:</p>
                      <p>{pallet.palletNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium">Material ID:</p>
                      <p>{pallet.materialId}</p>
                    </div>
                    <div>
                      <p className="font-medium">Quantity:</p>
                      <p>
                        {pallet.quantity} {pallet.unitId}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Net Weight:</p>
                      <p>{pallet.netWeight} kg</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Barcode:</p>
                      <p className="font-mono p-2 rounded text-xs truncate">
                        {pallet.barCode}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
