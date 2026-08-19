import toast from "react-hot-toast";
import BatLogo from "../components/BatLogo";

const SOUND_KEY = "talkative-sound";

export function requestNotificationPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission().catch(() => {});
  }
}

export function playSonarPing() {
  if (localStorage.getItem(SOUND_KEY) === "off") return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(980, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    /* browser blocked audio — ignore */
  }
}

export function updateAppTitle(unreadTotal) {
  document.title = unreadTotal > 0 ? `(${unreadTotal}) Talkative` : "Talkative";
}

export function getTotalUnread(unreadCounts) {
  return Object.values(unreadCounts).reduce((a, b) => a + b, 0);
}

export function notifyNewMessage(message, senderUser) {
  const name = senderUser?.fullName || "A contact";
  const preview = message.image ? "sent an image" : message.text || "";
  const avatar = senderUser?.profilePic;

  toast.custom(
    (t) => (
      <div
        onClick={() => toast.dismiss(t.id)}
        className={`pointer-events-auto flex items-center gap-3 rounded-xl border border-base-300 bg-base-100/95 backdrop-blur px-4 py-3 shadow-2xl ${
          t.visible ? "animate-enter" : "animate-exit"
        }`}
        role="status"
      >
        <span className="relative grid place-items-center shrink-0">
          <BatLogo className="size-8 text-primary signal-bat" />
          <span className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-md" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-base-content">
            {name}
          </span>
          <span className="block truncate text-xs text-base-content/60">
            {preview || "New message"}
          </span>
        </span>
        <span className="sonar-dot ml-2 size-2 shrink-0 rounded-full bg-primary" />
      </div>
    ),
    { duration: 4500, position: "top-center" }
  );

  if (
    "Notification" in window &&
    Notification.permission === "granted" &&
    document.hidden
  ) {
    try {
      new Notification("Talkative — " + name, {
        body: preview || "You have a new message",
        icon: avatar || undefined,
        tag: message._id,
      });
    } catch {
      /* some browsers reject the icon — ignore */
    }
  }

  playSonarPing();
}