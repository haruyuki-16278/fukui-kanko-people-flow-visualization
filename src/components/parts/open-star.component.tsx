import { DeleteDialogTrigger } from "@/components/parts/delete-dialog.component";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { linkPath } from "@/lib/utils";

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
    <div className="group flex w-full max-w-full items-center gap-x-2">
      <a
        className="block w-full max-w-full cursor-pointer overflow-hidden text-ellipsis text-nowrap pl-2 underline group-hover:text-primary"
        href={linkPath(`/?${new URLSearchParams({ starTitle: title, starSeriesAll: seriesAll })}`)}
      >
        {title}
      </a>
      <DeleteDialogTrigger title={title} removeStar={removeStar} />

      {/* <Button
        className="shrink-0"
        variant="outline"
        size="icon"
        onClick={() => defaultStar(title)}
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
