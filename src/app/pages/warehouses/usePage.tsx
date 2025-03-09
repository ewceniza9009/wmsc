"use client";

import { Company } from "@/models/MstCompany";
import { Warehouse } from "@/models/MstWarehouse";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function usePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id !== "new";

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  
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

  const fetchCompanies = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/companies-select");
      setCompanies(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load companies");
    }
  }, []);

  const fetchWarehouses = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/warehouses", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm
        }
      });
      setWarehouses(data.data);
      setTotalItems(data.pagination.total);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load warehouses");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm]);

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
  }, [status, session, router, fetchWarehouses, fetchCompanies]);
  
  // Refetch warehouses when pagination or search changes
  useEffect(() => {
    if (status === "authenticated" && ["admin", "manager"].includes(session?.user.role)) {
      fetchWarehouses();
    }
  }, [currentPage, itemsPerPage, searchTerm, status, session?.user.role, fetchWarehouses]);

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
        router.push("./");
        toast.success("Warehouse added successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle pagination and search changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
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
    // Pagination and search props
    currentPage,
    itemsPerPage,
    searchTerm,
    totalItems,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
  };
}
