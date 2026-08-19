import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { THEMES, DEFAULT_THEME } from "../lib/themes";
import BatLogo from "../components/BatLogo";
import { Volume2, VolumeX } from "lucide-react";

const SettingsPage = () => {
  const { authUser } = useAuthStore();
  const storedTheme = localStorage.getItem("chat-theme");
  const [theme, setTheme] = useState(
    () =>
      (THEMES.some((t) => t.value === storedTheme) && storedTheme) ||
      DEFAULT_THEME
  );
  const [soundOn, setSoundOn] = useState(
    () => localStorage.getItem("talkative-sound") !== "off"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("chat-theme", theme);
  }, [theme]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    localStorage.setItem("talkative-sound", next ? "on" : "off");
  };

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-3xl tracking-[0.15em] text-base-content uppercase">
            Settings
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-base-content/50">
            tune the relay
          </p>
        </div>

        <div className="divider mt-6" />

        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-base font-semibold">Theme</h3>
            <p className="text-sm text-base-content/60 mt-0.5">
              The city has moods. Pick one.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`group flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  theme === t.value
                    ? "border-primary bg-base-300 ring-1 ring-primary"
                    : "border-base-300 hover:border-base-content/30"
                }`}
                aria-pressed={theme === t.value}
              >
                <span className="flex gap-1.5">
                  <span
                    className="size-5 rounded-md border border-base-content/20"
                    style={{ backgroundColor: t.swatch.base100 }}
                  />
                  <span
                    className="size-5 rounded-md border border-base-content/20"
                    style={{ backgroundColor: t.swatch.base300 }}
                  />
                  <span
                    className="size-5 rounded-md border border-base-content/20"
                    style={{ backgroundColor: t.swatch.primary }}
                  />
                </span>
                <span className="font-display text-lg tracking-[0.12em] uppercase text-base-content">
                  {t.label}
                </span>
                <span className="text-xs text-base-content/50">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold">Alert sound</h3>
            <p className="text-sm text-base-content/60 mt-0.5">
              A soft sonar ping when a message arrives.
            </p>
          </div>
          <button
            onClick={toggleSound}
            className={`btn btn-sm gap-2 ${soundOn ? "btn-primary" : "btn-ghost"}`}
            aria-pressed={soundOn}
          >
            {soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            {soundOn ? "Sound on" : "Sound off"}
          </button>
        </div>

        <div className="divider" />

        <div>
          <h3 className="text-base font-semibold mb-4">Account Information</h3>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="size-10 rounded-full">
                <img
                  src={
                    authUser?.profilePic ||
                    "https://api.dicebear.com/10.x/lorelei/svg"
                  }
                  alt={authUser?.fullName || "Profile"}
                />
              </div>
            </div>
            <div className="text-sm space-y-0.5">
              <p className="font-medium">{authUser?.fullName}</p>
              <p className="text-base-content/50 font-mono text-xs">
                {authUser?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4 opacity-70">
          <BatLogo className="size-10 text-primary/60" />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;