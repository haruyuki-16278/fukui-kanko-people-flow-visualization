import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GraphSeries } from "@/interfaces/graph-series.interface";
import { ShareIcon } from "@primer/octicons-react";
import { useState } from "react";

interface Props {
  disabled: boolean;
  title?: string;
  seriesAll: GraphSeries[];
}

export function ShareDialogTrigger({ disabled, title, seriesAll }: Props) {
  const [copied, setCopied] = useState(false);

  const onClickCopyUrl = () => {
    navigator.clipboard.writeText(
      `${location.origin}${location.pathname}?${new URLSearchParams({ starTitle: title ?? new Date().toString(), starSeriesAll: JSON.stringify(seriesAll) })}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="shrink-0" variant="outline" size="icon">
          <ShareIcon size="medium" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>グラフを共有する</DialogTitle>
          <DialogDescription className="flex justify-center">
            <Button className="transition-all" disabled={copied} onClick={onClickCopyUrl}>
              {copied ? "コピーしました!" : "URLをコピーする"}
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
