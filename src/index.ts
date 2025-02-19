import {
  ApprovalVoting,
  QuadraticVoting,
  RankedChoiceVoting,
  SingleChoiceVoting,
  WeightedVoting
} from './voting';

export * from './sign/types';
export * from './sign';
export * as utils from './utils';
export * from './utils/';
export * as schemas from './schemas';

export const VoteClasses = {
  'single-choice': SingleChoiceVoting,
  approval: ApprovalVoting,
  quadratic: QuadraticVoting,
  'ranked-choice': RankedChoiceVoting,
  weighted: WeightedVoting,
  basic: SingleChoiceVoting
};
