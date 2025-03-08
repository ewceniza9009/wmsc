"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { Customer } from "@/models/MstCustomer";
import { Term } from "@/models/MstTerm";

export default function usePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id !== "new";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  
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
      if (!["admin", "manager"].includes(session.user.role)) {
        toast.error("You do not have permission to access this page");
        router.push("/pages");
      } else {
        fetchCustomers();
        fetchTerms();
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);

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

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/customers");
      setCustomers(data);
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

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    try {
      await axios.delete(`/api/customers/${selectedCustomer.id}`);
      toast.success("Customer deleted successfully");
      fetchCustomers();
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete Customer");
    }
  };

  const openDeleteDialog = (Customer: Customer) => {
    setSelectedCustomer(Customer);
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

  return {
    customers,
    terms,
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
  };
}