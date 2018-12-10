const github = require('./github');

github.webhooks.on('issues.opened', async ({ id, name, payload }) => {
  console.log('Adding label..');

  const client = await github.createRestClient();

  try {
    await client.issues.addLabels({
      labels: ['needs-response'],
      repo: payload.repository.name,
      number: payload.issue.number,
      owner: payload.repository.owner.login
    });
  } catch (e) {
    console.error(e);
  }
});

module.exports = require('http').createServer(github.webhooks.middleware);
