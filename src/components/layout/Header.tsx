import { useSidebar } from '../../hooks/useSidebar'

export default function Header() {
  const { toggle, isOpen } = useSidebar()

  return (
    <header className="fixed top-0 left-0 right-0 h-15 z-40 flex items-center gap-4 px-4 bg-gray-900/80 border-b border-white/10 backdrop-blur-md">

      {/* Bouton hamburger */}
      <button
        className="flex flex-col justify-center items-center gap-[5px] w-10 h-10 rounded-md p-2 text-white hover:bg-white/10 transition-colors shrink-0"
        onClick={toggle}
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={isOpen}
      >
        <span className={`block w-[22px] h-[2px] rounded-full bg-current origin-center transition-all duration-250
          ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`}
        />
        <span className={`block h-[2px] rounded-full bg-current transition-all duration-250
          ${isOpen ? 'opacity-0 w-0' : 'w-[22px]'}`}
        />
        <span className={`block w-[22px] h-[2px] rounded-full bg-current origin-center transition-all duration-250
          ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
        />
      </button>

      {/* Titre */}
      <div className="text-white font-bold text-lg tracking-tight">
        KahootLike
      </div>

    </header>
  )
}

