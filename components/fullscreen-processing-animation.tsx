"use client";

import { useEffect, useState, useMemo } from "react";
import { FileText, Sparkles, Zap } from "lucide-react";

interface FullscreenProcessingAnimationProps {
  isVisible: boolean;
  isProcessingComplete?: boolean;
  onComplete?: () => void;
}

// Pre-computed particle positions to avoid hydration mismatch
const PARTICLE_POSITIONS = [
  { left: 5, top: 10, delay: 0.2, duration: 8 },
  { left: 15, top: 25, delay: 1.5, duration: 12 },
  { left: 25, top: 5, delay: 0.8, duration: 10 },
  { left: 35, top: 45, delay: 2.1, duration: 9 },
  { left: 45, top: 15, delay: 3.2, duration: 11 },
  { left: 55, top: 35, delay: 0.5, duration: 7 },
  { left: 65, top: 55, delay: 1.8, duration: 13 },
  { left: 75, top: 20, delay: 2.5, duration: 8 },
  { left: 85, top: 40, delay: 0.9, duration: 10 },
  { left: 95, top: 60, delay: 3.8, duration: 12 },
  { left: 10, top: 70, delay: 1.2, duration: 9 },
  { left: 20, top: 80, delay: 2.8, duration: 11 },
  { left: 30, top: 65, delay: 0.3, duration: 8 },
  { left: 40, top: 75, delay: 4.1, duration: 10 },
  { left: 50, top: 85, delay: 1.6, duration: 12 },
  { left: 60, top: 70, delay: 2.3, duration: 9 },
  { left: 70, top: 90, delay: 0.7, duration: 11 },
  { left: 80, top: 75, delay: 3.5, duration: 8 },
  { left: 90, top: 85, delay: 1.9, duration: 10 },
  { left: 8, top: 50, delay: 2.6, duration: 12 },
];

export function FullscreenProcessingAnimation({ isVisible, isProcessingComplete = false, onComplete }: FullscreenProcessingAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const steps = useMemo(() => [
    { icon: FileText, text: "Analyzing your resume...", color: "from-purple-500 to-pink-500" },
    { icon: Sparkles, text: "Optimizing content with AI...", color: "from-pink-500 to-orange-500" },
    { icon: Zap, text: "Making it ATS-friendly...", color: "from-orange-500 to-purple-500" },
  ], []);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Stop at 75% until processing is complete
        if (!isProcessingComplete && prev >= 75) return 75;
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 50);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        // Only cycle through steps once (0 -> 1 -> 2, then stay at 2)
        if (prev >= steps.length - 1) return steps.length - 1;
        return prev + 1;
      });
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isVisible, isProcessingComplete, steps.length]);

  // Auto-close when complete and reaches 100%
  useEffect(() => {
    if (isProcessingComplete && progress >= 100 && onComplete) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 500); // Short delay before closing

      return () => clearTimeout(timeout);
    }
  }, [isProcessingComplete, progress, onComplete]);

  // Don't render until mounted on client to avoid hydration issues
  if (!isMounted || !isVisible) return null;

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
      {/* Animated background particles - using pre-computed positions */}
      <div className="absolute inset-0 overflow-hidden">
        {PARTICLE_POSITIONS.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `particle-float ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Animated icon */}
        <div className="mb-8 relative inline-block">
          <div
            className="absolute inset-0 blur-3xl opacity-60"
            style={{
              background: `linear-gradient(to right, ${currentStep === 0 ? '#a855f7, #ec4899' : currentStep === 1 ? '#ec4899, #f97316' : '#f97316, #a855f7'})`,
              animation: 'pulse-gentle 3s ease-in-out infinite',
            }}
          />
          <div
            className="relative bg-white/10 backdrop-blur-sm rounded-full p-8 border-4 border-white/30"
            style={{ animation: 'float-gentle 3s ease-in-out infinite' }}
          >
            <CurrentIcon
              className="w-24 h-24 text-white"
              style={{ animation: 'spin-slow 4s linear infinite' }}
            />
          </div>
        </div>

        {/* Status text */}
        <h2
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          style={{ animation: 'fade-in 0.5s ease-out' }}
        >
          Creating Your Perfect Resume
        </h2>

        <p
          className="text-xl md:text-2xl text-purple-100 mb-12"
          style={{ animation: 'fade-in 0.5s ease-out 0.2s both' }}
        >
          {steps[currentStep].text}
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/30">
            <div
              className="h-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: `linear-gradient(to right, ${currentStep === 0 ? '#a855f7, #ec4899' : currentStep === 1 ? '#ec4899, #f97316' : '#f97316, #a855f7'})`,
              }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ animation: 'shimmer 2s infinite' }}
              />
            </div>
          </div>
          <p className="text-white/80 text-sm mt-3 font-medium">
            {Math.min(progress, 100)}%
          </p>
        </div>

        {/* Fun facts */}
        <div
          className="mt-12 text-purple-200 text-sm"
          style={{ animation: 'fade-in 0.5s ease-out 0.5s both' }}
        >
          <p className="italic">
            ATS systems scan for specific keywords in your resume
          </p>
          <p className="mt-2">
            Optimizing your content right now
          </p>
        </div>
      </div>

      {/* CSS animations defined in a standard style tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes particle-float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }

        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </div>
  );
}
