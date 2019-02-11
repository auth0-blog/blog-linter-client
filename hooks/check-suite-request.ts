/* eslint no-console: off */
import GitHub from '../github';
import * as Webhooks from '@octokit/webhooks';

// Checks
import frontmatterCheck from '../checks/frontmatter';

const availableChecks = [frontmatterCheck];

export default async function(
  evt: Webhooks.WebhookEvent<Webhooks.WebhookPayloadCheckSuite>
): Promise<any> {
  const client = await GitHub.createRestClient();
  const owner = evt.payload.repository.owner.login;
  const repo = evt.payload.repository.name;

  // Get commit details
  try {
    const { data: commit } = await client.repos.getCommit({
      sha: evt.payload.check_suite.head_sha,
      owner,
      repo
    });

    console.log(commit);
    console.log(commit.commit.tree);
    console.log(commit.files);

    const filesChecked: Array<string> = [];

    // for (const { filename } of commit.files) {
    //   try {
    //     // const { data } = await client.repos.getContents({
    //     //   owner,
    //     //   repo,
    //     //   ref: commit.sha,
    //     //   path: filename
    //     // });

    //     // const fileContent = new Buffer.from(data.content, 'base64').toString(
    //     //   'utf-8'
    //     // );

    //     filesChecked.push(filename);

    //     // Lint the file contents here
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }

    console.log(filesChecked);

    availableChecks.forEach(async check => {
      const checkRun = await GitHub.createCheckFromRequest(
        client,
        evt.payload,
        check.name
      );

      // Run the check here
      check.exec({
        payload: evt.payload
      });

      const fileSummaryText = `The following files have been checked:
        ${filesChecked.map(f => `* ${f}`).join('\n')}`;

      console.log(fileSummaryText);

      await client.checks.update({
        repo,
        owner,
        check_run_id: checkRun.data.id,
        status: 'completed',
        conclusion: 'success',
        completed_at: new Date().toISOString(),
        output: {
          title: frontmatterCheck.name,
          summary: frontmatterCheck.summary,
          text: fileSummaryText
        }
      });
    });
  } catch (e) {
    console.error(e);
  }
}
