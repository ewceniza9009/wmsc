'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      // In a real implementation, this would call an API endpoint to send a reset email
      // For now, we'll just simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      toast.success('Password reset instructions sent to your email');
      setEmailSent(true);
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64">
          <Image 
            src="/images/warehouse.svg" 
            alt="Warehouse" 
            width={256} 
            height={256} 
            className="opacity-50"
          />
        </div>
        <div className="absolute bottom-20 right-20 w-64 h-64">
          <Image 
            src="/images/truck.svg" 
            alt="Truck" 
            width={256} 
            height={256} 
            className="opacity-50"
          />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96">
          <Image 
            src="/images/pallet.svg" 
            alt="Pallet" 
            width={384} 
            height={384} 
            className="opacity-30"
          />
        </div>
      </div>

      {/* Back to login link */}
      <div className="absolute top-6 left-6 z-20">
        <motion.div
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
        >
          <Link href="/login" passHref legacyBehavior>
            <a className="flex items-center text-teal-700 dark:text-teal-500 hover:text-teal-800 dark:hover:text-teal-400 p-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </a>
          </Link>
        </motion.div>
      </div>

      {/* Forgot Password card */}
      <div className="flex items-center justify-center min-h-screen px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl border-t-4 border-teal-500">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: 0.3 
                  }}
                >
                  <KeyRound className="h-12 w-12 text-teal-600" />
                </motion.div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-teal-700 dark:text-teal-500">
                Forgot Password
              </CardTitle>
              <CardDescription className="text-center">
                {emailSent 
                  ? "Check your email for reset instructions" 
                  : "Enter your email to receive password reset instructions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!emailSent ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="email@example.com" 
                                {...field} 
                                disabled={isLoading}
                                className="bg-white/50 dark:bg-gray-700/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : 'Send Reset Instructions'}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4"
                >
                  <p className="mb-4 text-teal-700 dark:text-teal-500">
                    We've sent password reset instructions to your email address.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please check your inbox and follow the instructions to reset your password.
                  </p>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Remember your password?{' '}
                <Link href="/login" className="text-teal-600 hover:text-teal-700 dark:text-teal-500 dark:hover:text-teal-400">
                  Back to Login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}