import React from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    {
      id: 1,
      icon: "🤖",
      title: "Machine Learning Models",
      description: "Develop and deploy predictive models using scikit-learn, TensorFlow, and PyTorch. Expertise in supervised, unsupervised, and reinforcement learning algorithms."
    },
    {
      id: 2,
      icon: "🧠",
      title: "Artificial Intelligence",
      description: "Build intelligent systems and AI-powered applications. Specializing in natural language processing, computer vision, and deep learning architectures."
    },
    {
      id: 3,
      icon: "�",
      title: "Data Analysis & Analytics",
      description: "Comprehensive data analysis using Python, Pandas, and Jupyter Notebooks. Transform raw data into actionable insights with advanced statistical modeling."
    },
    {
      id: 4,
      icon: "📈",
      title: "Predictive Analytics",
      description: "Build forecasting models and predictive analytics solutions. Use time series analysis, regression, and classification to predict future trends."
    },
    {
      id: 5,
      icon: "📊",
      title: "Data Visualization",
      description: "Create compelling visualizations using Matplotlib, Seaborn, and Plotly. Turn complex datasets into clear, interactive dashboards and reports."
    },
    {
      id: 6,
      icon: "�",
      title: "Python Development",
      description: "Expert Python programming for data science, automation, and web applications. Clean, efficient code with best practices and documentation."
    },
    {
      id: 7,
      icon: "�",
      title: "Statistical Analysis",
      description: "Advanced statistical testing, hypothesis validation, and experimental design. Provide data-driven insights for informed decision making."
    },
    {
      id: 8,
      icon: "⚡",
      title: "Data Pipeline Engineering",
      description: "Design and implement ETL pipelines, data preprocessing workflows, and automated data processing systems for scalable analytics."
    }
  ];

  return (
    <section className="services-section">
      <h2 className="section-title">AI & Data Science Services</h2>
      <p className="section-subtitle">
        Leveraging artificial intelligence and machine learning to provide cutting-edge data solutions
      </p>
      
      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>

      <div className="services-cta">
        <h3>Ready to leverage AI for your business?</h3>
        <p>Let's discuss how machine learning and data science can transform your organization</p>
        <Link to="/contact" className="btn btn-primary">Get in Touch</Link>
      </div>
    </section>
  );
}