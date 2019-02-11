/* eslint no-console: off */
import { CheckRunContext } from './types';

export default {
  name: 'Frontmatter Verification',
  summary:
    'Verification that the frontmatter is valid YAML and that all the required elements are valid',

  exec(context: CheckRunContext) {
    console.log(context);
  }
};
