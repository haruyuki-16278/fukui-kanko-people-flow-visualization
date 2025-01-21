import { DetailAttributeKey, ObjectClass } from "./aggregated-data.interface";
import { Placement } from "./place.interface";

export type GraphType = "simple" | "stack" | "ratio";

export interface GraphSeries {
  id: string;
  name?: string;
  show?: boolean;
  graphType: GraphType;
  focusedAttribute?: DetailAttributeKey;
  placement?: Placement;
  objectClass?: ObjectClass;
  exclude?: Record<string, string[]>;
}
