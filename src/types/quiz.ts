// ─── Forme brute du fichier JSON ─────────────────────────────────────────────

export interface QuizAssets {
  img_url: string
}

export interface QuizQuestionRaw {
  /** Texte de la question */
  answer: string
  /** Liste des réponses correctes */
  valids: string[]
  /** Liste des réponses incorrectes */
  falses: string[]
  /** Ressources associées (image, etc.) */
  assets: QuizAssets
}

export interface QuizRaw {
  /** Nom du quiz */
  name: string
  questions: QuizQuestionRaw[]
}

// ─── Forme parsée et enrichie ─────────────────────────────────────────────────

/** Une réponse dans la liste mélangée, avec son statut de validité */
export interface QuizAnswer {
  text: string
  isValid: boolean
}

/** Une question enrichie avec les réponses déjà mélangées */
export interface QuizQuestion {
  /** Texte de la question */
  text: string
  /** Réponses mélangées (valides + fausses) */
  answers: QuizAnswer[]
  /** URL de l'image associée */
  imgUrl: string
}

/** Informations globales du quiz calculées lors du parsing */
export interface QuizInfo {
  name: string
  totalQuestions: number
  questions: QuizQuestion[]
}

// ─── État pendant l'exécution du quiz ────────────────────────────────────────

/** Index des réponses sélectionnées par le joueur pour la question courante */
export type AnswerSelection = Set<number>

/** Résultat cumulé sur l'ensemble du quiz */
export interface QuizResult {
  /** Nombre total de bonnes réponses cochées */
  validResponse: number
  /** Nombre total de mauvaises réponses cochées */
  falsesResponse: number
  /** Score final sur 100 */
  score: number
}
