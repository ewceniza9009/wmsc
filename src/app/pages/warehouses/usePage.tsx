"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { Company } from "@/models/MstCompany";
import { Warehouse } from "@/models/MstWarehouse";

export default function usePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id !== "new";

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  
  const [form, setForm] = useState({
    warehouseCode: "",
    warehouseName: "",
    companyId: "",
    address: "",
    contact: "",
    contactNumber: "",
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      if (!["admin", "manager"].includes(session.user.role)) {
        toast.error("You do not have permission to access this page");
        router.push("/pages");
      } else {
        fetchWarehouses();
        fetchCompanies();
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (isEdit && id) {
      setIsDetailLoading(true);
      axios
        .get(`/api/warehouses/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error(err))
        .finally(() => setIsDetailLoading(false));
    } else {
      setIsDetailLoading(false);
    }
  }, [id, isEdit]);

  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get("/api/companies");
      setCompanies(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load companies");
    }
  };

  const fetchWarehouses = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/warehouses");
      setWarehouses(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load warehouses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedWarehouse) return;
    try {
      await axios.delete(`/api/warehouses/${selectedWarehouse.id}`);
      toast.success("Warehouse deleted successfully");
      fetchWarehouses();
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete warehouse");
    }
  };

  const openDeleteDialog = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteDialogOpen(true);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEdit) {
        await axios.put(`/api/warehouses/${id}`, form);
        toast.success("Warehouse updated successfully");
      } else {
        await axios.post("/api/warehouses", form);
        router.push("/warehouses");
        toast.success("Warehouse added successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    warehouses,
    companies,
    isLoading,
    isDetailLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedWarehouse,
    handleDelete,
    openDeleteDialog,
    form,
    handleChange,
    handleSubmit,
    isSaving,
  };
}
