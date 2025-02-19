import { SingleChoiceVoting } from './singleChoice';
import { ApprovalVoting } from './approval';
import { QuadraticVoting } from './quadratic';
import { RankedChoiceVoting } from './rankedChoice';
import { WeightedVoting } from './weighted';

export default {
  'single-choice': SingleChoiceVoting,
  approval: ApprovalVoting,
  quadratic: QuadraticVoting,
  'ranked-choice': RankedChoiceVoting,
  weighted: WeightedVoting,
  basic: SingleChoiceVoting
};

export const VoteClasses: {
  'single-choice': typeof SingleChoiceVoting;
  approval: typeof ApprovalVoting;
  quadratic: typeof QuadraticVoting;
  'ranked-choice': typeof RankedChoiceVoting;
  weighted: typeof WeightedVoting;
  basic: typeof SingleChoiceVoting;
} = {
  'single-choice': SingleChoiceVoting,
  approval: ApprovalVoting,
  quadratic: QuadraticVoting,
  'ranked-choice': RankedChoiceVoting,
  weighted: WeightedVoting,
  basic: SingleChoiceVoting
};
