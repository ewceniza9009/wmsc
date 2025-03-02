'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Box, Truck, Users, ChevronLeft, ChevronRight, Warehouse, Thermometer, Clock, Shield, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const features = [
    {
      title: "Inventory Management",
      description: "Track stock levels, manage product locations, and optimize storage space.",
      icon: <Box className="h-12 w-12 text-primary mb-4" />,
      image: "/images/pallet.svg"
    },
    {
      title: "Order Processing",
      description: "Streamline picking, packing, and shipping operations with efficient workflows.",
      icon: <Truck className="h-12 w-12 text-primary mb-4" />,
      image: "/images/truck.svg"
    },
    {
      title: "Warehouse Management",
      description: "Control access levels and monitor staff performance across your warehouse.",
      icon: <Warehouse className="h-12 w-12 text-primary mb-4" />,
      image: "/images/warehouse.svg"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Warehouse className="h-8 w-8 text-teal-600" />
            <span className="text-xl font-bold text-teal-700 dark:text-teal-500">WMS Cold Storage</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/login">Login</Link>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <motion.div 
            className="md:w-1/2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-teal-700 dark:text-teal-500">
              Cold Storage Warehouse Management
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Streamline your inventory, optimize operations, and boost productivity with our comprehensive temperature-controlled warehouse management solution.
            </p>
            <div className="pt-4 flex space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700" asChild>
                  <Link href="/login">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="border-teal-600 text-teal-700 hover:bg-teal-50" asChild>
                  <a href="#features">
                    Learn More
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md h-64 md:h-80 rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/images/warehouse.svg" 
                alt="Warehouse Illustration" 
                fill 
                className="object-contain p-4"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.section 
          className="py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8 text-teal-700 dark:text-teal-500">Trusted by Industry Leaders</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <p className="text-3xl font-bold text-teal-600">99.9%</p>
                <p className="text-gray-600 dark:text-gray-300">Uptime Reliability</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-teal-600">500+</p>
                <p className="text-gray-600 dark:text-gray-300">Active Warehouses</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-teal-600">10M+</p>
                <p className="text-gray-600 dark:text-gray-300">Items Tracked</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-teal-600">24/7</p>
                <p className="text-gray-600 dark:text-gray-300">Customer Support</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Carousel Section */}
        <section className="py-12" id="features">
          <h2 className="text-3xl font-bold text-center mb-12 text-teal-700 dark:text-teal-500">Key Features</h2>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Carousel */}
            <div className="overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800">
              <div className="relative h-96">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0 flex flex-col md:flex-row items-center p-6 transition-all duration-500"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: currentSlide === index ? 1 : 0,
                      zIndex: currentSlide === index ? 10 : 0
                    }}
                  >
                    <div className="md:w-1/2 space-y-4 mb-6 md:mb-0">
                      <div className="text-teal-600 dark:text-teal-400">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-500">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                      <div className="relative w-full h-48 md:h-64">
                        <Image 
                          src={feature.image} 
                          alt={feature.title} 
                          fill 
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={prevSlide}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous</span>
              </Button>
              
              <div className="flex space-x-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={nextSlide}
                className="rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12 text-teal-700 dark:text-teal-500">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <Thermometer className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Temperature Control</h3>
              <p className="text-gray-600 dark:text-gray-300">Precise monitoring and control of storage temperatures for sensitive goods.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <Truck className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Efficient Logistics</h3>
              <p className="text-gray-600 dark:text-gray-300">Optimize shipping routes and delivery schedules for maximum efficiency.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <Users className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Team Management</h3>
              <p className="text-gray-600 dark:text-gray-300">Comprehensive tools for staff scheduling, task assignment, and performance tracking.</p>
            </motion.div>
          </div>
        </section>

        {/* Additional Benefits Section */}
        <motion.section 
          className="py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-teal-700 dark:text-teal-500">Advanced Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <Clock className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">Monitor inventory movements and status updates in real-time across your facilities.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <Shield className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Security & Compliance</h3>
              <p className="text-gray-600 dark:text-gray-300">Enterprise-grade security features and compliance with industry regulations for cold storage.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <BarChart className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Analytics & Reporting</h3>
              <p className="text-gray-600 dark:text-gray-300">Comprehensive data analysis and reporting tools to optimize your warehouse operations.</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Call to Action Section */}
        <motion.section 
          className="py-16 bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl shadow-lg my-12 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Cold Storage Operations?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">Join hundreds of businesses that have optimized their warehouse management with our specialized cold storage solution.</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button size="lg" className="bg-white text-teal-700 hover:bg-gray-100" asChild>
                <Link href="/login">
                  Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Warehouse className="h-6 w-6 text-teal-600" />
                <span className="text-lg font-bold text-teal-700 dark:text-teal-500">WMS Cold Storage</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Comprehensive warehouse management solution for temperature-controlled environments.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4 text-teal-700 dark:text-teal-500">Features</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>Inventory Management</li>
                <li>Order Processing</li>
                <li>Temperature Monitoring</li>
                <li>Staff Management</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4 text-teal-700 dark:text-teal-500">Resources</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Support Center</li>
                <li>Case Studies</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4 text-teal-700 dark:text-teal-500">Contact</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>Email: info@wmscold.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: 123 Warehouse Ave</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} WMS Cold Storage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
