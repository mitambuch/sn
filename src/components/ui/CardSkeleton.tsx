// ═══════════════════════════════════════════════════
// CardSkeleton — listing card placeholder shape
//
// WHAT: Renders an aspect-ratio image block + 3 stub text bars matching
//       the editorial card silhouette used by all module list pages.
//       Reuses the Skeleton atom for the shimmer animation.
// WHEN: Drop in any list grid while data is loading; keep the surrounding
//       grid + responsive cols identical so the layout doesn't jump.
// CHANGE RATIO: pass `ratio="3/4"` etc. — defaults to "4/5".
// ═══════════════════════════════════════════════════

import { Skeleton } from '@components/ui/Skeleton';
import { cn } from '@utils/cn';

interface CardSkeletonProps {
  ratio?: '1/1' | '4/3' | '3/4' | '16/9' | '4/5' | '3/2';
  className?: string;
}

const ratioStyles: Record<NonNullable<CardSkeletonProps['ratio']>, string> = {
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '3/4': 'aspect-[3/4]',
  '16/9': 'aspect-video',
  '4/5': 'aspect-[4/5]',
  '3/2': 'aspect-[3/2]',
};

export const CardSkeleton = ({ ratio = '4/5', className }: CardSkeletonProps) => {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className={cn('w-full overflow-hidden rounded-md', ratioStyles[ratio])}>
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="h-3 w-2/5 rounded-full" />
      <Skeleton className="h-4 w-4/5 rounded-full" />
      <Skeleton className="h-3 w-1/3 rounded-full" />
    </div>
  );
};
