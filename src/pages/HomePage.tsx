import { L } from '../routes/Routes'
import { useTestsInfo } from '../context/TestsInfoContext'

export default function HomePage() {
  const { tests, loading, error } = useTestsInfo()

  if (loading) {
    return (
      <main className="page page--home">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-400">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm">Chargement des catégories…</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="page page--home">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 max-w-md mx-auto text-center px-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-lg font-semibold text-white">Impossible de charger les catégories</h2>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="page page--home px-4">
      <div className="max-w-6xl mx-auto pt-8 pb-12">
        <h1 className="text-2xl font-bold text-white mb-6">Choisis ton quiz</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((cat) => (
            <section
              key={cat.dir}
              className="rounded-2xl border border-white/10 bg-gray-900/30 overflow-hidden"
            >
              <div className="aspect-video bg-gray-800">
                <img
                  src={cat.img_url}
                  alt={cat.type}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-white">{cat.type}</h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {cat.tests.map((id) => (
                    <L.Link
                      key={id}
                      routeName="quiz"
                      params={{ dir: cat.dir, id }}
                      className="px-3 py-1.5 rounded-lg text-sm bg-violet-500/10 border border-violet-500/30 text-violet-200 hover:bg-violet-500/20 transition-colors"
                    >
                      Test {id}
                    </L.Link>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
