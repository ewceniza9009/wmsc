'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Boxes, Clock, LayoutDashboard, Truck, Users } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Sample data for charts and tables
const temperatureData = [
  { day: 'Mon', zone1: -18.2, zone2: -20.1, zone3: -19.5 },
  { day: 'Tue', zone1: -18.5, zone2: -20.3, zone3: -19.8 },
  { day: 'Wed', zone1: -18.1, zone2: -20.0, zone3: -19.3 },
  { day: 'Thu', zone1: -18.4, zone2: -20.2, zone3: -19.6 },
  { day: 'Fri', zone1: -18.3, zone2: -20.1, zone3: -19.4 },
  { day: 'Sat', zone1: -18.6, zone2: -20.4, zone3: -19.7 },
  { day: 'Sun', zone1: -18.2, zone2: -20.0, zone3: -19.5 },
];

const inventoryData = [
  { category: 'Dairy', current: 120, capacity: 150 },
  { category: 'Meat', current: 85, capacity: 100 },
  { category: 'Seafood', current: 45, capacity: 75 },
  { category: 'Produce', current: 65, capacity: 100 },
  { category: 'Frozen Foods', current: 110, capacity: 125 },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Acme Foods', status: 'Processing', date: '2025-03-01', items: 12 },
  { id: 'ORD-002', customer: 'Fresh Mart', status: 'Shipped', date: '2025-02-28', items: 8 },
  { id: 'ORD-003', customer: 'Glacier Distributors', status: 'Delivered', date: '2025-02-27', items: 15 },
  { id: 'ORD-004', customer: 'Polar Logistics', status: 'Processing', date: '2025-02-26', items: 6 },
  { id: 'ORD-005', customer: 'Arctic Storage Co.', status: 'Pending', date: '2025-02-25', items: 10 },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <LayoutDashboard className="h-7 w-7 text-primary" />
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name || 'User'}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">425</div>
            <p className="text-xs text-muted-foreground">Products in storage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">System users</p>
          </CardContent>
        </Card>
      </div>

      {/* Temperature Monitoring Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature Monitoring</CardTitle>
          <CardDescription>
            7-day temperature trends across cold storage zones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={temperatureData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[-22, -16]} />
                <Tooltip formatter={(value) => [`${value}°C`, 'Temperature']} />
                <Legend />
                <Line type="monotone" dataKey="zone1" stroke="#0ea5e9" name="Zone 1" />
                <Line type="monotone" dataKey="zone2" stroke="#14b8a6" name="Zone 2" />
                <Line type="monotone" dataKey="zone3" stroke="#8b5cf6" name="Zone 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Capacity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Capacity</CardTitle>
          <CardDescription>
            Current storage utilization by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={inventoryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#14b8a6" name="Current Stock" />
                <Bar dataKey="capacity" fill="#cbd5e1" name="Total Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Latest order activity in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>
              Manage your warehouse inventory and stock levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end">
              <Button asChild>
                <Link href="/pages/inventory">
                  Go to Inventory <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order Processing</CardTitle>
            <CardDescription>
              View and process incoming and outgoing orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end">
              <Button asChild>
                <Link href="/pages/orders">
                  Go to Orders <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage system users and their permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end">
              <Button asChild>
                <Link href="/pages/users">
                  Go to Users <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}