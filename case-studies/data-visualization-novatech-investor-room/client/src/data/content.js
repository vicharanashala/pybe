// Bundled copy of the case-study content. The API serves the very same files from /shared,
// so the app works offline and the two sources can never disagree.
import caseStudy from '../../../shared/caseStudy.json';
import plots from '../../../shared/plots.json';
import quiz from '../../../shared/quiz.json';

export const bundled = { caseStudy, plots, quiz };

export {codeFor,chartImage} from './assetManifest.js';
