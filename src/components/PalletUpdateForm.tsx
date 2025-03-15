"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import DateSelector from "@/components/ui/date-selector";
import { Input } from "@/components/ui/input";
import InputNumber from "@/components/ui/input-number";
import { Label } from "@/components/ui/label";
import { StorageReceivingPallet } from "@/models/TrnStorageReceivingPallet";
import { Check, CircleOff } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface PalletUpdateFormProps {
  pallet: StorageReceivingPallet;
  onUpdate: (updatedPallet: StorageReceivingPallet) => void;
  onCancel: () => void;
}

const PalletUpdateForm: React.FC<PalletUpdateFormProps> = ({
  pallet,
  onUpdate,
  onCancel,
}) => {
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
    };
    onUpdate(updatedPallet);
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Pallet</AlertDialogTitle>
          <AlertDialogDescription>
            Update the fields for the pallet. Click save when you're done.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="boxNumber" className="text-left">
              Box #
            </Label>
            <Input
              id="boxNumber"
              value={boxNumber}
              onChange={(e) => setBoxNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vendorBatchNumber" className="text-left">
              Vendor Batch Number
            </Label>
            <Input
              id="vendorBatchNumber"
              value={vendorBatchNumber}
              onChange={(e) => setVendorBatchNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="batchCode" className="text-left">
              Batch Code
            </Label>
            <Input
              id="batchCode"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiryDate" className="text-left">
              Exp. Date
            </Label>
            <DateSelector
              date={expiryDate}
              onSelect={(date) => setExpiryDate(date)}
              placeholder="Select date"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manufactureDate" className="text-left">
              Man. Date
            </Label>
            <DateSelector
              date={manufactureDate}
              onSelect={(date) => setManufactureDate(date)}
              placeholder="Select date"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="noDaysToPrompAlert" className="text-left">
              # Days To Alert
            </Label>
            <InputNumber
              id="noDaysToPrompAlert"
              value={noDaysToPrompAlert}
              onChange={(value) => setNoDaysToPrompAlert(value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="arrivalSequenceNo" className="text-left">
              Arrival Seq. #
            </Label>
            <InputNumber
              id="arrivalSequenceNo"
              value={arrivalSequenceNo}
              onChange={(value) => setArrivalSequenceNo(value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isLastMaterial" className="text-right">
              Is Last Material
            </Label>
            <input
              type="checkbox"
              id="isLastMaterial"
              checked={isLastMaterial}
              onChange={(e) => setIsLastMaterial(e.target.checked)}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onCancel}><CircleOff className="h-4 w-4"/> Cancel</Button>
          <Button variant="default" onClick={handleUpdate}><Check className="h-4 w-4"/> Continue</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PalletUpdateForm;