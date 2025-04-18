"use client";

import * as z from "zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter, usePathname, redirect, useSearchParams } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";

import Image from "next/image"

import { Tooltip } from '@nextui-org/react';
import {Popover, PopoverTrigger, PopoverContent} from "@nextui-org/popover";
import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { SimplerLoader } from "@/components/simpler-loader";
import { UserAvatar } from "@/components/user-avatar";
import { Empty } from "@/components/ui/empty";

// import { useProModal } from "@/hooks/use-pro-modal";
// import { checkSubscription } from "@/lib/subscription";

import { formSchema } from "./constants";

const STRIPE_PAYMENT_LINK: string = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? 'https://stripe.com';

// file upload
import mammoth from "mammoth"; // supports .docx
import { PDFDocument } from 'pdf-lib'; // supports .pdf

// saving (downloading) generated resume as .docx
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { DocumentCreator } from "@/lib/resume-generator";
// import { experiences, education, skills, achievements } from "@/lib/cv-data"; // dummy data

const ResumeGeneratorPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // const proModal = useProModal();

  //
  //
  // AI response output state
  //
  //

  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  //
  //
  // button hover states
  //

  // const [topCTAButtonIsHovered, setTopCTAButtonIsHovered] = useState(false);
  const [isJobPostingTooltipOpen, setIsJobPostingTooltipOpen] = useState(false);
  const [fileUploadButtonIsHovered, setFileUploadButtonIsHovered] = useState(false);
  const [formSubmitButtonIsHovered, setFormSubmitButtonIsHovered] = useState(false);

  // manage form submit button tooltip display states
  const [isSubmitButtonTooltipOpen, setIsSubmitButtonTooltipOpen] = useState(false);


  // manage file upload POPOVER display states
  const [typedTitle, setTypedTitle] = useState('');
  const [typedBody, setTypedBody] = useState('');
  const [typedBody2, setTypedBody2] = useState('');
  const [typedBody3, setTypedBody3] = useState('');
  const [isFileUploadPopoverOpen, setIsFileUploadPopoverOpen] = useState(false);
  let popoverHasBeenShownToUser = false;

  useEffect(() => {
    const popoverShown = localStorage.getItem('file_upload_popover_shown') === 'true'
    if (!popoverShown) {
      toggleScrollAndDimBackground(true);
      const showPopoverTimeout = setTimeout(() => {
        setIsFileUploadPopoverOpen(true);

        typeText('👋 Hey there, welcome to ResumAI!', setTypedTitle);

        setTimeout(() => {
          typeText(
            'Upload your resume and watch as the AI assistant begins to proofread and make improvements.',
            setTypedBody
          );
        }, 3300);

        setTimeout(() => {
          typeText(
            'Don\'t have a resume yet? Manually enter as much (or as little) info as you like, and we\'ll take it from there!',
            setTypedBody2
          );
        }, 8700);

        setTimeout(() => {
          typeText(
            '* Supports .docx and .txt file types.',
            setTypedBody3
          );
        }, 15200);

        setTimeout(() => {
          setIsFileUploadPopoverOpen(false);
          localStorage.setItem('file_upload_popover_shown', 'true');
          popoverHasBeenShownToUser = true;
          toggleScrollAndDimBackground(false);
        }, 19100); // popover stays open for X seconds
      }, 250); // Initial delay before showing popover

      return () => clearTimeout(showPopoverTimeout);
    }
  }, []);


  //
  //
  // file upload ai call
  //
  //



  const convertUploadedFileToFormInputsUsingAi = async(fileContents: string) => {
    console.log('convertUploadedFileToFormInputsUsingAi()');
    // get job post description
    const input = document.querySelector('input[name="job_post_description"]') as HTMLInputElement | null;
    let job_post_description = (input && input.value) ? input.value.trim() : '';
    let job_post_description_insert = job_post_description.length ? `Ensure the new resume output aligns with the given job description: ${job_post_description}` : '';
    console.log({job_post_description_insert})

    // localStorage.removeItem('file_has_been_uploaded_and_parsed', 'false')
    // localStorage.removeItem('stored_form_values', '{}');
    // localStorage.removeItem('file_upload_popover_shown');
    // localStorage.removeItem('file_upload_count');
    // return;

    const promptString = `Persona: you are a expert resume writer with with years of experience improving resumes.
    Improve the verbiage, tone, and professionalism of the inputted content (${fileContents}) and map it to our desired 'resume_object' structure.

    ${job_post_description_insert}

    Rules:
    1. The output should maintain the exact same object structure of the original 'resume_object', meaning only the key properties' values should be modified.
    2. When necessary fix any typos, sentence structure issues, grammar problems, capitalize proper nouns, and expand acronyms.
    3. Add realistic content to sections that are blank (within reason).
    4. For 'resume_object.experiences' data, elaborate so most of the experience summary instances are at least 2 sentances.
    5. For 'resume_object.education' section, ensure school names are proper nonand clear.
    6. For 'resume_object.achievements' section, elaborate when necessary to explain context of achievement.
    7. For 'resume_object.references' section, elaborate when necessary to explain context of relationship.
    8. Incorporate words such as 'managed', 'solved', 'planned', 'executed', 'demonstrated', 'succeeded', 'collaborated', 'implemented', 'strategized', 'lead', etc.
    9. The outputted content should be a markedly improved version of the input.
    10. The outputted result should only be a string-ified version of the 'resume_object'.
    11. Do not modify the 'job_post_description' field and it's value in any way.
    resume_object:
    {
      "job_post_description": "${job_post_description}",
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
  }
        `;

    // console.log('res import step: ', promptString);

    // make API call
    try {
      const userMessage: ChatCompletionRequestMessage = { role: "user", content: promptString };
      const newMessages = [...messages, userMessage];

      const response = await axios.post('/api/resume-generator', { messages: newMessages });
      // setMessages((current) => [...current, userMessage, response.data]);
      // console.log('try/catch data: ', response.data.content);

      // NOTE: hopefully these instructions work consistently
      // console.log({response});
      const outputObject = JSON.parse(response.data.content);
      // console.log({response, outputObject});

      toast.dismiss();
      toast.success('Successfully imported, analyzed, and updated your resume.', {
        duration: 22000,
      });

      return response;
      // console.log({ outputObject });
      // form.reset(); // we want to persist form data if they want to submit again
    } catch (error: any) {
      if (error?.response?.status === 999/* 403 */) {
        // don't want this to ever happen, 999 doesn't exist
        // proModal.onOpen();
        console.log('Something bad happened when trying to read your resume');
      } else {
        toast.error("Something went wrong with the AI connection, please be patient as we try again.");
      }
    } finally {
      router.refresh();
    }
  };

  //
  // file upload file input-related

  const ACCEPTED_FILE_TYPES = ".docx,.txt"; // .pdf not currently supported
  const [uploadedFileContents, setUploadedFileContents] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      setUploadedFileName(file.name);

      try {
        if (fileType === "application/pdf") {
          //
          // .pdf
          //
          // (curently not supported, am seeing a lot of resources saying I need to set up a webworker)

          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          let text = "";

          // Extracting text is not directly supported, however, assuming some JSON structure for text location might not help.
          // Text extraction would require parsing text run attributes, which is complex and often unsuccessful without workers or back-end support.

          // Sample code for iterating pages (text output would need a precise method):
          console.log(pdfDoc)
          for (let i = 0; i < pdfDoc.getPageCount(); i++) {
            const page = pdfDoc.getPage(i);
            console.log('page: ', page);
            // const content = page.getTextContent();
            // console.log('content: ', content);
            const { width, height } = page.getSize();
            text += `Page ${i + 1} (Size: ${width} x ${height})\n`; // Dummy text, actual text extraction is complex
          }

          setUploadedFileContents(text);

        } else if (
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

  function toggleScrollAndDimBackground(lock: boolean) {
  const body = document.body;
  const dimOverlayId = 'dim-overlay';

  if (lock) {
    // Lock scrolling
    body.style.overflow = 'hidden';

    // Create and append a dim overlay if it doesn't exist
    if (!document.getElementById(dimOverlayId)) {
      const dimOverlay = document.createElement('div');
      dimOverlay.id = dimOverlayId;
      dimOverlay.style.position = 'fixed';
      dimOverlay.style.top = '0';
      dimOverlay.style.left = '0';
      dimOverlay.style.width = '100%';
      dimOverlay.style.height = '100%';
      dimOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      dimOverlay.style.zIndex = '1000';
      body.appendChild(dimOverlay);
    }
  } else {
    // Unlock scrolling
    body.style.overflow = '';

    // Remove the dim overlay if it exists
    const dimOverlay = document.getElementById(dimOverlayId);
    if (dimOverlay) {
      body.removeChild(dimOverlay);
    }
  }
}

  //
  //
  // ui stuff
  //
  //

  const [subheadline, setSubheadline] = useState('Professional resume writing at your fingertips. Upload your resume and get started.');
  // const [topCtaButton, setTopCtaButton] = useState('Get Instant Access');
  const [buyButtonContent, setBuyButtonContent] = useState('Generate Resume');

  //
  //
  // MANAGING PAYMENT HISTORY/CACHE
  //
  //

  const current_time: any = new Date();
  let payment_date: any = false;
  let differenceInMinutes = 0;
  let differenceInMilliseconds = 0;

  // tracking if user has paid or not
  const paidQueryStringValue = 'xj3z01__022';
  let paidQueryString: string = ''; // pulled from query string parameter on successful payment redirect from stripe
  let payment_received: any = false;
  // const [hasPaid, setHasPaid] = useState(false);
  let hasPaid = false;

  useEffect(() => {
    const paidQueryString = searchParams.get('p') ?? '';
    if (paidQueryString === paidQueryStringValue) {
      // setHasPaid(true); // hasPaid = true;
      hasPaid = true;
      localStorage.setItem('pr_0012', 'true');
      // Optionally, you can clear the query parameter from the URL
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.delete('p');
      router.replace(`${pathname}?${nextSearchParams}`);
    }
  }, [searchParams, router]);

  useEffect(() => {
    const x = localStorage.getItem('pr_0012') === 'true';
    if (x) {
      hasPaid = true;
      // setHasPaid(true); // hasPaid = true;
    }
  }, []);

  // resume generator download management
  let number_of_downloads: any = 0;
  const max_download_count = 15;

  // form persistence
  let storedFormValues: any = {};

  // file upload
  let hasFileBeenSelectedByUser = false;
  let fileHasBeenUploadedAndParsed = false;
  type UploadedResumeDataType = { [key: string]: string; }; // Assuming all values are strings, adjust as necessary
  const [uploadedResumeDataConvertedToForm, setUploadedResumeDataConvertedToForm] = useState<UploadedResumeDataType>({});
  const [isGettingAiResponseForFileUploadProcess, setIsGettingAiResponseForFileUploadProcess] = useState(false);

  if (global?.window !== undefined) { // now it's safe to access window and localStorage

    //
    //
    popoverHasBeenShownToUser = localStorage.getItem('file_upload_popover_shown') === 'true'

    //
    // manage form persistence
    let sfv = localStorage.getItem('stored_form_values') ?? '';
    if (sfv && sfv.length) {
      storedFormValues = JSON.parse(sfv);
    }

    //
    // manage file upload form and prefilling inputs with response

    fileHasBeenUploadedAndParsed = localStorage.getItem('file_has_been_uploaded_and_parsed') === 'true';

    const convertUploadedFileToFormInputsUsingAiProcess = async () => {
      // console.log('convertUploadedFileToFormInputsUsingAiProcess()')
      try {
        const prefilledUserResData = await convertUploadedFileToFormInputsUsingAi(uploadedFileContents);
        if (prefilledUserResData && prefilledUserResData.data && prefilledUserResData.data.content) {
          const responseObject = JSON.parse(prefilledUserResData.data.content);
          // prepopulate form fields with response
          localStorage.setItem('stored_form_values', JSON.stringify(responseObject));
          storedFormValues = responseObject;
          setUploadedResumeDataConvertedToForm(responseObject); // jump to '!! update form values once file is uploaded !!'
          // set flag to track that we've processed the resume
          localStorage.setItem('file_has_been_uploaded_and_parsed', 'true');
          setIsGettingAiResponseForFileUploadProcess(false);
          console.log('form populated with rewritten resume and tracked');

          // scroll to submit button and show tooltip
          // setTimeout(() => {
          //   const element = document.getElementById("bottomSectionOfPage");
          //   if (element) {
          //     element?.scrollIntoView({ behavior: "smooth",  block: "end"});
          //   }
          //   setIsSubmitButtonTooltipOpen(true);
          //   setTimeout(() => {
          //     setIsSubmitButtonTooltipOpen(false);
          //   }, 6500); // Tooltip stays open for X seconds
          // }, 1200);
        } else {
          setIsGettingAiResponseForFileUploadProcess(false);
        }
      } catch (error) {
        console.log('Error processing resume: ', error);
        setIsGettingAiResponseForFileUploadProcess(false);
      }
    };

    hasFileBeenSelectedByUser = uploadedFileContents && uploadedFileContents.length > 0 ? true : false;
    // console.log({isGettingAiResponseForFileUploadProcess, hasFileBeenSelectedByUser, fileHasBeenUploadedAndParsed})

    if (
      !isGettingAiResponseForFileUploadProcess && hasFileBeenSelectedByUser && !fileHasBeenUploadedAndParsed) {
      setIsGettingAiResponseForFileUploadProcess(true);
      convertUploadedFileToFormInputsUsingAiProcess();
    } else {
      // console.log('skipping uploaded resume rewrite - file has already been processed or hasnt been uploaded yet');
    }

    //
    // Manage payment + download history so users can return to site
    payment_received = localStorage.getItem('pr_0012') === 'true';

    const x = localStorage.getItem('pr_0012') === 'true';
    if (x) {
      hasPaid = true;
      // setHasPaid(true); // hasPaid = true;
    }




    payment_date = localStorage.getItem('payment_date');

    //
    // Timestamps
    const timestamp1: any = new Date(current_time);
    const timestamp2: any = new Date(payment_date);

    differenceInMilliseconds = timestamp1 - timestamp2;
    differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    // console.log({hasPaid, timestamp1, timestamp2, payment_date, differenceInMinutes, number_of_downloads})

    number_of_downloads = Number(localStorage.getItem('x8u_000_vb_nod')); // 'number_of_downloads'


    let clearCache1 = hasPaid && (differenceInMinutes > 43200); // (30 days) // 360000); // 100 hours
    let clearCache2 = number_of_downloads > (max_download_count - 1);
    // console.log({clearCache1,clearCache2});

    if (clearCache1 || clearCache2) {
      // console.log('cache cleared');
      localStorage.removeItem('pr_0012'); // 'payment_received'
      localStorage.setItem('payment_date', '');
      localStorage.setItem('x8u_000_vb_nod', '0'); // 'number_of_downloads'
    }
  }


  //
  //
  // MANAGING FORM FIELDS
  //
  //

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema), // disable form validation
    // since I want people to go to Stripe prior to filling out the form, if they wish
    defaultValues: {
      job_post_description: storedFormValues.job_post_description ?? '',
      full_name: storedFormValues.full_name ?? '',
      email_address: storedFormValues.email_address ?? '',
      phone_number: storedFormValues.phone_number ?? '',
      personal_website: storedFormValues.personal_website ?? '',
      linkedin_profile: storedFormValues.linkedin_profile ?? '',
      //
      interests: storedFormValues.interests ?? '',
      //
      skills: storedFormValues.skills ?? '',
      //
      // job #1
      //
      job_1_employer: storedFormValues.job_1_employer ?? '',
      job_1_title: storedFormValues.job_1_title ?? '',
      job_1_start_month: storedFormValues.job_1_start_month ?? '',
      job_1_start_year: storedFormValues.job_1_start_year ?? '',
      job_1_end_month: storedFormValues.job_1_end_month ?? '',
      job_1_end_year: storedFormValues.job_1_end_year ?? '',
      job_1_summary: storedFormValues.job_1_summary ?? '',
      // job #2
      job_2_employer: storedFormValues.job_2_employer ?? '',
      job_2_title: storedFormValues.job_2_title ?? '',
      job_2_start_month: storedFormValues.job_2_start_month ?? '',
      job_2_start_year: storedFormValues.job_2_start_year ?? '',
      job_2_end_month: storedFormValues.job_2_end_month ?? '',
      job_2_end_year: storedFormValues.job_2_end_year ?? '',
      job_2_summary: storedFormValues.job_2_summary ?? '',
      // job #3
      job_3_employer: storedFormValues.job_3_employer ?? '',
      job_3_title: storedFormValues.job_3_title ?? '',
      job_3_start_month: storedFormValues.job_3_start_month ?? '',
      job_3_start_year: storedFormValues.job_3_start_year ?? '',
      job_3_end_month: storedFormValues.job_3_end_month ?? '',
      job_3_end_year: storedFormValues.job_3_end_year ?? '',
      job_3_summary: storedFormValues.job_3_summary ?? '',
      // job #4
      job_4_employer: storedFormValues.job_4_employer ?? '',
      job_4_title: storedFormValues.job_4_title ?? '',
      job_4_start_month: storedFormValues.job_4_start_month ?? '',
      job_4_start_year: storedFormValues.job_4_start_year ?? '',
      job_4_end_month: storedFormValues.job_4_end_month ?? '',
      job_4_end_year: storedFormValues.job_4_end_year ?? '',
      job_4_summary: storedFormValues.job_4_summary ?? '',
      // job #5
      job_5_employer: storedFormValues.job_5_employer ?? '',
      job_5_title: storedFormValues.job_5_title ?? '',
      job_5_start_month: storedFormValues.job_5_start_month ?? '',
      job_5_start_year: storedFormValues.job_5_start_year ?? '',
      job_5_end_month: storedFormValues.job_5_end_month ?? '',
      job_5_end_year: storedFormValues.job_5_end_year ?? '',
      job_5_summary: storedFormValues.job_5_summary ?? '',
      // job #6
      job_6_employer: storedFormValues.job_6_employer ?? '',
      job_6_title: storedFormValues.job_6_title ?? '',
      job_6_start_month: storedFormValues.job_6_start_month ?? '',
      job_6_start_year: storedFormValues.job_6_start_year ?? '',
      job_6_end_month: storedFormValues.job_6_end_month ?? '',
      job_6_end_year: storedFormValues.job_6_end_year ?? '',
      job_6_summary: storedFormValues.job_6_summary ?? '',
      //
      // education
      //
      college_name_1: storedFormValues.college_name_1 ?? '',
      college_degree_1: storedFormValues.college_degree_1 ?? '',
      college_field_of_study_1: storedFormValues.college_field_of_study_1 ?? '',
      college_notes_1: storedFormValues.college_notes_1 ?? '',
      college_start_year_1: storedFormValues.college_start_year_1 ?? '',
      college_end_year_1: storedFormValues.college_end_year_1 ?? '',

      college_name_2: storedFormValues.college_name_2 ?? '',
      college_degree_2: storedFormValues.college_degree_2 ?? '',
      college_field_of_study_2: storedFormValues.college_field_of_study_2 ?? '',
      college_notes_2: storedFormValues.college_notes_2 ?? '',
      college_start_year_2: storedFormValues.college_start_year_2 ?? '',
      college_end_year_2: storedFormValues.college_end_year_2 ?? '',

      college_name_3: storedFormValues.college_name_3 ?? '',
      college_degree_3: storedFormValues.college_degree_3 ?? '',
      college_field_of_study_3: storedFormValues.college_field_of_study_3 ?? '',
      college_notes_3: storedFormValues.college_notes_3 ?? '',
      college_start_year_3: storedFormValues.college_start_year_3 ?? '',
      college_end_year_3: storedFormValues.college_end_year_3 ?? '',
      //
      // civic service/extra
      //
      achievement_1_issuer: storedFormValues.achievement_1_issuer ?? '',
      achievement_1_name: storedFormValues.achievement_1_name ?? '',
      achievement_2_issuer: storedFormValues.achievement_2_issuer ?? '',
      achievement_2_name: storedFormValues.achievement_2_name ?? '',
      achievement_3_issuer: storedFormValues.achievement_3_issuer ?? '',
      achievement_3_name: storedFormValues.achievement_3_name ?? '',
      //
      // references
      //
      reference_1_info: storedFormValues.reference_1_info ?? '',
      reference_2_info: storedFormValues.reference_2_info ?? '',
      reference_3_info: storedFormValues.reference_3_info ?? '',
      reference_4_info: storedFormValues.reference_4_info ?? '',
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

    if (storedFormValues.job_1_employer) {
      if (
        storedFormValues.job_1_employer.length ||
        storedFormValues.job_1_title.length ||
        storedFormValues.job_1_start_month.length ||
        storedFormValues.job_1_start_year.length ||
        storedFormValues.job_1_end_month.length  ||
        storedFormValues.job_1_end_year.length ||
        storedFormValues.job_1_summary.length
      ) {
        setJob1Visibility(true);
      }
    }

    if (storedFormValues.job_2_employer) {
      if (
        storedFormValues.job_2_employer.length ||
        storedFormValues.job_2_title.length ||
        storedFormValues.job_2_start_month.length ||
        storedFormValues.job_2_start_year.length ||
        storedFormValues.job_2_end_month.length  ||
        storedFormValues.job_2_end_year.length ||
        storedFormValues.job_2_summary.length
      ) {
        setJob2Visibility(true);
      }
    }

    if (storedFormValues.job_3_employer) {
      if (
        storedFormValues.job_3_employer.length ||
        storedFormValues.job_3_title.length ||
        storedFormValues.job_3_start_month.length ||
        storedFormValues.job_3_start_year.length ||
        storedFormValues.job_3_end_month.length  ||
        storedFormValues.job_3_end_year.length ||
        storedFormValues.job_3_summary.length
      ) {
        setJob3Visibility(true);
      }
    }

    if (storedFormValues.job_4_employer) {
      if (
        storedFormValues.job_4_employer.length ||
        storedFormValues.job_4_title.length ||
        storedFormValues.job_4_start_month.length ||
        storedFormValues.job_4_start_year.length ||
        storedFormValues.job_4_end_month.length  ||
        storedFormValues.job_4_end_year.length ||
        storedFormValues.job_4_summary.length
      ) {
        setJob4Visibility(true);
      }
    }

    if (storedFormValues.job_5_employer) {
      if (
        storedFormValues.job_5_employer.length ||
        storedFormValues.job_5_title.length ||
        storedFormValues.job_5_start_month.length ||
        storedFormValues.job_5_start_year.length ||
        storedFormValues.job_5_end_month.length  ||
        storedFormValues.job_5_end_year.length ||
        storedFormValues.job_5_summary.length
      ) {
        setJob5Visibility(true);
      }
    }

    if (storedFormValues.job_6_employer) {
      if (
        storedFormValues.job_6_employer.length ||
        storedFormValues.job_6_title.length ||
        storedFormValues.job_6_start_month.length ||
        storedFormValues.job_6_start_year.length ||
        storedFormValues.job_6_end_month.length  ||
        storedFormValues.job_6_end_year.length ||
        storedFormValues.job_6_summary.length
      ) {
        setJob6Visibility(true);
      }
    }

    // education
    if (
      storedFormValues.college_name_1 ||
      storedFormValues.college_degree_1 ||
      storedFormValues.college_field_of_study_1 ||
      storedFormValues.college_notes_1 ||
      storedFormValues.college_start_year_1 ||
      storedFormValues.college_end_year_1
    ) {
      setEducation1Visibility(true);
    }

    if (
      storedFormValues.college_name_2 ||
      storedFormValues.college_degree_2 ||
      storedFormValues.college_field_of_study_2 ||
      storedFormValues.college_notes_2 ||
      storedFormValues.college_start_year_2 ||
      storedFormValues.college_end_year_2
    ) {
      setEducation2Visibility(true);
    }

    if (
      storedFormValues.college_name_3 ||
      storedFormValues.college_degree_3 ||
      storedFormValues.college_field_of_study_3 ||
      storedFormValues.college_notes_3 ||
      storedFormValues.college_start_year_3 ||
      storedFormValues.college_end_year_3
    ) {
      setEducation3Visibility(true);
    }

    // civic
    if (
      storedFormValues.achievement_1_issuer ||
      storedFormValues.achievement_1_name
    ) {
      setCivic1Visibility(true);
    }

    if (
      storedFormValues.achievement_2_issuer ||
      storedFormValues.achievement_2_name
    ) {
      setCivic2Visibility(true);
    }

    if (
      storedFormValues.achievement_3_name ||
      storedFormValues.achievement_3_issuer
    ) {
      setCivic3Visibility(true);
    }

    // references
    if (
      storedFormValues.reference_1_info ||
      storedFormValues.reference_2_info ||
      storedFormValues.reference_3_info ||
      storedFormValues.reference_4_info
    ) {
      setReferences1Visibility(true);
    }
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


  if (storedFormValues) {
    // console.log(' there are stored values', storedFormValues);
    // RAW DATA
    /*

        {
            "job_post_description": "test",
            "full_name": "sadas",
            "email_address": "sd",
            "phone_number": "sad",
            "personal_website": "asdas",
            "linkedin_profile": "sadasd",
            "interests": "sdasd",
            "skills": "sadas",
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
            "college_field_of_study_3": "",
            "college_degree_3": "",
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
        }
    */
  }


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
    // let new_download_count = number_of_downloads + 1;
    // localStorage.setItem('x8u_000_vb_nod', new_download_count); // 'number_of_downloads'
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

    const promptString = `Persona: you are a expert resume writer with with years of experience improving resumes.
Improve the verbiage, tone, and professionalism of the inputted content so it can be used in a resume. ${job_post_description_insert}

Rules:
1. The output should maintain the exact same object structure of the original 'resume_object', meaning only the key properties' values should be modified.
2. When necessary fix any typos, sentence structure issues, grammar problems, capitalize proper nouns, and expand acronyms.
3. If a section does not have content, you will usually leave it blank unless it makes sense to add detail.
4. For 'resume_object.experiences' data, elaborate so most of the experience summary instances are at least 2 sentances.
5. For 'resume_object.education' section, ensure school names are proper nonand clear.
6. For 'resume_object.achievements' section, elaborate when necessary to explain context of achievement.
7. For 'resume_object.references' section, elaborate when necessary to explain context of relationship.
8. Incorporate words such as 'managed', 'solved', 'planned', 'executed', 'demonstrated', 'succeeded', 'collaborated', 'implemented', 'strategized', 'lead', etc.
9. The outputted content should be a markedly improved version of the input.
10. The outputted result should only be a string-ified version of the 'resume_object'.
resume_object:
${stringifiedMappedFormValues}
    `;


    // console.log('res gen step: ', promptString);

    const fileName = `${(mappedFormValues.personal_info.name).replace(' ', '')}-Resume.docx`;

    // make API call
    try {
      const userMessage: ChatCompletionRequestMessage = { role: "user", content: promptString };
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
      let new_download_count = number_of_downloads + 1;
      localStorage.setItem('x8u_000_vb_nod', new_download_count); // 'number_of_downloads'
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

        toast.error("Something went wrong with the AI connection, but your resume was still generated.\n\nThis did not count against your remaining downloads: " +  number_of_downloads + "/" + max_download_count);
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


  //
  //


  //
  //

  // preselect checkboxes if they have content

    useEffect(() => {
      // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
      const timeoutId = setTimeout(() => {
        if (storedFormValues.job_1_employer) {
          if (
            storedFormValues.job_1_employer.length ||
            storedFormValues.job_1_title.length ||
            storedFormValues.job_1_start_month.length ||
            storedFormValues.job_1_start_year.length ||
            storedFormValues.job_1_end_month.length  ||
            storedFormValues.job_1_end_year.length ||
            storedFormValues.job_1_summary.length
          ) {
            setJob1Visibility(true);
          }
        }

        if (storedFormValues.job_2_employer) {
          if (
            storedFormValues.job_2_employer.length ||
            storedFormValues.job_2_title.length ||
            storedFormValues.job_2_start_month.length ||
            storedFormValues.job_2_start_year.length ||
            storedFormValues.job_2_end_month.length  ||
            storedFormValues.job_2_end_year.length ||
            storedFormValues.job_2_summary.length
          ) {
            setJob2Visibility(true);
          }
        }

        if (storedFormValues.job_3_employer) {
          if (
            storedFormValues.job_3_employer.length ||
            storedFormValues.job_3_title.length ||
            storedFormValues.job_3_start_month.length ||
            storedFormValues.job_3_start_year.length ||
            storedFormValues.job_3_end_month.length  ||
            storedFormValues.job_3_end_year.length ||
            storedFormValues.job_3_summary.length
          ) {
            setJob3Visibility(true);
          }
        }

        if (storedFormValues.job_4_employer) {
          if (
            storedFormValues.job_4_employer.length ||
            storedFormValues.job_4_title.length ||
            storedFormValues.job_4_start_month.length ||
            storedFormValues.job_4_start_year.length ||
            storedFormValues.job_4_end_month.length  ||
            storedFormValues.job_4_end_year.length ||
            storedFormValues.job_4_summary.length
          ) {
            setJob4Visibility(true);
          }
        }

        if (storedFormValues.job_5_employer) {
          if (
            storedFormValues.job_5_employer.length ||
            storedFormValues.job_5_title.length ||
            storedFormValues.job_5_start_month.length ||
            storedFormValues.job_5_start_year.length ||
            storedFormValues.job_5_end_month.length  ||
            storedFormValues.job_5_end_year.length ||
            storedFormValues.job_5_summary.length
          ) {
            setJob5Visibility(true);
          }
        }

        if (storedFormValues.job_6_employer) {
          if (
            storedFormValues.job_6_employer.length ||
            storedFormValues.job_6_title.length ||
            storedFormValues.job_6_start_month.length ||
            storedFormValues.job_6_start_year.length ||
            storedFormValues.job_6_end_month.length  ||
            storedFormValues.job_6_end_year.length ||
            storedFormValues.job_6_summary.length
          ) {
            setJob6Visibility(true);
          }
        }

        // education
        if (
          storedFormValues.college_name_1 ||
          storedFormValues.college_degree_1 ||
          storedFormValues.college_field_of_study_1 ||
          storedFormValues.college_notes_1 ||
          storedFormValues.college_start_year_1 ||
          storedFormValues.college_end_year_1
        ) {
          setEducation1Visibility(true);
        }

        if (
          storedFormValues.college_name_2 ||
          storedFormValues.college_degree_2 ||
          storedFormValues.college_field_of_study_2 ||
          storedFormValues.college_notes_2 ||
          storedFormValues.college_start_year_2 ||
          storedFormValues.college_end_year_2
        ) {
          setEducation2Visibility(true);
        }

        if (
          storedFormValues.college_name_3 ||
          storedFormValues.college_degree_3 ||
          storedFormValues.college_field_of_study_3 ||
          storedFormValues.college_notes_3 ||
          storedFormValues.college_start_year_3 ||
          storedFormValues.college_end_year_3
        ) {
          setEducation3Visibility(true);
        }

        // civic
        if (
          storedFormValues.achievement_1_issuer ||
          storedFormValues.achievement_1_name
        ) {
          setCivic1Visibility(true);
        }

        if (
          storedFormValues.achievement_2_issuer ||
          storedFormValues.achievement_2_name
        ) {
          setCivic2Visibility(true);
        }

        if (
          storedFormValues.achievement_3_name ||
          storedFormValues.achievement_3_issuer
        ) {
          setCivic3Visibility(true);
        }

        // references
        if (
          storedFormValues.reference_1_info ||
          storedFormValues.reference_2_info ||
          storedFormValues.reference_3_info ||
          storedFormValues.reference_4_info
        ) {
          setReferences1Visibility(true);
        }

        if (payment_received) {
          setBuyButtonContent(`Download Now (${number_of_downloads}/${max_download_count})`); // 'number_of_downloads'
          setSubheadline(`Thank you for your purchase. You have ${((43200-differenceInMinutes)/1440).toFixed(0)} days of access remaining.`);
        }

      }, 250);

      // Cleanup function to clear the timeout if the component unmounts
      return () => clearTimeout(timeoutId);
    }, []); // Empty dependency array ensures the effect runs only once


    useEffect(() => {
      const timeoutId = setTimeout(() => {
          const element = document.getElementById("bottomSectionOfPage");
          if (hasPaid) {
            element?.scrollIntoView({ behavior: "smooth",  block: "end"});
          }
      }, 650);
      // Cleanup function to clear the timeout if the component unmounts
      return () => clearTimeout(timeoutId);
    }, []); // Empty dependency array ensures the effect runs only once


  return (
    <div>
      <Heading
        title="AI-Powered Resume Generator"
        description={subheadline}
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />


{/*

     <Button
      style={{
          position: 'absolute',
          maxWidth: '232px',
          backgroundColor: topCTAButtonIsHovered ? 'rgba(255, 159, 64, 0.97)' : 'rgba(255, 140, 0, 0.97)',
          right: '0',
          top: '0',
          marginRight: '32px',
          marginTop: '32px',
          visibility: hasPaid ? 'hidden' : 'visible',
        }}
        className="col-span-6 w-full xs:hidden sm:hidden md:hidden lg:block"
        type="submit"
        size="icon"
        onClick={onClick}
        onMouseEnter={() => setTopCTAButtonIsHovered(true)}
        onMouseLeave={() => setTopCTAButtonIsHovered(false)}
      >
         {topCtaButton}
      </Button>

*/}

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg
                border
                w-full
                p-4
                px-3
                md:px-6
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
            >


            {/* Job Post description */}
            <FormField
              name="job_post_description"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
                <Tooltip
                  showArrow={true}
                  isOpen={isJobPostingTooltipOpen}
                  onOpenChange={(open) => setIsJobPostingTooltipOpen(open)}
                  delay={0}
                  closeDelay={0}
                  motionProps={{
                    variants: {
                      exit: {
                        opacity: 0,
                        transition: {
                          duration: 0.1,
                          ease: "easeIn",
                        }
                      },
                      enter: {
                        opacity: 1,
                        transition: {
                          duration: 0.15,
                          ease: "easeOut",
                        }
                      },
                    },
                  }}
                  color="primary"
                  content={"ResumAI uses this field to tailor your new resume to a specific role."}
                >
                  <FormControl className="m-0 p-2" >
                    {/* }<Input */}
                    <Textarea
                      className="border-0 outline-none  "
                      disabled={isLoading}
                      placeholder="Copy + paste job description"
                      {...field}
                    />
                  </FormControl>
                  </Tooltip>
                </FormItem>
              )}
            />




              {/* FILE UPLOAD   */}

              <FormItem
                className="col-span-6 lg:col-span-4"
                style={{
                  color: '#576574',
                  textAlign: 'left',
                }}
              >
                <FormControl className="m-0 p-2">
                  <>
                    <Popover
                      color="primary"
                      offset={12}
                      showArrow={true}
                      isOpen={isFileUploadPopoverOpen}
                      onOpenChange={(open) => setIsFileUploadPopoverOpen(open)}
                    >
                      <PopoverTrigger>
                        <label
                          style={{ fontWeight: "bold" }}
                          onMouseEnter={() => setIsFileUploadPopoverOpen(true)}
                          onMouseLeave={() => setIsFileUploadPopoverOpen(false)}
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
                            className="noWrap"
                            style={{
                              padding: "8px 16px",
                              borderRadius: "8px",
                              color: "#ffffff",
                              fontSize: "14px",
                              fontWeight: "500",
                              display: "inline-block",
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                              backgroundColor: fileHasBeenUploadedAndParsed ? 'grey' : fileUploadButtonIsHovered ? 'rgba(255, 159, 64, 0.97)' : 'rgba(255, 140, 0, 0.97)',
                            }}
                            onMouseEnter={() => setFileUploadButtonIsHovered(true)}
                            onMouseLeave={() => setFileUploadButtonIsHovered(false)}
                          >
                            Upload Current Resume
                          </label>
                          {uploadedFileName && (
                            <p style={{
                              color: "black !important",
                              fontSize: "12px",
                              fontWeight: "normal",
                              paddingLeft: "8px",
                              whiteSpace: "nowrap",
                            }}>{uploadedFileName}</p>
                          )}
                        </label>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="px-1 py-2">

                          <div className="text-xl font-bold">
                            {popoverHasBeenShownToUser ? (
                              <span>📝 Have any questions?</span>
                            ) : (
                              <span>{typedTitle}</span>
                            )}
                          </div>

                          {fileHasBeenUploadedAndParsed || popoverHasBeenShownToUser || typedBody ? (
                            <div className="text-small pt-2">
                              {fileHasBeenUploadedAndParsed
                                ? 'You have run out of free rewrites. Submit the form to get unlimited access for $9.99.'
                                : popoverHasBeenShownToUser
                                ? 'Upload your resume and watch the ResumAI assistant begin to work on your resume.'
                                : typedBody}
                            </div>
                          ) : null}

                          {fileHasBeenUploadedAndParsed || popoverHasBeenShownToUser || typedBody2 ? (
                            <div className="text-small pt-2">
                              {fileHasBeenUploadedAndParsed
                                ? "Don't have a resume yet? Manually enter as much (or as little) info as you like, and we'll take it from there!"
                                : popoverHasBeenShownToUser
                                ? "Don't have a resume yet? Manually enter as much (or as little) info as you like, and we'll take it from there!"
                                : typedBody2}
                            </div>
                          ) : null}

                          {popoverHasBeenShownToUser || typedBody3 ? (
                            <div className="text-tiny pt-2" style={{ fontSize: "13px" }}>
                              {popoverHasBeenShownToUser ? (
                                <span>
                                  * Supports <b>.docx</b> and <b>.txt</b> file types.
                                </span>
                              ) : (
                                <span>{typedBody3}</span>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </PopoverContent>
                    </Popover>
                    {isGettingAiResponseForFileUploadProcess && (
                      <div className="col-span-5 p-0 rounded-lg w-full flex items-left justify-center">
                        <SimplerLoader />
                      </div>
                    )}
                  </>
                </FormControl>
              </FormItem>






            <div className="showhideContainer" style={{
              display: "contents",
            }}>


             {/* PERSONAL INFO  */}

              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-2">
                  <label style={{ fontWeight: 'bold' }}>
                    Resume Header Section
                  </label>
                </FormControl>
              </FormItem>


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

              {/* Professional experience */}

              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-2">
                  <label style={{ fontWeight: 'bold' }}>
                    Employment History
                  </label>
                </FormControl>
              </FormItem>

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




              {/* EDUCATION */}

              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-2">
                  <label style={{ fontWeight: 'bold' }}>
                    Education
                  </label>
                </FormControl>
              </FormItem>

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

              {/* CIVIC INVOLVEMENT */}

              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-2">
                  <label style={{ fontWeight: 'bold' }}>
                    Achievements and Recognitions
                  </label>
                </FormControl>
              </FormItem>

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


              {/* REFERENCES DROPDOWN */}


              <FormItem className="col-span-12 lg:col-span-12">
                <FormControl className="m-0 p-2">
                  <label style={{ fontWeight: 'bold' }}>
                    Professional References
                  </label>
                </FormControl>
              </FormItem>

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


              {/*

                Generate / 'purchase' button (variant #1)

              */}
              <FormItem className="col-span-6 lg:col-span-6 rounded-lg ">
                <Tooltip
                  showArrow={true}
                  isOpen={isSubmitButtonTooltipOpen}
                  onOpenChange={(open) => setIsSubmitButtonTooltipOpen(open)}
                  delay={0}
                  closeDelay={0}
                  motionProps={{
                    variants: {
                      exit: {
                        marginBottom: "-8px",
                        opacity: 0,
                        transition: {
                          duration: 0.1,
                          ease: "easeIn",
                        }
                      },
                      enter: {
                        marginBottom: "-8px",
                        opacity: 1,
                        transition: {
                          duration: 0.15,
                          ease: "easeOut",
                        }
                      },
                    },
                  }}
                  color="primary"
                  content={"Finalizes resume content and generates new template"}
                >
                  <FormControl className="m-0 p-0">
                    <Button
                      className="w-full"
                      // className="col-span-12 lg:col-span-12 w-full"
                      type="submit"
                      disabled={isLoading}
                      style={{
                        float: 'left',
                        backgroundColor: formSubmitButtonIsHovered ? 'rgba(90, 84, 236, 0.97)' : 'rgba(111, 90, 246, 0.97)',
                        marginTop: '4px',
                        maxWidth: '192px',
                        whiteSpace: 'nowrap',
                       }}
                      size="icon"
                      id='submit'
                      onMouseEnter={() => setFormSubmitButtonIsHovered(true)}
                      onMouseLeave={() => setFormSubmitButtonIsHovered(false)}
                    >
                      Generate New Resume
                    {/*
                      <Image width={20} height={20} alt="Stripe logo" src="/stripe.png" />
                    */}
                    </Button>
                  </FormControl>
                </Tooltip>
              </FormItem>

              </div> {/* end showhideContainer */}

              {/*

                Generate / 'purchase' button (variant #2)

              */}


            </form>
          </Form>
        </div>
        <div className="space-y-4" id="bottomSectionOfPage">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {(messages.reverse()).map((message) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                {message.role !== "user" ? "Data output: " : "Prompt: "}
                <p className="text-sm">
                  {message.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeGeneratorPage;
