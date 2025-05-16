import { DeleteDialogTrigger } from "@/components/parts/delete-dialog.component";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { linkPath } from "@/lib/utils";
import { KebabHorizontalIcon } from "@primer/octicons-react";
import { Button } from "../ui/button";

interface Props {
  title: string;
  seriesAll: string;
  removeStar: (title: string) => void;
  defaultStar: (title: string) => void;
  removedefaultStar: () => void;
  getDefaultTitle: () => string;
}

export function OpenStar({
  title,
  seriesAll,
  removeStar,
  defaultStar,
  removedefaultStar,
  getDefaultTitle,
}: Props) {
  return (
    <div className="group mt-2 flex max-w-full items-center gap-x-2">
      <a
        className="block w-full max-w-full cursor-pointer overflow-hidden text-ellipsis text-nowrap pl-2 underline group-hover:text-primary"
        href={linkPath(`/?${new URLSearchParams({ starTitle: title, starSeriesAll: seriesAll })}`)}
      >
        {title}
      </a>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="shrink-0" variant="secondary" size="icon">
            <KebabHorizontalIcon size="small" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {title === getDefaultTitle() ? (
            <DropdownMenuItem onClick={() => removedefaultStar()}>
              ページの初期表示を解除
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => defaultStar(title)}>
              ページの初期表示に設定
            </DropdownMenuItem>
          )}
          <DeleteDialogTrigger title={title} removeStar={removeStar} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
