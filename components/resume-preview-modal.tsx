"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: {
    personal_info: {
      name: string;
      phone_number: string;
      email_address: string;
      linkedin: string;
      personal_website: string;
      interests: string;
    };
    experiences: any[];
    education: any[];
    skills: any[];
    achievements: any[];
    references: any[];
  } | null;
  onDownloadPaid: () => void;
}

export function ResumePreviewModal({
  isOpen,
  onClose,
  resumeData,
  onDownloadPaid,
}: ResumePreviewModalProps) {
  if (!resumeData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Resume Preview */}
          <div
            className="resume-preview bg-white p-12 shadow-lg"
            style={{
              fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
              maxWidth: '8.5in',
              minHeight: '11in',
              margin: '0 auto',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Header: Name */}
            <h1
              style={{
                fontSize: '30px',
                fontWeight: '700',
                color: '#1e40af',
                marginBottom: '10px',
                lineHeight: '1.2',
              }}
            >
              {resumeData.personal_info?.name || ''}
            </h1>

            {/* Contact Info */}
            <div className="contact-info" style={{ fontSize: '12px', marginBottom: '4px', color: '#374151', paddingBottom: '10px', borderBottom: '1px solid #d1d5db' }}>
              {resumeData.personal_info?.phone_number && (
                <>
                  {resumeData.personal_info.phone_number}
                  {' • '}
                </>
              )}
              {resumeData.personal_info?.email_address && (
                <>
                  <a
                    href={`mailto:${resumeData.personal_info.email_address}`}
                    style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '500' }}
                  >
                    {resumeData.personal_info.email_address}
                  </a>
                  {' • '}
                </>
              )}
              {resumeData.personal_info?.linkedin && (
                <>
                  {resumeData.personal_info.linkedin}
                  {resumeData.personal_info?.personal_website ? ' • ' : ''}
                </>
              )}
              {resumeData.personal_info?.personal_website && (
                <a
                  href={resumeData.personal_info.personal_website.startsWith('http')
                    ? resumeData.personal_info.personal_website
                    : `https://${resumeData.personal_info.personal_website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '500' }}
                >
                  {resumeData.personal_info.personal_website}
                </a>
              )}
            </div>

            {/* Interests Section */}
            {resumeData.personal_info?.interests && (
              <>
                <h2 className="section-heading">Interests</h2>
                <p style={{ marginBottom: '12px', lineHeight: '1.5', fontSize: '13px' }}>
                  {resumeData.personal_info.interests}
                </p>
              </>
            )}

            {/* Skills Section */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <>
                <h2 className="section-heading">Technical Skills</h2>
                <p style={{ marginBottom: '12px', lineHeight: '1.5', fontSize: '13px' }}>
                  {resumeData.skills
                    .map((skill: any) =>
                      typeof skill === 'string' ? skill : skill?.name || skill?.skill || ''
                    )
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </>
            )}

            {/* Professional Experience */}
            {resumeData.experiences && resumeData.experiences.length > 0 && (
              <>
                <h2 className="section-heading">Professional Experience</h2>
                {resumeData.experiences.map((exp: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', color: '#111827' }}>
                        {exp.company?.name || exp.company}
                      </div>
                      <div style={{ fontSize: '11px', textAlign: 'right', whiteSpace: 'nowrap', fontWeight: '600', color: '#4b5563' }}>
                        {(() => {
                          let start = '';
                          let end = '';

                          // Format start date
                          if (typeof exp.startDate === 'object' && exp.startDate) {
                            if (exp.startDate.month && exp.startDate.year) {
                              start = `${exp.startDate.month} ${exp.startDate.year}`;
                            } else if (exp.startDate.year) {
                              start = String(exp.startDate.year);
                            }
                          } else if (exp.startDate) {
                            start = String(exp.startDate);
                          }

                          // Format end date
                          if (exp.isCurrent) {
                            end = 'Present';
                          } else if (typeof exp.endDate === 'object' && exp.endDate) {
                            if (exp.endDate.month && exp.endDate.year) {
                              end = `${exp.endDate.month} ${exp.endDate.year}`;
                            } else if (exp.endDate.year) {
                              end = String(exp.endDate.year);
                            }
                          } else if (exp.endDate) {
                            end = String(exp.endDate);
                          } else {
                            end = 'Present';
                          }

                          return start || end ? `${start} - ${end}` : '';
                        })()}
                      </div>
                    </div>
                    <div style={{ fontStyle: 'italic', fontSize: '12px', marginBottom: '6px', color: '#374151' }}>
                      {exp.title}
                    </div>
                    {exp.summary && (
                      <ul style={{ marginLeft: '20px', listStyleType: 'disc', fontSize: '13px', lineHeight: '1.6', color: '#374151' }}>
                        {Array.isArray(exp.summary) ? (
                          exp.summary.map((item: string, i: number) => (
                            <li key={i} style={{ marginBottom: '4px' }}>
                              {item}
                            </li>
                          ))
                        ) : (
                          <li>{exp.summary}</li>
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </>
            )}

            {/* Education Section */}
            {resumeData.education && resumeData.education.length > 0 && (
              <>
                <h2 className="section-heading">Education</h2>
                {resumeData.education.map((edu: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
                      {edu.schoolName}
                    </div>
                    <div style={{ fontStyle: 'italic', fontSize: '12px' }}>
                      {edu.fieldOfStudy} - {edu.degree}
                    </div>
                    {edu.notes && (
                      <p style={{ marginTop: '4px', lineHeight: '1.5', fontSize: '13px' }}>{edu.notes}</p>
                    )}
                  </div>
                ))}
              </>
            )}

            {/* Achievements Section - Always show */}
            <h2 className="section-heading">Achievements and Recognition</h2>
            {resumeData.achievements && resumeData.achievements.length > 0 ? (
              <ul style={{ marginLeft: '20px', listStyleType: 'disc', fontSize: '13px', lineHeight: '1.5' }}>
                {resumeData.achievements.map((achievement: any, idx: number) => {
                  const displayText = typeof achievement === 'string'
                    ? achievement
                    : achievement.issuer && achievement.name
                      ? `${achievement.name} - ${achievement.issuer}`
                      : achievement.name || achievement.issuer || '';

                  return displayText ? (
                    <li key={idx} style={{ marginBottom: '2px' }}>
                      {displayText}
                    </li>
                  ) : null;
                })}
              </ul>
            ) : (
              <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#666', fontStyle: 'italic', marginBottom: '12px' }}>
                No achievements added
              </p>
            )}

            {/* References Section - Always show */}
            <h2 className="section-heading">References</h2>
            {resumeData.references && resumeData.references.length > 0 ? (
              <>
                {resumeData.references.map((reference: any, idx: number) => (
                  <p key={idx} style={{ marginBottom: '8px', lineHeight: '1.5', fontSize: '13px' }}>
                    {reference.info || reference}
                  </p>
                ))}
              </>
            ) : (
              <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#666', fontStyle: 'italic', marginBottom: '12px' }}>
                No references added
              </p>
            )}
          </div>

          {/* Watermark Overlay */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 10 }}
          >
            <div
              className="watermark-diagonal"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-45deg)',
                fontSize: '80px',
                fontWeight: 'bold',
                color: 'rgba(0, 0, 0, 0.08)',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              SAMPLE - ResumAI.com
            </div>
          </div>

          {/* Modal Footer with CTAs */}
          <div className="sticky bottom-0 bg-white border-t p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Close Preview
            </Button>
            <Button
              type="button"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 w-full sm:w-auto"
              onClick={onDownloadPaid}
            >
              💎 Get Clean Resume - $9.99
            </Button>
          </div>
        </div>

        <style jsx global>{`
          .section-heading {
            font-size: 15px;
            font-weight: 700;
            color: #1e40af;
            margin-top: 16px;
            margin-bottom: 8px;
            border-bottom: 1.5px solid #1e40af;
            padding-bottom: 3px;
          }

          .resume-preview {
            font-family: Calibri, 'Gill Sans', 'Gill Sans MT', 'Trebuchet MS', sans-serif;
            color: #1f2937;
          }

          .resume-preview h1 {
            line-height: 1.2;
          }

          .resume-preview p {
            line-height: 1.5;
          }

          .resume-preview a {
            color: #1e40af;
            text-decoration: none;
            font-weight: 500;
          }

          .resume-preview a:hover {
            text-decoration: underline;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
