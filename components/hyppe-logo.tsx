export default function HyppeLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-bold text-black text-xl">hyppé</span>
      <span className="font-bold text-hyppe-lime text-xl">.run</span>
    </div>
  )
}

