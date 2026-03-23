'use client'

export default function AnimatedCard({ children, delay = 0 }) {
  return (
    <div
      style={{
        animation: `fadeInUp 0.6s ease-out backward`,
        animationDelay: `${delay}ms`
      }}
      className="h-full"
    >
      {children}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
