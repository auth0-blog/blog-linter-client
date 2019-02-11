import Webhooks from '@octokit/webhooks';

export type CheckRunContext = {
  payload: Webhooks.WebhookPayloadCheckSuite;
}