import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Signup() {
  const formRef = useRef(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const fd = new FormData(formRef.current);
      await signupUser(fd);
      // backend returns { user }; log in with credentials to get a token
      const session = await loginUser({
        email: fd.get("email"),
        password: fd.get("password"),
      });
      login(session);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <div className="panel">
        <h1>
          <span style={{ color: "var(--color-accent)" }}>mkchannel --new</span>
        </h1>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <form ref={formRef} onSubmit={onSubmit}>
          <label className="field">
            <span>channelName</span>
            <input className="input" name="channelName" required maxLength={60} />
          </label>
          <label className="field">
            <span>email</span>
            <input className="input" name="email" type="email" required autoComplete="email" />
          </label>
          <label className="field">
            <span>phone</span>
            <input className="input" name="phone" type="tel" required autoComplete="tel" />
          </label>
          <label className="field">
            <span>password</span>
            <input
              className="input"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>
          <label className="field">
            <span>logoUrl — channel logo image</span>
            <input className="input" name="logoUrl" type="file" accept="image/*" required />
          </label>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "creating…" : "create channel"}
          </button>
        </form>
        <p className="swap">
          already broadcasting? <Link to="/login">login</Link>
        </p>
      </div>
    </main>
  );
}
