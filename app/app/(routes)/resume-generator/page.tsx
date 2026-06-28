"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { Tooltip } from '@nextui-org/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { SimplerLoader } from "@/components/simpler-loader";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { Empty } from "@/components/ui/empty";

import { formSchema } from "./constants";

const STRIPE_PAYMENT_LINK: string = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? 'https://stripe.com';

// file upload
import mammoth from "mammoth"; // supports .docx

// saving (downloading) generated resume as .docx
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { DocumentCreator } from "@/lib/resume-generator";
// import { experiences, education, skills, achievements } from "@/lib/cv-data"; // dummy data

// Components for button experience overhaul
import { ResumePreviewModal } from "@/components/resume-preview-modal";
import { incrementLocalGenerationCount } from "@/lib/generation-count";

// Generator redesign — dark editorial UI matching the marketing landing page
import { GeneratorTopbar } from "@/components/generator/generator-topbar";
import { GeneratorHero } from "@/components/generator/generator-hero";
import { TrustChipStrip } from "@/components/generator/trust-chip-strip";
import {
  TrustRail,
  HonestMathCard,
  LiveProofCard,
} from "@/components/generator/trust-rail";
import { CreditsPips } from "@/components/generator/credits-pips";
import { PreviewDoc } from "@/components/generator/preview-doc";
import { CheckoutPanel } from "@/components/generator/checkout-panel";
import { StickyMobileCTA } from "@/components/generator/sticky-mobile-cta";
import {
  IconCheck,
  IconFile,
  IconCloudUp,
  IconSpinner,
  IconChevronDown,
  IconSpark,
  IconLock,
} from "@/components/generator/icons";

const ResumeGeneratorPage = () => {
  // Track client-side mounting to prevent hydration mismatch with useSearchParams
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sticky mobile CTA visibility — shown once the hero scrolls off, hidden
  // again while the hero is in view (and, in render, once the result is open).
  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    if (!isMounted) return;
    const hero = document.getElementById("gen-hero");
    if (!hero || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setShowStickyCta(!entries[0].isIntersecting),
      { threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [isMounted]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //
  //
  // AI response output state
  //
  //

  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

  //
  //
  // button hover states
  //

  const [isJobPostingTooltipOpen, setIsJobPostingTooltipOpen] = useState(false);
  const [fileUploadButtonIsHovered, setFileUploadButtonIsHovered] = useState(false);

  // manage form submit button tooltip display states
  const [isSubmitButtonTooltipOpen, setIsSubmitButtonTooltipOpen] = useState(false);


  // Note: Popup modal removed - welcome content now shown inline on the page


  //
  //
  // file upload ai call
  //
  //



  const convertUploadedFileToFormInputsUsingAi = async(fileContents: string) => {
    console.log('=== [CLIENT] convertUploadedFileToFormInputsUsingAi() START ===');
    console.log('[CLIENT] File contents length:', fileContents?.length || 0);
    console.log('[CLIENT] File contents (first 500 chars):', fileContents?.substring(0, 500));

    // get job post description
    const input = document.querySelector('input[name="job_post_description"]') as HTMLInputElement | null;
    let job_post_description = (input && input.value) ? input.value.trim() : '';
    let job_post_description_insert = job_post_description.length ? `Ensure the new resume output aligns with the given job description: ${job_post_description}` : '';
    console.log('[CLIENT] Job post description:', job_post_description || '(none)');

    const resumeObjectTemplate = {
      "job_post_description": job_post_description,
      "full_name": "",
      "email_address": "",
      "phone_number": "",
      "personal_website": "",
      "linkedin_profile": "",
      "interests": "",
      "skills": "",
      "job_1_employer": "",
      "job_1_title": "",
      "job_1_start_month": "",
      "job_1_start_year": "",
      "job_1_end_month": "",
      "job_1_end_year": "",
      "job_1_summary": "",
      "job_2_employer": "",
      "job_2_title": "",
      "job_2_start_month": "",
      "job_2_start_year": "",
      "job_2_end_month": "",
      "job_2_end_year": "",
      "job_2_summary": "",
      "job_3_employer": "",
      "job_3_title": "",
      "job_3_start_month": "",
      "job_3_start_year": "",
      "job_3_end_month": "",
      "job_3_end_year": "",
      "job_3_summary": "",
      "job_4_employer": "",
      "job_4_title": "",
      "job_4_start_month": "",
      "job_4_start_year": "",
      "job_4_end_month": "",
      "job_4_end_year": "",
      "job_4_summary": "",
      "job_5_employer": "",
      "job_5_title": "",
      "job_5_start_month": "",
      "job_5_start_year": "",
      "job_5_end_month": "",
      "job_5_end_year": "",
      "job_5_summary": "",
      "job_6_employer": "",
      "job_6_title": "",
      "job_6_start_month": "",
      "job_6_start_year": "",
      "job_6_end_month": "",
      "job_6_end_year": "",
      "job_6_summary": "",
      "college_name_1": "",
      "college_degree_1": "",
      "college_field_of_study_1": "",
      "college_notes_1": "",
      "college_start_year_1": "",
      "college_end_year_1": "",
      "college_name_2": "",
      "college_degree_2": "",
      "college_field_of_study_2": "",
      "college_notes_2": "",
      "college_start_year_2": "",
      "college_end_year_2": "",
      "college_name_3": "",
      "college_degree_3": "",
      "college_field_of_study_3": "",
      "college_notes_3": "",
      "college_start_year_3": "",
      "college_end_year_3": "",
      "achievement_1_issuer": "",
      "achievement_1_name": "",
      "achievement_2_issuer": "",
      "achievement_2_name": "",
      "achievement_3_issuer": "",
      "achievement_3_name": "",
      "reference_1_info": "",
      "reference_2_info": "",
      "reference_3_info": "",
      "reference_4_info": ""
    };

    const promptString = "Persona: you are a expert resume writer with with years of experience improving resumes.\n" +
    "Improve the verbiage, tone, and professionalism of the inputted content (" + fileContents + ") and map it to our desired 'resume_object' structure.\n\n" +
    job_post_description_insert + "\n\n" +
    "Rules:\n" +
    "1. The output should maintain the exact same object structure of the original 'resume_object', meaning only the key properties' values should be modified.\n" +
    "2. When necessary fix any typos, sentence structure issues, grammar problems, capitalize proper nouns, and expand acronyms.\n" +
    "3. Add realistic detail to flesh out content the user did provide, but do NOT fabricate entire entries the user left blank (such as additional jobs, schools, achievements, or references). Leave unprovided repeated entries blank.\n" +
    "4. For 'resume_object.experiences' data, write each experience summary as a substantial paragraph of 3-4 full sentences. Describe the responsibilities, the actions taken, and the outcome or impact (quantify with realistic metrics where it fits). Be thorough and descriptive while staying professional and clear, but never pad with filler or repeat the same point.\n" +
    "5. For 'resume_object.education' section, ensure school names are proper nouns and clear, and use the notes field to add 1-2 sentences of relevant detail (coursework, focus areas, honors, or activities) when appropriate.\n" +
    "6. For 'resume_object.achievements' section, elaborate with a sentence or two explaining the context and significance of each achievement.\n" +
    "7. For 'resume_object.references' section, do NOT invent or fabricate references. If the user provided references, you may elaborate with a sentence explaining the context of the relationship. If no references were provided, leave the references array empty.\n" +
    "8. Incorporate strong action verbs such as 'managed', 'solved', 'planned', 'executed', 'demonstrated', 'succeeded', 'collaborated', 'implemented', 'strategized', 'led', etc.\n" +
    "9. Aim for a fuller, more detailed resume overall. Favor complete, descriptive sentences over terse fragments, while keeping every sentence professional, specific, and free of fluff.\n" +
    "10. The outputted result must be valid JSON matching the exact structure of 'resume_object'. Output only the JSON object, no additional text.\n" +
    "11. Do not modify the 'job_post_description' field and it's value in any way.\n" +
    "resume_object:\n" +
    JSON.stringify(resumeObjectTemplate, null, 2);

    // console.log('res import step: ', promptString);

    // make API call
    try {
      console.log('[CLIENT] Building API request...');
      const userMessage: ChatCompletionMessageParam = { role: "user", content: promptString };
      const newMessages = [...messages, userMessage];
      console.log('[CLIENT] Messages array length:', newMessages.length);
      console.log('[CLIENT] Prompt length:', promptString.length);

      console.log('[CLIENT] Calling /api/resume-generator...');
      const startTime = Date.now();
      const response = await axios.post('/api/resume-generator', { messages: newMessages });
      const duration = Date.now() - startTime;

      console.log('[CLIENT] API response received in', duration, 'ms');
      console.log('[CLIENT] Response status:', response.status);
      console.log('[CLIENT] Response data:', response.data);
      console.log('[CLIENT] Response data type:', typeof response.data);
      console.log('[CLIENT] Response data.content exists:', !!response.data?.content);
      console.log('[CLIENT] Response data.content type:', typeof response.data?.content);
      console.log('[CLIENT] Response data.content length:', response.data?.content?.length || 0);

      // Extract content and handle potential markdown code blocks
      let content = response.data.content;
      if (!content) {
        console.error('[CLIENT] ERROR: No content in response!');
        console.error('[CLIENT] Full response.data:', JSON.stringify(response.data, null, 2));
        throw new Error('No content in API response');
      }

      console.log('[CLIENT] Raw content (first 500 chars):', content.substring(0, 500));

      // Strip markdown code blocks if present (```json ... ``` or ``` ... ```)
      content = content.trim();
      if (content.startsWith('```')) {
        console.log('[CLIENT] Stripping markdown code blocks...');
        content = content.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }

      console.log('[CLIENT] Cleaned content (first 500 chars):', content.substring(0, 500));
      console.log('[CLIENT] Attempting JSON.parse...');

      const outputObject = JSON.parse(content);

      console.log('[CLIENT] JSON.parse SUCCESS!');
      console.log('[CLIENT] Parsed object keys:', Object.keys(outputObject));
      console.log('[CLIENT] Sample values - full_name:', outputObject.full_name);
      console.log('[CLIENT] Sample values - email_address:', outputObject.email_address);

      toast.dismiss();

      console.log('=== [CLIENT] convertUploadedFileToFormInputsUsingAi() SUCCESS ===');
      return response;
    } catch (error: any) {
      console.error('=== [CLIENT] ERROR in convertUploadedFileToFormInputsUsingAi ===');
      console.error('[CLIENT] Error name:', error?.name);
      console.error('[CLIENT] Error message:', error?.message);
      console.error('[CLIENT] Error stack:', error?.stack);
      console.error('[CLIENT] Axios response status:', error?.response?.status);
      console.error('[CLIENT] Axios response data:', error?.response?.data);
      console.error('[CLIENT] Full error object:', error);

      if (error?.response?.status === 403) {
        toast.error("Access denied. Please check your subscription.");
      } else if (error?.response?.status === 500) {
        toast.error("Server error. The AI service may be temporarily unavailable.");
      } else {
        toast.error("Something went wrong analyzing your resume. Please try again.");
      }
    } finally {
      console.log('[CLIENT] Finally block - refreshing router');
      router.refresh();
    }
  };

  //
  // file upload file input-related

  const ACCEPTED_FILE_TYPES = ".docx,.txt"; // .pdf not currently supported
  const [uploadedFileContents, setUploadedFileContents] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // In-place parse error surfaced under the dropzone (no apologetic copy).
  const [uploadError, setUploadError] = useState<string | null>(null);
  const FILE_ERROR_MSG = "Couldn't read that file. Try a .docx or .txt.";

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fileHasBeenUploadedAndParsed) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (fileHasBeenUploadedAndParsed) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      await processDroppedFile(file);
    }
  };

  const processDroppedFile = async (file: File) => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // Check file extension as backup for mime type
    const isDocx = fileName.endsWith('.docx') || fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || fileType === "application/msword";
    const isTxt = fileName.endsWith('.txt') || fileType === "text/plain";

    if (!isDocx && !isTxt) {
      setUploadError(FILE_ERROR_MSG);
      return;
    }

    setUploadedFileName(file.name);
    setUploadError(null);

    try {
      if (isDocx) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setUploadedFileContents(result.value);
        toast.success('Resume uploaded and analyzed successfully!');
      } else if (isTxt) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result;
          setUploadedFileContents(text as string);
          toast.success('Resume uploaded and analyzed successfully!');
        };
        reader.onerror = () => setUploadError(FILE_ERROR_MSG);
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadError(FILE_ERROR_MSG);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      const lowerName = file.name.toLowerCase();
      const isDocx = lowerName.endsWith('.docx') ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileType === "application/msword";
      const isTxt = lowerName.endsWith('.txt') || fileType === "text/plain";
      setUploadedFileName(file.name);
      setUploadError(null);

      try {
        if (isDocx) {
          //
          // .docx
          //
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          setUploadedFileContents(result.value);
          console.log('successfully processed .docx file')

        } else if (isTxt) {
          //
          // .txt
          //
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result;
            setUploadedFileContents(text as string);
          };
          reader.onerror = () => setUploadError(FILE_ERROR_MSG);
          reader.readAsText(file);

        } else {
          setUploadError(FILE_ERROR_MSG);
        }
      } catch (error) {
        console.error("Error processing file:", error);
        setUploadError(FILE_ERROR_MSG);
      }
    }
  };

  //
  //
  //
  //
  //


  //
  //
  // ui stuff
  //
  //

  const [subheadline, setSubheadline] = useState('Generate and edit your resume content for free. Pay $9.99 only when you\'re ready to download.');
  const [buyButtonContent, setBuyButtonContent] = useState('Generate Resume');

  // New state for button experience overhaul
  const [actionState, setActionState] = useState<'idle' | 'generating' | 'preview-ready'>('idle');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewResumeData, setPreviewResumeData] = useState<any>(null);
  const [showFormFields, setShowFormFields] = useState(false);
  // Marks that the current form content is already AI-improved (from an upload) so the
  // download can reuse it instead of making a second AI call. Keeps preview === download.
  const aiImprovedFormKeyRef = useRef<string | null>(null);

  // file upload state
  type UploadedResumeDataType = { [key: string]: string; };
  const [uploadedResumeDataConvertedToForm, setUploadedResumeDataConvertedToForm] = useState<UploadedResumeDataType>({});
  const [isGettingAiResponseForFileUploadProcess, setIsGettingAiResponseForFileUploadProcess] = useState(false);
  const [fileHasBeenUploadedAndParsed, setFileHasBeenUploadedAndParsed] = useState(false);
  const [isOpeningPreview, setIsOpeningPreview] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  //
  //
  // MANAGING PAYMENT HISTORY/CACHE
  //
  //

  // tracking if user has paid or not
  const paidQueryStringValue = 'xj3z01__022';
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    const paidQueryString = searchParams.get('p') ?? '';
    if (paidQueryString === paidQueryStringValue) {
      setHasPaid(true);
      setShowCelebration(true);
      localStorage.setItem('pr_0012', 'true');
      localStorage.setItem('payment_date', new Date().toISOString()); // FIX: Store payment date
      localStorage.setItem('x8u_000_vb_nod', '0'); // FIX: Reset download counter

      // Auto-hide celebration after 5 seconds
      setTimeout(() => setShowCelebration(false), 5000);

      // Clear the query parameter from the URL
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.delete('p');
      router.replace(`${pathname}?${nextSearchParams}`);
    }
  }, [searchParams, router, pathname]);

  useEffect(() => {
    const x = localStorage.getItem('pr_0012') === 'true';
    if (x) {
      setHasPaid(true);
    }
  }, []);

  // resume generator download management
  const [numberOfDownloads, setNumberOfDownloads] = useState(0);
  const max_download_count = 15;

  // Free AI-generation credits. A "generation" = regenerating content or
  // re-tailoring to a job description. Parsing an uploaded resume is FREE and does
  // NOT spend a credit (it's the hook). Once these run out, generation locks behind
  // the paywall but previewing the last version stays free.
  const MAX_FREE_GENERATIONS = 6;
  const FREE_GEN_KEY = 'free_ai_generations_used';
  const [freeGenerationsUsed, setFreeGenerationsUsed] = useState(0);
  const freeGenerationsLeft = Math.max(0, MAX_FREE_GENERATIONS - freeGenerationsUsed);
  const isOutOfCredits = !hasPaid && freeGenerationsLeft <= 0;

  // Spend one free generation credit. Returns false (without spending) when the user
  // is already out — callers should route to the paywall in that case.
  const spendCredit = (): boolean => {
    if (hasPaid) return true; // paid users have unlimited generations
    if (freeGenerationsLeft <= 0) return false;
    const next = freeGenerationsUsed + 1;
    setFreeGenerationsUsed(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(FREE_GEN_KEY, String(next));
    }
    return true;
  };

  // payment time tracking
  const [differenceInMinutes, setDifferenceInMinutes] = useState(0);

  // Main useEffect to handle all localStorage operations after mount
  useEffect(() => {
    if (typeof window === 'undefined' || isFormInitialized) return;

    // Load form values from localStorage
    const sfv = localStorage.getItem('stored_form_values') ?? '';
    if (sfv && sfv.length) {
      try {
        const storedFormValues = JSON.parse(sfv);
        // Reset form with stored values
        form.reset(storedFormValues);
      } catch (error) {
        console.error('Error parsing stored form values:', error);
      }
    }

    // Load download count
    const downloads = Number(localStorage.getItem('x8u_000_vb_nod') || '0');
    setNumberOfDownloads(downloads);

    // Load free AI-generation credits used
    const genUsed = Number(localStorage.getItem(FREE_GEN_KEY) || '0');
    setFreeGenerationsUsed(genUsed);

    // Load file upload status
    const hasUploadedFile = localStorage.getItem('file_has_been_uploaded_and_parsed') === 'true';
    setFileHasBeenUploadedAndParsed(hasUploadedFile);

    // Calculate time difference for payment
    const paymentDate = localStorage.getItem('payment_date');
    if (paymentDate) {
      const currentTime = new Date();
      const paymentTime = new Date(paymentDate);
      const diffMs = currentTime.getTime() - paymentTime.getTime();
      const diffMins = diffMs / (1000 * 60);
      setDifferenceInMinutes(diffMins);

      // Check if cache should be cleared
      const isPaid = localStorage.getItem('pr_0012') === 'true';
      const clearCache1 = isPaid && (diffMins > 43200); // 30 days
      const clearCache2 = downloads > (max_download_count - 1);

      if (clearCache1 || clearCache2) {
        localStorage.removeItem('pr_0012');
        localStorage.setItem('payment_date', '');
        localStorage.setItem('x8u_000_vb_nod', '0');
        setNumberOfDownloads(0);
        setHasPaid(false);
      }
    }

    // Update UI based on payment status
    if (localStorage.getItem('pr_0012') === 'true') {
      const downloads = Number(localStorage.getItem('x8u_000_vb_nod') || '0');
      setBuyButtonContent(`Download Now (${downloads}/${max_download_count})`);

      const paymentDate = localStorage.getItem('payment_date');
      if (paymentDate) {
        const currentTime = new Date();
        const paymentTime = new Date(paymentDate);
        const diffMs = currentTime.getTime() - paymentTime.getTime();
        const diffMins = diffMs / (1000 * 60);
        const daysRemaining = ((43200 - diffMins) / 1440).toFixed(0);
        setSubheadline(`Thank you for your purchase. You have ${daysRemaining} days of access remaining.`);
      }
    }

    setIsFormInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle file upload and AI processing
  useEffect(() => {
    console.log('[WRAPPER] useEffect triggered, uploadedFileContents length:', uploadedFileContents?.length || 0);

    if (typeof window === 'undefined' || !uploadedFileContents) {
      console.log('[WRAPPER] Early return - window undefined or no file contents');
      return;
    }

    const fileHasBeenUploadedAndParsed = localStorage.getItem('file_has_been_uploaded_and_parsed') === 'true';
    const hasFileBeenSelectedByUser = uploadedFileContents.length > 0;

    console.log('[WRAPPER] State check:', {
      isGettingAiResponseForFileUploadProcess,
      hasFileBeenSelectedByUser,
      fileHasBeenUploadedAndParsed
    });

    const convertUploadedFileToFormInputsUsingAiProcess = async () => {
      console.log('=== [WRAPPER] convertUploadedFileToFormInputsUsingAiProcess START ===');
      try {
        console.log('[WRAPPER] Calling convertUploadedFileToFormInputsUsingAi...');
        const prefilledUserResData = await convertUploadedFileToFormInputsUsingAi(uploadedFileContents);

        console.log('[WRAPPER] Got response from AI function:', !!prefilledUserResData);
        console.log('[WRAPPER] prefilledUserResData:', prefilledUserResData);
        console.log('[WRAPPER] prefilledUserResData?.data:', prefilledUserResData?.data);
        console.log('[WRAPPER] prefilledUserResData?.data?.content exists:', !!prefilledUserResData?.data?.content);

        if (prefilledUserResData && prefilledUserResData.data && prefilledUserResData.data.content) {
          console.log('[WRAPPER] Valid response received, processing...');

          // Extract and clean the content
          let content = prefilledUserResData.data.content;
          console.log('[WRAPPER] Content type:', typeof content);
          console.log('[WRAPPER] Content length:', content?.length);
          console.log('[WRAPPER] Content (first 500 chars):', content?.substring(0, 500));

          content = content.trim();
          // Strip markdown code blocks if present
          if (content.startsWith('```')) {
            console.log('[WRAPPER] Stripping markdown code blocks...');
            content = content.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
          }

          console.log('[WRAPPER] Attempting JSON.parse...');
          const responseObject = JSON.parse(content);
          console.log('[WRAPPER] JSON.parse SUCCESS! Keys:', Object.keys(responseObject));

          // prepopulate form fields with response
          console.log('[WRAPPER] Saving to localStorage and populating form...');
          localStorage.setItem('stored_form_values', JSON.stringify(responseObject));
          setUploadedResumeDataConvertedToForm(responseObject);
          form.reset(responseObject);
          // The uploaded content was already AI-improved by the conversion step above.
          // Capture it as the preview source (avoids the typewriter race) and mark the
          // form content as AI-improved so the download reuses it rather than re-calling AI.
          const aiImprovedMapped = mapFormValuesToResumeObject(responseObject);
          aiImprovedFormKeyRef.current = JSON.stringify(aiImprovedMapped);
          // The upload parse already AI-rewrote the resume. Surface that rewrite as
          // the ready-to-view preview right away — free, no extra generation/credit.
          // This lights up the prominent Preview CTA + sticky preview/download bar so
          // it's immediately obvious what to do next. The modal does NOT auto-open;
          // the user clicks Preview.
          setPreviewResumeData(aiImprovedMapped);
          setActionState('preview-ready');
          // set flag to track that we've processed the resume
          localStorage.setItem('file_has_been_uploaded_and_parsed', 'true');
          // Mark the upload as parsed so the UI reveals the preview action.
          setFileHasBeenUploadedAndParsed(true);
          console.log('=== [WRAPPER] SUCCESS - Form populated with rewritten resume ===');
        } else {
          console.error('[WRAPPER] ERROR: No valid response from AI');
          console.error('[WRAPPER] prefilledUserResData was:', prefilledUserResData);
          toast.error("Failed to analyze resume. Please try again.");
        }
      } catch (error: any) {
        console.error('=== [WRAPPER] ERROR in convertUploadedFileToFormInputsUsingAiProcess ===');
        console.error('[WRAPPER] Error name:', error?.name);
        console.error('[WRAPPER] Error message:', error?.message);
        console.error('[WRAPPER] Error stack:', error?.stack);
        toast.error("Something went wrong analyzing your resume. Please try again.");
      } finally {
        console.log('[WRAPPER] Finally block - setting isGettingAiResponseForFileUploadProcess to false');
        setIsGettingAiResponseForFileUploadProcess(false);
      }
    };

    if (!isGettingAiResponseForFileUploadProcess && hasFileBeenSelectedByUser && !fileHasBeenUploadedAndParsed) {
      console.log('[WRAPPER] Conditions met! Starting AI processing...');
      setIsGettingAiResponseForFileUploadProcess(true);
      convertUploadedFileToFormInputsUsingAiProcess();
    } else {
      console.log('[WRAPPER] Conditions NOT met, skipping AI processing');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFileContents]);

  // Initialize form with empty defaults to avoid hydration issues
  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema), // disable form validation
    // since I want people to go to Stripe prior to filling out the form, if they wish
    defaultValues: {
      job_post_description: '',
      full_name: '',
      email_address: '',
      phone_number: '',
      personal_website: '',
      linkedin_profile: '',
      //
      interests: '',
      //
      skills: '',
      //
      // job #1
      //
      job_1_employer: '',
      job_1_title: '',
      job_1_start_month: '',
      job_1_start_year: '',
      job_1_end_month: '',
      job_1_end_year: '',
      job_1_summary: '',
      // job #2
      job_2_employer: '',
      job_2_title: '',
      job_2_start_month: '',
      job_2_start_year: '',
      job_2_end_month: '',
      job_2_end_year: '',
      job_2_summary: '',
      // job #3
      job_3_employer: '',
      job_3_title: '',
      job_3_start_month: '',
      job_3_start_year: '',
      job_3_end_month: '',
      job_3_end_year: '',
      job_3_summary: '',
      // job #4
      job_4_employer: '',
      job_4_title: '',
      job_4_start_month: '',
      job_4_start_year: '',
      job_4_end_month: '',
      job_4_end_year: '',
      job_4_summary: '',
      // job #5
      job_5_employer: '',
      job_5_title: '',
      job_5_start_month: '',
      job_5_start_year: '',
      job_5_end_month: '',
      job_5_end_year: '',
      job_5_summary: '',
      // job #6
      job_6_employer: '',
      job_6_title: '',
      job_6_start_month: '',
      job_6_start_year: '',
      job_6_end_month: '',
      job_6_end_year: '',
      job_6_summary: '',
      //
      // education
      //
      college_name_1: '',
      college_degree_1: '',
      college_field_of_study_1: '',
      college_notes_1: '',
      college_start_year_1: '',
      college_end_year_1: '',

      college_name_2: '',
      college_degree_2: '',
      college_field_of_study_2: '',
      college_notes_2: '',
      college_start_year_2: '',
      college_end_year_2: '',

      college_name_3: '',
      college_degree_3: '',
      college_field_of_study_3: '',
      college_notes_3: '',
      college_start_year_3: '',
      college_end_year_3: '',
      //
      // civic service/extra
      //
      achievement_1_issuer: '',
      achievement_1_name: '',
      achievement_2_issuer: '',
      achievement_2_name: '',
      achievement_3_issuer: '',
      achievement_3_name: '',
      //
      // references
      //
      reference_1_info: '',
      reference_2_info: '',
      reference_3_info: '',
      reference_4_info: '',
    }
  });

  const isLoading = form.formState.isSubmitting;



  //
  // FUNCTION: text 'typing' animation
  const typeText = (text: string, callback: (typedText: string) => void) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        callback(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 45); // Adjust typing speed here
  };

  // !! update form values once file is uploaded !!
  useEffect(() => {
    // form.reset(uploadedResumeDataConvertedToForm);

    // trigger iterate through form fields animation
    const fields = Object.keys(uploadedResumeDataConvertedToForm);
    fields.forEach((field, index) => {
      if (uploadedResumeDataConvertedToForm[field]) {
        setTimeout(function() {
          typeText(uploadedResumeDataConvertedToForm[field], (typedText) => {
            form.setValue(field as keyof z.infer<typeof formSchema>, typedText);
          });
        }, 750 * (index + 1));
      }
    });

    if (uploadedResumeDataConvertedToForm.job_1_employer) {
      if (
        uploadedResumeDataConvertedToForm.job_1_employer.length ||
        uploadedResumeDataConvertedToForm.job_1_title.length ||
        uploadedResumeDataConvertedToForm.job_1_start_month.length ||
        uploadedResumeDataConvertedToForm.job_1_start_year.length ||
        uploadedResumeDataConvertedToForm.job_1_end_month.length  ||
        uploadedResumeDataConvertedToForm.job_1_end_year.length ||
        uploadedResumeDataConvertedToForm.job_1_summary.length
      ) {
        setJob1Visibility(true);
      }
    }

    if (uploadedResumeDataConvertedToForm.job_2_employer) {
      if (
        uploadedResumeDataConvertedToForm.job_2_employer.length ||
        uploadedResumeDataConvertedToForm.job_2_title.length ||
        uploadedResumeDataConvertedToForm.job_2_start_month.length ||
        uploadedResumeDataConvertedToForm.job_2_start_year.length ||
        uploadedResumeDataConvertedToForm.job_2_end_month.length  ||
        uploadedResumeDataConvertedToForm.job_2_end_year.length ||
        uploadedResumeDataConvertedToForm.job_2_summary.length
      ) {
        setJob2Visibility(true);
      }
    }

    if (uploadedResumeDataConvertedToForm.job_3_employer) {
      if (
        uploadedResumeDataConvertedToForm.job_3_employer.length ||
        uploadedResumeDataConvertedToForm.job_3_title.length ||
        uploadedResumeDataConvertedToForm.job_3_start_month.length ||
        uploadedResumeDataConvertedToForm.job_3_start_year.length ||
        uploadedResumeDataConvertedToForm.job_3_end_month.length  ||
        uploadedResumeDataConvertedToForm.job_3_end_year.length ||
        uploadedResumeDataConvertedToForm.job_3_summary.length
      ) {
        setJob3Visibility(true);
      }
    }

    if (uploadedResumeDataConvertedToForm.job_4_employer) {
      if (
        uploadedResumeDataConvertedToForm.job_4_employer.length ||
        uploadedResumeDataConvertedToForm.job_4_title.length ||
        uploadedResumeDataConvertedToForm.job_4_start_month.length ||
        uploadedResumeDataConvertedToForm.job_4_start_year.length ||
        uploadedResumeDataConvertedToForm.job_4_end_month.length  ||
        uploadedResumeDataConvertedToForm.job_4_end_year.length ||
        uploadedResumeDataConvertedToForm.job_4_summary.length
      ) {
        setJob4Visibility(true);
      }
    }

    if (uploadedResumeDataConvertedToForm.job_5_employer) {
      if (
        uploadedResumeDataConvertedToForm.job_5_employer.length ||
        uploadedResumeDataConvertedToForm.job_5_title.length ||
        uploadedResumeDataConvertedToForm.job_5_start_month.length ||
        uploadedResumeDataConvertedToForm.job_5_start_year.length ||
        uploadedResumeDataConvertedToForm.job_5_end_month.length  ||
        uploadedResumeDataConvertedToForm.job_5_end_year.length ||
        uploadedResumeDataConvertedToForm.job_5_summary.length
      ) {
        setJob5Visibility(true);
      }
    }

    if (uploadedResumeDataConvertedToForm.job_6_employer) {
      if (
        uploadedResumeDataConvertedToForm.job_6_employer.length ||
        uploadedResumeDataConvertedToForm.job_6_title.length ||
        uploadedResumeDataConvertedToForm.job_6_start_month.length ||
        uploadedResumeDataConvertedToForm.job_6_start_year.length ||
        uploadedResumeDataConvertedToForm.job_6_end_month.length  ||
        uploadedResumeDataConvertedToForm.job_6_end_year.length ||
        uploadedResumeDataConvertedToForm.job_6_summary.length
      ) {
        setJob6Visibility(true);
      }
    }

    // education
    if (
      uploadedResumeDataConvertedToForm.college_name_1 ||
      uploadedResumeDataConvertedToForm.college_degree_1 ||
      uploadedResumeDataConvertedToForm.college_field_of_study_1 ||
      uploadedResumeDataConvertedToForm.college_notes_1 ||
      uploadedResumeDataConvertedToForm.college_start_year_1 ||
      uploadedResumeDataConvertedToForm.college_end_year_1
    ) {
      setEducation1Visibility(true);
    }

    if (
      uploadedResumeDataConvertedToForm.college_name_2 ||
      uploadedResumeDataConvertedToForm.college_degree_2 ||
      uploadedResumeDataConvertedToForm.college_field_of_study_2 ||
      uploadedResumeDataConvertedToForm.college_notes_2 ||
      uploadedResumeDataConvertedToForm.college_start_year_2 ||
      uploadedResumeDataConvertedToForm.college_end_year_2
    ) {
      setEducation2Visibility(true);
    }

    if (
      uploadedResumeDataConvertedToForm.college_name_3 ||
      uploadedResumeDataConvertedToForm.college_degree_3 ||
      uploadedResumeDataConvertedToForm.college_field_of_study_3 ||
      uploadedResumeDataConvertedToForm.college_notes_3 ||
      uploadedResumeDataConvertedToForm.college_start_year_3 ||
      uploadedResumeDataConvertedToForm.college_end_year_3
    ) {
      setEducation3Visibility(true);
    }

    // civic
    if (
      uploadedResumeDataConvertedToForm.achievement_1_issuer ||
      uploadedResumeDataConvertedToForm.achievement_1_name
    ) {
      setCivic1Visibility(true);
    }

    if (
      uploadedResumeDataConvertedToForm.achievement_2_issuer ||
      uploadedResumeDataConvertedToForm.achievement_2_name
    ) {
      setCivic2Visibility(true);
    }

    if (
      uploadedResumeDataConvertedToForm.achievement_3_name ||
      uploadedResumeDataConvertedToForm.achievement_3_issuer
    ) {
      setCivic3Visibility(true);
    }

    // references
    if (
      uploadedResumeDataConvertedToForm.reference_1_info ||
      uploadedResumeDataConvertedToForm.reference_2_info ||
      uploadedResumeDataConvertedToForm.reference_3_info ||
      uploadedResumeDataConvertedToForm.reference_4_info
    ) {
      setReferences1Visibility(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedResumeDataConvertedToForm]);


  //
  //
  // formatting form data to word doc data structure
  //
  //

  function mapFormValuesToResumeObject(formValues: any) {
    let RESUME_OBJECT: any = {
      personal_info: {
        job_post_description: '',
        name: '',
        phone_number: '',
        email_address: '',
        linkedin: '',
        personal_website: '',
        interests: '',
      },
      experiences: [],
      education: [],
      skills: [], // [{ name: 'Angular' }, { name: 'PHP'}]
      achievements: [],
      references: [],
    };

    //
    //
    // PERSONAL INFO
    //
    //

    if (formValues.job_post_description) {
      RESUME_OBJECT.personal_info.job_post_description = formValues.job_post_description;
    }

    if (formValues.full_name) {
      RESUME_OBJECT.personal_info.name = formValues.full_name;
    }

    if (formValues.email_address) {
      RESUME_OBJECT.personal_info.email_address = formValues.email_address;
    }

    if (formValues.phone_number) {
      RESUME_OBJECT.personal_info.phone_number = formValues.phone_number;
    }

    if (formValues.personal_website) {
      RESUME_OBJECT.personal_info.personal_website = formValues.personal_website;
    }

    if (formValues.linkedin_profile) {
      RESUME_OBJECT.personal_info.linkedin = formValues.linkedin_profile;
    }

    if (formValues.interests) {
      RESUME_OBJECT.personal_info.interests = formValues.interests;
    }

    if (formValues.skills) {
      let skills = formValues.skills.replaceAll(',', ' ').split(' ');
      for (const element of skills) {
        let vv = { name: element };
        if (vv.name.length > 0) {
          RESUME_OBJECT.skills.push(vv);
        }
      }
    }

    //
    //
    // JOBS - experience_obj
    //
    //

    if (formValues.job_1_employer || formValues.job_1_title) {
      let new_experence_obj_1: any = {
        isCurrent: true,
        company: {
          name: formValues.job_1_employer,
        },
        title: formValues.job_1_title,
        summary: formValues.job_1_summary,
        startDate: {
          month: formValues.job_1_start_month,
          year: formValues.job_1_start_year,
        },
        endDate: {
          month: formValues.job_1_end_month,
          year: formValues.job_1_end_year,
        }
      }
      RESUME_OBJECT.experiences.push(new_experence_obj_1);
    }

    if (formValues.job_2_employer || formValues.job_2_title) {
      let new_experence_obj_2: any = {
        isCurrent: false,
        company: {
          name: formValues.job_2_employer,
        },
        title: formValues.job_2_title,
        summary: formValues.job_2_summary,
        startDate: {
          month: formValues.job_2_start_month,
          year: formValues.job_2_start_year,
        },
        endDate: {
          month: formValues.job_2_end_month,
          year: formValues.job_2_end_year,
        }
      }
      RESUME_OBJECT.experiences.push(new_experence_obj_2);
    }

    if (formValues.job_3_employer || formValues.job_3_title) {
      let new_experence_obj_3: any = {
        isCurrent: false,
        company: {
          name: formValues.job_3_employer,
        },
        title: formValues.job_3_title,
        summary: formValues.job_3_summary,
        startDate: {
          month: formValues.job_3_start_month,
          year: formValues.job_3_start_year,
        },
        endDate: {
          month: formValues.job_3_end_month,
          year: formValues.job_3_end_year,
        }
      }
      RESUME_OBJECT.experiences.push(new_experence_obj_3);
    }

    if (formValues.job_4_employer || formValues.job_4_title) {
      let new_experence_obj_4: any = {
        isCurrent: false,
        company: {
          name: formValues.job_4_employer,
        },
        title: formValues.job_4_title,
        summary: formValues.job_4_summary,
        startDate: {
          month: formValues.job_4_start_month,
          year: formValues.job_4_start_year,
        },
        endDate: {
          month: formValues.job_4_end_month,
          year: formValues.job_4_end_year,
        }
      }
      RESUME_OBJECT.experiences.push(new_experence_obj_4);
    }

    if (formValues.job_5_employer || formValues.job_5_title) {
      let new_experence_obj_5: any = {
        isCurrent: false,
        company: {
          name: formValues.job_5_employer,
        },
        title: formValues.job_5_title,
        summary: formValues.job_5_summary,
        startDate: {
          month: formValues.job_5_start_month,
          year: formValues.job_5_start_year,
        },
        endDate: {
          month: formValues.job_5_end_month,
          year: formValues.job_5_end_year,
        }
      }
      RESUME_OBJECT.experiences.push(new_experence_obj_5);
    }

    if (formValues.job_6_employer || formValues.job_6_title) {
      let new_experence_obj_6: any = {
        isCurrent: false,
        company: {
          name: formValues.job_6_employer,
        },
        title: formValues.job_6_title,
        summary: formValues.job_6_summary,
        startDate: {
          month: formValues.job_6_start_month,
          year: formValues.job_6_start_year,
        },
        endDate: {
          month: formValues.job_6_end_month,
          year: formValues.job_6_end_year,
        }
      }
      RESUME_OBJECT.experiences.push(new_experence_obj_6);
    }

    //
    //
    // education - education_obj
    //
    //

    /*

      let education_obj: any = {
        schoolName: '',
        degree: '',
        fieldOfStudy: '',
        notes: '',
        startDate: {
          year: 2012
        },
        endDate: {
          year: 2013
        }
      }

    */

    if (formValues.college_name_1 || formValues.college_degree_1) {
      let new_education_obj_1: any = {
        schoolName: formValues.college_name_1,
        degree: formValues.college_degree_1,
        fieldOfStudy: formValues.college_field_of_study_1,
        notes: formValues.college_notes_1,
        startDate: {
          year: formValues.college_start_year_1
        },
        endDate: {
          year: formValues.college_end_year_1
        }
      }
      RESUME_OBJECT.education.push(new_education_obj_1);
    }

    if (formValues.college_name_2 || formValues.college_degree_2) {
      let new_education_obj_2: any = {
        schoolName: formValues.college_name_2,
        degree: formValues.college_degree_2,
        fieldOfStudy: formValues.college_field_of_study_2,
        notes: formValues.college_notes_2,
        startDate: {
          year: formValues.college_start_year_2
        },
        endDate: {
          year: formValues.college_end_year_2
        }
      }
      RESUME_OBJECT.education.push(new_education_obj_2);
    }

    if (formValues.college_name_3 || formValues.college_degree_3) {
      let new_education_obj_3: any = {
        schoolName: formValues.college_name_3,
        degree: formValues.college_degree_3,
        fieldOfStudy: formValues.college_field_of_study_3,
        notes: formValues.college_notes_3,
        startDate: {
          year: formValues.college_start_year_3
        },
        endDate: {
          year: formValues.college_end_year_3
        }
      }
      RESUME_OBJECT.education.push(new_education_obj_3);
    }

    //
    //
    //  Achievements
    //
    //

    /*

      let achievement_obj: any = {
        issuer: '',
        name: '',
      }

    */


    if (formValues.achievement_1_issuer || formValues.achievement_1_name) {
      let new_achievement_obj_1: any = {
        issuer: formValues.achievement_1_issuer,
        name: formValues.achievement_1_name,
      }
      RESUME_OBJECT.achievements.push(new_achievement_obj_1);
    }

    if (formValues.achievement_2_issuer || formValues.achievement_2_name) {
      let new_achievement_obj_2: any = {
        issuer: formValues.achievement_2_issuer,
        name: formValues.achievement_2_name,
      }
      RESUME_OBJECT.achievements.push(new_achievement_obj_2);
    }

    if (formValues.achievement_3_issuer || formValues.achievement_3_name) {
      let new_achievement_obj_3: any = {
        issuer: formValues.achievement_3_issuer,
        name: formValues.achievement_3_name,
      }
      RESUME_OBJECT.achievements.push(new_achievement_obj_3);
    }

    //
    //
    // references
    //
    //
    if (formValues.reference_1_info) {
      let new_reference_obj_1: any = {
        info: formValues.reference_1_info,
      }
      RESUME_OBJECT.references.push(new_reference_obj_1);
    }
    if (formValues.reference_2_info) {
      let new_reference_obj_2: any = {
        info: formValues.reference_2_info,
      }
      RESUME_OBJECT.references.push(new_reference_obj_2);
    }
    if (formValues.reference_3_info) {
      let new_reference_obj_3: any = {
        info: formValues.reference_3_info,
      }
      RESUME_OBJECT.references.push(new_reference_obj_3);
    }
    if (formValues.reference_4_info) {
      let new_reference_obj_4: any = {
        info: formValues.reference_4_info,
      }
      RESUME_OBJECT.references.push(new_reference_obj_4);
    }

    return RESUME_OBJECT;
  }




  //
  //
  // Preview Generation Function
  //
  //

  const generatePreview = async (precomputedData?: any) => {
    const values = form.getValues();

    // Validate form
    const result = await form.trigger();
    if (!result) {
      toast.error('Please fill in required fields');
      const firstError = document.querySelector('[data-invalid="true"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setActionState('generating');
    setGenerationProgress(0);

    // Simulate progress during generation
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      // Prefer AI-improved data (e.g. from an uploaded document) so the preview shows
      // the rewrite; otherwise fall back to the mapped form values.
      const mappedFormValues = precomputedData ?? mapFormValuesToResumeObject(values);

      // Store for persistence
      localStorage.setItem('stored_form_values', JSON.stringify(values));

      // Store preview data
      setPreviewResumeData(mappedFormValues);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      setTimeout(() => {
        setActionState('preview-ready');
        setShowPreviewModal(true); // Open modal automatically
        // Finalize upload state when preview actually opens
        if (isOpeningPreview) {
          setIsOpeningPreview(false);
          setFileHasBeenUploadedAndParsed(true);
        }
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setActionState('idle');
      setGenerationProgress(0);
      toast.error('Generation failed. Please try again.');
      console.error('Preview generation error:', error);
    }
  };


  //
  //
  // AI Generation (spends a free credit) — decoupled from download
  //
  //

  // Runs the AI rewrite on the current form values, spends one free credit, stores
  // the improved resume as the preview source, and opens the preview. This is the
  // "generation" the credit model gates on (regenerate / re-tailor). Parsing an
  // upload happens elsewhere and is intentionally free.
  const runAiGeneration = async () => {
    // Out of free credits -> straight to the paywall.
    if (isOutOfCredits) {
      const values = form.getValues();
      localStorage.setItem('stored_form_values', JSON.stringify(values));
      window.location.assign(STRIPE_PAYMENT_LINK);
      return;
    }

    // Validate required fields first.
    const valid = await form.trigger();
    if (!valid) {
      toast.error('Please fill in the required fields first');
      const firstError = document.querySelector('[data-invalid="true"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Reserve the credit up front; refund it if the call fails.
    if (!spendCredit()) {
      window.location.assign(STRIPE_PAYMENT_LINK);
      return;
    }
    const creditWasSpent = !hasPaid;

    const values = form.getValues();
    const mappedFormValues = mapFormValuesToResumeObject(values);
    localStorage.setItem('stored_form_values', JSON.stringify(values));

    setActionState('generating');
    setGenerationProgress(0);
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => Math.min(prev + 8, 90));
    }, 400);

    const job_post_description = (mappedFormValues.personal_info.job_post_description || '').trim();
    const job_post_description_insert = job_post_description.length
      ? `It is imperative that you tailor the resume content to align with the given job description: ${job_post_description}`
      : '';

    const promptString =
      "Persona: you are a expert resume writer with with years of experience improving resumes.\n" +
      "Improve the verbiage, tone, and professionalism of the inputted content so it can be used in a resume. " + job_post_description_insert + "\n\n" +
      "Rules:\n" +
      "1. The output should maintain the exact same object structure of the original 'resume_object', meaning only the key properties' values should be modified.\n" +
      "2. When necessary fix any typos, sentence structure issues, grammar problems, capitalize proper nouns, and expand acronyms.\n" +
      "3. If a section does not have content, you will usually leave it blank unless it makes sense to add detail.\n" +
      "4. For 'resume_object.experiences' data, write each experience summary as a substantial paragraph of 3-4 full sentences. Describe the responsibilities, the actions taken, and the outcome or impact (quantify with realistic metrics where it fits). Be thorough and descriptive while staying professional and clear, but never pad with filler or repeat the same point.\n" +
      "5. For 'resume_object.education' section, ensure school names are proper nouns and clear, and use the notes field to add 1-2 sentences of relevant detail (coursework, focus areas, honors, or activities) when appropriate.\n" +
      "6. For 'resume_object.achievements' section, elaborate with a sentence or two explaining the context and significance of each achievement.\n" +
      "7. For 'resume_object.references' section, do NOT invent or fabricate references. If the user provided references, you may elaborate with a sentence explaining the context of the relationship. If no references were provided, leave the references array empty.\n" +
      "8. Incorporate strong action verbs such as 'managed', 'solved', 'planned', 'executed', 'demonstrated', 'succeeded', 'collaborated', 'implemented', 'strategized', 'led', etc.\n" +
      "9. Aim for a fuller, more detailed resume overall. Favor complete, descriptive sentences over terse fragments, while keeping every sentence professional, specific, and free of fluff.\n" +
      "10. The outputted content should be a markedly improved and more thoroughly developed version of the input.\n" +
      "11. The outputted result must be valid JSON matching the exact structure of 'resume_object'. Output only the JSON object, no additional text.\n" +
      "resume_object:\n" +
      JSON.stringify(mappedFormValues);

    try {
      const userMessage: ChatCompletionMessageParam = { role: "user", content: promptString };
      const newMessages = [...messages, userMessage];
      const response = await axios.post('/api/resume-generator', { messages: newMessages });
      setMessages((current) => [...current, userMessage, response.data]);

      let content = response.data.content;
      content = (content || '').trim();
      if (content.startsWith('```')) {
        content = content.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }
      const outputObject = JSON.parse(content);

      // The previewed object IS what gets downloaded (preview === download).
      setPreviewResumeData(outputObject);
      aiImprovedFormKeyRef.current = JSON.stringify(outputObject);

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setTimeout(() => {
        setActionState('preview-ready');
        // Generation no longer auto-opens the preview — the user clicks the
        // "👁 Preview current version" button to view it.
        setFileHasBeenUploadedAndParsed(true);
      }, 400);
      // Count this real generation toward the public "resumes generated" total
      // so the counter ticks up live for the user who just generated.
      incrementLocalGenerationCount();
    } catch (error) {
      clearInterval(progressInterval);
      setActionState('idle');
      setGenerationProgress(0);
      // Refund the credit since the generation didn't succeed.
      if (creditWasSpent) {
        setFreeGenerationsUsed((prev) => {
          const refunded = Math.max(0, prev - 1);
          localStorage.setItem(FREE_GEN_KEY, String(refunded));
          return refunded;
        });
      }
      toast.error('Generation failed — your free credit was not used. Please try again.');
      console.error('AI generation error:', error);
    }
  };

  // Builds and downloads the .docx straight from the previewed resume object, so the
  // download matches exactly what the user saw. Used by the paid download path.
  const downloadResumeFromData = (data: any) => {
    if (!data) {
      form.handleSubmit(onSubmit)();
      return;
    }
    try {
      const fileName = `${(data.personal_info?.name || 'resume').replace(' ', '')}-Resume.docx`;
      const documentCreator = new DocumentCreator();
      const doc = documentCreator.create([
        data.personal_info,
        data.experiences,
        data.education,
        data.skills,
        data.achievements,
        data.references,
      ]);
      Packer.toBlob(doc).then((blob) => saveAs(blob, fileName));

      const new_download_count = numberOfDownloads + 1;
      localStorage.setItem('x8u_000_vb_nod', String(new_download_count));
      setNumberOfDownloads(new_download_count);
      toast.success('Resume downloaded! Check your downloads folder.', { duration: 8000 });
    } catch (error) {
      console.error('Direct download failed, falling back to full submit:', error);
      form.handleSubmit(onSubmit)();
    }
  };


  //
  //
  // onSubmit
  //
  //


  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    // format form data to match necessary structure for resume template
    const mappedFormValues = mapFormValuesToResumeObject(values);

    // persist form values
    localStorage.setItem('stored_form_values', JSON.stringify(values));

    // console.log('has paid: ', hasPaid);
    // return;

    if (!hasPaid) {
      window.location.assign(STRIPE_PAYMENT_LINK);
      return;
    }


    // console.log('user has paid');
    // return

    /*

         __ FOR TESTING __

    */
    // increment on # of downloads
    // let new_download_count = numberOfDownloads + 1;
    // localStorage.setItem('x8u_000_vb_nod', new_download_count); // 'numberOfDownloads'
    // let remaining_downloads = (3 - new_download_count); // 3, 2, 1

    // toast.dismiss();
    // toast.success(`Successfully generated resume, please check your downloads folder.\n\nDownloads remaining: `, {
    //   duration: 20000,
    // });


    // const fileNameTest = 'test-name';

    // const documentCreator = new DocumentCreator();
    // const doc = documentCreator.create([
    //   mappedFormValues.personal_info,
    //   mappedFormValues.experiences,
    //   mappedFormValues.education,
    //   mappedFormValues.skills,
    //   mappedFormValues.achievements,
    //   mappedFormValues.references,
    // ]);

    // Packer.toBlob(doc).then(blob => {
    //   saveAs(blob, fileNameTest);
    //   console.log("Successfully created resume.");
    // });


    // return;

    /*

         __ FOR TESTING __

    */

    // get job post dscription
    const job_post_description = mappedFormValues.personal_info.job_post_description.trim();
    const job_post_description_insert = job_post_description.length
      ? `It is imperative that you tailor the resume content to align with the given job description: ${job_post_description}`
      : '';

    const stringifiedMappedFormValues = JSON.stringify(mappedFormValues);

    const promptString = "Persona: you are a expert resume writer with with years of experience improving resumes.\n" +
"Improve the verbiage, tone, and professionalism of the inputted content so it can be used in a resume. " + job_post_description_insert + "\n\n" +
"Rules:\n" +
"1. The output should maintain the exact same object structure of the original 'resume_object', meaning only the key properties' values should be modified.\n" +
"2. When necessary fix any typos, sentence structure issues, grammar problems, capitalize proper nouns, and expand acronyms.\n" +
"3. If a section does not have content, you will usually leave it blank unless it makes sense to add detail.\n" +
"4. For 'resume_object.experiences' data, write each experience summary as a substantial paragraph of 3-4 full sentences. Describe the responsibilities, the actions taken, and the outcome or impact (quantify with realistic metrics where it fits). Be thorough and descriptive while staying professional and clear, but never pad with filler or repeat the same point.\n" +
"5. For 'resume_object.education' section, ensure school names are proper nouns and clear, and use the notes field to add 1-2 sentences of relevant detail (coursework, focus areas, honors, or activities) when appropriate.\n" +
"6. For 'resume_object.achievements' section, elaborate with a sentence or two explaining the context and significance of each achievement.\n" +
"7. For 'resume_object.references' section, do NOT invent or fabricate references. If the user provided references, you may elaborate with a sentence explaining the context of the relationship. If no references were provided, leave the references array empty.\n" +
"8. Incorporate strong action verbs such as 'managed', 'solved', 'planned', 'executed', 'demonstrated', 'succeeded', 'collaborated', 'implemented', 'strategized', 'led', etc.\n" +
"9. Aim for a fuller, more detailed resume overall. Favor complete, descriptive sentences over terse fragments, while keeping every sentence professional, specific, and free of fluff.\n" +
"10. The outputted content should be a markedly improved and more thoroughly developed version of the input.\n" +
"11. The outputted result must be valid JSON matching the exact structure of 'resume_object'. Output only the JSON object, no additional text.\n" +
"resume_object:\n" +
stringifiedMappedFormValues;


    // console.log('res gen step: ', promptString);

    const fileName = `${(mappedFormValues.personal_info.name).replace(' ', '')}-Resume.docx`;

    // make API call
    try {
      let outputObject: any;

      // If the form content is already AI-improved (from an uploaded document the user
      // previewed without editing), reuse it so the download matches the preview exactly
      // and we skip a redundant second AI call.
      const alreadyAiImproved =
        aiImprovedFormKeyRef.current === JSON.stringify(mappedFormValues);

      if (alreadyAiImproved) {
        outputObject = mappedFormValues;
      } else {
        const userMessage: ChatCompletionMessageParam = { role: "user", content: promptString };
        const newMessages = [...messages, userMessage];

        const response = await axios.post('/api/resume-generator', { messages: newMessages });
        setMessages((current) => [...current, userMessage, response.data]);

        // NOTE: hopefully these instructions work consistently
        outputObject = JSON.parse(response.data.content);
      }

      // Generate word doc
      //
      //
      const documentCreator = new DocumentCreator();
      const doc = documentCreator.create([
        outputObject.personal_info,
        outputObject.experiences,
        outputObject.education,
        outputObject.skills,
        outputObject.achievements,
        outputObject.references,
      ]);

      Packer.toBlob(doc).then(blob => {
        saveAs(blob, fileName);
        console.log(`Successfully created resume - ${outputObject.personal_info.name}`);
      });

       // increment on # of downloads
      let new_download_count = numberOfDownloads + 1;
      localStorage.setItem('x8u_000_vb_nod', String(new_download_count)); // 'numberOfDownloads'
      setNumberOfDownloads(new_download_count);
      let remaining_downloads = (max_download_count - new_download_count); // 3, 2, 1

      toast.dismiss();
      toast.success(`Successfully generated resume, please check your downloads folder.\n\nDownloads remaining: ${remaining_downloads}`, {
        duration: 12000,
      });

      // form.reset(); // we want to persist form data if they want to submit again
    } catch (error: any) {
      if (error?.response?.status === 999/* 403 */) {
        // don't want this to ever happen, 999 doesn't exist
        // proModal.onOpen();
        console.log('something bad happened');
      } else {

        // Generate word doc without AI-assisted content
        //
        //
        const documentCreator = new DocumentCreator();
        const doc = documentCreator.create([
          mappedFormValues.personal_info,
          mappedFormValues.experiences,
          mappedFormValues.education,
          mappedFormValues.skills,
          mappedFormValues.achievements,
          mappedFormValues.references,
        ]);
        Packer.toBlob(doc).then(blob => {
          saveAs(blob, fileName);
          console.log(`Successfully created resume (without AI) - ${mappedFormValues.personal_info.name}`);
        });

        toast.error("Something went wrong with the AI connection, but your resume was still generated.\n\nThis did not count against your remaining downloads: " +  numberOfDownloads + "/" + max_download_count);
      }
    } finally {
      router.refresh();
    }
  }


  //
  //
  //

  const onClick = () => {
    const x = document && document.getElementById('submit');
    if (x) {
      x.click();
    }
    // window.location.assign(STRIPE_PAYMENT_LINK);
  }

  //
  //
  // TOGGLE FORM FIELD VISIBILITY
  //
  //

  // Professional experience section


  const [job1Visibility, setJob1Visibility] = useState<boolean>(false);

  const [job2Visibility, setJob2Visibility] = useState<boolean>(false);

  const [job3Visibility, setJob3Visibility] = useState<boolean>(false);

  const [job4Visibility, setJob4Visibility] = useState<boolean>(false);

  const [job5Visibility, setJob5Visibility] = useState<boolean>(false);

  const [job6Visibility, setJob6Visibility] = useState<boolean>(false);

  //
  //

  // EDUCATION - College section
  const [education1Visibility, setEducation1Visibility] = useState<boolean>(false);
  // EDUCATION - 2nd section
  const [education2Visibility, setEducation2Visibility] = useState<boolean>(false);
  // EDUCATION - 3rd section
  const [education3Visibility, setEducation3Visibility] = useState<boolean>(false);

  //
  //

  // Civic engagement - 1st section
  const [civic1Visibility, setCivic1Visibility] = useState<boolean>(false);
  // Civic engagement - 2nd section
  const [civic2Visibility, setCivic2Visibility] = useState<boolean>(false);
  // Civic engagement - 3rd section
  const [civic3Visibility, setCivic3Visibility] = useState<boolean>(false);

  //
  //

  // References - 1st section
  const [references1Visibility, setReferences1Visibility] = useState<boolean>(false);

  // Section collapse states for accordion UI
  const [sectionExperienceOpen, setSectionExperienceOpen] = useState<boolean>(true);
  const [sectionEducationOpen, setSectionEducationOpen] = useState<boolean>(false);
  const [sectionAchievementsOpen, setSectionAchievementsOpen] = useState<boolean>(false);
  const [sectionReferencesOpen, setSectionReferencesOpen] = useState<boolean>(false);

  // preselect checkboxes if they have content

  useEffect(() => {
    if (!isFormInitialized) return;

    // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
    const timeoutId = setTimeout(() => {
      const values = form.getValues();
      if (values.job_1_employer) {
        if (
          values.job_1_employer?.length ||
          values.job_1_title?.length ||
          values.job_1_start_month?.length ||
          values.job_1_start_year?.length ||
          values.job_1_end_month?.length  ||
          values.job_1_end_year?.length ||
          values.job_1_summary?.length
        ) {
          setJob1Visibility(true);
        }
      }

      if (values.job_2_employer) {
        if (
          values.job_2_employer?.length ||
          values.job_2_title?.length ||
          values.job_2_start_month?.length ||
          values.job_2_start_year?.length ||
          values.job_2_end_month?.length  ||
          values.job_2_end_year?.length ||
          values.job_2_summary?.length
        ) {
          setJob2Visibility(true);
        }
      }

      if (values.job_3_employer) {
        if (
          values.job_3_employer?.length ||
          values.job_3_title?.length ||
          values.job_3_start_month?.length ||
          values.job_3_start_year?.length ||
          values.job_3_end_month?.length  ||
          values.job_3_end_year?.length ||
          values.job_3_summary?.length
        ) {
          setJob3Visibility(true);
        }
      }

      if (values.job_4_employer) {
        if (
          values.job_4_employer?.length ||
          values.job_4_title?.length ||
          values.job_4_start_month?.length ||
          values.job_4_start_year?.length ||
          values.job_4_end_month?.length  ||
          values.job_4_end_year?.length ||
          values.job_4_summary?.length
        ) {
          setJob4Visibility(true);
        }
      }

      if (values.job_5_employer) {
        if (
          values.job_5_employer?.length ||
          values.job_5_title?.length ||
          values.job_5_start_month?.length ||
          values.job_5_start_year?.length ||
          values.job_5_end_month?.length  ||
          values.job_5_end_year?.length ||
          values.job_5_summary?.length
        ) {
          setJob5Visibility(true);
        }
      }

      if (values.job_6_employer) {
        if (
          values.job_6_employer?.length ||
          values.job_6_title?.length ||
          values.job_6_start_month?.length ||
          values.job_6_start_year?.length ||
          values.job_6_end_month?.length  ||
          values.job_6_end_year?.length ||
          values.job_6_summary?.length
        ) {
          setJob6Visibility(true);
        }
      }

      // education
      if (
        values.college_name_1 ||
        values.college_degree_1 ||
        values.college_field_of_study_1 ||
        values.college_notes_1 ||
        values.college_start_year_1 ||
        values.college_end_year_1
      ) {
        setEducation1Visibility(true);
      }

      if (
        values.college_name_2 ||
        values.college_degree_2 ||
        values.college_field_of_study_2 ||
        values.college_notes_2 ||
        values.college_start_year_2 ||
        values.college_end_year_2
      ) {
        setEducation2Visibility(true);
      }

      if (
        values.college_name_3 ||
        values.college_degree_3 ||
        values.college_field_of_study_3 ||
        values.college_notes_3 ||
        values.college_start_year_3 ||
        values.college_end_year_3
      ) {
        setEducation3Visibility(true);
      }

      // civic
      if (
        values.achievement_1_issuer ||
        values.achievement_1_name
      ) {
        setCivic1Visibility(true);
      }

      if (
        values.achievement_2_issuer ||
        values.achievement_2_name
      ) {
        setCivic2Visibility(true);
      }

      if (
        values.achievement_3_name ||
        values.achievement_3_issuer
      ) {
        setCivic3Visibility(true);
      }

      // references
      if (
        values.reference_1_info ||
        values.reference_2_info ||
        values.reference_3_info ||
        values.reference_4_info
      ) {
        setReferences1Visibility(true);
      }

    }, 250);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormInitialized]); // Re-run when form is initialized


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const element = document.getElementById("bottomSectionOfPage");
      if (hasPaid) {
        element?.scrollIntoView({ behavior: "smooth",  block: "end"});
      }
    }, 650);
    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [hasPaid]);

  // Don't render until client-side hydration is complete to avoid mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Persist what they've entered, then hand off to the existing Stripe payment
  // link. Used by the checkout panel, the out-of-credits CTA, and the modal.
  const goToCheckout = () => {
    const values = form.getValues();
    localStorage.setItem('stored_form_values', JSON.stringify(values));
    window.location.assign(STRIPE_PAYMENT_LINK);
  };

  // Real entitlement-driven state powering the preview/checkout reveal.
  const previewName: string =
    (previewResumeData?.personal_info?.name as string) ||
    (form.getValues('full_name') as string) ||
    'Your name';
  const previewRole: string =
    (previewResumeData?.experiences?.[0]?.title as string) ||
    (form.getValues('job_1_title') as string) ||
    'Tailored to your target role';
  const showResultReveal =
    !hasPaid && !!previewResumeData && actionState !== 'generating';

  return (
    <>
      {/* Resume Preview Modal — the full, free preview lives here */}
      <ResumePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        resumeData={previewResumeData}
        onDownloadPaid={() => {
          setShowPreviewModal(false);
          // Redirect to Stripe or trigger download based on hasPaid
          if (!hasPaid) {
            goToCheckout();
          } else {
            // Download exactly what was previewed.
            downloadResumeFromData(previewResumeData);
          }
        }}
      />

      {/* ambient glow + standalone topbar/hero — carries the marketing look */}
      <div className="gen-atmos" aria-hidden />
      <GeneratorTopbar />
      <GeneratorHero />

      <div className="gen-wrap">
        <TrustChipStrip />
        <div className="gen-layout">
          <div className="gen-work">

          {/* STEP 1 — your resume (upload / completed state) */}
          <section className={`gen-step${fileHasBeenUploadedAndParsed ? ' done' : ''}`}>
            <div className="gen-step-head">
              <div className="gen-step-no">
                {fileHasBeenUploadedAndParsed ? (
                  <IconCheck style={{ width: 15, height: 15 }} />
                ) : (
                  '1'
                )}
              </div>
              <div>
                <div className="gen-step-title">
                  Your resume <span className="gen-opt">optional</span>
                </div>
                <div className="gen-step-desc">
                  Read instantly.{' '}
                  <span className="free">
                    Nothing leaves your browser unless you generate.
                  </span>
                </div>
              </div>
            </div>

            {fileHasBeenUploadedAndParsed ? (
              <div className="gen-filechip">
                <div className="fic">
                  <IconFile />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="fname">{uploadedFileName}</div>
                  <div className="fmeta">parsed clean · 0 errors</div>
                </div>
                <button
                  type="button"
                  className="swap"
                  onClick={() => {
                    setFileHasBeenUploadedAndParsed(false);
                    setUploadError(null);
                  }}
                >
                  Replace
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`gen-drop${isDragging ? ' dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById('file-upload-input')?.click()
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      document.getElementById('file-upload-input')?.click();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload your resume. Accepts .docx and .txt files."
                >
                  <input
                    type="file"
                    accept={ACCEPTED_FILE_TYPES}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-upload-input"
                  />
                  <div className="gen-drop-ic">
                    {isGettingAiResponseForFileUploadProcess ? (
                      <IconSpinner className="spin" style={{ width: 28, height: 28 }} />
                    ) : (
                      <IconCloudUp />
                    )}
                  </div>
                  {isGettingAiResponseForFileUploadProcess ? (
                    <>
                      <h3>Reading your resume…</h3>
                      <p>This takes a few seconds.</p>
                    </>
                  ) : isDragging ? (
                    <>
                      <h3>Drop to upload</h3>
                      <p>Release your file here</p>
                    </>
                  ) : (
                    <>
                      <h3>Drop your resume here</h3>
                      <p>or browse — we&apos;ll read it instantly</p>
                      <span className="gen-btn-ghost">Select file</span>
                    </>
                  )}
                  <div className="gen-filetypes">
                    <span>
                      <IconFile style={{ width: 13, height: 13 }} /> .docx
                    </span>
                    <span>
                      <IconFile style={{ width: 13, height: 13 }} /> .txt
                    </span>
                  </div>
                </div>
                {uploadError && (
                  <div className="gen-drop-error" role="alert">
                    {uploadError}
                  </div>
                )}
              </>
            )}
          </section>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

            {/* STEP 2 — paste the job (active) */}
            <section className="gen-step active">
              <div className="gen-step-head">
                <div className="gen-step-no">2</div>
                <div>
                  <div className="gen-step-title">
                    Paste the job <span className="gen-opt">recommended</span>
                  </div>
                  <div className="gen-step-desc">
                    We rewrite your bullets to mirror its exact keywords, skills, and
                    seniority signals. <b>This is what beats the bots.</b>
                  </div>
                </div>
              </div>
              <FormField
                name="job_post_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="gen-jd"
                        disabled={isLoading}
                        placeholder="Paste the full posting here — title, responsibilities, requirements, the works. The more you give us, the sharper the match."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="gen-jd-hint">
                <span className="beat">94% KEYWORD MATCH</span>
                <span>
                  is the average once a posting is pasted. Skip this and you&apos;re
                  optimizing for nobody.
                </span>
              </div>
            </section>

            {/* STEP 3 — fine-tune (collapsible; holds the full editable form) */}
            <section className="gen-step">
              <button
                type="button"
                className="gen-manual"
                aria-expanded={showFormFields}
                onClick={() => setShowFormFields(!showFormFields)}
              >
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div className="gen-step-no">3</div>
                  <div>
                    <div className="gen-step-title">
                      Fine-tune the details <span className="gen-opt">optional</span>
                    </div>
                    <div className="gen-step-desc">
                      Adjust anything we pulled in before generating.
                    </div>
                  </div>
                </div>
                <IconChevronDown className="chev" style={{ width: 20, height: 20 }} />
              </button>

            {/* Form Fields - Shown when toggle clicked */}
            {showFormFields && (
            <div className="gen-finetune" style={{ marginTop: 18 }}>
            <div className="grid grid-cols-12 gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-200">

              {/* PERSONAL INFO  */}
              <div className="col-span-12 mb-2">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h4>
              </div>


              <FormField
                name="full_name"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-3 border-2 rounded-lg border-gray-300">
                    <FormControl className="m-0 p-2" >
                      <Input

                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="email_address"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-3 border-2 rounded-lg border-gray-300">
                    <FormControl className="m-0 p-2">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Email address"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-3 border-2 rounded-lg border-gray-300">
                    <FormControl className="m-0 p-2">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Phone number"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="linkedin_profile"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-3 border-2 rounded-lg border-gray-300">
                    <FormControl className="m-0 p-2">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Linkedin profile (if applicable)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="skills"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                    <FormControl className="m-0 p-2">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="List any skills or technical abilities"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="interests"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-3 border-2 rounded-lg border-gray-300">
                    <FormControl className="m-0 p-2">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Add your interests"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="personal_website"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-3 border-2 rounded-lg border-gray-300">
                    <FormControl className="m-0 p-2">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Personal website (if applicable)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Professional experience - Collapsible Section */}
              <div className="col-span-12 mt-4">
                <button
                  type="button"
                  onClick={() => setSectionExperienceOpen(!sectionExperienceOpen)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Employment History
                  </span>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform ${sectionExperienceOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {sectionExperienceOpen && (
              <>
              {/* EXPERIENCE 1 */}
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-2">
                  <label style={{ color: '#576574' }} className="text-sm">
                    <input
                      name="checked" type="checkbox" checked={job1Visibility}
                      onChange={e => setJob1Visibility(!job1Visibility)} />
                    &nbsp; Add experience (1)
                  </label>
                </FormControl>
              </FormItem>

              {job1Visibility ?
                <>

                  <FormField
                    name="job_1_start_month"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-3 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Start month"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_1_start_year"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Start year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_1_end_month"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-3 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="End month"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_1_end_year"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="End year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_1_employer"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Employer"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_1_title"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Job title"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_1_summary"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                        {/* }<Input */}
                        <Textarea
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Job description"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </> : ''}

              {/* EXPERIENCE 2 */}
              <FormItem className="col-span-12 lg:col-span-12">
                <FormControl className="m-0 p-2">
                  <label style={{ color: '#576574' }} className="text-sm">
                    <input
                      name="checked" type="checkbox" checked={job2Visibility}
                      onChange={e => setJob2Visibility(!job2Visibility)} />
                    &nbsp; Add experience (2)
                  </label>
                </FormControl>
              </FormItem>

              {job2Visibility ?
                <>

                  <FormField
                    name="job_2_start_month"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-3  border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Start month"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_2_start_year"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2  border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Start year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_2_end_month"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-3  border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="End month"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_2_end_year"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2  border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="End year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_2_employer"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Employer"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_2_title"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Job title"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_2_summary"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                        {/* }<Input */}
                        <Textarea
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Job description"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </> : ''}


              {/* EXPERIENCE 3 */}
              <FormItem className="col-span-12 lg:col-span-12">
                <FormControl className="m-0 p-2">
                  <label style={{ color: '#576574' }} className="text-sm">
                    <input
                      name="checked" type="checkbox" checked={job2Visibility}
                      onChange={e => setJob3Visibility(!job3Visibility)} />
                    &nbsp; Add experience (3)
                  </label>
                </FormControl>
              </FormItem>

              {job3Visibility ?
                <>

                  <FormField
                    name="job_3_start_month"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-3 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Start month"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_3_start_year"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Start year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_3_end_month"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-3 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="End month"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_3_end_year"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="End year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_3_employer"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Employer"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_3_title"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Job title"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_3_summary"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                        {/* }<Input */}
                        <Textarea
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Job description"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </> : ''}




              {/* EXPERIENCE 4 */}
              <FormItem className="col-span-12 lg:col-span-12">
                <FormControl className="m-0 p-2">
                  <label style={{ color: '#576574' }} className="text-sm">
                    <input
                      name="checked" type="checkbox" checked={job4Visibility}
                      onChange={e => setJob4Visibility(!job4Visibility)} />
                    &nbsp; Add experience (4)
                  </label>
                </FormControl>
              </FormItem>

              {job4Visibility ?
                <>

                  <FormField
                    name="job_4_start_month"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-3 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Start month"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_4_start_year"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Start year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_4_end_month"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-3 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="End month"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_4_end_year"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="End year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_4_employer"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Employer"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_4_title"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Job title"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_4_summary"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                        {/* }<Input */}
                        <Textarea
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Job description"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </> : ''}

              {/* EXPERIENCE 5 */}
              <FormItem className="col-span-12 lg:col-span-12">
                <FormControl className="m-0 p-2">
                  <label style={{ color: '#576574' }} className="text-sm">
                    <input
                      name="checked" type="checkbox" checked={job5Visibility}
                      onChange={e => setJob5Visibility(!job5Visibility)} />
                    &nbsp; Add experience (5)
                  </label>
                </FormControl>
              </FormItem>

              {job5Visibility ?
                <>
                  <FormField
                    name="job_5_start_month"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-3 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none"
                            disabled={isLoading}
                            placeholder="Start month"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_5_start_year"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none"
                            disabled={isLoading}
                            placeholder="Start year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_5_end_month"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-3 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="End month"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_5_end_year"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="End year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_5_employer"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Employer"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_5_title"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Job title"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_5_summary"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                        {/* }<Input */}
                        <Textarea
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Job description"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </> : ''}


              {/* EXPERIENCE 6 */}
              <FormItem className="col-span-12 lg:col-span-12">
                <FormControl className="m-0 p-2">
                  <label style={{ color: '#576574' }} className="text-sm">
                    <input
                      name="checked" type="checkbox" checked={job6Visibility}
                      onChange={e => setJob6Visibility(!job6Visibility)} />
                    &nbsp; Add experience (6)
                  </label>
                </FormControl>
              </FormItem>

              {job6Visibility ?
                <>
                  <FormField
                    name="job_6_start_month"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-3 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Start month"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_6_start_year"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Start year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_6_end_month"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-3 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="End month"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_6_end_year"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="End year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_6_employer"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Employer"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_6_title"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Job title"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="job_6_summary"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                        {/* }<Input */}
                        <Textarea
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Job description"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </> : ''}
              </>
              )}

              {/* EDUCATION - Collapsible Section */}
              <div className="col-span-12 mt-4">
                <button
                  type="button"
                  onClick={() => setSectionEducationOpen(!sectionEducationOpen)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    Education
                  </span>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform ${sectionEducationOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {sectionEducationOpen && (
              <>
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-2">
                  <label style={{ color: '#576574' }} className="text-sm">
                    <input
                      name="checked" type="checkbox" checked={education1Visibility}
                      onChange={e => setEducation1Visibility(!education1Visibility)} />
                    &nbsp; Add education
                  </label>
                </FormControl>
              </FormItem>

              {education1Visibility ?
                <>

                  <FormField
                    name="college_name_1"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-4 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="School name"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />



                  <FormField
                    name="college_degree_1"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-4 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Degree or certificate"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />


                  <FormField
                    name="college_field_of_study_1"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-4 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Field of Study"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_start_year_1"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Start year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_end_year_1"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Graduating year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_notes_1"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-8 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Notes"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                </>

                : ''}


              {/*EDUCATION - 2 */}
              <FormItem className="col-span-12 lg:col-span-12">
                <FormControl className="m-0 p-2">
                  <label style={{ color: '#576574' }} className="text-sm">
                    <input
                      name="checked" type="checkbox" checked={education2Visibility}
                      onChange={e => setEducation2Visibility(!education2Visibility)} />
                    &nbsp; Add education (1)
                  </label>
                </FormControl>
              </FormItem>

              {education2Visibility ?
                <>
                  <FormField
                    name="college_name_2"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-4 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="College name"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_degree_2"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-4 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Degree or certificate"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_field_of_study_2"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-4 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Field of Study"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_start_year_2"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Start year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_end_year_2"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Graduating year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_notes_2"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-8 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Notes"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                </>



                : ''}


              {/*EDUCATION - 3 */}
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-2">
                  <label style={{ color: '#576574' }} className="text-sm">
                    <input
                      name="checked" type="checkbox" checked={education3Visibility}
                      onChange={e => setEducation3Visibility(!education3Visibility)} />
                    &nbsp; Add education (2)
                  </label>
                </FormControl>
              </FormItem>

              {education3Visibility ?
                <>
                  <FormField
                    name="college_name_3"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-4 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="College name"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_degree_3"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-4 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none"
                            disabled={isLoading}
                            placeholder="Degree or certificate"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_field_of_study_3"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-4 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Field of Study"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_start_year_3"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Start year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_end_year_3"
                    render={({ field }) => (
                      <FormItem className="col-span-6 lg:col-span-2 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Graduating year"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_notes_3"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-8 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Notes"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                </>

                : ''}
              </>
              )}

              {/* ACHIEVEMENTS - Collapsible Section */}
              <div className="col-span-12 mt-4">
                <button
                  type="button"
                  onClick={() => setSectionAchievementsOpen(!sectionAchievementsOpen)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Achievements and Recognitions
                  </span>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform ${sectionAchievementsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {sectionAchievementsOpen && (
              <>
              {/* CIVIC 1 DROPDOWN */}
              <FormItem className="col-span-12 lg:col-span-12">
                <FormControl className="m-0 p-2">
                  <label style={{ color: '#576574' }} className="text-sm">
                    <input
                      name="checked" type="checkbox" checked={civic1Visibility}
                      onChange={e => setCivic1Visibility(!civic1Visibility)} />
                    &nbsp; Add achievement
                  </label>
                </FormControl>
              </FormItem>

              {civic1Visibility ?
                <>
                  <FormField
                    name="achievement_1_issuer"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-5 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Organization (if applicable)"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />


                  <FormField
                    name="achievement_1_name"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-7 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Describe any skills, achievements, or interests."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </> : ''}


              {/* CIVIC 2 DROPDOWN */}

              <FormItem className="col-span-12 lg:col-span-12">
                <FormControl className="m-0 p-2">
                  <label style={{ color: '#576574' }} className="text-sm">
                    <input
                      name="checked" type="checkbox" checked={civic2Visibility}
                      onChange={e => setCivic2Visibility(!civic2Visibility)} />
                      &nbsp; Add achievement (2)
                  </label>
                </FormControl>
              </FormItem>

              {civic2Visibility ?
                <>
                  <FormField
                    name="achievement_2_issuer"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-5 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Organization (if applicable)"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="achievement_2_name"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-7 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Describe any skills, achievements, or interests."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </> : ''}


              {/* CIVIC 3 DROPDOWN */}

              <FormItem className="col-span-12 lg:col-span-12">
                <FormControl className="m-0 p-2">
                  <label style={{ color: '#576574' }} className="text-sm">
                    <input
                      name="checked" type="checkbox" checked={civic3Visibility}
                      onChange={e => setCivic3Visibility(!civic3Visibility)} />
                      &nbsp; Add achievement (3)
                  </label>
                </FormControl>
              </FormItem>

              {civic3Visibility ?
                <>
                  <FormField
                    name="achievement_3_issuer"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-5 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Organization (if applicable)"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="achievement_3_name"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-7 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Describe any skills, achievements, or interests."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </> : ''}
              </>
              )}

              {/* REFERENCES - Collapsible Section */}
              <div className="col-span-12 mt-4">
                <button
                  type="button"
                  onClick={() => setSectionReferencesOpen(!sectionReferencesOpen)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Professional References
                  </span>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform ${sectionReferencesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {sectionReferencesOpen && (
              <>
              <FormItem className="col-span-12 lg:col-span-12">
                <FormControl className="m-0 p-2">
                  <label style={{ color: '#576574' }} className="text-sm">
                    <input
                      name="checked" type="checkbox" checked={references1Visibility}
                      onChange={e => setReferences1Visibility(!references1Visibility)} />
                    &nbsp; Add references
                  </label>
                </FormControl>
              </FormItem>

              {references1Visibility ?
                <>
                  <FormField
                    name="reference_1_info"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Name, title and contact info"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="reference_2_info"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Name, title and contact info"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="reference_3_info"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Name, title and contact info"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="reference_4_info"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                        <FormControl className="m-0 p-2">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Name, title and contact info"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </> : ''}
              </>
              )}

              </div>
              </div>
            )}
            </section>

            {/* mobile-only proof + honest math, placed right before generate */}
            <div className="gen-only-mobile">
              <LiveProofCard variant="mobile" />
              <HonestMathCard compact />
            </div>

            {/* STEP 4 — generate (the money setup) / paid download */}
            {hasPaid ? (
              <section className="gen-download">
                <div className="gen-step-head">
                  <div className="gen-step-no grad">
                    <IconCheck style={{ width: 15, height: 15 }} />
                  </div>
                  <div>
                    <div className="gen-step-title">Ready to download</div>
                    <div className="gen-step-desc">
                      Downloads: {numberOfDownloads}/{max_download_count} used.{' '}
                      <b>Regenerate and re-download as much as you like.</b>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="gen-btn-download"
                  disabled={isLoading}
                  onClick={() => form.handleSubmit(onSubmit)()}
                >
                  {isLoading ? <IconSpinner className="spin" /> : <IconCheck />}
                  {isLoading ? 'Generating…' : 'Download resume'}
                </button>
              </section>
            ) : (
              <section className="gen-generate">
                <div className="gen-step-head">
                  <div className="gen-step-no grad">4</div>
                  <div>
                    <div className="gen-step-title">Generate your resume</div>
                    <div className="gen-step-desc">
                      Rewritten sharp, ATS-ready, and recruiter-approved.{' '}
                      <b>Preview is always free.</b>
                    </div>
                  </div>
                </div>

                <CreditsPips used={freeGenerationsUsed} max={MAX_FREE_GENERATIONS} />

                {actionState === 'generating' && (
                  <div
                    style={{
                      height: 5,
                      width: '100%',
                      background: 'var(--line)',
                      borderRadius: 3,
                      overflow: 'hidden',
                      margin: '0 0 16px',
                    }}
                    aria-hidden
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${generationProgress}%`,
                        background: 'var(--grad)',
                        transition: 'width .3s ease',
                      }}
                    />
                  </div>
                )}

                {isOutOfCredits ? (
                  <>
                    <button
                      type="button"
                      className="gen-btn-primary"
                      onClick={goToCheckout}
                    >
                      <IconLock />
                      Unlock &amp; download · $9.99
                    </button>
                    <div className="gen-gen-sub">
                      You&apos;ve used all {MAX_FREE_GENERATIONS} free generations ·{' '}
                      <button
                        type="button"
                        onClick={() => {
                          if (previewResumeData) {
                            setShowPreviewModal(true);
                          } else {
                            generatePreview();
                          }
                        }}
                        style={{
                          color: 'var(--violet)',
                          background: 'none',
                          border: 'none',
                          textDecoration: 'underline',
                          textUnderlineOffset: 3,
                          cursor: 'pointer',
                          font: 'inherit',
                        }}
                      >
                        preview your last version free
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="gen-btn-primary"
                      disabled={isLoading || actionState === 'generating'}
                      onClick={() => runAiGeneration()}
                    >
                      {isLoading || actionState === 'generating' ? (
                        <IconSpinner className="spin" />
                      ) : (
                        <IconSpark />
                      )}
                      {isLoading || actionState === 'generating'
                        ? 'Generating your resume…'
                        : freeGenerationsUsed > 0
                          ? form.watch('job_post_description')
                            ? 'Regenerate & tailor to job'
                            : 'Regenerate my resume'
                          : form.watch('job_post_description')
                            ? 'Generate & tailor to job'
                            : 'Generate my resume'}
                    </button>
                    <div className="gen-gen-sub">
                      Free preview · no card · $9.99 only when you download
                    </div>
                    {!uploadedFileContents && !previewResumeData && (
                      <div className="gen-gen-sub">
                        Upload above or fill in your details, then hit generate.
                      </div>
                    )}
                  </>
                )}

                <div className="gen-foot">
                  <span className="t">
                    <IconLock /> Stripe secured
                  </span>
                  <span className="t">
                    <IconCheck /> No card on file, ever
                  </span>
                </div>
              </section>
            )}

            {/* ===== RESULT / MONEY MOMENT (revealed once a preview exists) ===== */}
            {showResultReveal && (
              <div className="gen-result">
                <div
                  className="gen-eyebrow"
                  style={{ textAlign: 'left', margin: '6px 0 16px' }}
                >
                  Your preview is ready · unlock to download
                </div>
                <div className="gen-result-grid">
                  <PreviewDoc
                    name={previewName}
                    role={previewRole}
                    onPreviewFree={() => setShowPreviewModal(true)}
                  />
                  <CheckoutPanel onUnlock={goToCheckout} />
                </div>
              </div>
            )}

            </form>
          </Form>

          </div>{/* end .gen-work */}

          <TrustRail />
        </div>{/* end .gen-layout */}

        <div className="gen-footnote">
          Questions before you start? <a href="#">How it works</a> ·{' '}
          <a href="#">What we do with your data</a> · <a href="#">Refund policy</a>
        </div>
      </div>{/* end .gen-wrap */}

      <StickyMobileCTA
        show={showStickyCta && !showResultReveal}
        busy={isLoading || actionState === 'generating'}
        onGenerate={() => runAiGeneration()}
      />
    </>
  );
}

export default ResumeGeneratorPage;
