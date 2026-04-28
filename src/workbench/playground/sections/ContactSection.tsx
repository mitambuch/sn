import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { Textarea } from '@components/ui/Textarea';
import { useToast } from '@hooks/useToast';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
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

const SplitFormInfo = () => (
  <div className="grid w-full max-w-3xl gap-8 md:grid-cols-[1fr_1fr] md:gap-10">
    <div>
      <h3 className="text-fg text-xl font-semibold tracking-tight md:text-2xl">
        Parlons de ton projet
      </h3>
      <p className="text-muted mt-2 text-sm leading-relaxed">
        On répond en 24h, du lundi au vendredi. Pour les urgences, appelle directement.
      </p>
      <ul className="mt-6 space-y-3">
        {[
          { Icon: Mail, label: 'hello@steaksoap.studio' },
          { Icon: Phone, label: '+41 21 555 42 42' },
          { Icon: MapPin, label: 'Lausanne, Suisse' },
          { Icon: Clock, label: 'Lun–Ven · 9h–18h' },
        ].map(({ Icon, label }) => (
          <li key={label} className="text-fg flex items-center gap-3 text-sm">
            <Icon size={14} strokeWidth={2} className="text-accent-text" />
            {label}
          </li>
        ))}
      </ul>
    </div>
    <form className="space-y-3">
      <Input label="Nom" placeholder="Jane Doe" />
      <Input label="Email" type="email" placeholder="jane@studio.com" />
      <Textarea label="Message" placeholder="Parle-nous de ton projet…" />
      <Button className="w-full">Envoyer</Button>
    </form>
  </div>
);

const InlineCompactContact = () => (
  <form className="border-border/60 bg-surface/30 w-full max-w-2xl rounded-2xl border p-3 sm:rounded-full sm:p-2">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="email"
        placeholder="ton@email.com"
        aria-label="Adresse email"
        className="text-fg placeholder:text-muted flex-1 bg-transparent px-4 py-2 text-sm outline-none"
      />
      <span className="bg-border/60 hidden h-6 w-px sm:block" />
      <input
        type="text"
        placeholder="Ton message en une ligne…"
        aria-label="Message"
        className="text-fg placeholder:text-muted flex-1 bg-transparent px-4 py-2 text-sm outline-none"
      />
      <Button size="sm" className="w-full shrink-0 sm:w-auto">
        Envoyer
      </Button>
    </div>
  </form>
);

const MultiStepContact = () => {
  const [step, setStep] = useState(1);
  return (
    <div className="border-border/60 w-full max-w-md rounded-xl border p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        {[1, 2, 3].map(n => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold ${
                n === step
                  ? 'bg-accent text-on-accent'
                  : n < step
                    ? 'bg-success/20 text-success-text'
                    : 'bg-surface text-muted'
              }`}
            >
              {n}
            </span>
            {n < 3 && (
              <span className={`h-px flex-1 ${n < step ? 'bg-success/50' : 'bg-border/60'}`} />
            )}
          </div>
        ))}
      </div>
      <h4 className="text-fg font-semibold tracking-tight">
        Étape {step} / 3 — {step === 1 ? 'Qui es-tu ?' : step === 2 ? 'Ton projet' : 'Validation'}
      </h4>
      <div className="mt-4 space-y-3">
        {step === 1 && (
          <>
            <Input label="Nom" placeholder="Jane Doe" />
            <Input label="Email" type="email" placeholder="jane@studio.com" />
          </>
        )}
        {step === 2 && (
          <>
            <Select
              label="Type de projet"
              placeholder="Choisir"
              options={[
                { value: 'site', label: 'Site vitrine' },
                { value: 'shop', label: 'E-commerce' },
                { value: 'identity', label: 'Identité' },
              ]}
            />
            <Textarea label="Brief" placeholder="Parle-nous de ton projet…" />
          </>
        )}
        {step === 3 && (
          <p className="text-muted text-sm leading-relaxed">
            On répond en 24h avec un premier retour + proposition de créneaux pour un call.
          </p>
        )}
      </div>
      <div className="mt-5 flex justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          Retour
        </Button>
        <Button size="sm" onClick={() => setStep(s => Math.min(3, s + 1))}>
          {step === 3 ? 'Envoyer' : 'Suivant'}
        </Button>
      </div>
    </div>
  );
};

const SPECIMENS: Specimen[] = [
  {
    id: 'split-form-info',
    path: 'inline · form gauche + infos droite',
    tags: ['product', 'editorial'],
    ethos: 'layout split · contact infos + form · classique',
    Component: SplitFormInfo,
  },
  {
    id: 'inline-compact-contact',
    path: 'inline · pill 2-fields + CTA',
    tags: ['minimal', 'product'],
    ethos: 'compact hero · email + message en ligne',
    Component: InlineCompactContact,
  },
  {
    id: 'multi-step-contact',
    path: 'inline · 3-step stepper form',
    tags: ['product'],
    ethos: 'formulaire long · progression 1/2/3 · retour/suivant',
    Component: MultiStepContact,
  },
];

export function ContactSection() {
  const { toast } = useToast();

  return (
    <Section number="20" title="contact form">
      <p className="text-muted mb-8 max-w-2xl text-sm leading-relaxed md:text-base">
        Form atom simple + 3 specimens : split layout info/form, compact pill inline, multi-step
        stepper. À choisir selon le type de site.
      </p>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· core atom</h3>
      <div className="border-border/50 mx-auto mb-10 max-w-lg rounded-lg border p-6">
        <h3 className="text-fg text-lg font-medium">Get in touch</h3>
        <p className="text-muted mt-1 text-sm">We usually respond within 24 hours.</p>
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" placeholder="Jane" />
            <Input label="Last name" placeholder="Doe" />
          </div>
          <Input label="Email" type="email" placeholder="jane@example.com" />
          <Select
            label="Subject"
            placeholder="Select a topic"
            options={[
              { value: 'general', label: 'General inquiry' },
              { value: 'support', label: 'Technical support' },
              { value: 'feedback', label: 'Feedback' },
              { value: 'partnership', label: 'Partnership' },
            ]}
          />
          <Textarea label="Message" placeholder="Tell us what's on your mind..." />
          <Button
            className="w-full"
            onClick={() =>
              toast({
                variant: 'success',
                message: "Message sent! We'll get back to you soon.",
              })
            }
          >
            Send message
          </Button>
        </div>
      </div>

      <h3 className="text-fg mb-4 font-mono text-[11px] tracking-[0.3em] uppercase">· specimens</h3>
      <div className="space-y-4">
        {SPECIMENS.map(({ id, path, tags, ethos, Component }) => (
          <SpecimenFrame key={id} id={id} path={path} tags={tags} ethos={ethos}>
            <Component />
          </SpecimenFrame>
        ))}
      </div>
    </Section>
  );
}
