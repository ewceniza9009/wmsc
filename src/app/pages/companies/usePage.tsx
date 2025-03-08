"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { Company } from "@/models/MstCompany";

export default function usePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id !== "new";

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  
  // Server-side pagination and search state
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [form, setForm] = useState({
    companyName: "",
    companyAddress: "",
    contactPerson: "",
    contactNo: "",
    tiin: "",
    bookNumber: "",
    accreditationNumber: "",
    serialNumber: "",
    permitNumber: "",
    accountant: "",
    financeManager: "",
    operationsManager: "",
    managingDirector: "",
    defaultApproveBy: "",
    imagePath: "",
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      if (!['admin', 'manager'].includes(session.user.role)) {
        toast.error("You do not have permission to access this page");
        router.push("/pages");
      } else {
        fetchCompanies(currentPage, itemsPerPage, searchTerm);
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router, currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    if (isEdit && id) {
      setIsDetailLoading(true);
      axios
        .get(`/api/companies/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error(err))
        .finally(() => setIsDetailLoading(false));
    } else {
      setIsDetailLoading(false);
    }
  }, [id, isEdit]);

  const fetchCompanies = async (page: number, limit: number, search: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/companies?page=${page}&limit=${limit}&search=${search}`);
      setCompanies(data.items);
      setTotalItems(data.totalItems);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load companies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCompany) return;
    try {
      await axios.delete(`/api/companies/${selectedCompany.id}`);
      toast.success("Company deleted successfully");
      fetchCompanies(currentPage, itemsPerPage, searchTerm);
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete company");
    }
  };

  const openDeleteDialog = (company: Company) => {
    setSelectedCompany(company);
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
        await axios.put(`/api/companies/${id}`, form);
        toast.success("Company updated successfully");
      } else {
        await axios.post("/api/companies", form);
        router.push("./");
        toast.success("Company added successfully");
      }
    } catch (error) {
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
    companies,
    isLoading,
    isDetailLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedCompany,
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