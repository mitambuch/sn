// ═══════════════════════════════════════════════════
// SegmentCreateForm — create one audience segment
//
// WHAT: slug + label + optional note form. Validates the slug client-side
//       (mirrors the DB check ^[a-z0-9-]{2,40}$), then delegates the insert
//       to the parent. Keeps its own field state so AdminSegments stays lean.
// WHEN: top of the /admin/segments page.
// ═══════════════════════════════════════════════════

import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Textarea } from '@components/ui/Textarea';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SLUG_RE = /^[a-z0-9-]{2,40}$/;

interface SegmentCreateFormProps {
  /** Insert the segment; resolves ok/error (error mapped to slug/toast). */
  onCreate: (
    slug: string,
    label: string,
    description?: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  /** Surface a non-slug error (network etc.) as a toast in the parent. */
  onError: (message: string) => void;
  /** Surface success in the parent (toast). */
  onSuccess: (label: string) => void;
}

export const SegmentCreateForm = ({ onCreate, onError, onSuccess }: SegmentCreateFormProps) => {
  const { t } = useTranslation();
  const [slug, setSlug] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [slugError, setSlugError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const cleanSlug = slug.trim().toLowerCase();
    const cleanLabel = label.trim();
    if (!SLUG_RE.test(cleanSlug)) {
      setSlugError(t('admin.segments.slugInvalid'));
      return;
    }
    if (!cleanLabel) return;
    setSlugError(null);
    setSubmitting(true);
    const result = await onCreate(cleanSlug, cleanLabel, description.trim() || undefined);
    setSubmitting(false);
    if (!result.ok) {
      if (/duplicate|unique|already exists/i.test(result.error ?? '')) {
        setSlugError(t('admin.segments.slugTaken'));
      } else {
        onError(result.error ?? t('common.error'));
      }
      return;
    }
    onSuccess(cleanLabel);
    setSlug('');
    setLabel('');
    setDescription('');
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        void handleSubmit();
      }}
      className="border-border bg-surface/40 space-y-4 rounded-lg border p-5 md:p-6"
    >
      <h2 className="text-fg font-mono text-sm tracking-widest uppercase">
        {t('admin.segments.createTitle')}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label={t('admin.segments.slugLabel')}
          value={slug}
          onChange={e => {
            setSlug(e.target.value);
            if (slugError) setSlugError(null);
          }}
          placeholder={t('admin.segments.slugPlaceholder')}
          helperText={t('admin.segments.slugHint')}
          {...(slugError ? { error: slugError } : {})}
          autoComplete="off"
        />
        <Input
          label={t('admin.segments.nameLabel')}
          value={label}
          onChange={e => {
            setLabel(e.target.value);
          }}
          placeholder={t('admin.segments.namePlaceholder')}
          autoComplete="off"
        />
      </div>
      <Textarea
        label={t('admin.segments.descriptionLabel')}
        value={description}
        onChange={e => {
          setDescription(e.target.value);
        }}
        placeholder={t('admin.segments.descriptionPlaceholder')}
        rows={2}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          isLoading={submitting}
          disabled={!slug.trim() || !label.trim()}
        >
          {t('admin.segments.create')}
        </Button>
      </div>
    </form>
  );
};
