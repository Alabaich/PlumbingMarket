export default function Skeleton({ className }: { className?: string }) {
    return (
      <div
        className={`animate-pulse bg-[#2c2d2c] rounded-md ${className}`}
      ></div>
    );
  }
  