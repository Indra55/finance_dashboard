"use client"

export function ZorvynLogo({ className }: { className?: string }) {
  return (
    <svg
      width="200"
      height="32"
      viewBox="0 0 200 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* A stylized Z for Zorvyn */}
      <path
        d="M2 2L30 2L2 30L30 30"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="40"
        y="24"
        fill="currentColor"
        fontSize="24"
        fontWeight="bold"
        letterSpacing="2"
      >
        ZORVYN
      </text>
    </svg>
  )
}
