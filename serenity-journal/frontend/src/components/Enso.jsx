// The Ensō (Japanese ink circle) is Serenity Journal's signature mark.
// It "draws itself" on load — a small ritual echoing the idea that a
// journal entry, like the circle, is completed by the act of making it.
const Enso = ({ size = 48, className = "" }) => (
  <svg
    viewBox="0 0 120 120"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
  >
    <path
      className="enso-stroke animate-enso"
      d="M60 15
         C 85 15, 105 35, 104 62
         C 103 88, 82 106, 57 104
         C 34 102, 16 83, 17 59
         C 18 37, 36 17, 60 16"
    />
  </svg>
);

export default Enso;
