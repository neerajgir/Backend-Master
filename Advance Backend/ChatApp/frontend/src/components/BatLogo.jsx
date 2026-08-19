import PropTypes from "prop-types";

const BAT_PATH =
  "M 6 40 C 4 30 8 20 16 14 C 24 8 34 8 40 8 C 44 8 47 16 50 22 C 53 16 56 8 60 8 C 66 8 76 8 84 14 C 92 20 96 30 94 40 C 90 50 82 52 76 48 C 70 44 66 44 62 48 C 58 52 54 56 50 58 C 46 56 42 52 38 48 C 34 44 30 44 24 48 C 18 52 10 50 6 40 Z";

const BatLogo = ({ className = "" }) => (
  <svg
    viewBox="0 0 100 66"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d={BAT_PATH} />
  </svg>
);

BatLogo.propTypes = {
  className: PropTypes.string,
};

export default BatLogo;