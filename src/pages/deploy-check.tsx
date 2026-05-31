import Head from 'next/head';
import { getDeployInfo } from '@/lib/deployInfo';

const deployInfo = getDeployInfo();

const rows = [
  ['App name', deployInfo.appName],
  ['Current build label', deployInfo.buildLabel],
  ['App version', deployInfo.appVersion],
  ['Git commit', deployInfo.gitCommit],
  ['Branch', deployInfo.branch],
  ['Build context', deployInfo.buildContext],
  ['Deploy URL', deployInfo.deployPrimeUrl],
  ['Site version env', deployInfo.siteVersion],
  ['Build timestamp', deployInfo.buildTimestamp],
  ['Footer spacing fixed', deployInfo.expectedCopy.footerSpacingFixed],
];

export default function DeployCheckPage() {
  return (
    <main className="contentPage articleBody">
      <Head>
        <title>Deploy check | Operon Kitchens</title>
        <meta
          name="description"
          content="Public Operon Kitchens deployment fingerprint for confirming live build version and expected copy."
        />
      </Head>
      <p className="eyebrow">Deployment fingerprint</p>
      <h1 className="contentTitle">Operon Kitchens deploy check</h1>
      <p>
        This public page shows safe build metadata and expected public-copy markers. It does not expose private credentials, database connection details or internal pricing data.
      </p>

      <section>
        <h2>Build information</h2>
        <dl className="deployCheckList">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || 'not available'}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>Expected public copy</h2>
        <dl className="deployCheckList">
          <div>
            <dt>Hero</dt>
            <dd>{deployInfo.expectedCopy.hero}</dd>
          </div>
          <div>
            <dt>Chatbot</dt>
            <dd>{deployInfo.expectedCopy.chatbot}</dd>
          </div>
          <div>
            <dt>Footer spacing fixed</dt>
            <dd>{deployInfo.expectedCopy.footerSpacingFixed}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
