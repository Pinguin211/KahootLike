import type { QuizRaw, QuizInfo, QuizQuestion } from '../types/quiz'

// ─── Utilitaires internes ────────────────────────────────────────────────────

/** Mélange un tableau en place (Fisher-Yates) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── API publique ────────────────────────────────────────────────────────────

/**
 * Charge et retourne le JSON brut d'un quiz depuis une URL.
 * Lève une Error si le fetch échoue ou si la réponse n'est pas OK.
 */
export async function loadQuiz(url: string): Promise<QuizRaw> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Impossible de charger le quiz : ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<QuizRaw>
}

/**
 * Transforme un QuizRaw en QuizInfo exploitable :
 * - Mélange les réponses (valides + fausses)
 * - Calcule le nombre total de questions
 */
export function parseQuiz(raw: QuizRaw): QuizInfo {
  const questions: QuizQuestion[] = raw.questions.map((q) => {
    const validAnswers = q.valids.map((text) => ({ text, isValid: true }))
    const falseAnswers = q.falses.map((text) => ({ text, isValid: false }))
    const answers = shuffle([...validAnswers, ...falseAnswers])

    return {
      text: q.answer,
      answers,
      imgUrl: q.assets.img_url,
    }
  })

  return {
    name: raw.name,
    totalQuestions: questions.length,
    questions,
  }
}

/**
 * Calcule le score final sur 100 en tenant compte des bonnes et mauvaises réponses.
 *
 * Formule : score = max(0, (validResponse - falsesResponse) / allQuestions) × 100
 *
 * - Chaque bonne réponse cochée contribue positivement.
 * - Chaque mauvaise réponse cochée pénalise (soustraction).
 * - Le score ne peut pas descendre sous 0.
 * - Si allQuestions = 0, retourne 0 pour éviter une division par zéro.
 *
 * @param validResponse  Nombre de bonnes réponses cochées par le joueur
 * @param falsesResponse Nombre de mauvaises réponses cochées par le joueur
 * @param allQuestions   Nombre total de bonnes réponses possibles dans le quiz
 */
export function evaluate(
  validResponse: number,
  falsesResponse: number,
  allQuestions: number,
): number {
  if (allQuestions === 0) return 0
  const raw = (validResponse - falsesResponse) / allQuestions
  return Math.round(Math.max(0, raw) * 100)
}
