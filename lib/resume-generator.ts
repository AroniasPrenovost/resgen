import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
  ExternalHyperlink,
  Table,
  TableRow,
  TableCell,
  VerticalAlign,
  TextDirection,
  Tab,
} from "docx";

type PersonalInfo = {
  name: string;
  phone_number: string;
  linkedin: string;
  email_address: string;
  personal_website: string;
  interests: string;
  // ... add other properties as needed
};

export class DocumentCreator {
  // tslint:disable-next-line: typedef
  public create([
    personal_info,
    experiences,
    educations,
    skills,
    achievements,
    references
  ]: [PersonalInfo, any[], any[], any[], any[], any[]]): Document {
    
    // console.log('create doc', { personal_info, other: [
    //   personal_info,
    //   experiences,
    //   educations,
    //   skills,
    //   achievements,
    //   references
    // ]});


    const document = new Document({
      creator: personal_info.name,
      title: `${personal_info.name}'s Resume`,
      description: `${personal_info.name}'s Professional Resume`,
      styles: {
        default: {
            title: {
                run: {
                  // font: 'Calibri',
                  font: 'Gill Sans',
                  size: 44,
                    // size: 28,
                    bold: true,
                    // italics: true,
                    color: "#3867d6",
                },
                paragraph: {
                    spacing: {
                        before: 0,
                        after: 0,
                    },
                },  
            },
            heading2: {
                run: {
                  font: 'Gill Sans',
                  size: 22,
                  // size: 28,
                  bold: true,
                  // italics: true,
                  color: "#3867d6",
                },
                paragraph: {
                    spacing: {
                        before: 120,
                        after: 40,
                    },
                },
            },
          },
        },
      sections: [
        {
          children: [  
            new Paragraph({
              text: (personal_info.name), // .toUpperCase(),
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.LEFT, 
              // alignment: AlignmentType.CENTER,   
              spacing: {
                 before: 0,
                after: 40, // SPACING 
              },
            }),


            /*



            new Paragraph({
              // tabStops: [
              //   {
              //     type: TabStopType.RIGHT,
              //     position: TabStopPosition.MAX
              //   }
              // ],
                       heading: HeadingLevel.TITLE,
              alignment: AlignmentType.LEFT,  
              children: [
                new TextRun({
               text: personal_info.name,
                  bold: true
                }),
                // new TextRun({
                //   text: `\t${dateText}`,
                //   bold: true
                // })
              ]
            })

            */

            ///////////////////////
            //
            //
            // SECTION: header contact info
            //
            //
            ///////////////////////

            this.createContactInfo(
              personal_info.phone_number,
              personal_info.linkedin,
              personal_info.email_address,
              personal_info.personal_website,
            ),


            ///////////////////////
            //
            //
            // SECTION: interests (not important)
            //
            //
            ///////////////////////


            this.createHeading("Interests"),
            this.createInterests(
              personal_info.interests
            ),




            ///////////////////////
            //
            //
            // SECTION: skills
            //
            //
            ///////////////////////

          
            this.createHeading("Technical Skills"),
            this.createSkillList(skills),




            ///////////////////////
            //
            //
            // SECTION: professional experience
            //
            //
            ///////////////////////



            this.createHeading("Professional Experience"),
            ...experiences
              .map((position: any) => {
                const arr: Paragraph[] = [];

                arr.push(
                  this.createInstitutionHeader(
                    position.company.name,
                    this.createPositionDateText(
                      position.startDate,
                      position.endDate,
                      position.isCurrent
                    ),
                    true // uppercase
                  )
                );
                arr.push(this.createRoleText(position.title));

                const bulletPoints = this.splitParagraphIntoBullets(
                  position.summary
                );

                if (position.summary.length) {
                  bulletPoints.forEach(bulletPoint => {
                    arr.push(this.createBullet(bulletPoint));
                  });
                }

                return arr;
              })
              .reduce((prev: any, curr: any) => prev.concat(curr), []),



            ///////////////////////
            //
            //
            // SECTION: education
            //
            //
            ///////////////////////

            this.createHeading("Education"),
            ...educations
              .map((education: any) => {
                const arr: Paragraph[] = [];
                arr.push(
                  this.createInstitutionHeader(
                    education.schoolName,
                    ` ${education.startDate.year} - ${education.endDate.year}`,
                    false,
                  )
                );
                arr.push(
                  this.createSchoolTitleText(
                    `${education.fieldOfStudy} - ${education.degree}`
                  )
                );

                const educationNotesLength = (education.notes).length;
                if (educationNotesLength > 0) {
                  const bulletPoints = this.splitParagraphIntoBullets(
                    education.notes
                  );
                  bulletPoints.forEach(bulletPoint => {
                    arr.push(this.createBullet(bulletPoint));
                  });
                }

                return arr;
              })
              .reduce((prev: any, curr: any) => prev.concat(curr), []),

            ///////////////////////
            //
            //
            // SECTION: achievements  and recognitions
            //
            //
            ///////////////////////


            this.createHeading("Achievements and Recognition"),
            // this.createSubHeading("Achievements"),
            ...this.createAchievementsList(achievements),



            ///////////////////////
            //
            //
            // SECTION: references
            //
            //
            ///////////////////////

            this.createHeading("References"),
            ...references
              .map((reference: any) => {
                const arr: Paragraph[] = [];
                arr.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: reference.info,
                        size: 22,
                        font: 'Calibri',
                      }),
                    ]
                  })
                );
                return arr;
              })
              .reduce((prev: any, curr: any) => prev.concat(curr), []),
            // new Paragraph(
            //   "Dr. Dean Mohamedally Director of Postgraduate Studies Department of Computer Science, University College London Malet Place, Bloomsbury, London WC1E d.mohamedally@ucl.ac.uk"
            // ),
            // new Paragraph("More references available upon request"),

            // new Paragraph({
            //   text:
            //     "This CV was generated in real-time based on my Linked-In profile from my personal website www.dolan.bio.",
            //   alignment: AlignmentType.CENTER
            // })





            // test
            //
            //
 
  
 



           //
           //
           // test




          ]
        }
      ]
    });

    return document;
  }

  /////////////////////
  //
  //
  // header code
  //
  //
  /////////////////////

  public createContactInfo(
    phoneNumber: string,
    profileUrl: string,
    email: string,
    personalWebsite: string,
  ): Paragraph {

    let emailLink: any;
    if (email.length) {
      emailLink = new ExternalHyperlink({
        children: [
              new TextRun({
                  text: email,
                  style: "Hyperlink",
                  size: 22,
                  font: 'Calibri',
              }),
        ],
        link: `mailto:${email}`,
      });
    }

    let linkedinLink: any;
    if (profileUrl.length) {
      linkedinLink = new ExternalHyperlink({
        children: [
              new TextRun({
                  text: profileUrl,
                  style: "Hyperlink",
                  size: 22,
                  font: 'Calibri',
              }),
        ],
        link: profileUrl,
      });
    }

    let personalWebsiteLink:any;
    if (personalWebsite.length) {
      personalWebsiteLink = new ExternalHyperlink({
        children: [
              new TextRun({
                  text: personalWebsite,
                  style: "Hyperlink",
                  size: 22,
                  font: 'Calibri',
              }),
        ],
        link: personalWebsite,
      });
    }
      

    return new Paragraph({
      alignment: AlignmentType.LEFT,
       // alignment: AlignmentType.CENTER,
       thematicBreak: true,
      children: [
         new TextRun({
             text: phoneNumber,
             size: 22,
             font: 'Calibri',
         }),
        new TextRun(
          (phoneNumber.length ? ' • ': '')
        ),
        emailLink,
        new TextRun(
          ((phoneNumber.length || emailLink.length) ? ' • ': '')
        ),
        linkedinLink,
        new TextRun(
          ((phoneNumber.length || emailLink.length || linkedinLink.length) ? ' • ': '')
        ),
        personalWebsiteLink,
      ],
    });
  }

  public createHeading(text: string): Paragraph {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_2,
      // alignment: AlignmentType.CENTER,
      alignment: AlignmentType.LEFT,  
      thematicBreak: true,
       spacing: {
        before: 60,
        after: 0, // SPACING 
      },
    });
  }

  public createSubHeading(text: string): Paragraph {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_2,
    });
  }

  public createInstitutionHeader(
    institutionName: string,
    dateText: string,
    isUppercase: boolean,
  ): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: isUppercase ? institutionName.toUpperCase() : institutionName,
          bold: true,
          size: 22,
          font: 'Calibri',
        }),
        new TextRun({
          text: "\t",
        }),
        new TextRun({
          children: [
            new Tab(), // this is how you right-align the text :/ 
            dateText,
          ],
          bold: true,
          size: 22,
          font: 'Calibri',
        })
      ],
      // thematicBreak: true,
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: TabStopPosition.MAX
        }
      ],
    });
  }

  public createRoleText(roleText: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
            text: roleText,
            italics: true,
            size: 22,
            font: 'Calibri',
            bold: true,
          })
      ]
    });
  }

    public createSchoolTitleText(roleText: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
            text: roleText,
            italics: true,
            size: 22,
            font: 'Calibri',
          })
      ]
    });
  }

  public createBullet(text: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          size: 22,
          font: 'Calibri',
        })
      ],
      bullet: {
        level: 0
      }
    });
  }

  // tslint:disable-next-line:no-any
  public createSkillList(skills: any[]): Paragraph {
    return new Paragraph({
      // alignment: AlignmentType.CENTER,
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: (skills.map(skill => skill.name).join(", ") + "."),
          size: 22,
          font: 'Calibri',
        })
      ]
    });
  }

  // tslint:disable-next-line:no-any
  public createAchievementsList(achievements: any[]): Paragraph[] {

    return achievements.map(
      achievement =>


      new Paragraph({
        children: [
          new TextRun({
            text: achievement.issuer,
            bold: true,
            size: 22,
            font: 'Calibri',
          }),
          new TextRun(
            ((achievement.issuer).length ? ' - ': '')
          ),
          new TextRun({
            text: achievement.name,
            size: 22,
            font: 'Calibri',
            // bold: true
          })
         ],
        // text: (achievement.issuer + ' - ' + achievement.name),
        // bold: true,
        bullet: {
          level: 0
        }
      })
    );
  }

  public createInterests(interests: string): Paragraph {
    return new Paragraph({
      // alignment: AlignmentType.CENTER,
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: interests,
          size: 22,
          font: 'Calibri',
        }),
      ],
    });
  }

  public splitParagraphIntoBullets(text: string): string[] {
    return text.split("\n\n");
  }

  // tslint:disable-next-line:no-any
  public createPositionDateText(
    startDate: any,
    endDate: any,
    isCurrent: boolean
  ): string {
    const startDateText =
      this.getMonthFromInt(startDate.month) + ". " + startDate.year;
    const endDateText = isCurrent
      ? "Present"
      : `${this.getMonthFromInt(endDate.month)}. ${endDate.year}`;

    return `${startDateText} - ${endDateText}`;
  }

  public getMonthFromInt(value: number): string {
    // console.log('typeof value ===  ', typeof value);
    // value = parseInt(value);
    const val = parseInt(String(value));
    // console.log('value = ', typeof val);
    switch (val) {
      case 1:
        return "Jan";
      case 2:
        return "Feb";
      case 3:
        return "Mar";
      case 4:
        return "Apr";
      case 5:
        return "May";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Aug";
      case 9:
        return "Sept";
      case 10:
        return "Oct";
      case 11:
        return "Nov";
      case 12:
        return "Dec";
      default:
        return "N/A";
    }
  }
}

