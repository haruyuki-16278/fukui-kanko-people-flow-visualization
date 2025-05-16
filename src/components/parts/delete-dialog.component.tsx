import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "@primer/octicons-react";

interface Props {
  title: string;
  removeStar: (title: string) => void;
}

export function DeleteDialogTrigger({ title, removeStar }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="shrink-0" variant="destructive" size="icon">
          <TrashIcon size="small" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            "{title}"をお気に入りから削除しますか？
          </DialogTitle>
          <DialogDescription className="flex justify-center">
            <Button
              className="transition-all"
              variant="destructive"
              onClick={() => removeStar(title)}
            >
              削除する
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
