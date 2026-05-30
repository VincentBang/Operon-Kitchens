import { QuoteAttachment, QuoteInput } from '@/lib/pricing';
import { trackKitchenEvent } from '@/lib/analytics';

interface Props {
  data: QuoteInput;
  onChange: (data: QuoteInput) => void;
  onNext: () => void;
  onBack: () => void;
}

const categories: { value: QuoteAttachment['category']; label: string }[] = [
  { value: 'photo', label: 'Photos' },
  { value: 'plan', label: 'Plans' },
  { value: 'currentQuote', label: 'Current quote' },
  { value: 'other', label: 'Other' },
];

export default function UploadDocumentsStep({ data, onChange, onNext, onBack }: Props) {
  const addFiles = (files: FileList | null, category: QuoteAttachment['category']) => {
    if (!files?.length) return;
    const nextFiles = Array.from(files).map((file) => ({
      id: `${category}-${file.name}-${Date.now()}`,
      name: file.name,
      category,
      size: file.size,
    }));
    onChange({
      ...data,
      supportingFiles: [...data.supportingFiles, ...nextFiles],
      photosProvided: data.photosProvided || category === 'photo' || category === 'plan',
    });
    trackKitchenEvent('file_upload_added', { file_category: category, route: '/quote' });
  };

  return (
    <div className="stepStack">
      <div className="stepIntro">
        <h2>Upload photos, plans or current quote</h2>
        <p>Photos and plans improve estimate confidence. Price confirmation still requires site measure and written scope confirmation.</p>
      </div>
      <div className="formGrid two">
        {categories.map((category) => (
          <label key={category.value} className="uploadBox">
            <span>{category.label}</span>
            <input type="file" multiple accept={category.value === 'currentQuote' ? '.pdf,image/*' : 'image/*,.pdf'} onChange={(event) => addFiles(event.target.files, category.value)} />
          </label>
        ))}
      </div>
      {data.supportingFiles.length > 0 && (
        <div className="quoteResult">
          <h3>Files noted for review</h3>
          <ul className="lineItemList">
            {data.supportingFiles.map((file) => (
              <li key={file.id}>
                <span>{file.name}</span>
                <span>{file.category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="wizardActions">
        <button className="button ghost" onClick={onBack}>Back</button>
        <button className="button primary" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
