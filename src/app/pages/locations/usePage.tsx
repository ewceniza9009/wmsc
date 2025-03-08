"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { Location } from "@/models/MstLocation";

export default function usePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id !== "new";

  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  
  const [form, setForm] = useState({
    locationNumber: "",
    locationName: "",
    locBay: "",
    locColumn: "",
    locRow: "",
    roomId: "",
    capacity: 0,
    totalWeight: 0,
    palletCount: 0,
    isLocked: false
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      if (!["admin", "manager"].includes(session.user.role)) {
        toast.error("You do not have permission to access this page");
        router.push("/pages");
      } else {
        fetchLocations();
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (isEdit && id) {
      setIsDetailLoading(true);
      axios
        .get(`/api/locations/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error(err))
        .finally(() => setIsDetailLoading(false));
    } else {
      setIsDetailLoading(false);
    }
  }, [id, isEdit]);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/locations");
      setLocations(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load locations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLocation) return;
    try {
      await axios.delete(`/api/locations/${selectedLocation.id}`);
      toast.success("Location deleted successfully");
      fetchLocations();
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete location");
    }
  };

  const openDeleteDialog = (location: Location) => {
    setSelectedLocation(location);
    setIsDeleteDialogOpen(true);
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEdit) {
        await axios.put(`/api/locations/${id}`, form);
        toast.success("Location updated successfully");
      } else {
        await axios.post("/api/locations", form);
        router.push("./");
        toast.success("Location added successfully");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save location");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    locations,
    isLoading,
    isDetailLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedLocation,
    handleDelete,
    openDeleteDialog,
    form,
    handleChange,
    handleSubmit,
    isSaving,
  };
}
