import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { loadQuiz, parseQuiz } from '../services/quizService'
import type { QuizInfo } from '../types/quiz'
import QuizRunner from '../components/ui/QuizRunner'
import { getPublicUrl } from '../config/publicUrl'

type QuizPageParams = {
  dir: string
  id: string
}

type LoadState = 'loading' | 'error' | 'ready'

export default function QuizPage() {
  const { dir, id } = useParams<QuizPageParams>()
  const [state, setState] = useState<LoadState>('loading')
  const [quiz, setQuiz] = useState<QuizInfo | null>(null)
  const [error, setError] = useState<string>('')
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (!dir || !id) {
      setError('Paramètres de quiz manquants dans l\'URL.')
      setState('error')
      return
    }

    setState('loading')
    const url = getPublicUrl(`tests/${dir}/${id}.json`)

    loadQuiz(url)
      .then((raw) => {
        const parsed = parseQuiz(raw)
        setQuiz(parsed)
        setState('ready')
      })
      .catch((err: Error) => {
        setError(err.message)
        setState('error')
      })
  }, [dir, id])

  const handleRestart = () => setKey((k) => k + 1)

  // ─── Chargement ────────────────────────────────────────────────────────────
  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-400">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-sm">Chargement du quiz…</p>
      </div>
    )
  }

  // ─── Erreur ────────────────────────────────────────────────────────────────
  if (state === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 max-w-md mx-auto text-center px-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-lg font-semibold text-white">Impossible de charger le quiz</h2>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    )
  }

  // ─── Quiz prêt ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:py-10 max-w-5xl mx-auto w-full">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-xl md:text-2xl font-bold text-white">{quiz!.name}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {quiz!.totalQuestions} question{quiz!.totalQuestions > 1 ? 's' : ''}
        </p>
      </div>

      {/* Runner */}
      <QuizRunner key={key} quiz={quiz!} onRestart={handleRestart} />
    </div>
  )
}
