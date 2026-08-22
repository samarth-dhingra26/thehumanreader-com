export default function GraduateEmblem() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a graduate wearing a mortarboard cap"
    >
      <path
        d="M45 190 Q100 130 155 190 L155 200 L45 200 Z"
        fill="var(--fg)"
        opacity="0.85"
      />
      <circle cx="100" cy="122" r="34" fill="var(--fg)" opacity="0.85" />
      <rect x="82" y="86" width="36" height="14" rx="2" fill="var(--accent)" />
      <polygon points="35,80 100,52 165,80 100,108" fill="var(--accent)" />
      <circle cx="100" cy="80" r="4.5" fill="var(--fg)" />
      <line x1="100" y1="80" x2="128" y2="112" stroke="var(--fg)" strokeWidth="2" />
      <circle cx="129" cy="117" r="6" fill="var(--fg)" />
    </svg>
  );
}
