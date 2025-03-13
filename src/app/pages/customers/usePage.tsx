"use client";

import { Customer } from "@/models/MstCustomer";
import { Tax } from "@/models/MstTax";
import { Term } from "@/models/MstTerm";
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

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  
  // Server-side pagination and search state
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [form, setForm] = useState({
    customerNumber: "",
    customerName: "",
    accountId: "",
    creditLimit: 0,
    termId: "",
    address: "",
    emailAddress: "",
    tinNumber: "",
    faxNumber: "",
    contactNumber: "",
    contactPerson: "",
    contactPosition: "",
    salesPerson: "",
    companyName: "",
    billingAddress: "",
    shippingAddress: "",
    taxId: "",
    isLocked: false,
    status: ""
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      if (!['admin', 'manager'].includes(session.user.role)) {
        toast.error("You do not have permission to access this page");
        router.push("/pages");
      } else {
        fetchCustomers(currentPage, itemsPerPage, searchTerm);
        fetchTerms();
        fetchTaxes();
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router, currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    if (isEdit && id) {
      setIsDetailLoading(true);
      axios
        .get(`/api/customers/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error(err))
        .finally(() => setIsDetailLoading(false));
    } else {
      setIsDetailLoading(false);
    }
  }, [id, isEdit]);

  const fetchCustomers = async (page: number, limit: number, search: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/customers?page=${page}&limit=${limit}&search=${search}`);
      setCustomers(data.items);
      setTotalItems(data.totalItems);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load Customers");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTerms = async () => {
    try {
      const { data } = await axios.get("/api/terms");
      setTerms(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load terms");
    }
  };

  const fetchTaxes = async () => {
    try {
      const { data } = await axios.get("/api/taxes");
      setTaxes(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load taxes");
    }
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    try {
      await axios.delete(`/api/customers/${selectedCustomer.id}`);
      toast.success("Customer deleted successfully");
      fetchCustomers(currentPage, itemsPerPage, searchTerm);
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete Customer");
    }
  };

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
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
        await axios.put(`/api/customers/${id}`, form);
        toast.success("Customer updated successfully");
      } else {
        await axios.post("/api/customers", form);
        router.push("./");
        toast.success("Customer added successfully");
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
    customers,
    terms,
    taxes,
    isLoading,
    isDetailLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedCustomer,
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