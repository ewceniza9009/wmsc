"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlusCircle, Pencil, Trash2, Thermometer } from "lucide-react";
import DataGrid from "@/components/DataGrid";
import { TableRow, TableCell } from "@/components/ui/table";
import usePage from "./usePage";
import Link from "next/link";

export default function RoomsPage() {
  const {
    rooms,
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedRoom,
    handleDelete,
    openDeleteDialog,
  } = usePage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Thermometer className="h-6 w-6 text-teal-500" />
            Rooms
          </h1>
          <p>Manage temperature-controlled rooms and their information</p>
        </div>

        <Link href="./rooms/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <DataGrid
            viewportHeight="60vh"
            data={rooms}
            columns={[
              { header: "Room Number" },
              { header: "Room Name" },
              { header: "Temperature Range" },
              { header: "Created" },
              { header: "Actions" },
            ]}
            searchFields={["roomNumber", "roomName"]}
            renderRow={(room) => (
              <TableRow key={room.id}>
                <TableCell>{room.roomNumber}</TableCell>
                <TableCell>{room.roomName}</TableCell>
                <TableCell>
                  {room.temperatureFrom}°C - {room.temperatureTo}°C
                </TableCell>
                <TableCell>
                  {new Date(room.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`./rooms/${room.id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(room)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
          />
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the
              room {selectedRoom?.roomName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
