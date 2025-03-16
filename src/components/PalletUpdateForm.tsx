"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DateSelector from "@/components/ui/date-selector";
import { Input } from "@/components/ui/input";
import InputNumber from "@/components/ui/input-number";
import { Label } from "@/components/ui/label";
import { StorageReceivingPallet } from "@/models/TrnStorageReceivingPallet";
import { Check, ListChecks, Locate, X } from "lucide-react";
import { useState } from "react";
import { LocationCombobox } from "./LocationCombobox";
import { Button } from "./ui/button";

interface PalletUpdateFormProps {
  pallet: StorageReceivingPallet;
  onUpdate: (updatedPallet: StorageReceivingPallet) => void;
  onCancel: () => void;
  showLocationOnly?: boolean;
}

const PalletUpdateForm: React.FC<PalletUpdateFormProps> = ({
  pallet,
  onUpdate,
  onCancel,
  showLocationOnly = false,
}) => {
  const [manualPalletNumber, setManualPalletNumber] = useState(
    pallet.manualPalletNumber
  );
  const [boxNumber, setBoxNumber] = useState(pallet.boxNumber);
  const [vendorBatchNumber, setVendorBatchNumber] = useState(
    pallet.vendorBatchNumber
  );
  const [batchCode, setBatchCode] = useState(pallet.batchCode);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    pallet.expiryDate
  );
  const [manufactureDate, setManufactureDate] = useState<Date | undefined>(
    pallet.manufactureDate
  );
  const [noDaysToPrompAlert, setNoDaysToPrompAlert] = useState(
    pallet.noDaysToPrompAlert
  );
  const [arrivalSequenceNo, setArrivalSequenceNo] = useState(
    pallet.arrivalSequenceNo
  );
  const [isLastMaterial, setIsLastMaterial] = useState(pallet.isLastMaterial);

  const [locationId, setLocationId] = useState(pallet.locationId);

  const handleUpdate = () => {
    const updatedPallet = {
      ...pallet,
      boxNumber,
      vendorBatchNumber,
      batchCode,
      expiryDate: expiryDate ? expiryDate : new Date(),
      manufactureDate: manufactureDate ? manufactureDate : new Date(),
      noDaysToPrompAlert,
      arrivalSequenceNo,
      isLastMaterial,
      locationId,
    };
    onUpdate(updatedPallet);
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex flex-row gap-2">
              {showLocationOnly ? <Locate className="h-6 w-6 pt-1 text-teal-500"/> : <ListChecks className="h-6 w-6 pt-1 text-teal-500" />}{" "}
              {showLocationOnly ? "Put Into Location" : "Update Pallet"}
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {showLocationOnly
              ? "Please select a location for the pallet."
              : "Please update the pallet details."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {showLocationOnly ? (
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="locationId">Location</Label>
              <LocationCombobox
                value={pallet.locationId}
                onValueChange={(value, item) => {
                  setLocationId(value);
                }}
                placeholder="Search a location"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="manualPalletNumber"
                className="text-left sm:text-left"
              >
                Man. Pallet #
              </Label>
              <Input
                id="manualPalletNumber"
                value={manualPalletNumber}
                onChange={(e) => setManualPalletNumber(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="boxNumber" className="text-left sm:text-left">
                Box #
              </Label>
              <Input
                id="boxNumber"
                value={boxNumber}
                onChange={(e) => setBoxNumber(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="vendorBatchNumber"
                className="text-left sm:text-left"
              >
                Vendor Batch #
              </Label>
              <Input
                id="vendorBatchNumber"
                value={vendorBatchNumber}
                onChange={(e) => setVendorBatchNumber(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="batchCode" className="text-left sm:text-left">
                Batch Code
              </Label>
              <Input
                id="batchCode"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="expiryDate" className="text-left sm:text-left">
                Exp. Date
              </Label>
              <DateSelector
                date={expiryDate}
                onSelect={(date) => setExpiryDate(date)}
                placeholder="Select date"
                className="sm:col-span-3"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="manufactureDate"
                className="text-left sm:text-left"
              >
                Man. Date
              </Label>
              <DateSelector
                date={manufactureDate}
                onSelect={(date) => setManufactureDate(date)}
                placeholder="Select date"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="noDaysToPrompAlert"
                className="text-left sm:text-left"
              >
                # Days To Alert
              </Label>
              <InputNumber
                id="noDaysToPrompAlert"
                value={noDaysToPrompAlert}
                onChange={(value) => setNoDaysToPrompAlert(value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="arrivalSequenceNo"
                className="text-left sm:text-left"
              >
                Arrival Seq. #
              </Label>
              <InputNumber
                id="arrivalSequenceNo"
                value={arrivalSequenceNo}
                onChange={(value) => setArrivalSequenceNo(value)}
                />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="isLastMaterial"
                className="text-right sm:text-left"
              >
                Last Material
              </Label>
              <input
                type="checkbox"
                id="isLastMaterial"
                checked={isLastMaterial}
                onChange={(e) => setIsLastMaterial(e.target.checked)}
                />
            </div>
          </div>
        )}
        <AlertDialogFooter>
          <div className="space-x-2">
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button variant="default" onClick={handleUpdate}>
              <Check className="h-4 w-4" />
              {showLocationOnly ? "Put" : "Update"}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PalletUpdateForm;
