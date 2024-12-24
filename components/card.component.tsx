import { InfoIcon } from "@primer/octicons-react";
import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
  information?: string;
};

export function Card(props: Props) {
  return (
    <article
      className={`flex h-fit flex-col items-center rounded-lg border-2 border-primary bg-background p-4 ${props.className}`}
    >
      <div className="grid-cols-edgetip grid h-12 w-full grid-rows-1 place-items-center">
        <div></div>
        <h3 className="h-fit w-fit text-center text-lg font-bold">{props.title}</h3>
        {props.information ? (
          <div className="tooltip group" data-tooltip={props.information}>
            <InfoIcon size={"small"} className="fill-gray-500 group-hover:scale-110" />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      {props.children}
    </article>
  );
}
