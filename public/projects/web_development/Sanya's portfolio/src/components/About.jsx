import React from "react";
import profileImage from "/images/profile.jpg";

export default function About() {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-image">
          <img
            src={profileImage}
            alt="Sanya Bansal - Data Science Professional"
          />
        </div>
        <div className="about-content">
          <h2>About Me</h2>
          <h3 className="about-name">Sanya Bansal</h3>
          <p>
            I am a dedicated Junior Data Science, AI & ML Engineer with a strong
            foundation in artificial intelligence, machine learning, and data
            analytics. I specialize in developing intelligent solutions using
            Python, statistical modeling, and advanced machine learning
            algorithms to solve complex business problems.
          </p>
          <p>
            My technical expertise includes Python (Pandas, NumPy, Scikit-learn,
            TensorFlow, PyTorch), machine learning algorithms, data
            visualization (Matplotlib, Seaborn, Plotly), SQL databases, and
            statistical analysis. I have hands-on experience with supervised and
            unsupervised learning, predictive modeling, and deep learning
            architectures.
          </p>
          <p>
            I've successfully completed multiple data science projects including
            salary prediction models, programming language trend analysis, and
            comprehensive statistical analyses. My passion lies in transforming
            raw data into actionable insights and building AI-powered solutions
            that drive innovation.
          </p>
          <a
            href="./Sanya Bansal-AI Resume .pdf"
            className="resume-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            📄 Download AI Resume (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}
