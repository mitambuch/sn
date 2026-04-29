// ═══════════════════════════════════════════════════
// AdminItemDrawer — schema-driven create / edit form for any module
//
// WHAT: Right-side drawer that renders a form for the active module,
//       driven by SCHEMAS[module].fields. Pre-filled when `editingSlug`
//       is provided. Submit → adminStore.createItem | updateItem.
// WHEN: Mounted by AdminCatalogue when "Ajouter" or row click happens.
// ═══════════════════════════════════════════════════

import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';
import { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { type AdminModule, useAdminStore } from '@/store/adminStore';

import { type FieldDef, SCHEMAS } from './schemas';

interface AdminItemDrawerProps {
  open: boolean;
  module: AdminModule;
  /** Slug of the item being edited; null when creating. */
  editingSlug: string | null;
  onClose: () => void;
}

const flattenForForm = (item: Record<string, unknown>): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(item)) {
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      out[k] = String(v);
    }
  }
  // Image flatten: pick first image
  const images = item.images;
  if (
    Array.isArray(images) &&
    images.length > 0 &&
    typeof images[0] === 'object' &&
    images[0] !== null
  ) {
    const first = images[0] as { src?: string; alt?: string };
    if (first.src) out.imageSrc = first.src;
    if (first.alt) out.imageAlt = first.alt;
  }
  // Cover flatten (articles)
  const cover = item.cover;
  if (cover && typeof cover === 'object' && cover !== null) {
    const c = cover as { src?: string; alt?: string };
    if (c.src) out.imageSrc = c.src;
    if (c.alt) out.imageAlt = c.alt;
  }
  // Dimensions flatten (artworks)
  const dims = item.dimensions;
  if (dims && typeof dims === 'object' && dims !== null) {
    const d = dims as { heightCm?: number; widthCm?: number };
    if (d.heightCm) out.heightCm = String(d.heightCm);
    if (d.widthCm) out.widthCm = String(d.widthCm);
  }
  return out;
};

const FieldInput = ({
  field,
  value,
  onChange,
  labelText,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
  labelText: string;
}) => {
  const id = `admin-field-${field.key}`;
  const baseInput =
    'bg-surface/80 border-border focus:border-accent focus:ring-accent text-fg placeholder:text-muted/60 rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none';

  if (field.type === 'textarea') {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-fg text-sm font-medium">
          {labelText}
          {field.required && <span className="text-muted">&nbsp;*</span>}
        </label>
        <textarea
          id={id}
          rows={4}
          required={field.required}
          placeholder={field.placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={baseInput}
        />
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-fg text-sm font-medium">
          {labelText}
          {field.required && <span className="text-muted">&nbsp;*</span>}
        </label>
        <select
          id={id}
          required={field.required}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={baseInput}
        >
          <option value="">—</option>
          {field.options?.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-fg text-sm font-medium">
        {labelText}
        {field.required && <span className="text-muted">&nbsp;*</span>}
      </label>
      <input
        id={id}
        type={
          field.type === 'number'
            ? 'number'
            : field.type === 'datetime'
              ? 'datetime-local'
              : field.type === 'image'
                ? 'url'
                : 'text'
        }
        step={field.step}
        required={field.required}
        placeholder={field.placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={baseInput}
      />
    </div>
  );
};

export const AdminItemDrawer = ({ open, module, editingSlug, onClose }: AdminItemDrawerProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const store = useAdminStore();
  const schema = SCHEMAS[module];

  // WHY: parent passes `key={module + editingSlug}` so this component
  // remounts when the target changes — lazy-init handles seeding without
  // a setState-in-effect violation.
  const [values, setValues] = useState<Record<string, string>>(() => {
    if (editingSlug) {
      const existing = store.getItem(module, editingSlug);
      return existing ? flattenForForm(existing as unknown as Record<string, unknown>) : {};
    }
    return {};
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const setField = (key: string, value: string): void => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const id = editingSlug
      ? ((store.getItem(module, editingSlug) as { id?: string } | undefined)?.id ??
        `${module}-${String(Date.now())}`)
      : `${module}-${String(Date.now())}`;
    const record = schema.toRecord(values, id);
    if (editingSlug) {
      store.updateItem(module, editingSlug, record as never);
      toast({ variant: 'success', message: t('admin.toasts.updated') });
    } else {
      store.createItem(module, record as never);
      toast({ variant: 'success', message: t('admin.toasts.created') });
    }
    onClose();
  };

  const handleDelete = () => {
    if (!editingSlug) return;
    const confirmed = window.confirm(t('admin.confirmDelete'));
    if (!confirmed) return;
    store.removeItem(module, editingSlug);
    toast({ variant: 'success', message: t('admin.toasts.removed') });
    onClose();
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={editingSlug ? t('admin.editTitle') : t('admin.newTitle')}
      className="fixed inset-0 z-(--z-modal)"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.close')}
        className="bg-bg/80 absolute inset-0 backdrop-blur-sm"
      />
      <aside
        className={cn(
          'border-border bg-bg absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col border-l',
          'duration-base motion-safe:animate-in motion-safe:slide-in-from-right',
        )}
      >
        <header className="border-border flex items-start justify-between border-b px-8 py-6">
          <div className="flex flex-col gap-1">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t(`admin.modules.${module}`)}
            </span>
            <h2 className="text-fg text-xl font-light">
              {editingSlug ? t('admin.editTitle') : t('admin.newTitle')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="text-muted hover:text-fg duration-base text-xs tracking-widest uppercase transition-colors"
          >
            ✕
          </button>
        </header>

        <form
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-8 py-8"
          onSubmit={handleSubmit}
        >
          {schema.fields.map(field => (
            <FieldInput
              key={field.key}
              field={field}
              value={values[field.key] ?? ''}
              onChange={v => setField(field.key, v)}
              labelText={t(field.labelKey)}
            />
          ))}

          <div className="border-border mt-4 flex items-center justify-between gap-4 border-t pt-4">
            <button
              type="submit"
              className={cn(
                'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
                'inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm tracking-widest uppercase',
                'duration-base transition-[border-color,background-color]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              )}
            >
              {editingSlug ? t('admin.saveChanges') : t('admin.create')}
              <span aria-hidden="true">→</span>
            </button>
            {editingSlug && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-danger-text hover:text-danger duration-base text-xs tracking-widest uppercase transition-colors"
              >
                {t('admin.deleteAction')}
              </button>
            )}
          </div>
        </form>
      </aside>
    </div>
  );
};
