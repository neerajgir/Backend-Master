import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User } from "lucide-react";
import BatLogo from "./BatLogo";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100/85 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="relative grid place-items-center">
              <span className="absolute inset-0 rounded-full bg-primary/25 blur-md" />
              <BatLogo className="size-9 text-primary relative" />
            </div>
            <div className="leading-none">
              <h1 className="font-display text-2xl tracking-[0.18em] text-base-content">
                TALKATIVE
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-base-content/50">
                Gotham relay
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link to={"/settings"} className="btn btn-sm gap-2 btn-ghost">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2 btn-ghost">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="btn btn-sm gap-2 btn-ghost" onClick={logout}>
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;