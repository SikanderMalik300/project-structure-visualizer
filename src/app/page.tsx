'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { ClientWrapper } from '@/components/ClientWrapper';

// Landing page components
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

// Dashboard redirect component
function DashboardRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-6"></div>
        <p className="text-slate-600 text-lg font-medium">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}

function HomeContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard redirect if user is logged in
  if (user) {
    return <DashboardRedirect />;
  }

  const handleGetStarted = () => {
    router.push('/auth');
  };

  // Show landing page if user is not logged in
  return (
    <div className="min-h-screen">
      <Header />
      <Hero onGetStarted={handleGetStarted} onViewDemo={handleGetStarted} />
      <Features />
      <HowItWorks onGetStarted={handleGetStarted} />
      <CTA onGetStarted={handleGetStarted} onViewDemo={handleGetStarted} />
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <ClientWrapper>
      <HomeContent />
    </ClientWrapper>
  );
}