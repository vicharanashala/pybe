import type { Challenge } from '../../types/mission'
import MCQChallengeView from './MCQChallengeView'
import FillChallengeView from './FillChallengeView'
import OrderChallengeView from './OrderChallengeView'

interface Props {
  challenge: Challenge
  onSuccess: () => void
}

export default function ChallengeStep({ challenge, onSuccess }: Props) {
  switch (challenge.type) {
    case 'mcq':
      return <MCQChallengeView challenge={challenge} onSuccess={onSuccess} />
    case 'fill':
      return <FillChallengeView challenge={challenge} onSuccess={onSuccess} />
    case 'order':
      return <OrderChallengeView challenge={challenge} onSuccess={onSuccess} />
    default:
      return null
  }
}
