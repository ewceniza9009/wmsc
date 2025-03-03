'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Box, Truck, Users, ChevronLeft, ChevronRight, Warehouse, Thermometer, Clock, Shield, BarChart, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const features = [
    {
      title: "Temperature Control",
      description: "Monitor and maintain precise temperature conditions for sensitive cold storage products with real-time alerts and historical data tracking for quality assurance.",
      icon: <Thermometer className="h-12 w-12 text-teal-600 mb-4" />,
      image: "/images/cold_storage.jpg"
    },
    {
      title: "Inventory Management",
      description: "Track stock levels, manage product locations, and optimize cold storage space with advanced algorithms that reduce waste and improve efficiency.",
      icon: <Box className="h-12 w-12 text-teal-600 mb-4" />,
      image: "/images/warehouse.jpeg"
    },
    {
      title: "Traceability",
      description: "Maintain complete chain of custody and temperature history for regulatory compliance with detailed audit trails and automated documentation.",
      icon: <FileText className="h-12 w-12 text-teal-600 mb-4" />,
      image: "/images/warehouse_employee.jpg"
    },
    {
      title: "Energy Efficiency",
      description: "Optimize power consumption with smart cooling systems that adjust based on inventory levels and external conditions, reducing operational costs.",
      icon: <Shield className="h-12 w-12 text-teal-600 mb-4" />,
      image: "/images/cold_storage.jpg"
    },
    {
      title: "Mobile Access",
      description: "Control your cold storage operations from anywhere with secure mobile applications that provide real-time monitoring and management capabilities.",
      icon: <BarChart className="h-12 w-12 text-teal-600 mb-4" />,
      image: "/images/warehouse.jpeg"
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
      {/* Header with Navigation */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Warehouse className="h-8 w-8 text-teal-600" />
            <span className="text-xl font-bold text-teal-700 dark:text-teal-400">WMS COLD STORAGE</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button asChild className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              <Link href="/login">Login</Link>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Cold Storage Solutions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        {/* Hero Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <motion.div 
            className="md:w-1/2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-teal-700 dark:text-teal-400">
              Cold Storage Warehouse Management
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Streamline your temperature-controlled inventory, optimize operations, and ensure compliance with our comprehensive cold storage warehouse management solution.
            </p>
            <div className="pt-4 flex space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="w-full bg-teal-600 hover:bg-teal-700 text-white" asChild>
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
            <div className="relative w-full max-w-md h-64 md:h-80 rounded-lg overflow-hidden shadow-xl bg-blue-50 p-4">
              <Image 
                src="/images/warehouse.jpeg" 
                alt="Cold Storage Warehouse" 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Benefits Section */}
        <motion.section 
          className="py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 text-teal-700 dark:text-teal-400">Cold Storage Benefits</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <Thermometer className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Temperature Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-300">Continuous monitoring with alerts for temperature deviations to protect sensitive inventory.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <Truck className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Cold Chain Logistics</h3>
              <p className="text-gray-600 dark:text-gray-300">Maintain temperature integrity throughout the entire supply chain process.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <Shield className="h-10 w-10 text-teal-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Compliance & Reporting</h3>
              <p className="text-gray-600 dark:text-gray-300">Automated documentation and reporting for regulatory compliance requirements.</p>
            </motion.div>
          </div>
        </section>
        </motion.section>

        {/* Additional Benefits Section */}
        <motion.section 
          className="py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-teal-700 dark:text-teal-400">Advanced Cold Storage Features</h2>
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

          {/* Features Carousel Section */}
          <section className="py-12" id="features">
          <h2 className="text-3xl font-bold text-center mb-12 text-teal-700 dark:text-teal-400">Cold Storage Solutions</h2>
          
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
                      <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-400">{feature.title}</h3>
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

        {/* Stats Section */}
        <motion.section 
          className="py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8 text-teal-700 dark:text-teal-400">Trusted by Cold Chain Leaders</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <p className="text-3xl font-bold text-teal-600">99.9%</p>
                <p className="text-gray-600 dark:text-gray-300">Temperature Accuracy</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-teal-600">500+</p>
                <p className="text-gray-600 dark:text-gray-300">Cold Storage Facilities</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-teal-600">10M+</p>
                <p className="text-gray-600 dark:text-gray-300">Temperature-Sensitive Items</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-teal-600">24/7</p>
                <p className="text-gray-600 dark:text-gray-300">Monitoring & Support</p>
              </div>
            </div>
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
                <li>Temperature Control</li>
                <li>Traceability</li>
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
                <li>Address: 123 Cold Storage Ave</li>
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
