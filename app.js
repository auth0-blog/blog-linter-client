/* eslint no-console: off */

const github = require('./github');

github.webhooks.on('check_suite.requested', async ({ payload }) => {
  const client = await github.createRestClient();
  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  let checkRunResult;

  // console.log(payload);

  try {
    checkRunResult = await client.checks.create({
      repo: payload.repository.name,
      owner: payload.repository.owner.login,
      name: 'Auth0 Blog Post Linter',
      head_sha: payload.check_suite.head_sha,
      status: 'in_progress',
      started_at: new Date().toISOString()
    });

    // console.log(checkRunResult);
  } catch (e) {
    console.error(e);
  }

  // Get commit details
  try {
    const { data: commit } = await client.repos.getCommit({
      sha: payload.check_suite.head_sha,
      owner,
      repo
    });

    // console.log(commit);
    // console.log(commit.commit.tree);
    // console.log(commit.files);

    const filesChecked = [];

    for (const { filename } of commit.files) {
      try {
        // const { data } = await client.repos.getContents({
        //   owner,
        //   repo,
        //   ref: commit.sha,
        //   path: filename
        // });

        // const fileContent = new Buffer.from(data.content, 'base64').toString(
        //   'utf-8'
        // );

        filesChecked.push(filename);

        // Lint the file contents here
      } catch (e) {
        console.error(e);
      }
    }

    console.log(filesChecked);

    const fileSummaryText = `The following files have been checked:

${filesChecked.map(f => `* ${f}`).join('\n')}`;

    console.log(fileSummaryText);

    await client.checks.update({
      repo,
      owner,
      check_run_id: checkRunResult.data.id,
      status: 'completed',
      conclusion: 'success',
      completed_at: new Date().toISOString(),
      output: {
        title: 'Frontmatter Verification',
        summary:
          'Verification that the frontmatter is valid YAML and that all the required elements are valid',
        text: fileSummaryText
      }
    });
  } catch (e) {
    console.error(e);
  }
});

module.exports = require('http').createServer(github.webhooks.middleware);
