export default function KnifeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Blade */}
      <path d="M4 12 L 18 4 L 20 6 L 12 20 L 4 12 Z" fill="currentColor" opacity="0.2" />
      <path d="M4 12 L 18 4 L 20 6 L 12 20 Z" />
      
      {/* Handle */}
      <circle cx="3" cy="13" r="2" fill="currentColor" />
      <circle cx="2.5" cy="13.5" r="1.5" stroke="none" fill="currentColor" opacity="0.6" />
      
      {/* Blade edge highlight */}
      <path d="M 6 11 L 17 5" opacity="0.5" strokeWidth="1" />
    </svg>
  );
}

