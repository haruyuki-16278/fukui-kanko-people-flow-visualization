import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function Card(props: Props) {
  return (
    <article
      className={`flex h-fit flex-col items-center rounded-lg border-2 border-primary bg-background p-4 ${props.className}`}
    >
      <h3 className="mb-4 text-lg font-bold">{props.title}</h3>
      {props.children}
    </article>
  );
}
