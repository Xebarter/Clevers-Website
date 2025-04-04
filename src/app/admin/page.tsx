"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User, ShieldAlert } from "lucide-react";
import { useAdminAuth } from './auth';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const { login, session, isLoading } = useAdminAuth();

  // If already authenticated, redirect to applications page
  useEffect(() => {
    if (!isLoading && session.isAuthenticated) {
      router.push('/admin/applications');
    }
  }, [isLoading, session, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    if (!username || !password) {
      setError('Please enter both username and password');
      setIsLoggingIn(false);
      return;
    }

    // Attempt login
    const success = login(username, password);
    if (success) {
      router.push('/admin/applications');
    } else {
      setError('Invalid username or password');
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-kinder-blue/10 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kinder-blue mx-auto"></div>
          <p className="mt-4 text-kinder-blue font-heading">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-kinder-blue/10 to-white p-4">
      <Card className="w-full max-w-md border-2 border-kinder-blue/30 rounded-3xl shadow-lg overflow-hidden">
        <CardHeader className="bg-kinder-blue/10 border-b border-kinder-blue/20 text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-kinder-blue flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-heading text-kinder-blue">Admin Login</CardTitle>
          <CardDescription className="font-body text-gray-600">
            Please enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="pt-6 space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl flex items-center gap-2 mb-4">
                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-body">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="block font-medium text-gray-700 font-heading">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="pl-10 kinder-input"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block font-medium text-gray-700 font-heading">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10 kinder-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pb-6">
            <Button
              type="submit"
              className="w-full kinder-button"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
