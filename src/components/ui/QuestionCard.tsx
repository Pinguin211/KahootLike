import { useState } from 'react'
import type { QuizQuestion, AnswerSelection } from '../../types/quiz'

interface QuestionCardProps {
  question: QuizQuestion
  questionIndex: number
  totalQuestions: number
  onValidate: (selection: AnswerSelection) => void
}

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  onValidate,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<AnswerSelection>(new Set())
  const [imgError, setImgError] = useState(false)

  const toggle = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleValidate = () => {
    onValidate(selected)
    setSelected(new Set())
  }

  const hasImage = !imgError && !!question.imgUrl
  const multipleValid = question.answers.filter((a) => a.isValid).length > 1

  return (
    <div className="w-full animate-fade-in">
      {/* ─── Progression (toujours visible en haut) ──────────────────── */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4 px-1">
        <span>
          Question {questionIndex + 1} / {totalQuestions}
        </span>
        <div className="flex gap-1 flex-wrap justify-end max-w-[60%]">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                totalQuestions > 15 ? 'w-3' : 'w-5'
              } ${
                i < questionIndex
                  ? 'bg-indigo-500'
                  : i === questionIndex
                    ? 'bg-indigo-400'
                    : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ─── Carte principale ─────────────────────────────────────────── */}
      {/*
        Mobile  : colonne  (flex-col)
        Desktop : ligne   (md:flex-row) – image à gauche, contenu à droite
      */}
      <div className="flex flex-col md:flex-row md:min-h-[420px] rounded-2xl overflow-hidden border border-gray-700 bg-gray-900 shadow-xl shadow-black/30">

        {/* ── Image (gauche sur desktop, dessus sur mobile) ── */}
        {hasImage && (
          <div className="md:w-2/5 md:flex-shrink-0 w-full aspect-video md:aspect-auto overflow-hidden bg-gray-800">
            <img
              src={question.imgUrl}
              alt="Illustration de la question"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        {/* ── Contenu (droite sur desktop, dessous sur mobile) ── */}
        <div
          className={`flex flex-col gap-5 p-5 md:p-6 flex-1 md:overflow-y-auto ${
            hasImage ? '' : 'w-full'
          }`}
        >
          {/* Texte de la question */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-4">
            <p className="text-base md:text-lg font-semibold text-white leading-snug">
              {question.text}
            </p>
            {multipleValid && (
              <p className="text-xs text-indigo-400 mt-2">
                ✦ Plusieurs bonnes réponses possibles
              </p>
            )}
          </div>

          {/* Réponses */}
          <div className="grid grid-cols-1 gap-3">
            {question.answers.map((answer, i) => {
              const isSelected = selected.has(i)
              return (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-900/30'
                      : 'bg-gray-800/50 border-gray-700 text-gray-200 hover:border-gray-500 hover:bg-gray-800'
                  }`}
                >
                  {/* Checkbox visuelle */}
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-500'
                        : 'border-gray-500 bg-transparent'
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm">{answer.text}</span>
                </button>
              )
            })}
          </div>

          {/* Bouton valider */}
          <button
            onClick={handleValidate}
            className="mt-auto w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-900/40 cursor-pointer"
          >
            {questionIndex + 1 < totalQuestions ? 'Question suivante →' : 'Terminer le quiz'}
          </button>
        </div>
      </div>
    </div>
  )
}

