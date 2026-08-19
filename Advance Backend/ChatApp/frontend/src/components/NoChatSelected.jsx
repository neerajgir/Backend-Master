import BatLogo from "./BatLogo";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-primary)_9%,transparent),transparent_55%)]" />

      <div className="relative text-center space-y-6 max-w-md">
        <div className="signal relative mx-auto w-fit">
          <span className="sonar-ring sonar-ring-1" />
          <span className="sonar-ring sonar-ring-2" />
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BatLogo className="w-14 h-14 text-primary signal-bat" />
          </div>
        </div>

        <div>
          <h2 className="font-display text-4xl tracking-[0.15em] text-base-content">
            THE SIGNAL IS QUIET
          </h2>
          <p className="text-base-content/50 mt-2">
            Pick a contact from the sidebar to open a channel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;