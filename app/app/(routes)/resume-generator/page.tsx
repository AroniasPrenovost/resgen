"use client";

import * as z from "zod";
import axios from "axios";
import { FileText, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
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

const ResumeGeneratorPage = () => {
  // Track client-side mounting to prevent hydration mismatch with useSearchParams
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    "3. Add realistic content to sections that are blank (within reason).\n" +
    "4. For 'resume_object.experiences' data, elaborate so most of the experience summary instances are at least 2 sentances.\n" +
    "5. For 'resume_object.education' section, ensure school names are proper nonand clear.\n" +
    "6. For 'resume_object.achievements' section, elaborate when necessary to explain context of achievement.\n" +
    "7. For 'resume_object.references' section, elaborate when necessary to explain context of relationship.\n" +
    "8. Incorporate words such as 'managed', 'solved', 'planned', 'executed', 'demonstrated', 'succeeded', 'collaborated', 'implemented', 'strategized', 'lead', etc.\n" +
    "9. The outputted content should be a markedly improved version of the input.\n" +
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
      toast.success('Successfully imported, analyzed, and updated your resume.', {
        duration: 22000,
      });

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
      toast.error("Please upload a .docx or .txt file");
      return;
    }

    setUploadedFileName(file.name);

    try {
      if (isDocx) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setUploadedFileContents(result.value);
        toast.success('Resume uploaded successfully!');
      } else if (isTxt) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result;
          setUploadedFileContents(text as string);
          toast.success('Resume uploaded successfully!');
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Something went wrong while processing the file.");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      setUploadedFileName(file.name);

      try {
        if (
          fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          fileType === "application/msword"
        ) {
          //
          // .docx
          //
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          setUploadedFileContents(result.value);
          console.log('successfully processed .docx file')

        } else if (fileType === "text/plain") {
          //
          // .txt
          //
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result;
            setUploadedFileContents(text as string);
          };
          reader.readAsText(file);

        } else {
          alert("Unsupported file format! Please upload a PDF, Word document, or TXT file.");
        }
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Something went wrong while processing the .txt file.");
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
  const [shouldAutoGeneratePreview, setShouldAutoGeneratePreview] = useState(false);

  // file upload state
  type UploadedResumeDataType = { [key: string]: string; };
  const [uploadedResumeDataConvertedToForm, setUploadedResumeDataConvertedToForm] = useState<UploadedResumeDataType>({});
  const [isGettingAiResponseForFileUploadProcess, setIsGettingAiResponseForFileUploadProcess] = useState(false);
  const [fileHasBeenUploadedAndParsed, setFileHasBeenUploadedAndParsed] = useState(false);
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
          // set flag to track that we've processed the resume
          localStorage.setItem('file_has_been_uploaded_and_parsed', 'true');
          setFileHasBeenUploadedAndParsed(true);
          setShouldAutoGeneratePreview(true);
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

  const generatePreview = async () => {
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
      // Map form values to resume structure
      const mappedFormValues = mapFormValuesToResumeObject(values);

      // Store for persistence
      localStorage.setItem('stored_form_values', JSON.stringify(values));

      // Store preview data
      setPreviewResumeData(mappedFormValues);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      setTimeout(() => {
        setActionState('preview-ready');
        setShowPreviewModal(true); // Open modal automatically
        toast.success('Preview ready!');
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
"4. For 'resume_object.experiences' data, elaborate so most of the experience summary instances are at least 2 sentances.\n" +
"5. For 'resume_object.education' section, ensure school names are proper nonand clear.\n" +
"6. For 'resume_object.achievements' section, elaborate when necessary to explain context of achievement.\n" +
"7. For 'resume_object.references' section, elaborate when necessary to explain context of relationship.\n" +
"8. Incorporate words such as 'managed', 'solved', 'planned', 'executed', 'demonstrated', 'succeeded', 'collaborated', 'implemented', 'strategized', 'lead', etc.\n" +
"9. The outputted content should be a markedly improved version of the input.\n" +
"10. The outputted result should only be a string-ified version of the 'resume_object'.\n" +
"resume_object:\n" +
stringifiedMappedFormValues;


    // console.log('res gen step: ', promptString);

    const fileName = `${(mappedFormValues.personal_info.name).replace(' ', '')}-Resume.docx`;

    // make API call
    try {
      const userMessage: ChatCompletionMessageParam = { role: "user", content: promptString };
      const newMessages = [...messages, userMessage];

      const response = await axios.post('/api/resume-generator', { messages: newMessages });
      setMessages((current) => [...current, userMessage, response.data]);
      // console.log('try/catch data: ', response.data.content);

      // NOTE: hopefully these instructions work consistently
      const outputObject = JSON.parse(response.data.content);
      // console.log({ outputObject });

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

  // Auto-generate preview after file upload processing completes
  // TODO: Re-enable after fixing scope issue
  // useEffect(() => {
  //   if (shouldAutoGeneratePreview) {
  //     setShouldAutoGeneratePreview(false);
  //     setTimeout(() => {
  //       generatePreview();
  //     }, 1000);
  //   }
  // }, [shouldAutoGeneratePreview]);

  // Don't render until client-side hydration is complete to avoid mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Resume Preview Modal */}
      <ResumePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        resumeData={previewResumeData}
        onDownloadPaid={() => {
          setShowPreviewModal(false);
          // Redirect to Stripe or trigger download based on hasPaid
          if (!hasPaid) {
            const values = form.getValues();
            localStorage.setItem('stored_form_values', JSON.stringify(values));
            window.location.assign(STRIPE_PAYMENT_LINK);
          } else {
            form.handleSubmit(onSubmit)();
          }
        }}
      />

      {/* Modern Hero Section with Visual Mockup */}
      <div className="px-4 lg:px-8 mb-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* Left Side - Upload Area */}
          <div className="order-2 lg:order-1">
            {/* Main Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative rounded-2xl border-2 border-dashed transition-all duration-300 p-8 md:p-12
                ${fileHasBeenUploadedAndParsed
                  ? 'border-green-400 bg-green-50/50'
                  : isGettingAiResponseForFileUploadProcess
                    ? 'border-purple-400 bg-purple-50/50'
                    : isDragging
                      ? 'border-purple-500 bg-purple-100/50 shadow-xl shadow-purple-200 scale-[1.02]'
                      : 'border-purple-300 bg-gradient-to-br from-white to-purple-50/30 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-100'
                }
              `}
            >
              <input
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-upload-input"
                disabled={fileHasBeenUploadedAndParsed}
              />

              <label
                htmlFor="file-upload-input"
                className={`flex flex-col items-center cursor-pointer ${fileHasBeenUploadedAndParsed ? 'cursor-default' : ''}`}
              >
                {/* Upload Icon */}
                <div className={`
                  w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300
                  ${fileHasBeenUploadedAndParsed
                    ? 'bg-green-100'
                    : isGettingAiResponseForFileUploadProcess
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg'
                      : isDragging
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-xl scale-110'
                        : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg hover:scale-105'
                  }
                `}>
                  {fileHasBeenUploadedAndParsed ? (
                    <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isGettingAiResponseForFileUploadProcess ? (
                    <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : isDragging ? (
                    <svg className="w-10 h-10 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  )}
                </div>

                {/* Text */}
                {fileHasBeenUploadedAndParsed ? (
                  <div className="text-center">
                    <p className="text-xl font-semibold text-green-700 mb-2">Resume Uploaded</p>
                    <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      {uploadedFileName}
                    </p>
                  </div>
                ) : isGettingAiResponseForFileUploadProcess ? (
                  <div className="text-center">
                    <p className="text-xl font-semibold text-purple-700 mb-2">
                      Analyzing your resume...
                    </p>
                    <p className="text-purple-500">This may take a few seconds</p>
                  </div>
                ) : isDragging ? (
                  <div className="text-center">
                    <p className="text-xl font-semibold text-purple-700 mb-2">
                      Release to upload
                    </p>
                    <p className="text-purple-500">Drop your file here</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xl font-semibold text-gray-800 mb-2">
                      Drop your resume here
                    </p>
                    <p className="text-gray-500 mb-4">or click to browse</p>
                    <span className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 transition-colors">
                      Select File
                    </span>
                  </div>
                )}
              </label>

              {/* File type indicator */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                    </svg>
                    .docx
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                    </svg>
                    .txt
                  </span>
                </div>
              </div>
            </div>

            {/* Preview Free Badge */}
            <div className="mt-6 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-600">Preview <strong className="text-green-600">FREE</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-600">Download <strong className="text-purple-600">$9.99</strong></span>
              </div>
            </div>
          </div>

          {/* Right Side - Visual Mockup */}
          <div className="order-1 lg:order-2 relative">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl"></div>

            {/* Main Resume Preview Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-purple-200/50 p-6 border border-gray-100">
              {/* Resume Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold">
                  MR
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">Maya Rodriguez</h3>
                  <p className="text-sm text-gray-500">Product Marketing Manager</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>maya.r@email.com</span>
                    <span>•</span>
                    <span>Austin, TX</span>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">Excel</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">Salesforce</span>
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">Marketing</span>
                  <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium">Leadership</span>
                </div>
              </div>

              {/* Experience Preview */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Experience</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs">T</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Target</p>
                      <p className="text-xs text-gray-400">2022 - Present</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs">W</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Wells Fargo</p>
                      <p className="text-xs text-gray-400">2019 - 2022</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge - ATS Score */}
              <div className="absolute -top-3 -right-3 bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-10">
                    <svg className="w-10 h-10 transform -rotate-90">
                      <circle cx="20" cy="20" r="16" stroke="#e5e7eb" strokeWidth="3" fill="none"/>
                      <circle cx="20" cy="20" r="16" stroke="#22c55e" strokeWidth="3" fill="none" strokeDasharray="100" strokeDashoffset="8" strokeLinecap="round"/>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-600">92</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">ATS Score</p>
                    <p className="text-[10px] text-green-600">Excellent</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge - ATS Perfect */}
              <div className="absolute -bottom-2 right-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg px-3 py-1.5 text-white text-xs font-medium flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                ATS Optimized
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-2xl
                border
                border-gray-200
                w-full
                p-6
                md:p-8
                bg-white
                shadow-sm
              "
            >

            {/* Job Description Section - More Prominent */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Target Job Description</h3>
                  <p className="text-sm text-gray-500">Optional - helps tailor your resume to the role</p>
                </div>
              </div>
              <FormField
                name="job_post_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="border border-gray-200 rounded-xl p-4 min-h-[100px] focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none bg-gray-50/50"
                        disabled={isLoading}
                        placeholder="Paste the job posting here and we'll optimize your resume to match the keywords and requirements..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Manual Entry Toggle */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowFormFields(!showFormFields)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-purple-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Edit details manually</p>
                    <p className="text-sm text-gray-500">Fine-tune your information after upload</p>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showFormFields ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Form Fields - Shown when toggle clicked */}
            {showFormFields && (
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
            )} {/* end showFormFields conditional */}

            {/* Generate Button Section - Clean & Modern */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              {hasPaid ? (
                // Paid User - Download Section
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Ready to Download</h3>
                        <p className="text-sm text-gray-500">Downloads: {numberOfDownloads}/{max_download_count} used</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    disabled={isLoading}
                    className="w-full h-14 text-base bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-green-200 transition-all hover:shadow-xl"
                    onClick={() => form.handleSubmit(onSubmit)()}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Resume
                      </span>
                    )}
                  </Button>
                </div>
              ) : (
                // Non-paid User - Generate & Preview Section
                <div className="text-center">
                  {/* Visual Flow Indicator - Dynamic Steps */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
                    {/* Step 1: Input */}
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                        fileHasBeenUploadedAndParsed
                          ? 'bg-green-500 text-white'
                          : 'bg-purple-600 text-white ring-4 ring-purple-200'
                      }`}>
                        {fileHasBeenUploadedAndParsed ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : '1'}
                      </div>
                      <span className={`text-sm ${fileHasBeenUploadedAndParsed ? 'text-green-600 font-medium' : 'text-gray-800 font-medium'}`}>Input</span>
                    </div>

                    <div className={`w-8 h-0.5 ${fileHasBeenUploadedAndParsed ? 'bg-green-400' : 'bg-gray-200'}`}></div>

                    {/* Step 2: Preview */}
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                        actionState === 'preview-ready'
                          ? 'bg-green-500 text-white'
                          : actionState === 'generating'
                            ? 'bg-purple-600 text-white ring-4 ring-purple-200 animate-pulse'
                            : fileHasBeenUploadedAndParsed
                              ? 'bg-purple-600 text-white ring-4 ring-purple-200'
                              : 'bg-gray-200 text-gray-500'
                      }`}>
                        {actionState === 'preview-ready' ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : '2'}
                      </div>
                      <span className={`text-sm ${actionState === 'preview-ready' ? 'text-green-600 font-medium' : actionState === 'generating' || fileHasBeenUploadedAndParsed ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                        Preview <span className="text-green-600 font-medium text-xs">FREE</span>
                      </span>
                    </div>

                    <div className={`w-8 h-0.5 ${actionState === 'preview-ready' ? 'bg-green-400' : 'bg-gray-200'}`}></div>

                    {/* Step 3: Download */}
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                        actionState === 'preview-ready'
                          ? 'bg-purple-600 text-white ring-4 ring-purple-200'
                          : 'bg-gray-200 text-gray-500'
                      }`}>3</div>
                      <span className={`text-sm ${actionState === 'preview-ready' ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                        Download <span className="text-purple-600 font-medium text-xs">$9.99</span>
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    disabled={isLoading || actionState === 'generating'}
                    className={`w-full max-w-md h-14 text-lg rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02]`}
                    onClick={() => generatePreview()}
                  >
                    {isLoading || actionState === 'generating' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Generating Preview...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Preview My Resume
                      </span>
                    )}
                  </Button>

                  {!uploadedFileContents && (
                    <p className="text-sm text-gray-400 mt-3">Upload your resume above to get started</p>
                  )}

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                      Secure payment
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      30-day revisions
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                      </svg>
                      ATS-optimized
                    </span>
                  </div>
                </div>
              )}
            </div>

              {/*

                Generate / 'purchase' button (variant #2)

              */}


            </form>
          </Form>
        </div>
        {/* Processing indicator - only shown when loading */}
        {isLoading && (
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Optimizing your resume...</p>
                <p className="text-sm text-gray-500">Our AI is enhancing your content for ATS compatibility</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeGeneratorPage;
