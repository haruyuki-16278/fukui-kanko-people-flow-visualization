import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  JAPANESE_ATTRIBUTE_NAME,
  OBJECT_CLASS,
  OBJECT_CLASS_ATTRIBUTES,
  ObjectClass,
  ObjectClassAttribute,
  REGIONS_PREFECTURES,
} from "@/interfaces/aggregated-data.interface";
import {
  defaultSeriesName,
  GRAPH_TYPES,
  GraphSeries,
  GraphType,
  SERIES_PROPERTY_EFFECT_TO,
} from "@/interfaces/graph-series.interface";
import { Placement, PLACEMENTS } from "@/interfaces/placement.interface";
import { cn } from "@/lib/utils";
import { MouseEventHandler, useState } from "react";
import { TrashIcon } from "@primer/octicons-react";

interface Props {
  series: GraphSeries;
  notify: (series: GraphSeries) => void;
  onRemoveClick: MouseEventHandler;
}

function updateSeriesProperty<Key extends keyof GraphSeries>(
  [key, value]: [Key, GraphSeries[Key]],
  series: GraphSeries,
): GraphSeries {
  const effectedProperties = SERIES_PROPERTY_EFFECT_TO[key]?.reduce(
    (obj, propertyKey) => ({
      ...obj,
      [propertyKey]: propertyKey === "graphType" ? "simple" : undefined,
    }),
    {} as Partial<GraphSeries>,
  );
  return {
    ...series,
    [key]: value,
    ...effectedProperties,
  };
}

export function SeriesConfigCard({ series, notify, onRemoveClick }: Props) {
  const [openRegions, setOpenRegions] = useState<string[]>(Object.keys(REGIONS_PREFECTURES));
  return (
    <Card className="flex w-full flex-col gap-y-4 p-4">
      <div className="flex justify-between">
        <label className="flex flex-row items-center gap-x-2">
          <Checkbox
            onCheckedChange={(v) => notify(updateSeriesProperty(["show", !!v], series))}
            className="block"
            checked={series.show}
          />
          <span>表示する</span>
        </label>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <TrashIcon size="medium" />
            </Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex justify-center">系統の削除</DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-center text-foreground break-words max-w-md mx-auto">
                系統名「{series.name ?? defaultSeriesName(series)}」のグラフを削除しますか？
              </DialogDescription>
              <DialogFooter>
                <Button
                  className="transition-all mx-auto w-fit"
                  variant="destructive"
                  onClick={onRemoveClick}
                >
                  削除する
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>
      <div>
        <span>系統名</span>
        <Input
          defaultValue={series.name}
          onChange={(v) =>
            notify(
              updateSeriesProperty(["name", v.target.value ? v.target.value : undefined], series),
            )
          }
          placeholder={defaultSeriesName(series)}
        />
      </div>
      <div>
        <span>設置場所</span>
        <Select
          onValueChange={(v: Placement) => notify(updateSeriesProperty(["placement", v], series))}
          defaultValue={series.placement}
        >
          <SelectTrigger
            className={cn(
              `${series.placement !== undefined ? "text-foreground" : "text-gray-500"}`,
            )}
          >
            <SelectValue placeholder="選択して下さい" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PLACEMENTS).map(([placement, { text }]) => (
              <SelectItem key={placement} value={placement}>
                {text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <span>検出対象</span>
        <Select
          key={series.placement}
          // 設置場所が未設定なら検出対象は選択できない
          disabled={!series.placement}
          defaultValue={series.objectClass}
          onValueChange={(v: ObjectClass) =>
            notify(updateSeriesProperty(["objectClass", v], series))
          }
        >
          <SelectTrigger
            className={cn(
              `${series.objectClass !== undefined ? "text-foreground" : "text-gray-500"}`,
            )}
          >
            <SelectValue placeholder="選択して下さい" />
          </SelectTrigger>
          <SelectContent>
            {series.placement
              ? PLACEMENTS[series.placement].targetObjects.map((objectClass) => (
                  <SelectItem value={objectClass} key={`${series.placement}#${objectClass}`}>
                    {OBJECT_CLASS[objectClass]}
                  </SelectItem>
                ))
              : null}
          </SelectContent>
        </Select>
      </div>
      {series.objectClass !== undefined && series.objectClass !== "Person" ? (
        <>
          <div>
            <span>グラフ種類</span>
            <RadioGroup
              defaultValue={series.graphType}
              onValueChange={(v: GraphType) =>
                notify(updateSeriesProperty(["graphType", v], series))
              }
              className="mt-2 pl-2"
            >
              {Object.entries(GRAPH_TYPES).map(([graphType, graphTypeText]) => (
                <div key={graphType + "radio"}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={graphType} id={graphType} />
                    <Label htmlFor={graphType}>{graphTypeText}</Label>
                  </div>
                  {graphType !== "simple" &&
                  graphType === series.graphType &&
                  series.objectClass !== undefined &&
                  series.objectClass !== "Person" ? (
                    <Select
                      key={graphType}
                      onValueChange={(v: ObjectClassAttribute) =>
                        notify(updateSeriesProperty(["focusedAttribute", v], series))
                      }
                      defaultValue={series.focusedAttribute}
                    >
                      <SelectTrigger
                        className={cn(
                          `${series.focusedAttribute !== undefined ? "text-foreground" : "text-gray-500"} mt-2`,
                        )}
                      >
                        <SelectValue placeholder={"属性を選択して下さい"} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(OBJECT_CLASS_ATTRIBUTES[series.objectClass]).map(
                          (objectClassAttribute) => (
                            <SelectItem key={objectClassAttribute} value={objectClassAttribute}>
                              {
                                JAPANESE_ATTRIBUTE_NAME[
                                  objectClassAttribute as ObjectClassAttribute
                                ]
                              }
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  ) : undefined}
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <span>フィルタ</span>
            {Object.entries(OBJECT_CLASS_ATTRIBUTES[series.objectClass]).map(
              ([objectClassAttribute, attributeValues]: [string, Record<string, string>]) => (
                <div className="mt-2 pl-2" key={objectClassAttribute}>
                  <span>
                    {JAPANESE_ATTRIBUTE_NAME[objectClassAttribute as ObjectClassAttribute]}
                  </span>
                  <div className="pl-2">
                    {objectClassAttribute === "prefectures"
                      ? // 都道府県
                        Object.entries(attributeValues).map(
                          ([attributeValue, attributeValueText]) => {
                            if (attributeValue === "All") {
                              // 全選択
                              // 全ての地方の都道府県キーを取得
                              const allRegionPrefectureKeys = Object.entries(attributeValues)
                                .filter(([attributeValue]) => attributeValue.endsWith("Region"))
                                .flatMap(
                                  ([attributeValue]) =>
                                    REGIONS_PREFECTURES[
                                      attributeValue as keyof typeof REGIONS_PREFECTURES
                                    ],
                                );
                              return (
                                <div className="flex">
                                  <label
                                    key={attributeValue}
                                    className="flex flex-row items-center gap-x-2"
                                  >
                                    <Checkbox
                                      onCheckedChange={(v) =>
                                        notify(
                                          updateSeriesProperty(
                                            [
                                              "exclude",
                                              v
                                                ? { ...series.exclude, [objectClassAttribute]: [] } // 全チェックON
                                                : {
                                                    ...series.exclude,
                                                    [objectClassAttribute]: allRegionPrefectureKeys,
                                                  }, // 全チェックOFF
                                            ],
                                            series,
                                          ),
                                        )
                                      }
                                      className="block"
                                      checked={!series.exclude?.[objectClassAttribute]?.length}
                                    />
                                    <span>{String(attributeValueText)}</span>
                                  </label>
                                </div>
                              );
                            } else if (attributeValue.endsWith("Region")) {
                              // 地方ごとのアコーディオン
                              const regionPrefectures =
                                REGIONS_PREFECTURES[
                                  attributeValue as keyof typeof REGIONS_PREFECTURES
                                ];
                              // 地方に属する都道府県が全て表示されているかチェック
                              const allChecked = regionPrefectures.every(
                                (prefectureKey) =>
                                  !series.exclude?.[objectClassAttribute]?.includes(prefectureKey),
                              );
                              // 地方に属する都道府県が一つでも表示されているかチェック
                              const anyChecked = regionPrefectures.some(
                                (prefectureKey) =>
                                  !series.exclude?.[objectClassAttribute]?.includes(prefectureKey),
                              );
                              // チェックボックスの状態を決定
                              const checkState = allChecked
                                ? true
                                : anyChecked
                                  ? "indeterminate"
                                  : false;

                              return (
                                <Accordion
                                  type="multiple"
                                  value={openRegions}
                                  onValueChange={setOpenRegions}
                                  key={attributeValue}
                                >
                                  <AccordionItem value={attributeValue} className="border-none">
                                    <div className="flex">
                                      <label
                                        key={attributeValue}
                                        className="flex flex-row items-center"
                                      >
                                        <Checkbox
                                          checked={checkState}
                                          onCheckedChange={(v) =>
                                            notify(
                                              updateSeriesProperty(
                                                [
                                                  "exclude",
                                                  {
                                                    ...series.exclude,
                                                    [objectClassAttribute]: v
                                                      ? (
                                                          series.exclude?.[objectClassAttribute] ??
                                                          []
                                                        ).filter(
                                                          (prefectureKey) =>
                                                            !regionPrefectures.includes(
                                                              prefectureKey,
                                                            ),
                                                        )
                                                      : [
                                                          ...(series.exclude?.[
                                                            objectClassAttribute
                                                          ] ?? []),
                                                          ...regionPrefectures.filter(
                                                            (prefectureKey) =>
                                                              !series.exclude?.[
                                                                objectClassAttribute
                                                              ]?.includes(prefectureKey),
                                                          ),
                                                        ],
                                                  },
                                                ],
                                                series,
                                              ),
                                            )
                                          }
                                        />
                                        <span className="pl-2 pr-1">
                                          {String(attributeValueText)}
                                        </span>
                                        <AccordionTrigger className="text-base py-0"></AccordionTrigger>
                                      </label>
                                    </div>
                                    {/* その地方に属した都道府県 */}
                                    <AccordionContent className="text-base pb-2">
                                      {regionPrefectures.map((prefectureKey) => (
                                        <div className="flex">
                                          <label
                                            key={prefectureKey}
                                            className="flex flex-row items-center gap-x-2 ml-5 mt-0"
                                          >
                                            <Checkbox
                                              onCheckedChange={(v) =>
                                                notify(
                                                  updateSeriesProperty(
                                                    [
                                                      "exclude",
                                                      series.exclude !== undefined
                                                        ? v
                                                          ? // truthyなら表示する→excludeからは外す
                                                            {
                                                              ...series.exclude,
                                                              [objectClassAttribute]: [
                                                                ...series.exclude[
                                                                  objectClassAttribute
                                                                ].filter(
                                                                  (excludeItem) =>
                                                                    excludeItem !== prefectureKey,
                                                                ),
                                                              ],
                                                            }
                                                          : // falsyなら表示しない→excludeに含める
                                                            {
                                                              ...series.exclude,
                                                              [objectClassAttribute]: [
                                                                ...(series.exclude[
                                                                  objectClassAttribute
                                                                ] ?? []),
                                                                prefectureKey,
                                                              ],
                                                            }
                                                        : v
                                                          ? undefined
                                                          : {
                                                              [objectClassAttribute]: [
                                                                prefectureKey,
                                                              ],
                                                            },
                                                    ],
                                                    series,
                                                  ),
                                                )
                                              }
                                              className="block"
                                              checked={
                                                !series.exclude?.[objectClassAttribute]?.includes(
                                                  prefectureKey,
                                                )
                                              }
                                            />
                                            <span>{attributeValues[prefectureKey]}</span>
                                          </label>
                                        </div>
                                      ))}
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              );
                            }
                          },
                        )
                      : Object.entries(attributeValues).map(
                          ([attributeValue, attributeValueText]) => (
                            <div className="flex">
                              <label
                                key={attributeValue}
                                className="flex flex-row items-center gap-x-2"
                              >
                                <Checkbox
                                  onCheckedChange={(v) =>
                                    notify(
                                      updateSeriesProperty(
                                        [
                                          "exclude",
                                          series.exclude !== undefined
                                            ? v
                                              ? // truthyなら表示する→excludeからは外す
                                                {
                                                  ...series.exclude,
                                                  [objectClassAttribute]: [
                                                    ...series.exclude[objectClassAttribute].filter(
                                                      (excludeItem) =>
                                                        excludeItem !== attributeValue,
                                                    ),
                                                  ],
                                                }
                                              : // falsyなら表示しない→excludeに含める
                                                {
                                                  ...series.exclude,
                                                  [objectClassAttribute]: [
                                                    ...(series.exclude[objectClassAttribute] ?? []),
                                                    attributeValue,
                                                  ],
                                                }
                                            : v
                                              ? undefined
                                              : { [objectClassAttribute]: [attributeValue] },
                                        ],
                                        series,
                                      ),
                                    )
                                  }
                                  className="block"
                                  checked={
                                    !series.exclude?.[objectClassAttribute]?.includes(
                                      attributeValue,
                                    )
                                  }
                                />
                                <span>{String(attributeValueText)}</span>
                              </label>
                            </div>
                          ),
                        )}
                  </div>
                </div>
              ),
            )}
          </div>
        </>
      ) : undefined}
    </Card>
  );
}
