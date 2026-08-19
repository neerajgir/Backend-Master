import PropTypes from "prop-types";
import BatLogo from "./BatLogo";

const SKYLINE_PATH =
  "M0 320 L0 190 L40 190 L40 130 L60 130 L60 100 L70 100 L70 74 L82 74 L82 160 L112 160 L112 225 L132 225 L132 145 L152 145 L152 112 L168 112 L168 210 L192 210 L192 160 L212 160 L212 88 L218 88 L218 60 L228 60 L228 88 L242 88 L242 192 L272 192 L272 136 L302 136 L302 240 L342 240 L342 96 L362 96 L362 68 L372 68 L372 96 L392 96 L392 176 L422 176 L422 128 L444 128 L444 88 L462 88 L462 208 L502 208 L502 152 L532 152 L532 112 L548 112 L548 80 L562 80 L562 184 L602 184 L602 256 L642 256 L642 144 L672 144 L672 176 L692 176 L692 112 L706 112 L706 72 L716 72 L716 104 L732 104 L732 168 L762 168 L762 224 L782 224 L782 190 L800 190 L800 320 Z";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-base-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--color-primary)_8%,transparent),transparent_55%)]" />
      <div className="searchlight" />

      <div className="relative z-10 max-w-md text-center px-8 pb-28">
        <div className="signal relative mx-auto mb-10 w-fit">
          <span className="sonar-ring sonar-ring-1" />
          <span className="sonar-ring sonar-ring-2" />
          <div className="w-44 h-44 rounded-full bg-primary/10 flex items-center justify-center">
            <BatLogo className="w-32 h-32 text-primary signal-bat" />
          </div>
        </div>

        <h2 className="font-display text-5xl tracking-[0.12em] text-base-content uppercase">
          {title}
        </h2>
        <p className="text-base-content/60 mt-4">{subtitle}</p>
      </div>

      <svg
        className="absolute bottom-0 left-0 w-full h-52 text-base-100"
        viewBox="0 0 800 320"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={SKYLINE_PATH} fill="currentColor" />
      </svg>
    </div>
  );
};

AuthImagePattern.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default AuthImagePattern;