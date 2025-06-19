import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-gray-800 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image 
                src="/roleradar_logo2.png" 
                alt="RoleRadar Logo" 
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">RoleRadar</h1>
              <p className="text-sm text-gray-400">Spot your next role in a heartbeat</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
