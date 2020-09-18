import { GitHub } from '@actions/github/lib/utils';
import { createAppAuth } from '@octokit/auth-app';
import { InstallationAccessTokenData } from '@octokit/auth-app/dist-types/types';

export async function getGithubAppToken(
  appId: string,
  appPrivateKey: string,
  appInstallationId: string
): Promise<InstallationAccessTokenData> {
  const appOctokit = new GitHub({
    authStrategy: createAppAuth,
    auth: {
      id: appId,
      privateKey: appPrivateKey
    },
  });
  const auth = (await appOctokit.auth({
    type: 'installation',
    installationId: appInstallationId,
  })) as InstallationAccessTokenData;

  return auth;
}
