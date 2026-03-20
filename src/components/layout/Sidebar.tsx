import { L } from '../../routes/Routes'
import { useSidebar } from '../../hooks/useSidebar'

const navItems = [
  { label: 'Accueil', routeName: 'home' as const, icon: '🏠' },
]

export default function Sidebar() {
  const { isOpen, close } = useSidebar()

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/55 backdrop-blur-sm transition-all duration-350
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Panneau latéral */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-60 w-70 max-w-[85vw]
          flex flex-col bg-gray-900 border-r border-white/10 shadow-2xl
          transition-transform duration-350 ease-in-out will-change-transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Menu principal"
      >
        {/* En-tête sidebar */}
        <div className="flex items-center justify-between h-15 px-4 border-b border-white/10 shrink-0">
          <span className="text-white font-bold text-lg tracking-tight">KahootLike</span>
          <button
            className="flex items-center justify-center w-9 h-9 rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            onClick={close}
            aria-label="Fermer le menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1">
            {navItems.map(({ label, routeName, icon }) => (
              <li key={routeName}>
                <L.NavLink
                  routeName={routeName}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'text-gray-400 hover:bg-white/8 hover:text-white'
                    }`
                  }
                  onClick={close}
                >
                  <span className="text-base w-6 text-center" aria-hidden="true">{icon}</span>
                  <span>{label}</span>
                </L.NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
