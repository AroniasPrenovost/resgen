"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, FileText, Sparkles, Eye, Download } from "lucide-react";
import { cn } from "@/lib/utils";

// Pre-computed confetti positions to avoid hydration mismatch from Math.random()
const CONFETTI_POSITIONS = [
  { left: 5, delay: 0.1, duration: 2.3 },
  { left: 12, delay: 0.8, duration: 3.1 },
  { left: 18, delay: 1.5, duration: 2.7 },
  { left: 25, delay: 0.3, duration: 3.5 },
  { left: 32, delay: 1.2, duration: 2.9 },
  { left: 38, delay: 0.6, duration: 3.3 },
  { left: 45, delay: 1.8, duration: 2.5 },
  { left: 52, delay: 0.4, duration: 3.7 },
  { left: 58, delay: 1.1, duration: 2.8 },
  { left: 65, delay: 0.9, duration: 3.2 },
  { left: 72, delay: 1.6, duration: 2.6 },
  { left: 78, delay: 0.2, duration: 3.4 },
  { left: 85, delay: 1.4, duration: 2.4 },
  { left: 92, delay: 0.7, duration: 3.6 },
  { left: 98, delay: 1.3, duration: 2.2 },
  { left: 8, delay: 0.5, duration: 3.8 },
  { left: 22, delay: 1.7, duration: 2.1 },
  { left: 35, delay: 0.0, duration: 3.0 },
  { left: 48, delay: 1.9, duration: 2.0 },
  { left: 62, delay: 0.85, duration: 3.9 },
  { left: 75, delay: 1.05, duration: 2.15 },
  { left: 88, delay: 0.35, duration: 3.25 },
  { left: 15, delay: 1.45, duration: 2.45 },
  { left: 42, delay: 0.65, duration: 3.15 },
  { left: 55, delay: 1.25, duration: 2.35 },
  { left: 68, delay: 0.15, duration: 3.45 },
  { left: 82, delay: 1.55, duration: 2.55 },
  { left: 95, delay: 0.45, duration: 3.55 },
  { left: 28, delay: 1.35, duration: 2.65 },
  { left: 50, delay: 0.55, duration: 3.65 },
];

interface ResumeActionSectionProps {
  hasPaid: boolean;
  isLoading: boolean;
  formHasErrors: boolean;
  downloadsUsed: number;
  maxDownloads: number;
  daysRemaining: number;
  previewGenerated: boolean;
  showCelebration?: boolean;
  generationProgress?: number;
  actionState?: 'idle' | 'generating' | 'preview-ready';
  onGeneratePreview: () => void;
  onViewPreview?: () => void;
  onDownload: () => void;
}

export function ResumeActionSection({
  hasPaid,
  isLoading,
  formHasErrors,
  downloadsUsed,
  maxDownloads,
  daysRemaining,
  previewGenerated,
  showCelebration = false,
  generationProgress = 0,
  actionState = 'idle',
  onGeneratePreview,
  onViewPreview,
  onDownload,
}: ResumeActionSectionProps) {
  // Track client-side mounting to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate progress percentage for downloads
  const downloadProgress = (downloadsUsed / maxDownloads) * 100;
  const downloadsRemaining = maxDownloads - downloadsUsed;

  // Determine headline based on state
  const getHeadline = () => {
    if (hasPaid) return "🎉 Welcome to ResumAI Pro!";
    if (actionState === 'generating') return "Creating your resume content...";
    if (previewGenerated) return "✨ Your resume is ready to review!";
    return "Ready to generate your professional resume?";
  };

  // Determine subheadline
  const getSubheadline = () => {
    if (hasPaid) return "Payment confirmed • Ready to download";
    if (actionState === 'generating') return "Please wait while we generate your preview";
    if (previewGenerated) return "Review your resume, then download";
    return "Preview for free • Download when perfect";
  };

  return (
    <Card
      className={cn(
        "border-2 border-purple-200 shadow-lg",
        showCelebration && "animate-pulse-success",
        hasPaid && "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50"
      )}
    >
      {/* Confetti Animation - only render on client to avoid hydration mismatch */}
      {isMounted && showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {CONFETTI_POSITIONS.map((confetti, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-confetti"
              style={{
                left: `${confetti.left}%`,
                animationDelay: `${confetti.delay}s`,
                animationDuration: `${confetti.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      <CardHeader>
        <div className="flex items-center gap-3">
          {hasPaid ? (
            <div className="p-3 bg-green-500 rounded-full">
              <Check className="w-8 h-8 text-white" />
            </div>
          ) : (
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <FileText className="w-8 h-8 text-white" />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className={cn("text-2xl", hasPaid && "text-green-900")}>
              {getHeadline()}
            </CardTitle>
            <CardDescription className={cn("text-base mt-1", hasPaid && "text-green-700")}>
              {getSubheadline()}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Value Props */}
        {!hasPaid && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                ✨
              </Badge>
              <div className="text-sm">
                <div className="font-medium">AI-powered content</div>
                <div className="text-gray-600">Professional rewriting</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                🎯
              </Badge>
              <div className="text-sm">
                <div className="font-medium">ATS-optimized</div>
                <div className="text-gray-600">Beat tracking systems</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                🔄
              </Badge>
              <div className="text-sm">
                <div className="font-medium">30 days access</div>
                <div className="text-gray-600">15 downloads included</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {actionState === 'generating' && (
          <div className="space-y-3">
            <Progress value={generationProgress} className="h-3" />
            <div className="text-center text-sm text-gray-600">
              {generationProgress < 30 && "Analyzing your information..."}
              {generationProgress >= 30 && generationProgress < 60 && "Optimizing content..."}
              {generationProgress >= 60 && generationProgress < 90 && "Formatting resume..."}
              {generationProgress >= 90 && "Almost done!"}
            </div>
          </div>
        )}

        {/* Status Card (Post-Payment) */}
        {hasPaid && (
          <div className="bg-white rounded-lg border p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Downloads used:</span>
              <span className="font-medium">
                {downloadsUsed}/{maxDownloads}
              </span>
            </div>
            <Progress value={downloadProgress} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Access expires:</span>
              <span className="font-medium">{daysRemaining} days remaining</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        {actionState !== 'generating' && (
          <div className="flex flex-col sm:flex-row gap-3">
            {!hasPaid && !previewGenerated && (
              <>
                <Button
                  type="button"
                  onClick={onGeneratePreview}
                  disabled={formHasErrors || isLoading}
                  className="flex-1 h-14 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Free Preview
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled
                  className="flex-1 h-14 text-base opacity-50"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download for $9.99
                </Button>
              </>
            )}

            {!hasPaid && previewGenerated && (
              <>
                <Button
                  type="button"
                  onClick={onViewPreview}
                  variant="outline"
                  className="flex-1 h-14 text-base border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View Preview
                </Button>
                <Button
                  type="button"
                  onClick={onDownload}
                  className="flex-1 h-14 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download for $9.99
                </Button>
              </>
            )}

            {hasPaid && (
              <Button
                type="button"
                onClick={onDownload}
                disabled={downloadsUsed >= maxDownloads}
                className="w-full h-16 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Download className="w-6 h-6 mr-2" />
                Download Resume.docx
                {downloadsUsed < maxDownloads && (
                  <span className="ml-2 text-sm opacity-80">
                    ({downloadsRemaining} remaining)
                  </span>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Micro-copy */}
        {!hasPaid && !previewGenerated && (
          <p className="text-center text-xs text-gray-500">
            Free preview + watermarked download • No credit card needed
          </p>
        )}
        {!hasPaid && previewGenerated && (
          <p className="text-center text-xs text-gray-500">
            Secure checkout via Stripe • Get clean .docx file
          </p>
        )}
        {hasPaid && (
          <p className="text-center text-xs text-gray-500">
            One-time payment • {maxDownloads} downloads • {daysRemaining}-day access
          </p>
        )}
      </CardContent>
    </Card>
  );
}
