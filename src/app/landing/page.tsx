"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Zap, Shield, Rocket, Users, Globe, FileText, Boxes, Star, Check, Crown } from "lucide-react";
import Link from "next/link";
import { motion, useAnimation, useInView } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useSession } from "next-auth/react";
import * as React from "react";

export default function Landing() {
  const { data: session, status } = useSession();
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  

  

  
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  const ref1 = React.useRef<HTMLDivElement>(null);
  const ref2 = React.useRef<HTMLDivElement>(null);
  const ref3 = React.useRef<HTMLDivElement>(null);
  const inView1 = useInView(ref1, { once: true, margin: "-100px" });
  const inView2 = useInView(ref2, { once: true, margin: "-100px" });
  const inView3 = useInView(ref3, { once: true, margin: "-100px" });
  const fade = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };
  const [testimonialApi, setTestimonialApi] = React.useState<any>(null);
  const [isCarouselHovered, setIsCarouselHovered] = React.useState(false);
  React.useEffect(() => {
    if (!testimonialApi || isCarouselHovered) return;
    const id = setInterval(() => {
      testimonialApi?.scrollNext();
    }, 4000);
    return () => clearInterval(id);
  }, [testimonialApi, isCarouselHovered]);
  const Stat = ({ value, label, Icon }: { value: number; label: string; Icon?: React.ComponentType<any> }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const isIn = useInView(ref, { once: true, margin: "-100px" });
    const [count, setCount] = React.useState(0);
    
    React.useEffect(() => {
      if (!isIn || !isClient) return;
      const duration = 1200;
      const start = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        setCount(value * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      const id = requestAnimationFrame(step);
      return () => cancelAnimationFrame(id);
    }, [isIn, value, isClient]);
    
    const formatter = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 });
    
    return (
      <div ref={ref} className="relative overflow-hidden text-center p-6 rounded-xl border bg-card">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative flex items-center justify-center gap-2">
          {Icon ? <Icon className="h-5 w-5 text-primary" /> : null}
          <div className="text-4xl font-extrabold tracking-tight font-mono">
            {isClient ? formatter.format(Math.round(count)) : '0'}
          </div>
        </div>
        <div className="relative mt-1 text-sm text-muted-foreground font-mono">{label}</div>
      </div>
    );
  };


  return (
    <MainLayout>
      <section className="relative overflow-hidden">
        {/* Enhanced Background with Multiple Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-rose-300 to-pink-300 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-400/30 via-transparent to-blue-400/30" />
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 via-transparent to-green-400/20" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        
        {/* Multiple Parallax Blobs */}
        <motion.div
          className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-orange-400/50 blur-3xl"
          initial={{ y: -20 }}
          animate={{ y: 20 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 8, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-pink-400/50 blur-3xl"
          initial={{ y: 10 }}
          animate={{ y: -10 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 10, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute top-1/2 left-1/4 h-48 w-48 rounded-full bg-purple-400/40 blur-3xl"
          initial={{ x: -30, y: 10 }}
          animate={{ x: 30, y: -10 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 12, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute top-1/3 right-1/3 h-56 w-56 rounded-full bg-blue-400/40 blur-3xl"
          initial={{ x: 20, y: -20 }}
          animate={{ x: -20, y: 20 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 15, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-1/3 left-1/3 h-40 w-40 rounded-full bg-yellow-400/40 blur-3xl"
          initial={{ x: -15, y: -15 }}
          animate={{ x: 15, y: 15 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 9, ease: 'easeInOut' }}
        />
        <div className="container mx-auto max-w-7xl px-4 pt-16 pb-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              ref={ref1}
              variants={fade}
              initial="hidden"
              animate={inView1 ? "show" : "hidden"}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-mono mb-6">
                ASCII Generator
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl font-mono mb-6">
                Transform your image or text into an aesthetically pleasing ASCII Art representation.
              </p>
              <blockquote className="mb-8 p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20 rounded-r-lg">
                <p className="text-lg font-mono italic text-orange-700 dark:text-orange-300">
                  "ASCII acts as a universal 'language' in the Digital world"
                </p>
              </blockquote>
              <div className="flex flex-wrap gap-3">
                {session ? (
                  // User is authenticated - show only converter button
                  <Link href="/converter">
                    <Button size="lg" className="relative overflow-hidden">
                      <span className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/20 to-transparent blur" />
                      <span className="relative flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        Open Converter
                      </span>
                    </Button>
                  </Link>
                ) : (
                  // User is not authenticated - show only signup button
                  <Button size="lg" variant="outline" className="border-white/30 backdrop-blur" onClick={() => setLoginOpen(true)}>
                    <Crown className="h-5 w-5 mr-2" />
                    Sign up for free
                  </Button>
                )}
              </div>
            </motion.div>
            <motion.div
              ref={ref2}
              variants={fade}
              initial="hidden"
              animate={inView2 ? "show" : "hidden"}
              className="hidden lg:block"
            >
              <div className="relative aspect-[3/2] rounded-2xl border bg-white/80 backdrop-blur-xl p-8 shadow-2xl">
                {/* Enhanced Background Effects */}
                <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-orange-400/60 blur-2xl" />
                <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-pink-400/60 blur-2xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-purple-400/30 blur-2xl" />
                <div className="absolute top-1/4 right-1/4 h-16 w-16 rounded-full bg-blue-400/40 blur-xl" />
                <div className="absolute bottom-1/4 left-1/4 h-20 w-20 rounded-full bg-yellow-400/30 blur-xl" />
                
                {/* Glass Morphism Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl border border-white/20" />
                
                <div className="relative h-full w-full grid place-items-center text-center p-4">
                  <p className="text-base font-semibold text-gray-700 dark:text-gray-300 font-mono mb-6">
                    Transform images into detailed ASCII art with color preservation.
                  </p>
                  
                  {/* Animated ASCII Art Examples */}
                  <div className="space-y-4 w-full max-w-lg">
                    {/* Complex Colored ASCII Art */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-center"
                    >
                      <pre className="text-xs font-mono leading-none">
{`  @@@@@@@@@@
  %%%%%%%%%%
  ##########
  ==========
  ++++++++++`}
                      </pre>
                    </motion.div>
                    
                    {/* Lion Portrait ASCII */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-center"
                    >
                      <pre className="text-xs font-mono text-amber-600 leading-none">
{`    .--.
   /    \\
  | O  O |
   \\  ~  /
    '--'`}
                      </pre>
                    </motion.div>
                    
                    {/* Abstract Pattern ASCII */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="text-center"
                    >
                      <pre className="text-xs font-mono text-blue-500 leading-none">
{`  ++++++++
  ========
  ********
  %%%%%%%%`}
                      </pre>
                    </motion.div>
                  </div>
                  
                  {/* Floating ASCII Characters */}
                  {isClient && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {['@', '#', '$', '%', '&', '*', '+', '=', '~'].map((char, index) => {
                        const positions = [
                          { x: -50, y: -30, left: 25, top: 30 },
                          { x: 30, y: -60, left: 45, top: 25 },
                          { x: -80, y: 20, left: 30, top: 45 },
                          { x: 60, y: -20, left: 60, top: 35 },
                          { x: -20, y: 50, left: 35, top: 60 },
                          { x: 40, y: 40, left: 55, top: 55 },
                          { x: -60, y: -40, left: 25, top: 20 },
                          { x: 20, y: 70, left: 40, top: 70 },
                          { x: -40, y: -70, left: 30, top: 15 }
                        ];
                        const pos = positions[index] || { x: 0, y: 0, left: 50, top: 50 };
                        
                        return (
                          <motion.div
                            key={char}
                            className="absolute text-xs font-mono text-gray-400/30"
                            initial={{ 
                              x: pos.x,
                              y: pos.y,
                              opacity: 0 
                            }}
                            animate={{ 
                              x: pos.x + (index % 2 === 0 ? 20 : -20),
                              y: pos.y + (index % 3 === 0 ? 15 : -15),
                              opacity: [0, 0.5, 0]
                            }}
                            transition={{ 
                              duration: 3 + (index * 0.2),
                              repeat: Infinity,
                              delay: index * 0.3
                            }}
                            style={{
                              left: `${pos.left}%`,
                              top: `${pos.top}%`
                            }}
                          >
                            {char}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why use ASCII Generator Section */}
      <section className="container mx-auto max-w-7xl px-4 py-20 bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-orange-950/20 dark:via-rose-950/20 dark:to-pink-950/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,165,0,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.1),transparent_50%)]" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full opacity-10 blur-xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full opacity-10 blur-xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-5 blur-2xl" />
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
            Why use an <span className="text-orange-600 dark:text-orange-400">ASCII Generator</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 font-mono">
            Transform complex images into stunning ASCII art in minutes, not hours
          </p>
          <p className="text-lg text-muted-foreground mb-8 font-mono">
            Skip the learning curve and save <span className="text-orange-600 dark:text-orange-400 font-semibold">99% on design time</span>
          </p>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium font-mono">
              2nd Generation
            </span>
            <span className="px-4 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full text-sm font-medium font-mono">
              High-Quality Output
            </span>
            <span className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium font-mono">
              Easy to Use
            </span>
            <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium font-mono">
              Free & Private
            </span>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Traditional Way */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true, margin: "-100px" }} 
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border relative overflow-hidden"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-600" />
            <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 font-mono">Traditional Way</h3>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">9-12 hours</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300 font-mono">Manual Pixel Mapping</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">Hours spent analyzing each pixel and mapping to characters</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">3-4 hours</span>
              </div>
              
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300 font-mono">Character Selection</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">Trial and error finding the right character set</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">2-3 hours</span>
              </div>
              
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300 font-mono">Manual Adjustments</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">Fine-tuning contrast, brightness, and spacing</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">4-5 hours</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-400 font-medium font-mono">
                Pain point: Complex manual process & inconsistent results
              </p>
            </div>
            </div>
          </motion.div>

          {/* AI-Powered Way */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true, margin: "-100px" }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border-2 border-orange-200 dark:border-orange-800 relative overflow-hidden"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-gray-900" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-pink-600" />
            <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 font-mono">AI-Powered Way</h3>
              </div>
              <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">2 minutes</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300 font-mono">Smart Analysis</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">Instant image processing & intelligent character mapping</p>
                  </div>
                </div>
                <span className="text-sm text-orange-600 dark:text-orange-400">30 seconds</span>
              </div>
              
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.5 2.54l2.6 1.53c.56-1.24.9-2.62.9-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.05.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300 font-mono">Lightning-Fast</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">Generate in seconds, not hours</p>
                  </div>
                </div>
                <span className="text-sm text-orange-600 dark:text-orange-400">1 minute</span>
              </div>
              
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300 font-mono">Perfect Results</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">Optimized settings for crisp, clear output</p>
                  </div>
                </div>
                <span className="text-sm text-orange-600 dark:text-orange-400">30 seconds</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium font-mono">
                <span className="font-bold">10x faster creation</span> with consistent, professional results
              </p>
            </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground font-mono">Choose the plan that works for you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }} 
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl border bg-card p-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 font-mono">Free</h3>
              <div className="text-4xl font-bold mb-2 font-mono">$0</div>
              <p className="text-muted-foreground font-mono">Perfect for getting started</p>
            </div>
                          <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="font-mono">10 credits per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="font-mono">All export formats</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="font-mono">Basic presets</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="font-mono">Local processing</span>
                </li>
              </ul>
            {session ? (
              <Link href="/converter">
                <Button className="w-full" variant="outline">
                  Open Converter
                </Button>
              </Link>
            ) : (
              <Button className="w-full" variant="outline" onClick={() => setLoginOpen(true)}>
                Get Started Free
              </Button>
            )}
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }} 
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-2xl border-2 border-primary bg-card p-8"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 font-mono">Pro</h3>
              <div className="text-4xl font-bold mb-2 font-mono">$2<span className="text-lg text-muted-foreground">/month</span></div>
              <p className="text-muted-foreground font-mono">For power users and teams</p>
            </div>
                          <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="font-mono">Unlimited credits</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="font-mono">Advanced presets</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="font-mono">Batch processing</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="font-mono">Priority support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="font-mono">API access</span>
                </li>
              </ul>
            {session ? (
              <Link href="/converter">
                <Button className="w-full">
                  <Crown className="h-4 w-4 mr-2" />
                  Open Converter
                </Button>
              </Link>
            ) : (
              <Button className="w-full" onClick={() => setLoginOpen(true)}>
                <Crown className="h-4 w-4 mr-2" />
                Start Pro Trial
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-xl border p-6 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold font-mono">Ready to get started?</h2>
          <p className="mt-2 text-muted-foreground font-mono">
            Jump into the converter and turn your images into ASCII art.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {session && status === "authenticated" ? (
              // User is authenticated - show only converter button
              <Link href="/converter">
                <Button size="lg">
                  Open Converter
                </Button>
              </Link>
            ) : (
              // User is not authenticated - show only signup button
              <Button size="lg" variant="outline" onClick={() => setLoginOpen(true)}>
                <Crown className="h-4 w-4 mr-2" />
                Sign up for free
              </Button>
            )}
          </div>
        </div>
      </section>
              <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} setOpen={setLoginOpen} />
    </MainLayout>
  );
}
