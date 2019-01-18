const App = require('@octokit/app');
const Rest = require('@octokit/rest');
const request = require('@octokit/request');
const WebhooksApi = require('@octokit/webhooks');
const fs = require('fs');
const path = require('path');

const appId = parseInt(process.env.GITHUB_APP_IDENTIFIER);
let privateKey = process.env.GITHUB_PRIVATE_KEY;
const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

if (!appId || !webhookSecret) {
  throw 'You must specify an app ID, GitHub private key and a webhook secret';
}

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

module.exports = {
  webhooks,
  async createRestClient() {
    const token = await this.getInstallationToken();
    const rest = new Rest({
      accept:
        'application/vnd.github.v3+json, application/vnd.github.antiope-preview+json',
      'user-agent': 'octokit/rest.js v16.1.0'
    });

    rest.authenticate({
      type: 'app',
      token
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
  }
};
