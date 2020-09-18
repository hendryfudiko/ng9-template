import * as core from '@actions/core';
import * as github from '@actions/github';

import { getGithubAppToken } from '~shared/authentication';

async function run(): Promise<void> {
  try {
    const appId = core.getInput('APP_ID');
    const appPrivateKey = core.getInput('APP_PRIVATE_KEY');
    const appInstallationId = core.getInput('APP_INSTALLATION_ID');
    const lintCheckName = core.getInput('LINT_CHECK_NAME');
    const { token } = await getGithubAppToken(
      appId,
      appPrivateKey,
      appInstallationId
    );

    const octokit = github.getOctokit(token);

    const context = github.context;
    const prContext = context.payload.pull_request;
    const prNumber = prContext?.number;

    const spawnCheck = await octokit.checks.create({
      ...context.repo,
      name: lintCheckName,
      head_sha: context.payload.after,
      status: 'in_progress'
    });
    console.log('----------- start spawnCheck.data -----------');
    console.log(spawnCheck.data);
    console.log('----------- end spawnCheck.data -----------');

    const spawnCheckOne = await octokit.checks.update({
      ...context.repo,
      check_run_id: spawnCheck.data.id,
      status: 'completed',
      conclusion: 'success'
    });
    console.log('----------- start spawnCheckOne.data -----------');
    console.log(spawnCheckOne.data);
    console.log('----------- end spawnCheckOne.data -----------');

    // octokit.checks.create.endpoint
    // octokit.checks.create()
    console.log('prNumber => ', prNumber);

    if (!prNumber || isNaN(prNumber)) {
      core.setFailed('Pull Request Number Invalid');
      throw new Error('Pull Request Number Invalid');
    }

    const endpoint = octokit.pulls.listFiles.endpoint({
      ...context.repo,
      pull_number: prNumber
    });
    console.log('endpoint => ', endpoint);

    const allFiles = await octokit.paginate(endpoint);
    // allFiles.map((file) => file)
    console.log(allFiles.length);
    console.log(github.context);

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
