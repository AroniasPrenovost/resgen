"use client";

import * as z from "zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter, usePathname, redirect, useSearchParams } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";

import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { Empty } from "@/components/ui/empty";
// import { useProModal } from "@/hooks/use-pro-modal";

import { formSchema } from "./constants";

import { Tooltip } from '@nextui-org/react';




// import { checkSubscription } from "@/lib/subscription";

// .docx generation
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { DocumentCreator } from "@/lib/resume-generator";
import { CoverLetterDocumentCreator } from "@/lib/cover-letter-generator";
import { experiences, education, skills, achievements } from "@/lib/cv-data"; // dummy data


import { headers } from 'next/headers'

const STRIPE_PAYMENT_LINK: string = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? 'https://stripe.com';

const ResumeGeneratorPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // const proModal = useProModal();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  //
  //
  // MANAGING PAYMENT HISTORY/CACHE
  //
  //

  const [subheadline, setSubheadline] = useState('Instant professional resume generation at your fingertips.');
  // const defaultPrice = '$9.99';
  // const salePrice = '$3.99';

  const [topCtaButton, setTopCtaButton] = useState('Get instant access for $3.99');
  const [buyButtonContent, setBuyButtonContent] = useState('Generate Resume');

  const current_time: any = new Date();
  let payment_date: any = false;
  let differenceInMinutes = 0;
  let differenceInMilliseconds = 0;

  const paidQueryStringValue = 'xj3z01__022';
  let paidQueryString: string = ''; // pulled from query string parameter on successful payment redirect from stripe
  let payment_received: any = false;
  let hasPaid = false;

  let number_of_downloads: any = 0;
  const max_download_count = 8;

  let storedFormValues: any = {};
  if (global?.window !== undefined) { // now it's safe to access window and localStorage

    //
    // manage form persistence
    let sfv = localStorage.getItem('stored_form_values') ?? '';
    if (sfv && sfv.length) {
      storedFormValues = JSON.parse(sfv);
    }

    //
    // Manage payment + download history so users can return to site

    payment_received = localStorage.getItem('pr_0012') === 'true';
    hasPaid = payment_received;

    paidQueryString = searchParams.get('p') ?? '';
    if (paidQueryString === paidQueryStringValue) {
      if (!payment_received) {
        localStorage.setItem('pr_0012', 'true');
        localStorage.setItem('payment_date', String(current_time));
      }
      // clear query string param from URL
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.delete('p');
      nextSearchParams.delete('user'); // subterfuge
      router.replace(`${pathname}?${nextSearchParams}`);
    }

    payment_date = localStorage.getItem('payment_date');

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
  //
  // self-explanatory
  //
  //

  function mapFormValuesToResumeObject(formValues: any) {
    let RESUME_OBJECT: any = {
      personal_info: {
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

    if (!hasPaid) {
      window.location.assign(STRIPE_PAYMENT_LINK);
      return;
    }


    console.log('user has paid');
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



    const stringifiedMappedFormValues = JSON.stringify(mappedFormValues);


    // add AI-generated content for empty form fields
    let fill_in_the_blank_phrase = fillInTheBlank // the form input
      ? 'Add realistic content to sections that are blank (within reason).'
      : 'If a secion does not exist, leave it blank.'
    ;


    const promptString = `Persona: you are a expert resume writer with with years of experience improving resumes.
Improve the verbiage, tone, and professionalism of the inputted content so it can be used in a resume.
Rules:
1. The output should maintain the exact same object structure of the original 'resume_object', meaning only the key properties' values should be modified.
2. When necessary, fix any typos, sentence structure issues, and grammar problems.
3. Capitalize proper nouns, and expand acronyms when necessary.
4. ${fill_in_the_blank_phrase}
5. For 'resume_object.experiences' data, elaborate so most of the experience summary instances are at least 2 sentances.
6. For 'resume_object.education' section, ensure school names are proper nonand clear.
7. For 'resume_object.achievements' section, elaborate when necessary to explain context of achievement.
8. For 'resume_object.references' section, elaborate when necessary to explain context of relationship.
9. Incorporate words such as 'managed', 'solved', 'planned', 'executed', 'demonstrated', 'succeeded', 'collaborated', 'implemented', 'strategized', 'lead', etc.
10. The outputted content should be a markedly improved version of the input.
11. The outputted result should only be a string-ified version of the 'resume_object'.
resume_object:
${stringifiedMappedFormValues}
    `;

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

  // 'Fill in the blank' checkbox
  const [fillInTheBlank, setFillInTheBlank] = useState<boolean>(false);


  //
  //

  // preselect checkboxes if they have content

    useEffect(() => {
      // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
      const timeoutId = setTimeout(() => {
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
          const element = document.getElementById("buyButton");
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



     {/*       <Tooltip
              color="secondary"
              content={"Don't worry, your inputs will still be here when you get back"}
            >*/}
               <Button
                style={{
                    position: 'absolute',
                    maxWidth: '264px',
                    backgroundColor: 'rgba(111, 90, 246, 0.97)',
                    // backgroundColor: 'orange',
                    right: '0',
                    // bottom: '0',
                    // marginBottom: '28px',
                    // marginRight: '118px',
                    top: '0',
                    marginRight: '32px',
                    marginTop: '32px',
                    visibility: hasPaid ? 'hidden' : 'visible',
                  }}
                  className="col-span-6 w-full xs: hidden sm:hidden md:hidden lg:block"
                  // className="col-span-12 lg:col-span-12 w-full"
                  type="submit"
                  // disabled={isLoading}
                  size="icon"
                  onClick={onClick}
                  >
                   {topCtaButton}
                </Button>
              {/*</Tooltip>*/}


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

              {/* PERSONAL INFO  */}

{/*              <FormField
                name="fill_in_the_blank_phrase"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-4 border-2 rounded-lg border-gray-300">
                    <FormControl className="m-0 p-2" >
                      <Input

                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Full name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />*/}


              {/* FILL IN THE BLANK   */}


              <FormItem
                  className="col-span-6 lg:col-span-6"
                  style={{
                    color: '#576574',
                    textAlign: 'left',
                    // padding: '-2px 12px',
                  }}
              >
              {/*<FormItem className="col-span-12 lg:col-span-10">*/}
                <FormControl className="m-0 p-2">
                  <Tooltip
                    color="primary"
                    content={"Checking this box tells our AI to generate content for sections left blank. For optimal results, it is suggested to provide at least the employer and job title."}
                  >
                    <label
                      style={{
                        color: '#576574',
                        verticalAlign: '-webkit-baseline-middle',
                        marginLeft: '6px',
                      }}
                      className="text-sm"
                    >
                      <input
                        name="checked" type="checkbox" checked={fillInTheBlank}
                        onChange={e => setFillInTheBlank(!fillInTheBlank)} />
                      &nbsp; Fill in the blank 🔥
                    </label>
                  </Tooltip>
                </FormControl>
              </FormItem>


             {/* PERSONAL INFO  */}

              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-2">
                  <label style={{ fontWeight: 'bold' }}>
                    Personal Information
                  </label>
                </FormControl>
              </FormItem>


              <FormField
                name="full_name"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-4 border-2 rounded-lg border-gray-300">
                    <FormControl className="m-0 p-2" >
                      <Input

                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Full name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="email_address"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-4 border-2 rounded-lg border-gray-300">
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
                  <FormItem className="col-span-12 lg:col-span-4 border-2 rounded-lg border-gray-300">
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
                  <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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
                name="personal_website"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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

              <FormField
                name="skills"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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
                  <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                          <Input
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
                      <FormItem className="col-span-3 lg:col-span-3  border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3  border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3  border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3  border-2 rounded-lg border-gray-300">
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
                          <Input
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                          <Input
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                          <Input
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                          <Input
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-3 lg:col-span-3 border-2 rounded-lg border-gray-300">
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
                          <Input
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
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-10 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-10 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-10 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-6 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-10 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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
                      <FormItem className="col-span-12 lg:col-span-12 border-2 rounded-lg border-gray-300">
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

                Download Button

              */}
       {/*    <Tooltip
              color="secondary"
              content={"Don't worry, your inputs will still be here when you get back"}
            >*/}
              <Button
                className="col-span-6 lg:col-span-6 w-full"
                // className="col-span-12 lg:col-span-12 w-full"
                type="submit"
                disabled={isLoading}
                style={{
                  float: 'left',
                  backgroundColor: 'rgba(111, 90, 246, 0.97)',
                  marginTop: '4px',
                 }}
                size="icon"
                id='submit'
                >
                {buyButtonContent}
              </Button>
                 {/*</Tooltip>*/}


            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4" id="buyButton">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            // <Empty label="AI-powered resume generation. Start your career journey today!" />
            <Empty label="NOTICE: We do not store any of your personal or financial data. All information is saved in your local browser session only." />
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
