import * as z from "zod";

export const formSchema = z.object({
  full_name: z.string().min(1, {
    message: "Your first and last name is required."
  }),
  email_address: z.string().min(1, {
    message: "Your email address is required."
  }),
  phone_number: z.string().min(1, {
    message: "Your phone number is required."
  }),
  personal_website: z.string().optional(),
  // job #1
  job_1_employer: z.string().optional(),
  job_1_title: z.string().optional(),
  job_1_start_date: z.string().optional(),
  job_1_end_date: z.string().optional(),
  job_1_description: z.string().optional(),
  // job #2
  job_2_employer: z.string().optional(),
  job_2_title: z.string().optional(),
  job_2_start_date: z.string().optional(),
  job_2_end_date: z.string().optional(),
  job_2_description: z.string().optional(),
  // job #3
  job_3_employer: z.string().optional(),
  job_3_title: z.string().optional(),
  job_3_start_date: z.string().optional(),
  job_3_end_date: z.string().optional(),
  job_3_description: z.string().optional(),
  // job #4
  job_4_employer: z.string().optional(),
  job_4_title: z.string().optional(),
  job_4_start_date: z.string().optional(),
  job_4_end_date: z.string().optional(),
  job_4_description: z.string().optional(),
    // job #5
  job_5_employer: z.string().optional(),
  job_5_title: z.string().optional(),
  job_5_start_date: z.string().optional(),
  job_5_end_date: z.string().optional(),
  job_5_description: z.string().optional(),
    // job #6
  job_6_employer: z.string().optional(),
  job_6_title: z.string().optional(),
  job_6_start_date: z.string().optional(),
  job_6_end_date: z.string().optional(),
  job_6_description: z.string().optional(),
  // job #7
  job_7_employer: z.string().optional(),
  job_7_title: z.string().optional(),
  job_7_start_date: z.string().optional(),
  job_7_end_date: z.string().optional(),
  job_7_description: z.string().optional(),
    // job #8
  job_8_employer: z.string().optional(),
  job_8_title: z.string().optional(),
  job_8_start_date: z.string().optional(),
  job_8_end_date: z.string().optional(),
  job_8_description: z.string().optional(),
    // job #9
  job_9_employer: z.string().optional(),
  job_9_title: z.string().optional(),
  job_9_start_date: z.string().optional(),
  job_9_end_date: z.string().optional(),
  job_9_description: z.string().optional(),
  // job #10
  job_10_employer: z.string().optional(),
  job_10_title: z.string().optional(),
  job_10_start_date: z.string().optional(),
  job_10_end_date: z.string().optional(),
  job_10_description: z.string().optional(),
  // education
  college_name: z.string().optional(),
  college_degree: z.string().optional(),
  college_start_year: z.string().optional(),
  college_end_year: z.string().optional(),
  college_name_masters: z.string().optional(),
  college_degree_masters: z.string().optional(),
  college_start_year_masters: z.string().optional(),
  college_end_year_masters: z.string().optional(),
  college_name_phd: z.string().optional(),
  college_degree_phd: z.string().optional(),
  college_start_year_phd: z.string().optional(),
  college_end_year_phd: z.string().optional(),
  // civic service/extra - 1 
  civic_1_org: z.string().optional(),
  civic_1_description: z.string().optional(),
    // civic service/extra - 2
  civic_2_org: z.string().optional(),
  civic_2_description: z.string().optional(),
  //leftover 
  prompt: z.string().min(1, {
    message: "Prompt is required."
  }),
});
