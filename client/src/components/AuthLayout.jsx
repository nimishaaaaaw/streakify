import "../styles/auth.css";

function AuthLayout({ title, children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/favicon.png" alt="Streakify Logo" />
        </div>

        <h2 className="auth-title">{title}</h2>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;