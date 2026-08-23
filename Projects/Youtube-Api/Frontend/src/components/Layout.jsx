import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-row">
          <NavLink to="/" className="wordmark" aria-label="OpenTube home">
            opentube
            <span className="cursor" aria-hidden="true" />
          </NavLink>
          <nav className="topnav" aria-label="Primary">
            <NavLink to="/" end>
              feed
            </NavLink>
            {user && (
              <>
                <NavLink to="/studio">studio</NavLink>
                <NavLink to="/upload">upload</NavLink>
              </>
            )}
            {!user ? (
              <NavLink to="/login">login</NavLink>
            ) : (
              <button
                className="link-btn"
                style={{ padding: "0 var(--space-md)", alignSelf: "stretch" }}
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                logout
              </button>
            )}
          </nav>
        </div>
        <div className="statusbar">
          <div className="statusbar-inner">
            <span>
              session:{" "}
              {user ? (
                <span className="ok">{user.channelName}</span>
              ) : (
                "guest — login to watch, comment & upload"
              )}
            </span>
            {user && (
              <>
                <span>subs: {user.subscribers ?? 0}</span>
                <span>subscriptions: {(user.subscribedChannels || []).length}</span>
              </>
            )}
            <span aria-hidden="true">▂ ▃ ▄ ▅ ▆</span>
          </div>
        </div>
      </header>

      <Outlet />

      <footer
        style={{
          borderTop: "var(--rule)",
          padding: "var(--space-md)",
          textAlign: "center",
          fontSize: "var(--text-xs)",
          color: "var(--color-ink-faint)",
        }}
      >
        OpenTube — open video, no algorithm. exit code 0.
      </footer>
    </div>
  );
}
