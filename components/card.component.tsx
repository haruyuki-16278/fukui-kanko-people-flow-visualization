import { DatabaseIcon, InfoIcon } from "@primer/octicons-react";
import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
  information?: string;
  sourceUrl?: string;
};

export function Card(props: Props) {
  return (
    <article
      className={`flex h-fit flex-col items-center rounded-lg border-2 border-primary bg-background p-4 ${props.className}`}
    >
      <div className="grid-cols-edgetip grid h-12 w-full grid-rows-1 place-items-center">
        <div></div>
        <h3 className="h-fit w-fit text-center text-lg font-bold">{props.title}</h3>
        <div className="flex items-center justify-center gap-2">
          {props.information ? (
            <div className="tooltip group" data-tooltip={props.information}>
              <InfoIcon size={"small"} className="fill-gray-500 group-hover:scale-125" />
            </div>
          ) : (
            <div></div>
          )}
          {props.sourceUrl ? (
            <a
              className="tooltip group"
              href={props.sourceUrl}
              data-tooltip="元データはこちら"
              target="_blank"
            >
              <DatabaseIcon size={"small"} className="fill-gray-500 group-hover:scale-125" />
            </a>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      {props.children}
    </article>
  );
}
