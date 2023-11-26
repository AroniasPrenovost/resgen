import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun
} from "docx";

export class CoverLetterDocumentCreator {
  // tslint:disable-next-line: typedef
  public create([personal_info, experiences, educations, skills, achivements, references]): Document {

    // console.log('create doc', { personal_info });
    const document = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: personal_info.name,
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER, // still trying to decide if should be centered or left-aligned
            }),
            this.createContactInfo(
              personal_info.phone_number,
              personal_info.linkedin,
              personal_info.email_address,
              personal_info.personal_website,
            ),
            // this.createHeading("Skills"),
            // this.createSkillList(skills),
            // this.createHeading("Professional Experience"),
            // ...experiences
            //   .map((position: any) => {
            //     const arr: Paragraph[] = [];

            //     arr.push(
            //       this.createInstitutionHeader(
            //         position.company.name,
            //         this.createPositionDateText(
            //           position.startDate,
            //           position.endDate,
            //           position.isCurrent
            //         )
            //       )
            //     );
            //     arr.push(this.createRoleText(position.title));

            //     const bulletPoints = this.splitParagraphIntoBullets(
            //       position.summary
            //     );

            //     bulletPoints.forEach(bulletPoint => {
            //       arr.push(this.createBullet(bulletPoint));
            //     });

            //     return arr;
            //   })
            //   .reduce((prev: any, curr: any) => prev.concat(curr), []),
            // this.createHeading("Achievements and Recognition"),
            // this.createSubHeading("Achievements"),
            // ...this.createAchivementsList(achivements),


            // ...educations
            //   .map((education: any) => {


            // this.createSubHeading("Interests"),
            this.createInterests(
              "Body content of CV"
            ),
          ]
        }
      ]
    });

    return document;
  }

  public createContactInfo(
    phoneNumber: string,
    profileUrl: string,
    email: string,
    personalWebsite: string,
  ): Paragraph {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun(
          `Phone: ${phoneNumber} | LinkedIn: ${profileUrl} | Email: ${email}`
        ),
        new TextRun({
          text: `${personalWebsite.length ? ('Website: ' + personalWebsite) : ''}`,
          break: 1
        })
      ]
    });
  }

  public createHeading(text: string): Paragraph {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_1,
      thematicBreak: true
    });
  }

  public createSubHeading(text: string): Paragraph {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_2
    });
  }

  public createInstitutionHeader(
    institutionName: string,
    dateText: string
  ): Paragraph {
    return new Paragraph({
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: TabStopPosition.MAX
        }
      ],
      children: [
        new TextRun({
          text: institutionName,
          bold: true
        }),
        new TextRun({
          text: `\t${dateText}`,
          bold: true
        })
      ]
    });
  }

  public createRoleText(roleText: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: roleText,
          italics: true
        })
      ]
    });
  }

  public createBullet(text: string): Paragraph {
    return new Paragraph({
      text: text,
      bullet: {
        level: 0
      }
    });
  }

  // tslint:disable-next-line:no-any
  public createSkillList(skills: any[]): Paragraph {
    return new Paragraph({
      children: [new TextRun(skills.map(skill => skill.name).join(", ") + ".")]
    });
  }

  // tslint:disable-next-line:no-any
  public createAchivementsList(achivements: any[]): Paragraph[] {
    return achivements.map(
      achievement =>
        new Paragraph({
          text: (achievement.issuer + ' - ' + achievement.name),
          bullet: {
            level: 0
          }
        })
    );
  }

  public createInterests(interests: string): Paragraph {
    return new Paragraph({
      children: [new TextRun(interests)]
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
    const val = parseInt(value);
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
