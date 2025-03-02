'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Box, Truck, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Box className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">WMS</span>
          </div>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Warehouse Management System
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Streamline your inventory, optimize operations, and boost productivity with our comprehensive warehouse management solution.
            </p>
            <div className="pt-4">
              <Button size="lg" asChild>
                <Link href="/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-64 md:h-80 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <Box className="h-24 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Box className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Track stock levels, manage product locations, and optimize storage space.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Truck className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Order Processing</CardTitle>
                <CardDescription>
                  Streamline picking, packing, and shipping operations with efficient workflows.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Control access levels and monitor staff performance across your warehouse.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Warehouse Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
