import React, { useState } from "react";

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [fullSizeImage, setFullSizeImage] = useState(null);

  const volleyballGallery = [
    {
      title: "All District Winners",
      description: "Team recognition for outstanding district performance. Celebrating excellence in competitive volleyball.",
      image: "/images/volleyball/All District Winners.jpg",
      tags: ["Team Achievement", "District Champions", "Recognition"]
    },
    {
      title: "CBSE Tournament - Group Picture",
      description: "Team photo from CBSE tournament. Showcasing team unity and sportsmanship.",
      image: "/images/volleyball/Group picture CBSE tournament.jpg",
      tags: ["CBSE", "Tournament", "Team Photo"]
    },
    {
      title: "Inter School Runner Up",
      description: "Second place finish in inter-school volleyball competition. Demonstrating competitive excellence.",
      image: "/images/volleyball/Inter school runner up.jpg",
      tags: ["Runner Up", "Inter School", "Competition"]
    },
    {
      title: "Newspaper Headline - Match Coverage 2",
      description: "Media coverage of volleyball achievements. Featured in local newspaper for outstanding performance.",
      image: "/images/volleyball/newspaper headline 2.jpg",
      tags: ["Media Coverage", "Newspaper", "Recognition"]
    },
    {
      title: "Newspaper Headlines Collection",
      description: "Collection of newspaper articles covering team achievements and tournament highlights.",
      image: "/images/volleyball/newspaper headlines.jpg",
      tags: ["Media", "Press Coverage", "Team Success"]
    },
    {
      title: "Team Winners Photo",
      description: "Victory celebration photo with the entire team. Capturing the joy of championship success.",
      image: "/images/volleyball/Team Winners.jpg",
      tags: ["Champions", "Victory", "Team Photo"]
    },
    {
      title: "Winner CBSE Tournament",
      description: "First place finish in CBSE volleyball tournament. Peak achievement of the season.",
      image: "/images/volleyball/Winner CBSE tournamne.jpg",
      tags: ["CBSE Champions", "First Place", "Tournament Winner"]
    },
    {
      title: "Winner Sahodya Tournament",
      description: "Championship win at Sahodya tournament. Demonstrating skill and teamwork.",
      image: "/images/volleyball/Winner Sahodya Tournament.jpg",
      tags: ["Sahodya", "Tournament Win", "Championship"]
    },
    {
      title: "Zonal Level Winners",
      description: "Zonal championship victory. Advancing through competitive regional play.",
      image: "/images/volleyball/Zonal level winners.jpg",
      tags: ["Zonal Champions", "Regional Victory", "Team Success"]
    }
  ];

  const artworkGallery = [
    {
      title: "Traditional Japanese Wave Art",
      description: "Intricate pen and ink drawing inspired by traditional Japanese wave patterns. Features detailed line work and flowing organic forms reminiscent of Hokusai's Great Wave.",
      image: "/images/artwork/Sketch6.jpg",
      tags: ["Pen & Ink", "Traditional Art", "Japanese Style", "Line Art"]
    },
    {
      title: "Indian Classical Art - Three Graces",
      description: "Beautiful illustration featuring three traditional Indian women in classical attire, surrounded by lotus flowers. Rich colors and intricate details showcase traditional Indian artistic traditions.",
      image: "/images/artwork/Acrylic 3Woman painting.jpg",
      tags: ["Traditional Art", "Indian Art", "Portrait", "Cultural Heritage"]
    },
    {
      title: "Harry Potter Fan Art - Dobby",
      description: "Charming illustration of Dobby the house elf from the Harry Potter series. Features expressive character design with accompanying text.",
      image: "/images/artwork/Cartoon art.jpg",
      tags: ["Fan Art", "Character Design", "Harry Potter", "Illustration"]
    },
    {
      title: "Radha Krishna Portrait",
      description: "Vibrant watercolor painting depicting the divine couple Radha and Krishna. Features rich colors, traditional Indian iconography, and skilled portraiture.",
      image: "/images/artwork/RadhaKrishna.jpg",
      tags: ["Watercolor", "Portrait", "Indian Mythology", "Religious Art"]
    },
    {
      title: "Indian Folk Art Collection",
      description: "Collection of traditional Indian folk art pieces featuring elephants, mandalas, and decorative patterns. Bright colors and intricate designs showcase mastery of traditional Indian artistic styles.",
      image: "/images/artwork/Rangoli Designs.jpg",
      tags: ["Folk Art", "Traditional Patterns", "Indian Art", "Decorative Art"]
    },
    {
      title: "Nature Sketches - Tree Swing",
      description: "Detailed pen and ink landscape drawing featuring a tree with a swing. Shows excellent understanding of perspective, texture, and natural forms.",
      image: "/images/artwork/Sketch1.jpg",
      tags: ["Pen & Ink", "Landscape", "Nature", "Detailed Drawing"]
    },
    {
      title: "Mythical Creatures - Deer Spirit",
      description: "Enchanting illustration of a deer with antlers that transform into trees and birds. Combines nature elements with fantasy concepts.",
      image: "/images/artwork/Sketch2.jpg",
      tags: ["Fantasy Art", "Mythical Creatures", "Surreal", "Nature Spirits"]
    },
    {
      title: "Seascape with Birds",
      description: "Dynamic seascape drawing featuring waves and flying seabirds. Excellent use of line work to show movement and texture in both water and sky.",
      image: "/images/artwork/Sketch3.jpg",
      tags: ["Seascape", "Birds", "Environmental Art", "Line Drawing"]
    },
    {
      title: "Lotus Flower Study",
      description: "Detailed botanical drawing of a lotus flower with leaves. Shows excellent understanding of botanical illustration techniques and attention to natural details.",
      image: "/images/artwork/Sketch4.jpg",
      tags: ["Botanical Art", "Graphite Drawing", "Nature Study", "Realistic"]
    },
    {
      title: "Japanese Temple in Clouds",
      description: "Atmospheric illustration of a traditional Japanese temple surrounded by stylized clouds. Shows mastery of architectural drawing and traditional Asian artistic elements.",
      image: "/images/artwork/Sketch5.jpg",
      tags: ["Architecture", "Japanese Art", "Traditional", "Atmospheric"]
    }
  ];

  const projects = [
    {
      id: 1,
      title: "Salary Data Analysis",
      description:
        "Comprehensive salary analysis using Python and Jupyter Notebook. Analyzed salary distributions, career progression patterns, and compensation trends. Applied statistical methods and created professional visualizations using Matplotlib and Seaborn.",
      icon: "💰",
      tags: ["Python", "Jupyter", "Pandas", "Data Analysis"],
      type: "python",
      notebookLink: "/projects/data-science/Project 1/project_ 1-Salary.ipynb",
      slidesLink:
        "/projects/data-science/Project 1/project_ 1-Salary.slides.html",
      datasetLink: "/projects/data-science/Project 1/003 salaries-by-college-major.csv",
      githubLink: "https://github.com/Sanyabansal115/My-Data-Science-Projects/blob/main/Project%201/project_%201-Salary.ipynb",
    },
    {
      id: 2,
      title: "Lego Dataset Analysis",
      description:
        "Analyzed Lego datasets for coursework using Jupyter Notebook. Explored product categories, pricing trends, and popularity patterns. Applied data cleaning, transformation, and visualization techniques to derive insights.",
      icon: "🧱",
      tags: ["Python", "Jupyter", "Pandas", "Data Visualization"],
      type: "python",
      notebookLink:
        "/projects/data-science/Project 4/Project-4-Lego_Analysis_for_Course.ipynb",
      slidesLink:
        "/projects/data-science/Project 4/Project-4-Lego_Analysis_for_Course.slides.html",
      githubLink: "https://github.com/Sanyabansal115/My-Data-Science-Projects/blob/main/Project%204/Project-4-Lego_Analysis_for_Course.ipynb",
    },
    {
      id: 3,
      title: "Programming Languages Study Analysis",
      description:
        "Comparative study of programming languages using statistical analysis. Examined language popularity, usage trends, and performance metrics. Created comprehensive visualizations and detailed reports.",
      icon: "💻",
      tags: ["Python", "Jupyter", "Statistics", "Research"],
      type: "python",
      notebookLink:
        "/projects/data-science/Project 2/Project-2_Programming_Languages_(start).ipynb",
      slidesLink:
        "/projects/data-science/Project 2/Project-2_Programming_Languages_(start).slides.html",
      datasetLink: "/projects/data-science/Project 2/002 QueryResults.csv",
      githubLink: "https://github.com/Sanyabansal115/My-Data-Science-Projects/blob/main/Project%202/Project-2_Programming_Languages_(start).ipynb",
    },
    {
      id: 4,
      title: "Seaborn & Linear Regression Analysis",
      description:
        "Advanced statistical analysis utilizing Seaborn and linear regression models. Explored variable relationships, performed correlation analysis, and built predictive models with high accuracy.",
      icon: "📈",
      tags: ["Python", "Seaborn", "Linear Regression", "Machine Learning"],
      type: "python",
      notebookLink:
        "/projects/data-science/Project 3/Project-3_Seaborn_and_Linear_Regression.ipynb",
      slidesLink:
        "/projects/data-science/Project 3/Project-3_Seaborn_and_Linear_Regression.slides.html",
      datasetLink: "/projects/data-science/Project 3/cost_revenue_dirty.csv",
      githubLink: "https://github.com/Sanyabansal115/My-Data-Science-Projects/blob/main/Project%203/Project-3_Seaborn_and_Linear_Regression.ipynb",
    },
    {
      id: 5,
      title: "Customer Churn Prediction",
      description:
        "Advanced machine learning project predicting customer churn using telecommunications data. Implemented multiple ML algorithms including Logistic Regression and Decision Trees. Applied feature engineering, data preprocessing, and model evaluation to identify high-risk customers for targeted retention strategies.",
      icon: "🤖",
      tags: [
        "Machine Learning",
        "Python",
        "Scikit-learn",
        "Predictive Analytics",
        "Classification",
      ],
      type: "ai-ml",
      notebookLink:
        "/projects/ai-machine_learning/Project 1/Customer Churn Prediction.ipynb",
      slidesLink:
        "/projects/ai-machine_learning/Project 1/Customer Churn Prediction.slides.html",
      datasetLink:
        "/projects/ai-machine_learning/Project 1/Telco-Customer-Churn.csv",
      githubLink: "https://github.com/Sanyabansal115/My-AI-ML-Projects/blob/main/Customer-Churn-Prediction/Customer%20Churn%20Prediction.ipynb",
    },
    {
      id: 6,
      title: "Varsity Volleyball",
      description:
        `Served as team captain for two seasons. Led team to regional championships through strategic planning and mentoring. Demonstrated leadership, teamwork, and athletic excellence. Gallery includes ${volleyballGallery.length} photos from tournaments, victories, and team achievements.`,
      icon: "🏐",
      tags: ["Team Captain", "Leadership", "Athletics", "Championships"],
      type: "sports",
      isGallery: true,
      galleryCount: volleyballGallery.length,
      galleryType: "volleyball"
    },
    {
      id: 17,
      title: "Digital Art Portfolio",
      description:
        `Comprehensive collection of ${artworkGallery.length} artworks including traditional pen & ink drawings, watercolor paintings, digital illustrations, and cultural art pieces. Features Japanese-inspired wave art, Indian classical portraits, botanical studies, fantasy creatures, and architectural drawings. Click to explore the full gallery.`,
      icon: "🎨",
      tags: ["Digital Art", "Portfolio", "Mixed Media", "Traditional Art", "Cultural Art"],
      type: "art",
      isGallery: true,
      galleryCount: artworkGallery.length,
      galleryType: "artwork"
    }
  ];

  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.type === filter);

  return (
    <section className="projects-section">
      <h2 className="section-title">Projects & Achievements</h2>

      <div className="project-filters">
        <p
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "var(--vintage-text)",
            fontSize: "1.1rem",
          }}
        >
          Python/Jupyter data analysis, web development, athletic achievements,
          and creative work
        </p>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({projects.length})
          </button>
          <button
            className={`filter-btn ${filter === "python" ? "active" : ""}`}
            onClick={() => setFilter("python")}
          >
            🐍 Python ({projects.filter((p) => p.type === "python").length})
          </button>
          <button
            className={`filter-btn ${filter === "webdev" ? "active" : ""}`}
            onClick={() => setFilter("webdev")}
          >
            💻 Web Dev ({projects.filter((p) => p.type === "webdev").length})
          </button>
          <button
            className={`filter-btn ${filter === "ai-ml" ? "active" : ""}`}
            onClick={() => setFilter("ai-ml")}
          >
            🤖 AI/ML ({projects.filter((p) => p.type === "ai-ml").length})
          </button>
          <button
            className={`filter-btn ${filter === "sports" ? "active" : ""}`}
            onClick={() => setFilter("sports")}
          >
            🏐 Sports ({projects.filter((p) => p.type === "sports").length})
          </button>
          <button
            className={`filter-btn ${filter === "art" ? "active" : ""}`}
            onClick={() => setFilter("art")}
          >
            🎨 Art ({projects.filter((p) => p.type === "art").length})
          </button>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-image">
              {project.isGallery ? (
                <span 
                  style={{ fontSize: "4rem", cursor: "pointer" }}
                  onClick={() => setSelectedArtwork(project)}
                >
                  {project.icon}
                </span>
              ) : (
                <span style={{ fontSize: "4rem" }}>{project.icon}</span>
              )}
            </div>
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="project-links">
                {project.isGallery && (
                  <button
                    className="project-link"
                    onClick={() => setSelectedArtwork(project)}
                    style={{ cursor: "pointer", border: "none", background: "transparent" }}
                  >
                    {project.galleryType === "volleyball" ? "🏐" : "🖼️"} View Gallery ({project.galleryCount} {project.galleryType === "volleyball" ? "photos" : "pieces"})
                  </button>
                )}
                {project.slidesLink && (
                  <a
                    href={project.slidesLink}
                    className="project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📊 View Slides
                  </a>
                )}
                {project.notebookLink && (
                  <a
                    href={project.notebookLink}
                    className="project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📓 Jupyter Notebook
                  </a>
                )}
                {project.datasetLink && (
                  <a
                    href={project.datasetLink}
                    className="project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📋 Dataset (CSV)
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    className="project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    💻 GitHub Code
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gallery Modal - Art & Volleyball */}
      {selectedArtwork && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            overflowY: "auto"
          }}
          onClick={() => setSelectedArtwork(null)}
        >
          <div 
            style={{
              backgroundColor: "var(--vintage-cream-light)",
              borderRadius: "20px",
              padding: "3rem",
              maxWidth: "1400px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArtwork(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "var(--vintage-orange)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontSize: "1.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ×
            </button>
            
            <h2 style={{
              textAlign: "center",
              color: "var(--vintage-brown-dark)",
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.5rem",
              marginBottom: "2rem"
            }}>
              {selectedArtwork.galleryType === "volleyball" ? "🏐 Volleyball Achievements" : "🎨 Digital Art Portfolio"}
            </h2>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "2rem"
            }}>
              {(selectedArtwork.galleryType === "volleyball" ? volleyballGallery : artworkGallery).map((item, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 8px 25px rgba(139, 69, 19, 0.2)",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <img 
                    src={item.image} 
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                      cursor: "pointer"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullSizeImage(item);
                    }}
                  />
                  <div style={{ padding: "1.5rem" }}>
                    <h3 style={{
                      color: "var(--vintage-brown-dark)",
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.3rem",
                      marginBottom: "0.5rem"
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      color: "var(--vintage-text)",
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      marginBottom: "1rem"
                    }}>
                      {item.description}
                    </p>
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem"
                    }}>
                      {item.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          style={{
                            display: "inline-block",
                            background: "var(--vintage-orange)",
                            color: "var(--vintage-cream-light)",
                            padding: "0.3rem 0.8rem",
                            borderRadius: "15px",
                            fontSize: "0.85rem",
                            fontWeight: "500"
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Size Image Modal */}
      {fullSizeImage && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem"
          }}
          onClick={() => setFullSizeImage(null)}
        >
          <div 
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setFullSizeImage(null)}
              style={{
                position: "absolute",
                top: "-50px",
                right: "0",
                background: "var(--vintage-orange)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontSize: "1.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10001
              }}
            >
              ×
            </button>
            
            <img 
              src={fullSizeImage.image} 
              alt={fullSizeImage.title}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "10px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
              }}
            />
            
            <div style={{
              marginTop: "1rem",
              textAlign: "center",
              color: "white",
              maxWidth: "600px"
            }}>
              <h3 style={{
                color: "white",
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem",
                marginBottom: "0.5rem"
              }}>
                {fullSizeImage.title}
              </h3>
              <p style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "1rem",
                lineHeight: "1.6"
              }}>
                {fullSizeImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}