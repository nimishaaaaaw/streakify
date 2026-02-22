import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");

  const timer = setTimeout(() => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, 2500);

  return () => clearTimeout(timer);
}, []);

  return (
    <div style={styles.container}>
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet="/mobile.png"
        />
        <img
          src="/desktop.png"
          alt="Streakify"
          style={styles.image}
        />
      </picture>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};

export default Splash;