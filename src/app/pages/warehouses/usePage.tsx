"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { Company } from "@/models/MstCompany";
import { Warehouse } from "@/models/MstWarehouse";

export default function usePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  // Authenticate and fetch initial data
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

  return {
    warehouses,
    companies,
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedWarehouse,
    handleDelete,
    openDeleteDialog,
  };
}
