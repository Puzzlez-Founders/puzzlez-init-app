import React from "react";

const HomePage: React.FC = () => {
  return (
    <div style={styles.pageWrapper}>
      <header style={styles.header}>
        <h1>Welcome to Puzzles</h1>
        <p>Transforming every manual process into digital solutions.</p>
      </header>

      <main style={styles.mainSection}>
        <h2>Revolutionizing the Way You Work</h2>
        <p>
          At Puzzles, we bring innovation to life by converting manual processes
          into seamless digital experiences. Let's unlock your potential through
          technology.
        </p>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          style={styles.ctaButton}
        >
          Explore Our Solutions
        </button>

        <div style={styles.features}>
          {features.map((feature, index) => (
            <div key={index} style={styles.feature}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer style={styles.footer}>
        <p>
          &copy; 2024 Puzzles. All Rights Reserved.{" "}
          <a href="#" style={styles.footerLink}>
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
};

const styles = {
  pageWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: '"Inter", sans-serif',
    textAlign: "center" as const,
  },
  header: {
    background: "#ffffff",
    color: "#2b2d42",
    padding: "40px 20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    fontSize: "3rem",
    fontWeight: "700",
  },
  mainSection: {
    flex: "1",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  ctaButton: {
    backgroundColor: "#ef233c",
    color: "#ffffff",
    margin: "15px",
    padding: "15px 40px",
    borderRadius: "8px",
    fontSize: "1.2rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.3s ease, background-color 0.3s ease",
    boxShadow: "0 6px 20px rgba(239, 35, 60, 0.5)",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginTop: "40px",
    width: "100%",
    maxWidth: "1200px",
  },
  feature: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    textAlign: "center" as const,
    transition: "transform 0.3s ease",
  },
  footer: {
    backgroundColor: "#2b2d42",
    color: "#ffffff",
    textAlign: "center" as const,
    padding: "20px",
    marginTop: "auto",
  },
  footerLink: {
    color: "#ef233c",
    textDecoration: "none",
    fontWeight: "500",
  },
};

const features = [
  {
    title: "Automation Excellence",
    description:
      "Streamline repetitive tasks with our intelligent automation tools.",
  },
  {
    title: "Custom Software Solutions",
    description:
      "Get tailor-made applications to meet your unique business needs.",
  },
  {
    title: "Data-Driven Insights",
    description: "Leverage the power of data to make informed decisions.",
  },
  {
    title: "Cloud Transformation",
    description: "Move to the cloud for enhanced efficiency and scalability.",
  },
];

export default HomePage;
