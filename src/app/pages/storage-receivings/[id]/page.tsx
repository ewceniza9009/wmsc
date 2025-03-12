"use client";

import { LocationCombobox } from "@/components/LocationCombobox";
import { MaterialCombobox } from "@/components/MaterialCombobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DateSelector from "@/components/ui/date-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchBox from "@/components/ui/SearchBox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stepper } from "@/components/ui/stepper";
import { Unit } from "@/models/MstUnit";
import { StorageReceiving } from "@/models/TrnStorageReceiving";
import { StorageReceivingPallet } from "@/models/TrnStorageReceivingPallet";
import axios from "axios";
import { Grid2X2Plus, ListCollapse } from "lucide-react";
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
    manualPalletNumber: "",
    locationId: "",
    locationName: "",
    materialId: "",
    materialName: "",
    quantity: 0,
    unitId: "",
    unitName: "",
    boxNumber: "",
    vendorBatchNumber: "",
    batchCode: "",
    grossWeight: 0,
    expiryDate: new Date().toLocaleDateString(),
    manufactureDate: new Date().toLocaleDateString(),
    packageTareWeight: 0,
    palletTareWeight: 0,
    netWeight: 0,
    barCode: "",
  });

  const [units, setUnits] = useState<Unit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
        manualPalletNumber: palletData.manualPalletNumber,
        locationId: palletData.locationId,
        locationName: palletData.locationName,
        materialId: palletData.materialId,
        materialName: palletData.materialName,
        quantity: palletData.quantity,
        unitId: palletData.unitId,
        unitName: palletData.unitName,
        boxNumber: palletData.boxNumber,
        vendorBatchNumber: palletData.vendorBatchNumber,
        batchCode: palletData.batchCode,
        expiryDate: new Date(),
        manufactureDate: new Date(),
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
        manualPalletNumber: "",
        locationId: "",
        locationName: "",
        materialId: "",
        materialName: "",
        quantity: 0,
        unitId: "",
        unitName: "",
        boxNumber: "",
        vendorBatchNumber: "",
        batchCode: "",
        expiryDate: new Date().toLocaleDateString(),
        manufactureDate: new Date().toLocaleDateString(),
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

  const filteredPallets = storageReceiving.pallets
    ? storageReceiving.pallets.filter((pallet) =>
        pallet.palletNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Grid2X2Plus className="h-6 w-6 text-teal-500" />
            Storage Receiving Pallet
          </h1>
          <p className="font-medium italic">Receiving Number: {storageReceiving.receivingNumber}</p>
          <p className="font-medium italic">Customer: {storageReceiving.customerName}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/pages/storage-receivings")}
        >
          Back to List
        </Button>
      </div>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="flex w-40 mb-2">
            <ListCollapse />
            Receive Pallet
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
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
                        <Label htmlFor="materialId">Material *</Label>
                        <MaterialCombobox
                          value={palletData.materialId}
                          onValueChange={(value, item) => {
                            handleInputChange("materialId", value);
                            if (item) {
                              handleInputChange("materialName", item.materialName);
                            }
                          }}
                          placeholder="Search a material"
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
                          onValueChange={(value) => {
                            handleInputChange("unitId", value);
                            if (value) {
                              const selectedUnit = units.find(
                                (unit) => unit.id === value
                              );
                              if (selectedUnit) {
                                handleInputChange(
                                  "unitName",
                                  selectedUnit.unitName
                                );
                              }
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map((unit) => (
                              <SelectItem key={unit.id} value={unit.id}>
                                {unit.unitName} ({unit.unitNumber})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="boxNumber">Box # *</Label>
                        <Input
                          id="boxNumber"
                          value={palletData.boxNumber}
                          onChange={(e) =>
                            handleInputChange("boxNumber", e.target.value)
                          }
                          placeholder="Enter box number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vendorBatchNumber">Vendor Batch # *</Label>
                        <Input
                          id="vendorBatchNumber"
                          value={palletData.vendorBatchNumber}
                          onChange={(e) =>
                            handleInputChange("vendorBatchNumber", e.target.value)
                          }
                          placeholder="Enter vendor batch number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="batchCode">Batch Code</Label>
                        <Input
                          id="batchCode"
                          value={palletData.batchCode}
                          onChange={(e) =>
                            handleInputChange("batchCode", e.target.value)
                          }
                          placeholder="Enter batch code"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <DateSelector
                          date={
                            palletData.expiryDate
                              ? new Date(palletData.expiryDate)
                              : undefined
                          }
                          onSelect={(date) => handleInputChange("expiryDate", date)}
                          placeholder="Select date"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="manufactureDate">Manufacture Date</Label>
                        <DateSelector
                          date={
                            palletData.manufactureDate
                              ? new Date(palletData.manufactureDate)
                              : undefined
                          }
                          onSelect={(date) =>
                            handleInputChange("manufactureDate", date)
                          }
                          placeholder="Select date"
                        />
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
                    <div className="space-y-2">
                      <Label htmlFor="manualPalletNumber">
                        Manual Pallet Number{" "}
                      </Label>
                      <Input
                        id="manualPalletNumber"
                        value={palletData.manualPalletNumber}
                        onChange={(e) =>
                          handleInputChange("manualPalletNumber", e.target.value)
                        }
                        placeholder="Enter manual pallet number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locationId">Location </Label>
                      <LocationCombobox
                        value={palletData.locationId}
                        onValueChange={(value, item) => {
                          handleInputChange("locationId", value);
                          if (item) {
                            handleInputChange("locationName", item.locationName);
                          }
                        }}
                        placeholder="Search a location"
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
                        <p className="font-medium">Location:</p>
                        <p>{palletData.locationName}</p>
                      </div>
                      <div>
                        <p className="font-medium">Material:</p>
                        <p>{palletData.materialName}</p>
                      </div>
                      <div>
                        <p className="font-medium">Quantity:</p>
                        <p>{palletData.quantity}</p>
                      </div>
                      <div>
                        <p className="font-medium">Qty Unit:</p>
                        <p>{palletData.unitName}</p>
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
        </CollapsibleContent>
      </Collapsible>

      <SearchBox onSearch={(searchTerm: string) => setSearchTerm(searchTerm)} />
      {storageReceiving.pallets && storageReceiving.pallets.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Received Pallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPallets.map((pallet, index) => (                
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Pallet Number:</p>
                      <p>{pallet.palletNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium">Location:</p>
                      <p>{pallet.locationName}</p>
                    </div>
                    <div>
                      <p className="font-medium">Material:</p>
                      <p>{pallet.materialName}</p>
                    </div>
                    <div>
                      <p className="font-medium">Quantity:</p>
                      <p>
                        {pallet.quantity} {pallet.unitName}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Net Weight:</p>
                      <p>{pallet.netWeight} Kg</p>
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
