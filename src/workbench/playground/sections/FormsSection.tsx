import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { Textarea } from '@components/ui/Textarea';
import { Eye, EyeOff, Search, Upload } from 'lucide-react';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { Section, SpecimenFrame } from '../shared';
import type { TagList } from '../tags';

type Specimen = {
  id: string;
  tags: TagList;
  ethos: string;
  path: string;
  Component: () => ReactElement;
};

/* ─── Specimen components ─────────────────────────────── */

const FloatingLabel = () => {
  const [value, setValue] = useState('');
  const filled = value.length > 0;
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        id="fl-demo"
        placeholder=" "
        className="border-border/60 bg-bg text-fg focus:border-accent peer w-full rounded-lg border px-4 pt-5 pb-2 text-sm transition-colors outline-none"
      />
      <label
        htmlFor="fl-demo"
        className={`pointer-events-none absolute left-4 origin-left text-sm transition-all ${
          filled
            ? 'text-accent-text top-1.5 translate-y-0 scale-[0.75]'
            : 'text-muted peer-focus:text-accent-text top-3.5 peer-focus:top-1.5 peer-focus:scale-[0.75]'
        }`}
      >
        Adresse e-mail
      </label>
    </div>
  );
};

const InlineSearch = () => (
  <div className="border-border/60 bg-surface/40 focus-within:border-accent/50 duration-base flex w-full max-w-md items-center gap-2 rounded-full border px-4 py-2 transition-colors">
    <Search size={14} strokeWidth={2} className="text-muted shrink-0" />
    <input
      type="search"
      placeholder="Chercher dans le projet…"
      className="text-fg placeholder:text-muted flex-1 bg-transparent text-sm outline-none"
    />
    <span className="border-border/60 bg-bg text-muted rounded-md border px-1.5 py-0.5 font-mono text-[10px]">
      ⌘K
    </span>
  </div>
);

const PasswordVisibility = () => {
  const [value, setValue] = useState('azerty1234');
  const [shown, setShown] = useState(false);
  return (
    <div className="w-full max-w-md space-y-1.5">
      <label htmlFor="pw-demo" className="text-fg text-xs font-medium tracking-tight">
        Mot de passe
      </label>
      <div className="border-border/60 bg-bg focus-within:border-accent/50 duration-base flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors">
        <input
          id="pw-demo"
          type={shown ? 'text' : 'password'}
          value={value}
          onChange={e => setValue(e.target.value)}
          className="text-fg flex-1 bg-transparent text-sm tracking-widest outline-none"
        />
        <button
          type="button"
          onClick={() => setShown(v => !v)}
          aria-label={shown ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          className="text-muted hover:text-fg duration-base transition-colors"
        >
          {shown ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
        </button>
      </div>
      <p className="text-muted text-xs">8 caractères minimum · 1 chiffre · 1 symbole</p>
    </div>
  );
};

const AddressGroup = () => (
  <div className="grid w-full max-w-md grid-cols-6 gap-3">
    <div className="col-span-6">
      <Input label="Rue" placeholder="14 rue des Fauvettes" />
    </div>
    <div className="col-span-2">
      <Input label="NPA" placeholder="1003" />
    </div>
    <div className="col-span-4">
      <Input label="Ville" placeholder="Lausanne" />
    </div>
  </div>
);

const CheckboxList = () => {
  const [state, setState] = useState({ newsletter: true, marketing: false, updates: true });
  return (
    <fieldset className="w-full max-w-md space-y-3">
      <legend className="text-fg mb-1 text-xs font-medium tracking-tight">Notifications</legend>
      {(
        [
          ['newsletter', 'Newsletter mensuelle'],
          ['marketing', 'Offres marketing'],
          ['updates', 'Mises à jour produit'],
        ] as const
      ).map(([key, label]) => {
        const id = `cb-${key}`;
        return (
          <div
            key={key}
            className="border-border/50 hover:border-accent/30 duration-base flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors"
          >
            <input
              id={id}
              type="checkbox"
              checked={state[key]}
              onChange={e => setState(s => ({ ...s, [key]: e.target.checked }))}
              className="accent-accent h-4 w-4"
            />
            <label htmlFor={id} className="text-fg flex-1 cursor-pointer text-sm">
              {label}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
};

const FileUpload = () => {
  const [name, setName] = useState<string | null>(null);
  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={() => document.getElementById('file-demo')?.click()}
        className="border-border/60 bg-surface/40 hover:border-accent/50 hover:bg-surface group duration-base flex w-full flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-6 transition-colors"
      >
        <Upload
          size={22}
          strokeWidth={1.5}
          className="text-muted group-hover:text-accent-text duration-base transition-colors"
        />
        <span className="text-fg text-sm font-medium tracking-tight">
          {name ?? (
            <>
              Glisse un fichier ou <span className="text-accent-text">parcours</span>
            </>
          )}
        </span>
        <span className="text-muted font-mono text-[10px] tracking-wider uppercase">
          JPG · PNG · WEBP · 5 MB max
        </span>
      </button>
      <input
        id="file-demo"
        type="file"
        className="sr-only"
        accept="image/*"
        aria-label="Upload file"
        onChange={e => setName(e.target.files?.[0]?.name ?? null)}
      />
    </div>
  );
};

const QuantityStepper = () => {
  const [n, setN] = useState(3);
  return (
    <div className="flex w-full max-w-md flex-col gap-1.5">
      <span className="text-fg text-xs font-medium tracking-tight">Quantité</span>
      <div className="border-border/60 inline-flex w-fit items-stretch overflow-hidden rounded-full border">
        <button
          type="button"
          aria-label="Décrémenter"
          onClick={() => setN(v => Math.max(0, v - 1))}
          className="text-fg hover:bg-surface duration-base h-9 w-9 transition-colors"
        >
          −
        </button>
        <span className="border-border/60 bg-bg text-fg flex h-9 w-14 items-center justify-center border-x font-mono text-sm font-semibold tabular-nums">
          {n}
        </span>
        <button
          type="button"
          aria-label="Incrémenter"
          onClick={() => setN(v => v + 1)}
          className="text-fg hover:bg-surface duration-base h-9 w-9 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};

/* ─── Specimens array ───────────────────────────────── */

const SPECIMENS: Specimen[] = [
  {
    id: 'floating-label',
    path: 'inline · floating label input',
    tags: ['product', 'minimal'],
    ethos: 'label qui flotte quand rempli · signup moderne',
    Component: FloatingLabel,
  },
  {
    id: 'inline-search',
    path: 'inline · search pill + ⌘K',
    tags: ['product', 'technical'],
    ethos: 'recherche pill · kbd chip · command palette feel',
    Component: InlineSearch,
  },
  {
    id: 'password-visibility',
    path: 'inline · password + eye toggle',
    tags: ['product'],
    ethos: 'password + afficher/masquer · helper règles',
    Component: PasswordVisibility,
  },
  {
    id: 'address-group',
    path: 'inline · grid 6-col grouped',
    tags: ['product'],
    ethos: '3 inputs grid · rue 6 · NPA 2 · ville 4',
    Component: AddressGroup,
  },
  {
    id: 'checkbox-list',
    path: 'inline · bordered checkboxes',
    tags: ['product'],
    ethos: '3 options notifications · hover outline',
    Component: CheckboxList,
  },
  {
    id: 'file-upload',
    path: 'inline · dashed dropzone',
    tags: ['product'],
    ethos: 'dropzone dashed · format + taille visible',
    Component: FileUpload,
  },
  {
    id: 'quantity-stepper',
    path: 'inline · − value + pill',
    tags: ['product', 'technical'],
    ethos: 'qty stepper · pill 3 segments',
    Component: QuantityStepper,
  },
];

export function FormsSection() {
  return (
    <Section number="05" title="form inputs">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Atomes de base + 7 specimens d'inputs composés. Floating label, search pill, password
        toggle, address grid, checkbox list, file upload, quantity stepper — tous tokens-only,
        tagués, responsive.
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">
        · core atoms
      </h3>
      <div className="mb-10 grid max-w-md gap-4">
        <Input label="Input default" placeholder="Tape quelque chose…" />
        <Input label="Avec helper" helperText="Indication contextuelle" />
        <Input label="Avec erreur" error="Ce champ est requis" />
        <Textarea label="Textarea" placeholder="Message multi-ligne…" />
        <Select
          label="Select"
          placeholder="Choisir une langue"
          options={[
            { value: 'fr', label: 'Français' },
            { value: 'en', label: 'English' },
            { value: 'de', label: 'Deutsch' },
          ]}
        />
      </div>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· specimens</h3>
      <div className="grid gap-4 lg:grid-cols-2">
        {SPECIMENS.map(({ id, path, tags, ethos, Component }) => (
          <SpecimenFrame key={id} id={id} path={path} tags={tags} ethos={ethos} centered={false}>
            <Component />
          </SpecimenFrame>
        ))}
      </div>
    </Section>
  );
}
