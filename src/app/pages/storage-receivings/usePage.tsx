"use client";

import { StorageReceiving } from "@/models/TrnStorageReceiving";
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

  const [storageReceivings, setStorageRecevings] = useState<StorageReceiving[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(true);

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    receivingOrderId: null,
    receivingNumber: "",
    warehouseId: "",
    pickFromWarehouseId: "",
    storagePickId: "",
    receivingDate: new Date(),
    receivingTime: new Date(),
    truckPlateNumber: "",
    manufactureDateHeader: new Date(),
    noOfDaysToPrompAlertHeader: 0,
    quantity: 0,
    weight: 0,
    containerNumber: "",
    remarks: "",
    customerId: "",
    isFreezing: false,
    receivingBy: "",
    isLocked: false,
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStorageReceving, setSelectedStorageReceving] =
    useState<StorageReceiving | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      if (!["admin", "manager"].includes(session.user.role)) {
        toast.error("You do not have permission to access this page");
        router.push("/pages");
      } else {
        fetchStorageRecevings(currentPage, itemsPerPage, searchTerm);
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router, currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    if (isEdit && id) {
      setIsDetailLoading(true);
      axios
        .get(`/api/storage-receivings/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error(err))
        .finally(() => setIsDetailLoading(false));
    } else {
      setIsDetailLoading(false);
    }
  }, [id, isEdit]);

  const fetchStorageRecevings = async (
    page: number,
    limit: number,
    search: string
  ) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/api/storage-receivings?page=${page}&limit=${limit}&search=${search}`
      );
      setStorageRecevings(data.items);
      setTotalItems(data.totalItems);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load storage receiving"
      );
    } finally {
      console.log(storageReceivings)
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStorageReceving) return;
    try {
      await axios.delete(`/api/storage-receivings/${selectedStorageReceving.id}`);
      toast.success("Storage receving deleted successfully");
      fetchStorageRecevings(currentPage, itemsPerPage, searchTerm);
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete storage receving"
      );
    }
  };

  const openDeleteDialog = (storageReceving: StorageReceiving) => {
    setSelectedStorageReceving(storageReceving);
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
        await axios.put(`/api/storage-recevings/${id}`, form);
        toast.success("Storage receving updated successfully");
      } else {
        await axios.post("/api/storage-receivings", form);
        router.push("./");
        toast.success("Storage receving added successfully");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to save storage receving"
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
    storageReceivings,
    isLoading,
    isDetailLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedStorageReceving,
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
