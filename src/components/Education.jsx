/**
 * Education.jsx - Education and Certifications Component
 * 
 * This component displays Sanya Bansal's educational background and professional
 * certifications. It separates formal education (degrees) from professional
 * certifications and provides interactive elements for viewing certificates
 * and transcripts.
 * 
 * Features:
 * - Timeline layout for educational background
 * - Certificate grid for professional certifications
 * - PDF transcript viewing functionality
 * - Certificate image display and verification
 * - Responsive design for all device sizes
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 * @since 2025-09-30
 */

// Import React library
import React from 'react';

/**
 * Education Component
 * 
 * Renders educational background in timeline format and certifications
 * in a grid layout. Handles click events for document viewing.
 * 
 * @returns {JSX.Element} Complete education section with timeline and certifications
 */
export default function Education() {
  /**
   * Formal Education Data Array
   * 
   * Contains information about degrees and formal education.
   * Each object represents an educational milestone with:
   * - id: Unique identifier for React key prop
   * - degree: Name of the degree or program
   * - institution: Educational institution name
   * - date: Duration or completion date
   * - description: Brief description of the program
   * - details: Specific coursework and skills learned
   * - transcriptLink: Optional PDF link for official transcripts
   */
  const educationData = [
    {
      id: 1,
      degree: "Advanced Diploma in Software Engineering Technology - Artificial Intelligence",
      institution: "Centennial College",
      date: "2025 - 2027",
      description: "Specialization in Software Engineering and AI",
      details: "Coursework: Data Structures, Web Applications, Python Programming, Database Management, Machine Learning, Statistical Analysis",
      transcriptLink: "Official Transcript.pdf"
    },
    {
      id: 2,
      degree: "Schooling",
      institution: "D.A.V Public School, India",
      date: "2010 - 2024",
      description: "Completed high school with a focus on science and mathematics",
      details: "Coursework: Physics, Chemistry, Mathematics, Computer Science, Sports and Extracurricular Activities"
    }
  ];

  /**
   * Professional Certifications Data Array
   * 
   * Contains information about professional certifications and training programs.
   * Each object includes:
   * - id: Unique identifier for React key prop
   * - degree: Certification name
   * - institution: Training provider
   * - date: Completion date or duration
   * - description: Brief overview of certification
   * - details: Specific technologies and skills covered
   * - certificateLink: Optional image link for certificate verification
   */
  const certificationsData = [
    {
      id: 3,
      degree: "Data Science, ML & AI Certification",
      institution: "Numitech Solutions, India",
      date: "June,2024 - September,2024",
      description: "Python for Data Science and Analytics",
      details: "Completed intensive program covering Pandas, NumPy, Matplotlib, Seaborn, and Jupyter Notebooks",
      certificateLink: "images/Data Science, ML & Ai.png"
    },
    {
      id: 4,
      degree: "SQL Database Certification",
      institution: "Numitech Solutions, India",
      date: "October 01,2024 - October 30,2024",
      description: "SQL for Data Analysis",
      details: "Learned SQL queries, database design, and data manipulation techniques",
      certificateLink: "images/SQL Database.png"
    },
    {
      id: 5,
      degree: "C Language Certification",
      institution: "Teach Savvy, India",
      date: "August 2023 - December 2023",
      description: "C Programming for Beginners",
      details: "Learned the basics of C programming, including syntax, data types, and control structures"
    }
  ];

  /**
   * Component Render Method
   * 
   * Returns the complete education section JSX with timeline and certifications.
   * Uses semantic HTML and accessible design patterns.
   */
  return (
    <section className="education-section">
      {/* Section header with main title */}
      <h2 className="section-title">Education & Qualifications</h2>
      
      {/* Educational Timeline Section */}
      <div className="timeline">
        {/* Map through education data to create timeline items */}
        {educationData.map(educationalBackground => (
          <div key={educationalBackground.id} className="timeline-item">
            <div className="timeline-content">
              {/* Display the date range for this education */}
              <div className="timeline-date">{educationalBackground.date}</div>
              
              {/* Main degree/program title */}
              <h3>{educationalBackground.degree}</h3>
              
              {/* Institution name */}
              <h4 className="institution-name">{educationalBackground.institution}</h4>
              
              {/* Brief description of the program */}
              <p className="edu-description">{educationalBackground.description}</p>
              
              {/* Detailed coursework and skills */}
              <p className="edu-details">{educationalBackground.details}</p>
              
              {/* Conditional rendering for certificate images */}
              {educationalBackground.certificateLink && (
                <div className="certificate-container">
                  <img 
                    src={educationalBackground.certificateLink} 
                    alt={`${educationalBackground.degree} Certificate`}
                    className="certificate-image"
                    onClick={() => window.open(educationalBackground.certificateLink, '_blank')}
                  />
                  <p className="certificate-label">View Certificate</p>
                </div>
              )}
              
              {/* Conditional rendering for transcript links */}
              {educationalBackground.transcriptLink && (
                <div className="transcript-container">
                  <button 
                    className="transcript-button"
                    onClick={() => window.open(educationalBackground.transcriptLink, '_blank')}
                  >
                    📄 View Official Transcript
                  </button>
                </div>
              )}
            </div>
            
            {/* Timeline visual indicator dot */}
            <div className="timeline-dot"></div>
          </div>
        ))}
      </div>

      {/* Professional Certifications Section */}
      <div className="certifications">
        <h3 className="subsection-title">Professional Certifications</h3>
        
        {/* Certification cards grid */}
        <div className="cert-grid">
          {/* Map through certifications data to create certification cards */}
          {certificationsData.map(certification => (
            <div 
              key={certification.id} 
              className="cert-card" 
              onClick={() => certification.certificateLink && window.open(certification.certificateLink, '_blank')}
            >
              {/* Dynamic icon based on certification type */}
              <div className="cert-icon">
                {certification.degree.includes('Data Science') ? '📊' : 
                 certification.degree.includes('SQL') ? '🗄️' : 
                 certification.degree.includes('C Language') ? '💻' : '🎓'}
              </div>
              
              {/* Certification title */}
              <h4>{certification.degree}</h4>
              
              {/* Training institution */}
              <p className="cert-institution">{certification.institution}</p>
              
              {/* Completion date */}
              <p className="cert-date">{certification.date}</p>
              
              {/* Brief description */}
              <p className="cert-description">{certification.description}</p>
              
              {/* Verification badge for certificates with links */}
              {certification.certificateLink && (
                <div className="cert-badge">✓ Verified</div>
              )}
            </div>
          ))}
          
          {/* Additional skills showcase card */}
          <div className="cert-card additional-skills">
            <div className="cert-icon">🚀</div>
            <h4>Additional Skills</h4>
            <p>React • JavaScript • Python</p>
            <p>Machine Learning • Deep Learning • Artificial Intelligence</p>
          </div>
        </div>
      </div>
    </section>
  );
}