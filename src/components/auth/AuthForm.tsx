'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, UserPlus, AlertCircle, FolderTree, CheckCircle, Mail, Lock } from 'lucide-react';

export function AuthForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    console.log('Attempting to', isSignIn ? 'sign in' : 'sign up', 'with email:', email);

    try {
      const { error } = isSignIn 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        console.error('Auth error:', error);
        setError(error.message);
      } else {
        if (!isSignIn) {
          setSuccess('Account created! Please check your email for verification.');
        }
        console.log('Auth successful');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8 relative overflow-hidden font-poppins">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-4 sm:-bottom-8 left-1/2 transform -translate-x-1/2 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-16 sm:top-32 left-1/4 w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 border-2 border-blue-500 rotate-45 animate-bounce"></div>
        <div className="absolute top-24 sm:top-48 right-1/4 w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 bg-indigo-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-16 sm:bottom-32 left-1/3 w-2 sm:w-3 lg:w-4 h-2 sm:h-3 lg:h-4 bg-cyan-500 transform rotate-45 animate-spin-slow"></div>
      </div>

      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <div className="w-6 h-6 sm:w-8 lg:w-9 sm:h-8 lg:h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg sm:shadow-xl">
              <FolderTree className="w-3 h-3 sm:w-4 lg:w-5 sm:h-4 lg:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Project Structure
              </h1>
              <p className="text-xs text-slate-500 font-medium">Visualizer</p>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="border-0 shadow-lg sm:shadow-xl bg-white/80 backdrop-blur-md overflow-hidden">
          <CardHeader className="text-center pb-3 sm:pb-4 bg-gradient-to-b from-white to-slate-50/50 p-3 sm:p-4 lg:p-5">
            <div className="w-8 h-8 sm:w-10 lg:w-12 sm:h-10 lg:h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              {isSignIn ? (
                <LogIn className="w-4 h-4 sm:w-5 lg:w-6 sm:h-5 lg:h-6 text-blue-600" />
              ) : (
                <UserPlus className="w-4 h-4 sm:w-5 lg:w-6 sm:h-5 lg:h-6 text-purple-600" />
              )}
            </div>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-1 sm:mb-2">
              {isSignIn ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-1 sm:px-2">
              {isSignIn 
                ? 'Sign in to access your dashboard' 
                : 'Join developers visualizing projects'
              }
            </p>
          </CardHeader>
          
          <CardContent className="p-3 sm:p-4 lg:p-6">
            {error && (
              <Alert variant="destructive" className="mb-3 sm:mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <AlertDescription className="text-red-700 text-xs sm:text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-3 sm:mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                <AlertDescription className="text-green-700 text-xs sm:text-sm">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium text-xs sm:text-sm">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className="pl-8 sm:pl-9 h-8 sm:h-9 lg:h-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-md sm:rounded-lg bg-slate-50/50 backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium text-xs sm:text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    minLength={6}
                    className="pl-8 sm:pl-9 h-8 sm:h-9 lg:h-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-md sm:rounded-lg bg-slate-50/50 backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm"
                  />
                </div>
                {!isSignIn && (
                  <p className="text-xs text-slate-500 mt-1">
                    Minimum 6 characters
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-8 sm:h-9 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-md sm:rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-semibold text-xs sm:text-sm"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-1.5">
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                    <span className="text-xs sm:text-sm">Processing...</span>
                  </div>
                ) : isSignIn ? (
                  <div className="flex items-center gap-1.5">
                    <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Sign In</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Create Account</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Switch Auth Mode */}
            <div className="mt-4 sm:mt-5 text-center">
              <p className="text-slate-600 mb-2 text-xs sm:text-sm">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setIsSignIn(!isSignIn);
                  setError(null);
                  setSuccess(null);
                }}
                disabled={loading}
                className="border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 rounded-md sm:rounded-lg px-4 sm:px-6 text-xs sm:text-sm h-7 sm:h-8"
              >
                {isSignIn ? "Create new account" : "Sign in instead"}
              </Button>
            </div>

            {/* Features reminder */}
            <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-100">
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-2">Why join us?</p>
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 text-xs text-slate-600">
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                    <span>Free forever</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                    <span>Privacy first</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                    <span>Instant setup</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}