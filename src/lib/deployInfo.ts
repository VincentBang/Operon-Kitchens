export const OPERON_KITCHENS_APP_VERSION = '2026-05-31-quote-safety-pass';

const safeEnvironmentKeys = [
  'COMMIT_REF',
  'BRANCH',
  'CONTEXT',
  'DEPLOY_PRIME_URL',
  'NEXT_PUBLIC_SITE_VERSION',
] as const;

type SafeEnvironmentKey = typeof safeEnvironmentKeys[number];

export interface DeployInfo {
  appName: string;
  appVersion: string;
  buildLabel: string;
  gitCommit: string;
  branch: string;
  buildContext: string;
  deployPrimeUrl: string;
  siteVersion: string;
  buildTimestamp: string;
  expectedCopy: {
    hero: string;
    chatbot: string;
    footerSpacingFixed: 'yes';
  };
}

function readSafeEnv(key: SafeEnvironmentKey) {
  return process.env[key] || 'not available';
}

export function getDeployInfo(): DeployInfo {
  return {
    appName: 'Operon Kitchens',
    appVersion: OPERON_KITCHENS_APP_VERSION,
    buildLabel: process.env.NEXT_PUBLIC_SITE_VERSION || OPERON_KITCHENS_APP_VERSION,
    gitCommit: readSafeEnv('COMMIT_REF'),
    branch: readSafeEnv('BRANCH'),
    buildContext: readSafeEnv('CONTEXT'),
    deployPrimeUrl: readSafeEnv('DEPLOY_PRIME_URL'),
    siteVersion: readSafeEnv('NEXT_PUBLIC_SITE_VERSION'),
    buildTimestamp: process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || process.env.BUILD_TIMESTAMP || 'not available',
    expectedCopy: {
      hero: 'Sydney kitchen renovation estimates and quote review before you commit.',
      chatbot: 'Need help with scope? Ask Operon',
      footerSpacingFixed: 'yes',
    },
  };
}
