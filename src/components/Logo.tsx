export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-md bg-white border border-gray-200"
    >
      <svg
        width={size - 8}
        height={size - 8}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect x="2" y="6" width="20" height="12" rx="2" stroke="#111827" strokeWidth="1.5" />
        <path d="M7 9h10M7 12h6" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default Logo;
