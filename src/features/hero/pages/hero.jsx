import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon, CoffeeBeansIcon, Location01Icon } from '@hugeicons/core-free-icons'
import React from 'react'
import { Link } from 'react-router'

const Hero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5eee6] to-[#e3caa5] px-4">
      <div className="flex flex-col items-center w-full max-w-7xl mx-auto py-10">
        <div className="flex items-center gap-3 border-2 border-[#e3caa5] bg-[#fff8f0] px-4 py-2 mb-6 rounded-md w-full max-w-fit mx-auto">
          <HugeiconsIcon icon={Location01Icon} size={22} className="text-[#b68973]" />
          <p className="text-sm text-[#7c5e3c] font-semibold text-center">
            Phase 4 Package 4 Matarik Bridge Bagong Silang, Caloocan
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 mb-10 w-full">
          <HugeiconsIcon icon={CoffeeBeansIcon} size={48} className="text-[#b68973]" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#7c5e3c] text-center font-serif tracking-tight uppercase">
            Fresh Brews, Cozy Vibes
          </h1>
          <p className="text-center text-[#7c5e3c]/90 text-base sm:text-lg font-medium max-w-2xl mx-auto">
            We believe coffee is more than a drink—it’s a moment to slow down and savor life. From freshly roasted beans to cozy corners, every detail is brewed with care.
          </p>
        </div>
        <Link to={'/products'} className="flex items-center gap-3 bg-[#b68973] hover:bg-[#a1745e] text-white font-bold px-8 sm:px-10 py-3 sm:py-4 border-2 border-[#7c5e3c] uppercase tracking-wider shadow-lg transition rounded w-full max-w-fit mx-auto">
          Order Now
          <HugeiconsIcon icon={ArrowRight02Icon} size={22} />
        </Link>
      </div>
    </div>
  )
}

export default Hero