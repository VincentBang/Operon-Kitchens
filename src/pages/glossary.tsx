import { GetServerSideProps } from 'next';
import { GlossaryRecord, listGlossary } from '@/lib/adminData';

interface Props {
  terms: GlossaryRecord[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return { props: { terms: listGlossary(false) } };
};

export default function GlossaryPage({ terms }: Props) {
  return (
    <main>
      <section className="contentHero slim">
        <div>
          <p className="eyebrow">Planning language</p>
          <h1 className="contentTitle">Kitchen glossary</h1>
        </div>
        <p className="muted">Understand common kitchen and cabinetry terminology to help you navigate your renovation with confidence.</p>
      </section>
      <section className="contentPage">
      <div className="definitionList">
        {terms.map(({ term, definition }) => (
          <article key={term}>
            <h3>{term}</h3>
            <p>{definition}</p>
          </article>
        ))}
      </div>
      </section>
    </main>
  );
}
