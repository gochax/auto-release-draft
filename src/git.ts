import { exec } from '@actions/exec'
import * as core from '@actions/core'

export async function getChangesIntroducedByTag(
  tag: string): Promise<string> {
    const previousVersionTag = await getPreviousVersionTag(tag)

    return previousVersionTag
      ? getCommitMessagesBetween(previousVersionTag, tag)
      : getCommitMessagesFrom(tag)
}

export async function getPreviousVersionTag(
  tag: string): Promise<string | null> {
    let previousTag = ''

    const options: exec.ExecOptions = {
      listeners: {
        stdout: (data: Buffer) => {
          previousTag += data.toString()
        }
      },
      silent: true,
      ignoreReturnCode: true
    }

    const exitCode = await exec(
      'git',
      ['describe',
      'match', 'v[0-9]*',
      '--abbrev = 0',
      '${tag}^'],
      options)

      core.debug(`The previous version tag is ${previousTag}`)

      return exitCode === 0 ? previousTag.trim() : null
  }

  export async function getCommitMessagesBetween(
    firstTag: string,
    secondTag: string,): Promise<string | null> {
      let commitMessages = ''
  
      const options: exec.ExecOptions = {
        listeners: {
          stdout: (data: Buffer) => {
            commitMessages += data.toString()
          }
        },
        silent: true
      }
  
      const exitCode = await exec(
        'git',
        ['log',
        '--format=%s',
        `${firstTag}..${secondTag}`],
        options);
  
        core.debug(`The commit messages between ${firstTag} and ${secondTag} are:\n${commitMessages}`)
  
        return commitMessages.trim();
    }

  export async function getCommitMessagesFrom(
    tag: string): Promise<string | null> {
      let commitMessages = ''
  
      const options: exec.ExecOptions = {
        listeners: {
          stdout: (data: Buffer) => {
            commitMessages += data.toString()
          }
        },
        silent: true
      }
  
      const exitCode = await exec(
        'git',
        ['log',
        '--format=%s',
        tag],
        options);
  
        core.debug(`The commit messages between ${tag} are:\n${commitMessages}`)
  
        return commitMessages.trim();
    }