import * as z from "zod";

export const formSchema = z.object({
  job_post_description: z.string().optional(),
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
  linkedin_profile: z.string().optional(),
  //
  interests: z.string().optional(),
  //
  skills: z.string().optional(),
  // job #1
  job_1_employer: z.string().optional(),
  job_1_title: z.string().optional(),
  job_1_start_month: z.string().optional(),
  job_1_start_year: z.string().optional(),
  job_1_end_month: z.string().optional(),
  job_1_end_year: z.string().optional(),
  job_1_summary: z.string().optional(),
  // job #2
  job_2_employer: z.string().optional(),
  job_2_title: z.string().optional(),
  job_2_start_month: z.string().optional(),
  job_2_start_year: z.string().optional(),
  job_2_end_month: z.string().optional(),
  job_2_end_year: z.string().optional(),
  job_2_summary: z.string().optional(),
  // job #3
  job_3_employer: z.string().optional(),
  job_3_title: z.string().optional(),
  job_3_start_month: z.string().optional(),
  job_3_start_year: z.string().optional(),
  job_3_end_month: z.string().optional(),
  job_3_end_year: z.string().optional(),
  job_3_summary: z.string().optional(),
  // job #4
  job_4_employer: z.string().optional(),
  job_4_title: z.string().optional(),
  job_4_start_month: z.string().optional(),
  job_4_start_year: z.string().optional(),
  job_4_end_month: z.string().optional(),
  job_4_end_year: z.string().optional(),
  job_4_summary: z.string().optional(),
  // job #5
  job_5_employer: z.string().optional(),
  job_5_title: z.string().optional(),
  job_5_start_month: z.string().optional(),
  job_5_start_year: z.string().optional(),
  job_5_end_month: z.string().optional(),
  job_5_end_year: z.string().optional(),
  job_5_summary: z.string().optional(),
  // job #6
  job_6_employer: z.string().optional(),
  job_6_title: z.string().optional(),
  job_6_start_month: z.string().optional(),
  job_6_start_year: z.string().optional(),
  job_6_end_month: z.string().optional(),
  job_6_end_year: z.string().optional(),
  job_6_summary: z.string().optional(),
  // job #7
  // job_7_employer: z.string().optional(),
  // job_7_title: z.string().optional(),
  // job_7_start_month: z.string().optional(),
  // job_7_start_year: z.string().optional(),
  // job_7_end_month: z.string().optional(),
  // job_7_end_year: z.string().optional(),
  // job_7_summary: z.string().optional(),
  // job #8
  // job_8_employer: z.string().optional(),
  // job_8_title: z.string().optional(),
  // job_8_start_month: z.string().optional(),
  // job_8_start_year: z.string().optional(),
  // job_8_end_month: z.string().optional(),
  // job_8_end_year: z.string().optional(),
  // job_8_summary: z.string().optional(),
  // job #9
  // job_9_employer: z.string().optional(),
  // job_9_title: z.string().optional(),
  // job_9_start_month: z.string().optional(),
  // job_9_start_year: z.string().optional(),
  // job_9_end_month: z.string().optional(),
  // job_9_end_year: z.string().optional(),
  // job_9_summary: z.string().optional(),
  // job #10
  // job_10_employer: z.string().optional(),
  // job_10_title: z.string().optional(),
  // job_10_start_month: z.string().optional(),
  // job_10_start_year: z.string().optional(),
  // job_10_end_month: z.string().optional(),
  // job_10_end_year: z.string().optional(),
  // job_10_summary: z.string().optional(),
  // education
  college_name_1: z.string().optional(),
  college_degree_1: z.string().optional(),
  college_field_of_study_1: z.string().optional(),
  college_notes_1: z.string().optional(),
  college_start_year_1: z.string().optional(),
  college_end_year_1: z.string().optional(),

  college_name_2: z.string().optional(),
  college_degree_2: z.string().optional(),
  college_field_of_study_2: z.string().optional(),
  college_notes_2: z.string().optional(),
  college_start_year_2: z.string().optional(),
  college_end_year_2: z.string().optional(),

  college_name_3: z.string().optional(),
  college_field_of_study_3: z.string().optional(),
  college_degree_3: z.string().optional(),
  college_notes_3: z.string().optional(),
  college_start_year_3: z.string().optional(),
  college_end_year_3: z.string().optional(),

  // civic service/extra - 1
  achievement_1_issuer: z.string().optional(),
  achievement_1_name: z.string().optional(),
  // civic service/extra - 2
  achievement_2_issuer: z.string().optional(),
  achievement_2_name: z.string().optional(),
  // civic service/extra - 2
  achievement_3_issuer: z.string().optional(),
  achievement_3_name: z.string().optional(),
  //
  //
  reference_1_info: z.string().optional(),
  reference_2_info: z.string().optional(),
  reference_3_info: z.string().optional(),
  reference_4_info: z.string().optional(),
});
