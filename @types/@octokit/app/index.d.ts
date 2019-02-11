declare module '@octokit/app' {
  export type AppOptions = {
    id?: number;
    privateKey?: string;
  };

  /**
   * Arguments for getInstallationAccesToken()
   */
  export interface InstallationAccessTokenArgs {
    installationId: number;
  }

  /**
   * Result type for getInstallationAccesToken()
   */
  export interface InstallationAccessTokenResult {
    token: string;
    expires_at: string;
  }

  /**
   * A GitHub application
   */
  export default class App {
    constructor(options?: AppOptions);
    getSignedJsonWebToken(): string;
    getInstallationAccesToken(args: InstallationAccessTokenArgs): Promise<InstallationAccessTokenResult>;
  }
}
