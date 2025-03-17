"use client";

import { StorageTransfer } from "@/models/TrnStorageTransfer";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function usePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id !== "new";

  const [storageTransfers, setStorageTransfers] = useState<
    StorageTransfer[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(true);

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    receivingOrderId: null,
    transferNumber: "NA",
    warehouseId: "",
    pickFromWarehouseId: "",
    storagePickId: "",
    transferDate: new Date(),
    transferTime: new Date(),
    truckPlateNumber: "",
    manufactureDateHeader: new Date(),
    noDaysToPrompAlertHeader: 0,
    quantity: 0,
    weight: 0,
    containerNumber: "",
    remarks: "",
    customerId: "",
    isFreezing: false,
    receivedBy: "",
    isLocked: false,
  });

  useEffect(() => {
    const storedWarehouse = localStorage.getItem("selectedWarehouse");
    if (storedWarehouse) {
      setForm((prevForm) => ({
        ...prevForm,
        warehouseId: storedWarehouse,
      }));
    }
  }, []);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStorageTransfer, setSelectedStorageTransfer] =
    useState<StorageTransfer | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      if (!["admin", "manager"].includes(session.user.role)) {
        toast.error("You do not have permission to access this page");
        router.push("/pages");
      } else {
        fetchStorageTransfers(currentPage, itemsPerPage, searchTerm);
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router, currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    if (isEdit && id) {
      setIsDetailLoading(true);

      axios
        .get(`/api/storage-transfers/${id}`)
        .then((res) => {
          setForm(res.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsDetailLoading(false));
    } else {
      setIsDetailLoading(false);
    }
  }, [id, isEdit]);

  const fetchStorageTransfers = async (
    page: number,
    limit: number,
    search: string
  ) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/api/storage-transfers?page=${page}&limit=${limit}&search=${search}`
      );
      setStorageTransfers(data.items);
      setTotalItems(data.totalItems);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load storage transfer"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStorageTransfer) return;
    try {
      await axios.delete(
        `/api/storage-transfers/${selectedStorageTransfer.id}`
      );
      toast.success("Storage transfer deleted successfully");
      fetchStorageTransfers(currentPage, itemsPerPage, searchTerm);
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete storage transfer"
      );
    }
  };

  const openDeleteDialog = (storageTransfer: StorageTransfer) => {
    setSelectedStorageTransfer(storageTransfer);
    setIsDeleteDialogOpen(true);
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEdit) {
        await axios.put(`/api/storage-transfers/${id}`, form);
        toast.success("Storage transfer updated successfully");
      } else {
        await axios.post("/api/storage-transfers", form);
        router.push("/pages/storage-transfers");
        toast.success("Storage transfer added successfully");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to save storage transfer"
      );
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  return {
    storageTransfers,
    isLoading,
    isDetailLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedStorageTransfer,
    handleDelete,
    openDeleteDialog,
    form,
    handleChange,
    handleSubmit,
    isSaving,
    totalItems,
    currentPage,
    itemsPerPage,
    searchTerm,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
  };
}