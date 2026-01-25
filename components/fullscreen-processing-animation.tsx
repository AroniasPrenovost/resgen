"use client";

import { useEffect, useState } from "react";
import { FileText, Sparkles, Zap } from "lucide-react";

interface FullscreenProcessingAnimationProps {
  isVisible: boolean;
  isProcessingComplete?: boolean;
  onComplete?: () => void;
}

export function FullscreenProcessingAnimation({ isVisible, isProcessingComplete = false, onComplete }: FullscreenProcessingAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: FileText, text: "Analyzing your resume...", color: "from-purple-500 to-pink-500" },
    { icon: Sparkles, text: "Optimizing content with AI...", color: "from-pink-500 to-orange-500" },
    { icon: Zap, text: "Making it ATS-friendly...", color: "from-orange-500 to-purple-500" },
  ];

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
  }, [isVisible, isProcessingComplete]);

  // Auto-close when complete and reaches 100%
  useEffect(() => {
    if (isProcessingComplete && progress >= 100 && onComplete) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 500); // Short delay before closing

      return () => clearTimeout(timeout);
    }
  }, [isProcessingComplete, progress, onComplete]);

  if (!isVisible) return null;

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Animated icon */}
        <div className="mb-8 relative inline-block">
          <div className={`absolute inset-0 bg-gradient-to-r ${steps[currentStep].color} blur-3xl opacity-60 animate-pulse-gentle`} />
          <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-8 border-4 border-white/30 animate-float-gentle">
            <CurrentIcon className="w-24 h-24 text-white animate-spin-slow" />
          </div>
        </div>

        {/* Status text */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
          Creating Your Perfect Resume
        </h2>

        <p className="text-xl md:text-2xl text-purple-100 mb-12 animate-fade-in-delay">
          {steps[currentStep].text}
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/30">
            <div
              className={`h-full bg-gradient-to-r ${steps[currentStep].color} transition-all duration-500 ease-out relative overflow-hidden`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          <p className="text-white/80 text-sm mt-3 font-medium">
            {Math.min(progress, 100)}%
          </p>
        </div>

        {/* Fun facts */}
        <div className="mt-12 text-purple-200 text-sm animate-fade-in-slow">
          <p className="italic">
            Did you know? ATS systems scan for specific keywords in your resume.
          </p>
          <p className="mt-2">
            We&apos;re optimizing yours right now!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
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

        .animate-float {
          animation: float linear infinite;
        }

        .animate-float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.5s ease-out 0.2s both;
        }

        .animate-fade-in-slow {
          animation: fade-in 0.5s ease-out 0.5s both;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
