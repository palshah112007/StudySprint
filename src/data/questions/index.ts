import { mathQuestions } from './mathematics'
import { physicsQuestions } from './physics'
import { chemistryQuestions } from './chemistry'
import { csQuestions } from './computer-science'
import { biologyQuestions } from './biology'
import { aptitudeQuestions } from './aptitude'
import { historyGkQuestions } from './history-gk'

export { mathQuestions } from './mathematics'
export { physicsQuestions } from './physics'
export { chemistryQuestions } from './chemistry'
export { csQuestions } from './computer-science'
export { biologyQuestions } from './biology'
export { aptitudeQuestions } from './aptitude'
export { historyGkQuestions } from './history-gk'

export const ALL_QUESTIONS = [
  ...mathQuestions,
  ...physicsQuestions,
  ...chemistryQuestions,
  ...csQuestions,
  ...biologyQuestions,
  ...aptitudeQuestions,
  ...historyGkQuestions,
]

export const SUBJECTS = [...new Set(ALL_QUESTIONS.map(q => q.subject))]