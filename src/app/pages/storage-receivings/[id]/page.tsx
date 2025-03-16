"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { MaterialCombobox } from "@/components/MaterialCombobox";
import PalletUpdateForm from "@/components/PalletUpdateForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import DateSelector from "@/components/ui/date-selector";
import { Input } from "@/components/ui/input";
import InputNumber from "@/components/ui/input-number";
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
import { StorageReceivingPallet } from "@/models/TrnStorageReceivingPallet";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Barcode,
  Check,
  CircleX,
  Grid2X2,
  Grid2X2Plus,
  Grid2X2X,
  ListCollapse,
  LucideBarcode,
  LucideBetweenHorizonalStart,
  Pencil,
  Printer,
  Trash,
  Weight,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactBarcode from "react-barcode";
import usePage from "./usePage";

export default function StorageReceivingDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    isLoading,
    storageReceiving,
    activeStep,
    palletData,
    units,
    handleInputChange,
    handleNextStep,
    handlePreviousStep,
    fetchStorageReceiving,
    deletePallet,
    alertDialogRef,
    alertDialogWidth,
  } = usePage();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPallet, setSelectedPallet] =
    useState<StorageReceivingPallet | null>(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);

  const [isUpdateLocation, setIsUpdateLocation] = useState(false);

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

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

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
    ? storageReceiving.pallets.filter(
        (pallet) =>
          pallet.palletNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          pallet.materialName?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p className="text-gray-500 text-xs font-semibold mt-2">
            {storageReceiving.receivingNumber} {" - "}
            {storageReceiving.customerName}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/pages/storage-receivings")}
          className="flex align-top"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
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
                    <h3 className="text-lg font-semibold">
                      Pallet Information
                    </h3>
                    <div className="grid grid-rows-4 md:grid-flow-col gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="materialId">Material *</Label>
                        <MaterialCombobox
                          value={palletData.materialId}
                          onValueChange={(value, item) => {
                            handleInputChange("materialId", value);
                            if (item) {
                              handleInputChange(
                                "materialName",
                                item.materialName
                              );
                              handleInputChange(
                                "materialNumber",
                                item.materialNumber
                              );
                            }
                          }}
                          placeholder="Search a material"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity *</Label>
                        <InputNumber
                          id="quantity"
                          value={palletData.quantity}
                          onChange={(value) =>
                            handleInputChange("quantity", value)
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
                        <Label htmlFor="vendorBatchNumber">
                          Vendor Batch # *
                        </Label>
                        <Input
                          id="vendorBatchNumber"
                          value={palletData.vendorBatchNumber}
                          onChange={(e) =>
                            handleInputChange(
                              "vendorBatchNumber",
                              e.target.value
                            )
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
                          onSelect={(date) =>
                            handleInputChange("expiryDate", date)
                          }
                          placeholder="Select date"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="manufactureDate">
                          Manufacture Date
                        </Label>
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
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Weighing</h3>
                      <div className="grid grid-rows-4 grid-flow-col gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="grossWeight">
                            Gross Weight (kg) *
                          </Label>
                          <InputNumber
                            id="grossWeight"
                            value={palletData.grossWeight}
                            onChange={(value) =>
                              handleInputChange("grossWeight", value)
                            }
                            placeholder="Enter gross weight"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="packageTareWeight">
                            Package Tare Weight (kg)
                          </Label>
                          <InputNumber
                            id="packageTareWeight"
                            value={palletData.packageTareWeight}
                            onChange={(value) =>
                              handleInputChange("packageTareWeight", value)
                            }
                            placeholder="Enter package tare weight"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="palletTareWeight">
                            Pallet Tare Weight (kg)
                          </Label>
                          <InputNumber
                            id="palletTareWeight"
                            value={palletData.palletTareWeight}
                            onChange={(value) =>
                              handleInputChange("palletTareWeight", value)
                            }
                            placeholder="Enter pallet tare weight"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="netWeight">Net Weight (kg)</Label>
                          <InputNumber
                            id="netWeight"
                            value={palletData.netWeight}
                            onChange={(value) =>
                              handleInputChange("netWeight", value)
                            }
                            disabled
                            className="bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border border-primary rounded-lg p-4">
                      <div className="flex justify-end w-full my-10">
                        <Label className="text-red-600 font-normal italic">
                          Weighing scale disconnected...
                        </Label>
                      </div>
                      <div className="flex justify-end w-full">
                        <Label className="text-8xl font-[Digital-7] ">
                          0.000 kg
                        </Label>
                      </div>
                      <div className="flex justify-end w-full mt-10">
                        <Button variant="default">
                          <Weight className="h-4 w-4" />
                          Capture Weight
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Barcode Generation
                    </h3>
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
                          handleInputChange(
                            "manualPalletNumber",
                            e.target.value
                          )
                        }
                        placeholder="Enter manual pallet number"
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="locationId">Location </Label>
                      <LocationCombobox
                        value={palletData.locationId}
                        onValueChange={(value, item) => {
                          handleInputChange("locationId", value);
                          if (item) {
                            handleInputChange(
                              "locationName",
                              item.locationName
                            );
                          }
                        }}
                        placeholder="Search a location"
                      />
                    </div> */}
                    <p className="text-sm text-muted-foreground">
                      Click "Generate Barcode" to create a barcode based on the
                      receiving number, date, material number and weight.
                    </p>
                    <div className="flex justify-center">
                      <Button onClick={handleNextStep}>Generate Barcode</Button>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Confirmation</h3>
                    <p className="text-sm text-muted-foreground">
                      Review the pallet information before saving.
                    </p>
                    <div className="grid grid-rows-4 md:grid-flow-col gap-4">
                      <div>
                        <p className="font-medium">Pallet Number:</p>
                        <p>{"To be generated on save..."}</p>
                      </div>
                      <div>
                        <p className="font-medium">Location:</p>
                        <p>{"Should be set on put... "}</p>
                      </div>
                      <div>
                        <p className="font-medium">Material:</p>
                        <p>{palletData.materialName}</p>
                      </div>
                      <div>
                        <p className="font-medium">Quantity:</p>
                        <p>{(+palletData.quantity).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Qty Unit:</p>
                        <p>{palletData.unitName}</p>
                      </div>
                      <div>
                        <p className="font-medium">Gross Weight:</p>
                        <p>{(+palletData.grossWeight).toFixed(2)} kg</p>
                      </div>
                      <div>
                        <p className="font-medium">Package Tare Weight:</p>
                        <p>{(+palletData.packageTareWeight).toFixed(2)} kg</p>
                      </div>
                      <div>
                        <p className="font-medium">Pallet Tare Weight:</p>
                        <p>{(+palletData.palletTareWeight).toFixed(2)} kg</p>
                      </div>
                      <div>
                        <p className="font-medium">Net Weight:</p>
                        <p>{(+palletData.netWeight).toFixed(2)} kg</p>
                      </div>
                    </div>
                    <p className="font-medium">Barcode:</p>
                    <div className="flex justify-center w-full my-10">
                      <ReactBarcode
                        value={palletData.barCode}
                        width={1.5}
                        height={80}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={activeStep === 0}
                  >
                    <ArrowLeft />
                    Previous
                  </Button>
                  <Button onClick={handleNextStep}>
                    {activeStep === steps.length - 1 ? (
                      <Check />
                    ) : (
                      <ArrowRight />
                    )}
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
            <CardTitle className="flex flex-row items-center gap-2">
              <Grid2X2 className="h-4 w-4 text-teal-500" />
              Saved Pallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPallets.map((pallet, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 flex flex-col h-full"
                >
                  <div className="grid grid-rows-5 md:grid-flow-col gap-1 flex-grow">
                    <div>
                      <p className="font-medium text-[12px]">Pallet Number:</p>
                      <p className="text-[12px]">{pallet.palletNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium text-[12px]">Location:</p>
                      <p className="text-[12px]">{pallet.locationName}</p>
                    </div>
                    <div>
                      <p className="font-medium text-[12px]">Material:</p>
                      <p className="text-[12px]">{pallet.materialName}</p>
                    </div>
                    <div>
                      <p className="font-medium text-[12px]">Quantity:</p>
                      <p className="text-[12px]">
                        {(+pallet.quantity).toFixed(2)} {pallet.unitName}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-[12px]">Box Number:</p>
                      <p className="text-[12px]">{pallet.boxNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium text-[12px]">
                        Vendor Batch Number:
                      </p>
                      <p className="text-[12px]">{pallet.vendorBatchNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium text-[12px]">Batch Code:</p>
                      <p className="text-[12px]">{pallet.batchCode}</p>
                    </div>
                    <div>
                      <p className="font-medium text-[12px]">
                        No of days to alert:
                      </p>
                      <p className="text-[12px]">
                        {(+pallet.noDaysToPrompAlert).toFixed(0)} Days
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-[12px]">
                        Is last material:
                      </p>
                      <Checkbox checked={pallet.isLastMaterial} />
                    </div>
                    <div>
                      <p className="font-medium text-[12px]">Net Weight:</p>
                      <p className="text-[12px]">
                        {(+pallet.netWeight).toFixed(2)} Kg
                      </p>
                    </div>
                  </div>
                  <div className="border-t-1 border-dashed border-gray-400 w-full my-2" />
                  <div className="flex justify-between">
                    <div className="col-span-2">
                      <p className="font-medium text-[12px]">Barcode:</p>
                      <p className="font-mono rounded text-xs truncate">
                        {pallet.barCode}
                      </p>
                    </div>
                    <div>
                      <AlertDialog open={isDeleteModalOpen}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSelectedPallet(pallet);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Grid2X2X className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              <div className="flex flex-row gap-2">
                                <CircleX className="h-6 w-6 pt-1 text-teal-500" />
                                Delete Pallet
                              </div>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this pallet [
                              {selectedPallet?.palletNumber || "NA"}]?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <div className="space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsDeleteModalOpen(false);
                                }}
                              >
                                <X className="h-4 w-4" />
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  deletePallet(selectedPallet?.id || "");
                                  setIsDeleteModalOpen(false);
                                }}
                              >
                                <Trash className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedPallet(pallet);
                          setIsUpdateLocation(true);
                          setIsUpdateFormOpen(true);
                        }}
                      >
                        <LucideBetweenHorizonalStart className="h-4 w-4 text-primary" />
                      </Button>
                      <AlertDialog open={isBarcodeModalOpen}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSelectedPallet(pallet);
                              setIsBarcodeModalOpen(true);
                            }}
                          >
                            <LucideBarcode className="h-4 w-4 text-gray-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent ref={alertDialogRef}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                            <div className="flex flex-row gap-2">
                                <Barcode className="h-6 w-6 pt-1 text-teal-500" />
                                Pallet Barcode
                              </div>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Barcode for pallet: {selectedPallet?.palletNumber}
                              <br />
                              <br />
                              <ReactBarcode
                                value={selectedPallet?.barCode || "NA"}
                                width={alertDialogWidth / 240}
                                height={80}
                              />
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <div className="space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsBarcodeModalOpen(false)}
                              >
                                <X className="h-4 w-4" />
                                Close
                              </Button>
                              <Button
                                variant="default"
                                onClick={() => {
                                  setIsBarcodeModalOpen(false);
                                }}
                              >
                                <Printer className="h-4 w-4" />
                                Print
                              </Button>
                            </div>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIsUpdateLocation(false);
                          setSelectedPallet(pallet);
                          setIsUpdateFormOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isUpdateFormOpen && selectedPallet && (
        <PalletUpdateForm
          pallet={selectedPallet}
          showLocationOnly={isUpdateLocation}
          onUpdate={async (updatedPallet) => {
            // Make API call to update the pallet
            try {
              const updatedPalletData = {
                ...updatedPallet,
              };
              await axios.put(
                `/api/storage-receiving-pallets/${updatedPallet.id}`,
                updatedPalletData
              );
              // Refresh storage receiving data
              fetchStorageReceiving();
              // Close the form
              setIsUpdateFormOpen(false);
              setSelectedPallet(null);
            } catch (error: any) {
              console.error("Failed to update pallet:", error);
            }
          }}
          onCancel={() => {
            setIsUpdateFormOpen(false);
            setSelectedPallet(null);
          }}
        />
      )}
    </div>
  );
}
