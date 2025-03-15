"use client";

import { Unit } from "@/models/MstUnit";
import { StorageReceiving } from "@/models/TrnStorageReceiving";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useReceiving() {
  const router = useRouter();
  const { id } = useParams();

  const deletePallet = async (palletId: string) => {
    try {
      await axios.delete(`/api/storage-receiving-pallets/${palletId}`);
      toast.success("Pallet deleted successfully");
      // After successful deletion, refresh the list of pallets
      fetchStorageReceiving();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete pallet");
    }
  };

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
    materialNumber: "",
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

  useEffect(() => {
    if (!id) {
      toast.error("No storage receiving ID provided");
      router.push("/pages/storage-receivings");
      return;
    }

    fetchStorageReceiving();
    fetchUnits();
  }, [id, router]);

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
      formattedDate,
      `PAL${Date.now().toString().slice(-6)}`, // Simple unique ID for the pallet
      palletData.materialNumber,
      palletData.netWeight.toString(),
    ].join("-");

    setPalletData((prev) => ({
      ...prev,
      barCode: barcode,
    }));

    // Move to the next step
    setActiveStep(3);
  };

  const addPallet = async () => {
    if (!storageReceiving) return;

    try {
      // Create a new pallet object
      const newPallet = {
        storageReceivingId: storageReceiving.id,
        palletNumber: palletData.palletNumber || "NA",
        manualPalletNumber: palletData.manualPalletNumber,
        locationId: palletData.locationId || "",
        locationName: palletData.locationName,
        materialId: palletData.materialId,
        materialName: palletData.materialName,
        materialNumber: palletData.materialNumber,
        quantity: palletData.quantity,
        unitId: palletData.unitId,
        unitName: palletData.unitName,
        boxNumber: palletData.boxNumber,
        vendorBatchNumber: palletData.vendorBatchNumber,
        batchCode: palletData.batchCode,
        expiryDate: palletData.expiryDate,
        manufactureDate: palletData.manufactureDate,
        grossWeight: palletData.grossWeight,
        packageTareWeight: palletData.packageTareWeight,
        palletTareWeight: palletData.palletTareWeight,
        netWeight: palletData.netWeight,
        barCode: palletData.barCode,
      };

      await axios.post(`/api/storage-receiving-pallets`, newPallet);

      toast.success("Pallet added successfully");

      // Reset form and go back to first step for adding another pallet
      setPalletData({
        palletNumber: "",
        manualPalletNumber: "",
        locationId: "",
        locationName: "",
        materialId: "",
        materialName: "",
        materialNumber: "",
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

      // Refresh storage receiving data - not needed anymore
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
      // Add pallet
      addPallet();
      return;
    }

    // Move to the next step
    setActiveStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  return {
    isLoading,
    storageReceiving,
    activeStep,
    palletData,
    units,
    setPalletData,
    setActiveStep,
    handleInputChange,
    handleNextStep,
    handlePreviousStep,
    fetchUnits,
    fetchStorageReceiving,
    deletePallet,
  };
}
