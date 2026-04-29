// ═══════════════════════════════════════════════════
// ImageUpload — multi-image picker with thumbnail preview
//
// WHAT: A small uploader that lets the user attach up to N photos to an
//       inquiry. Files stay client-side as object URLs (no network call
//       in lot B); previews render as monochrome thumbnails with remove.
// WHEN: Embedded in inquiry drawers (free-form, jet, item-specific) so
//       members can send a reference photo with their request.
// CHANGE LIMIT: edit `maxFiles` prop default (3 by default).
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import { ImagePlus, X } from 'lucide-react';
import { type ChangeEvent, useEffect, useId, useRef, useState } from 'react';

interface ImageUploadProps {
  label: string;
  hint?: string;
  maxFiles?: number;
  className?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  url: string;
}

export const ImageUpload = ({ label, hint, maxFiles = 3, className }: ImageUploadProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  // WHY: object URLs leak memory if not revoked when the component unmounts
  // or files are replaced. Keep cleanup tight even though lot B is short-lived.
  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    if (incoming.length === 0) return;
    const slots = maxFiles - files.length;
    const next: UploadedFile[] = incoming.slice(0, slots).map((f, i) => ({
      id: `${String(Date.now())}-${String(i)}`,
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setFiles(prev => [...prev, ...next]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = (id: string) => {
    setFiles(prev => {
      const removed = prev.find(f => f.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter(f => f.id !== id);
    });
  };

  const canAdd = files.length < maxFiles;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className="text-fg text-sm font-medium">
        {label}
      </label>
      {hint && <p className="text-muted text-xs leading-relaxed">{hint}</p>}

      <div className="grid grid-cols-3 gap-2">
        {files.map(f => (
          <div
            key={f.id}
            className="border-border bg-surface group relative aspect-square overflow-hidden rounded-md border"
          >
            <img src={f.url} alt={f.name} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(f.id)}
              aria-label={`Remove ${f.name}`}
              className={cn(
                'bg-bg/80 text-fg absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-full',
                'opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
                'focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none',
              )}
            >
              <X size={14} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        ))}

        {canAdd && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              'border-border bg-surface/40 hover:border-fg/50 hover:bg-surface text-muted hover:text-fg',
              'flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed',
              'duration-base transition-[border-color,background-color,color]',
              'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
          >
            <ImagePlus size={18} strokeWidth={1.5} aria-hidden="true" />
            <span className="text-[10px] tracking-widest uppercase">
              {files.length}/{maxFiles}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handleSelect}
      />
    </div>
  );
};
