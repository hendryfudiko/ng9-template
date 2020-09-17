import * as core from '@actions/core'
import * as github from '@actions/github'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    const context = github.context
    const prContext = context.payload.pull_request

    const prNumber = prContext?.number
    const token = core.getInput('token')
    const octokit = github.getOctokit(token)
    // octokit.checks.create.endpoint
    // octokit.checks.create()
    console.log('prNumber => ', prNumber)

    if (!prNumber || isNaN(prNumber)) {
      core.setFailed('Pull Request Number Invalid')
      throw new Error('Pull Request Number Invalid')
    }

    const endpoint = octokit.pulls.listFiles.endpoint({
      ...github.context.repo,
      pull_number: prNumber
    })
    console.log('endpoint => ', endpoint)

    const allFiles = await octokit.paginate(endpoint)
    // allFiles.map((file) => file)
    console.log(allFiles.length)
    console.log(github.context)

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
