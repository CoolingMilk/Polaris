import type { ReactNode } from "react";

export function Card(props: {
  title: string;
  description?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <header className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
            {props.title}
          </h2>
          {props.description ? (
            <p className="mt-1 text-sm text-zinc-600">{props.description}</p>
          ) : null}
        </div>
        {props.right ? <div className="shrink-0">{props.right}</div> : null}
      </header>
      <div className="px-5 py-4">{props.children}</div>
    </section>
  );
}
