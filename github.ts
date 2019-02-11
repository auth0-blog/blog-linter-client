import App from '@octokit/app';
import Rest from '@octokit/rest';
import request from '@octokit/request';
import WebhooksApi from '@octokit/webhooks';

const fs = require('fs');
const path = require('path');

if (!process.env.GITHUB_APP_IDENTIFIER) {
  throw 'No GitHub app identifier specified';
}

if (!process.env.GITHUB_WEBHOOK_SECRET) {
  throw 'No Webhook secret key specified';
}

const appId = parseInt(process.env.GITHUB_APP_IDENTIFIER);
let privateKey = process.env.GITHUB_PRIVATE_KEY;
const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

if (!privateKey) {
  privateKey = fs.readFileSync(
    path.join(__dirname, 'private-key.pem'),
    'utf-8'
  );
}

const webhooks = new WebhooksApi({
  secret: process.env.GITHUB_WEBHOOK_SECRET
});

const app = new App({
  id: appId,
  privateKey
});

export default {
  webhooks,
  async createRestClient(): Promise<Rest> {
    const token = await this.getInstallationToken();
    const rest = new Rest({
      accept:
        'application/vnd.github.v3+json, application/vnd.github.antiope-preview+json',
      'user-agent': 'octokit/rest.js v16.1.0'
    });

    console.log(token);

    rest.authenticate({
      type: 'app',
      token: token.token
    });

    return rest;
  },

  async getInstallationId() {
    const jwt = app.getSignedJsonWebToken();

    const result = await request('GET /repos/:owner/:repo/installation', {
      owner: 'elkdanger',
      repo: 'blog-1',
      headers: {
        authorization: `Bearer ${jwt}`,
        accept: 'application/vnd.github.machine-man-preview+json'
      }
    });

    return result.data.id;
  },

  async getInstallationToken() {
    const installationId = await this.getInstallationId();

    return await app.getInstallationAccesToken({ installationId });
  },

  /**
   * Creates a new check run from a 'check run requested' event object
   * @param {The GitHub client} client
   * @param {The checkrun request object} request
   * @param {The name of the check} name
   * @param {The initial status} status
   */
  async createCheckFromRequest(
    client: Rest,
    payload: WebhooksApi.WebhookPayloadCheckSuite,
    name: string,
    status: 'queued' | 'in_progress' | 'completed' = 'in_progress'
  ): Promise<Rest.Response<Rest.ChecksCreateResponse>> {
    const checkRunResult = await client.checks.create({
      repo: payload.repository.name,
      owner: payload.repository.owner.login,
      name,
      head_sha: payload.check_suite.head_sha,
      status,
      started_at: new Date().toISOString()
    });

    return checkRunResult;
  }
};
