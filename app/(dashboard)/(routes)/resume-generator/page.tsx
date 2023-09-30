"use client";

import * as z from "zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
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
import { useProModal } from "@/hooks/use-pro-modal";

import { formSchema } from "./constants";

// PDF and .docx generation
import { jsPDF,HTMLOptionImage } from "jspdf";
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { DocumentCreator } from "@/lib/cv-generator";
import { experiences, education, skills, achievements } from "@/lib/cv-data"; // dummy data

const ResumeGeneratorPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email_address: "",
      phone_number: "",
      personal_website: "",
         // job #1
      job_1_employer: "",
      job_1_title: "",
      job_1_start_date: "",
      job_1_end_date: "",
      job_1_description: "",
      // job #2
      job_2_employer: "",
      job_2_title: "",
      job_2_start_date: "",
      job_2_end_date: "",
      job_2_description: "",
      // job #3
      job_3_employer: "",
      job_3_title: "",
      job_3_start_date: "",
      job_3_end_date: "",
      job_3_description: "",
      // job #4
      job_4_employer: "",
      job_4_title: "",
      job_4_start_date: "",
      job_4_end_date: "",
      job_4_description: "",
        // job #5
      job_5_employer: "",
      job_5_title: "",
      job_5_start_date: "",
      job_5_end_date: "",
      job_5_description: "",
        // job #6
      job_6_employer: "",
      job_6_title: "",
      job_6_start_date: "",
      job_6_end_date: "",
      job_6_description: "",
      // job #7
      job_7_employer: "",
      job_7_title: "",
      job_7_start_date: "",
      job_7_end_date: "",
      job_7_description: "",
        // job #8
      job_8_employer: "",
      job_8_title: "",
      job_8_start_date: "",
      job_8_end_date: "",
      job_8_description: "",
        // job #9
      job_9_employer: "",
      job_9_title: "",
      job_9_start_date: "",
      job_9_end_date: "",
      job_9_description: "",
      // job #10
      job_10_employer: "",
      job_10_title: "",
      job_10_start_date: "",
      job_10_end_date: "",
      job_10_description: "",
      // education
      college_name: "",
      college_degree: "",
      college_start_year: "",
      college_end_year: "",
      college_name_masters: "",
      college_degree_masters: "",
      college_start_year_masters: "",
      college_end_year_masters: "",
      college_name_phd: "",
      college_degree_phd: "",
      college_start_year_phd: "",
      college_end_year_phd: "",
      // civic service/extra - 1 
      civic_1_org: "",
      civic_1_description: "",
        // civic service/extra - 2
      civic_2_org: "",
      civic_2_description: "",
      // leftover
      prompt: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    // somehow morpth eveything into the API call? 
    const PROMPT = `Persona: You are an expert resume writer. 

Take the structured data object input and create a valid resume with the information following this format:

Rules: 
1. Take a deep breath
2. Expand and rewrite experience when appropriate

Input: 


    `;



    try {
      const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
      const newMessages = [...messages, userMessage];

      const response = await axios.post('/api/conversation', { messages: newMessages });
      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  }

  function generateDocx(): void {
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create([
      experiences,
      education,
      skills,
      achievements
    ]);

    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, "resume.docx");
      console.log("Document created successfully");
    });
  }

  function generatePDF(){
    var doc = new jsPDF();
    doc.setFontSize(14);  
    doc.text(['test', 'test'], 20, 10);
    //doc.text(35, 25, "Paranyan loves jsPDF");
    //doc.addImage(imgData, 'JPEG', 15, 40, 180, 160);
    doc.save('resume.pdf');
  }



  // TOGGLE FORM FIELD VISIBILITY

  // EDUCATION - College section
  const [educationCollegeVisibility, setEducationCollegeVisibility] = useState<boolean>(false);
  // EDUCATION - Masters section
  const [educationMastersVisibility, setEducationMastersVisibility] = useState<boolean>(false);
    // EDUCATION - PhD section
  const [educationPhDVisibility, setEducationPhDVisibility] = useState<boolean>(false);

  return (
    <div>
      <Heading
        title="Resume generator"
        description="Generate a professional resume designed to pass automated systems and get you in front of the hiring manager."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />

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


              <FormField
                name="full_name"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Your first and last name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              /> 
 
              <FormField
                name="email_address"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
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
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
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
                name="personal_website"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
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

              {/*JOBS*/}

              <FormField
                name="job_1_employer"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Job 1 employer"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />


              <FormField
                name="job_1_title"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Job 1 title"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

             <FormField
                name="job_1_start_date"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Job 1 start date"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />


              <FormField
                name="job_1_end_date"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Job 1 end date"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />


              <FormField
                name="job_1_description"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Job 1 description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* EDUCATION */}

              <input name="checked" type="checkbox" checked={educationCollegeVisibility} 
              onChange={e => setEducationCollegeVisibility(!educationCollegeVisibility)} />

              {educationCollegeVisibility ? 
                <>

                <FormField
                  name="college_name"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
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
                  name="college_degree"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none  "
                          disabled={isLoading}
                          placeholder="College degree"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="college_start_year"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none  "
                          disabled={isLoading}
                          placeholder="College start year"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="college_end_year"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
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

              </>

              : ''}


              {/*EDUCATION - MASTERS */}

              <input name="checked" type="checkbox" checked={educationMastersVisibility} 
              onChange={e => setEducationMastersVisibility(!educationMastersVisibility)} />


              {educationMastersVisibility ? 
                <>
                     <FormField
                        name="college_name_masters"
                        render={({ field }) => (
                          <FormItem className="col-span-12 lg:col-span-10">
                            <FormControl className="m-0 p-0">
                              <Input
                                className="border-0 outline-none  "
                                disabled={isLoading}
                                placeholder="College name for Masters degree"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="college_degree_masters"
                        render={({ field }) => (
                          <FormItem className="col-span-12 lg:col-span-10">
                            <FormControl className="m-0 p-0">
                              <Input
                                className="border-0 outline-none  "
                                disabled={isLoading}
                                placeholder="College degree Masters"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="college_start_year_masters"
                        render={({ field }) => (
                          <FormItem className="col-span-12 lg:col-span-10">
                            <FormControl className="m-0 p-0">
                              <Input
                                className="border-0 outline-none  "
                                disabled={isLoading}
                                placeholder="College start year Masters degree"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="college_end_year_masters"
                        render={({ field }) => (
                          <FormItem className="col-span-12 lg:col-span-10">
                            <FormControl className="m-0 p-0">
                              <Input
                                className="border-0 outline-none  "
                                disabled={isLoading}
                                placeholder="Graduating year Masters degree"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />



                  </>



              : ''}


              {/*EDUCATION - PHD */}


               <input name="checked" type="checkbox" checked={educationPhDVisibility} 
              onChange={e => setEducationPhDVisibility(!educationPhDVisibility)} />


              {educationPhDVisibility ? 
                <>

                   <FormField
                    name="college_name_phd"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-10">
                        <FormControl className="m-0 p-0">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="College name for PhD"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_degree_phd"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-10">
                        <FormControl className="m-0 p-0">
                          <Input
                            className="border-0 outline-none"
                            disabled={isLoading}
                            placeholder="PhD"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_start_year_phd"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-10">
                        <FormControl className="m-0 p-0">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="College start year PhD"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="college_end_year_phd"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-10">
                        <FormControl className="m-0 p-0">
                          <Input
                            className="border-0 outline-none  "
                            disabled={isLoading}
                            placeholder="Graduating year PhD"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

              </>

              : ''}


              {/* CIVIc */}

               <FormField
                name="civic_1_org"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Civic involvement organization 1"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
 

              <FormField
                name="civic_1_description"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Describe your involvement"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

                             <FormField
                name="civic_2_org"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Civic involvement organization 2"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
 

              <FormField
                name="civic_2_description"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none  "
                        disabled={isLoading}
                        placeholder="Describe your involvement"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />






              {/*separator*/}

              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Teach me about generative AI"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />


              <Button 
                style={{backgroundColor: "orange"}} 
                className="col-span-12 lg:col-span-2 w-full" 
                type="submit" 
                disabled={isLoading} 
                size="icon">
                Write my resume
              </Button>
             
              <Button 
                  onClick={generateDocx} 
                  className="col-span-12 lg:col-span-2 w-full" 
                  // type="submit" 
                  disabled={isLoading} 
                  size="icon"
                >
                 Generate docx
                </Button>

                <Button 
                  onClick={generatePDF} 
                  className="col-span-12 lg:col-span-2 w-full" 
                  // type="submit" 
                  disabled={isLoading} 
                  size="icon"
                >
                  Generate PDF
                </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
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

