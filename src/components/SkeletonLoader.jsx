import React from 'react';

export function TrekCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col gap-3 skeleton-shimmer">
      <div className="aspect-[16/10] bg-slate-200/60 rounded-xl" />
      <div className="h-4 bg-slate-200/60 rounded w-3/4" />
      <div className="h-3 bg-slate-200/60 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-slate-200/60 rounded w-1/3" />
        <div className="h-8 bg-slate-200/60 rounded-xl w-1/3" />
      </div>
    </div>
  );
}

export function TrekDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="aspect-[16/9] bg-slate-200/60 rounded-3xl skeleton-shimmer" />
      <div className="h-8 bg-slate-200/60 rounded w-2/3 skeleton-shimmer" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-20 bg-slate-200/60 rounded-2xl skeleton-shimmer" />
        ))}
      </div>
    </div>
  );
}
