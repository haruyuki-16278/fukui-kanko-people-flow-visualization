import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocalDefaultStars } from "@/lib/hooks/local-default-stars";
import { TrashIcon } from "@primer/octicons-react";

interface Props {
  title: string;
  removeStar: (title: string) => void;
}

export function DeleteDialogTrigger({ title, removeStar }: Props) {
  const { removeDefaultStar, getDefaultTitle } = useLocalDefaultStars();
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
              onClick={() => {
                if (title === getDefaultTitle()) {
                  removeDefaultStar();
                }
                removeStar(title);
              }}
            >
              削除する
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
