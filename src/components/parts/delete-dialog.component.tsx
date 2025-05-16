import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Props {
  title: string;
  removeStar: (title: string) => void;
}

export function DeleteDialogTrigger({ title, removeStar }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>
          お気に入りから削除
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center">{title}</DialogTitle>
          <DialogDescription className="flex justify-center text-black">
            本当に削除しますか？
          </DialogDescription>
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
