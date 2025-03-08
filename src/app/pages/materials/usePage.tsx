"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { Material } from "@/models/MstMaterial";

export default function usePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id !== "new";

  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialCategories, setMaterialCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  
  // Server-side pagination and search state
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [form, setForm] = useState({
    materialNumber: "",
    brandCode: "",
    materialName: "",
    materialCategoryId: "",
    numberOfDaysToExpiry: 0,
    customerId: "",
    unitId: "",
    fixedWeight: 0,
    weightType: "Fixed",
    isLocked: false
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      if (!['admin', 'manager'].includes(session.user.role)) {
        toast.error("You do not have permission to access this page");
        router.push("/pages");
      } else {
        fetchMaterials(currentPage, itemsPerPage, searchTerm);
        fetchMaterialCategories();
        fetchCustomers();
        fetchUnits();
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router, currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    if (isEdit && id) {
      setIsDetailLoading(true);
      axios
        .get(`/api/materials/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error(err))
        .finally(() => setIsDetailLoading(false));
    } else {
      setIsDetailLoading(false);
    }
  }, [id, isEdit]);

  const fetchMaterials = async (page: number, limit: number, search: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/materials?page=${page}&limit=${limit}&search=${search}`);
      setMaterials(data.items);
      setTotalItems(data.totalItems);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load materials");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaterialCategories = async () => {
    try {
      const { data } = await axios.get("/api/material-categories");
      setMaterialCategories(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load material categories");
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get("/api/customers");
      setCustomers(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load customers");
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

  const handleDelete = async () => {
    if (!selectedMaterial) return;
    try {
      await axios.delete(`/api/materials/${selectedMaterial.id}`);
      toast.success("Material deleted successfully");
      fetchMaterials(currentPage, itemsPerPage, searchTerm);
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete material");
    }
  };

  const openDeleteDialog = (material: Material) => {
    setSelectedMaterial(material);
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
        await axios.put(`/api/materials/${id}`, form);
        toast.success("Material updated successfully");
      } else {
        await axios.post("/api/materials", form);
        router.push("./");
        toast.success("Material added successfully");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save material");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle page change for ServerDataGrid
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change for ServerDataGrid
  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle search term change for ServerDataGrid
  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  return {
    materials,
    materialCategories,
    customers,
    units,
    isLoading,
    isDetailLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedMaterial,
    handleDelete,
    openDeleteDialog,
    form,
    handleChange,
    handleSubmit,
    isSaving,
    // Server-side pagination and search props
    totalItems,
    currentPage,
    itemsPerPage,
    searchTerm,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
  };
}
