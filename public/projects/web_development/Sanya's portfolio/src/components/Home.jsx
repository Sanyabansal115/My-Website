import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="home-section">
      <div className="hero-content">
        <div className="portfolio-title">
          <h1 className="hero-title">SANYA<br/>BANSAL</h1>
          <p className="hero-subtitle">JUNIOR DATA SCIENCE, AI & ML ENGINEER • FULL STACK DEVELOPER</p>
          <p className="hero-subtitle-secondary">Agile Practitioner • DevOps Enthusiast • Cloud Architect • Python & Web Developer</p>
        </div>
        <p className="mission-statement">
          Passionate Data Science and Full Stack Development professional specializing in Artificial Intelligence, Machine Learning, and cloud-native solutions. 
          Experienced in Python programming, data analysis, statistical modeling, and machine learning algorithms. 
          Skilled in HTML5, CSS3, JavaScript, React, and Node.js for building responsive web applications.
          Proficient in Agile methodologies, DevOps practices, CI/CD pipelines, and cloud platforms (AWS, Azure).
          Experienced with containerization (Docker), version control (Git), and infrastructure automation.
          Combining technical expertise with creative problem-solving to drive data-driven decision making, scalable applications, and innovation.
        </p>
        <div className="cta-buttons">
          <Link to="/about" className="btn btn-primary">About Me</Link>
          <Link to="/projects" className="btn btn-secondary">View My Work</Link>
          <a href="./Sanya Bansal-AI Resume .pdf" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Download Resume</a>
        </div>
        <div className="author-name">
          <h3>DATA SCIENTIST • AI/ML ENGINEER • FULL-STACK • PROBLEM SOLVER</h3>
        </div>
      </div>
      
      
    </section>
  );
}