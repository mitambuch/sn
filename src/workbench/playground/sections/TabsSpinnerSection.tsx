import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';

import { Section } from '../shared';

export function TabsSpinnerSection() {
  return (
    <Section number="11" title="tabs">
      <Tabs defaultValue="design">
        <TabsList>
          <TabsTrigger value="design">design</TabsTrigger>
          <TabsTrigger value="develop">develop</TabsTrigger>
          <TabsTrigger value="deploy">deploy</TabsTrigger>
        </TabsList>
        <TabsContent value="design">
          <p className="text-muted text-sm leading-relaxed">
            start with tokens and a design system. define colors, typography, spacing, and component
            anatomy before writing code.
          </p>
        </TabsContent>
        <TabsContent value="develop">
          <p className="text-muted text-sm leading-relaxed">
            build components with typescript strict, functional patterns, and tailwind tokens. test
            everything with vitest.
          </p>
        </TabsContent>
        <TabsContent value="deploy">
          <p className="text-muted text-sm leading-relaxed">
            validate with lint, typecheck, and tests. then ship with confidence using conventional
            commits and automated releases.
          </p>
        </TabsContent>
      </Tabs>
    </Section>
  );
}
