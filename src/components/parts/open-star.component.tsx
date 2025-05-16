// import { DeleteDialogTrigger } from "@/components/parts/delete-dialog.component";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { linkPath } from "@/lib/utils";
import { TrashIcon } from "@primer/octicons-react";
import { Button } from "../ui/button";

interface Props {
  title: string;
  seriesAll: string;
  removeStar: (title: string) => void;
  // defaultStar: (title: string) => void;
  // removeDefaultStar: () => void;
  // getDefaultTitle: () => string;
}

export function OpenStar({
  title,
  seriesAll,
  removeStar,
  // defaultStar,
  // removeDefaultStar,
  // getDefaultTitle,
}: Props) {
  return (
    <div className="group mt-2 flex max-w-full items-center gap-x-2">
      <a
        className="block w-full max-w-full cursor-pointer overflow-hidden text-ellipsis text-nowrap pl-2 underline group-hover:text-primary"
        href={linkPath(`/?${new URLSearchParams({ starTitle: title, starSeriesAll: seriesAll })}`)}
      >
        {title}
      </a>
      <Button
        className="shrink-0"
        variant="destructive"
        size="icon"
        onClick={() => removeStar(title)}
      >
        <TrashIcon size="small" />
      </Button>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <KebabHorizontalIcon size="small" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {title === getDefaultTitle() ? (
            <DropdownMenuItem onClick={() => removeDefaultStar()}>
              ページの初期表示を解除
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => defaultStar(title)}>
              ページの初期表示に設定
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <DeleteDialogTrigger title={title} removeStar={removeStar} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}
