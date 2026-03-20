import { useState } from 'react'
import type { QuizInfo, AnswerSelection, QuizResult } from '../../types/quiz'
import { evaluate } from '../../services/quizService'
import QuestionCard from './QuestionCard'

interface QuizRunnerProps {
  quiz: QuizInfo
  onRestart?: () => void
}

export default function QuizRunner({ quiz, onRestart }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cumulValid, setCumulValid] = useState(0)
  const [cumulFalse, setCumulFalse] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)

  /** Nombre total de bonnes réponses possibles dans tout le quiz */
  const totalValidAnswers = quiz.questions.reduce(
    (sum, q) => sum + q.answers.filter((a) => a.isValid).length,
    0,
  )

  const handleValidate = (selection: AnswerSelection) => {
    const question = quiz.questions[currentIndex]

    // Compter les bonnes et mauvaises réponses de cette question
    let qValid = 0
    let qFalse = 0
    selection.forEach((idx) => {
      if (question.answers[idx].isValid) {
        qValid++
      } else {
        qFalse++
      }
    })

    const newValid = cumulValid + qValid
    const newFalse = cumulFalse + qFalse

    if (currentIndex + 1 < quiz.totalQuestions) {
      setCumulValid(newValid)
      setCumulFalse(newFalse)
      setCurrentIndex((i) => i + 1)
    } else {
      // Fin du quiz
      const score = evaluate(newValid, newFalse, totalValidAnswers)
      setResult({ validResponse: newValid, falsesResponse: newFalse, score })
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setCumulValid(0)
    setCumulFalse(0)
    setResult(null)
    onRestart?.()
  }

  // ─── Écran de score ───────────────────────────────────────────────────────
  if (result !== null) {
    const { score, validResponse, falsesResponse } = result
    const scoreColor =
      score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'
    const scoreBg =
      score >= 80 ? 'bg-emerald-900/20 border-emerald-700' : score >= 50 ? 'bg-amber-900/20 border-amber-700' : 'bg-red-900/20 border-red-700'
    const message =
      score === 100
        ? 'Parfait ! 🏆'
        : score >= 80
          ? 'Très bien ! 🎉'
          : score >= 50
            ? 'Pas mal ! 💪'
            : 'À revoir… 📚'

    return (
      <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto py-8 animate-fade-in">
        <div className={`w-full rounded-2xl border p-8 text-center ${scoreBg}`}>
          <p className="text-gray-400 text-sm mb-1">Résultat final</p>
          <p className={`text-7xl font-black ${scoreColor}`}>{score}</p>
          <p className="text-gray-400 mt-1 text-sm">/ 100</p>
          <p className={`text-xl font-semibold mt-4 ${scoreColor}`}>{message}</p>
        </div>

        {/* Détails */}
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{validResponse}</p>
            <p className="text-xs text-gray-400 mt-1">Bonne{validResponse > 1 ? 's' : ''} réponse{validResponse > 1 ? 's' : ''}</p>
          </div>
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{falsesResponse}</p>
            <p className="text-xs text-gray-400 mt-1">Mauvaise{falsesResponse > 1 ? 's' : ''} réponse{falsesResponse > 1 ? 's' : ''}</p>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-900/40 cursor-pointer"
        >
          Recommencer le quiz
        </button>
      </div>
    )
  }

  // ─── Déroulement du quiz ─────────────────────────────────────────────────
  return (
    <QuestionCard
      question={quiz.questions[currentIndex]}
      questionIndex={currentIndex}
      totalQuestions={quiz.totalQuestions}
      onValidate={handleValidate}
    />
  )
}
