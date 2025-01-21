"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Placement, places } from "@/interfaces/place.interface";
import {
  ageRanges,
  carCategories,
  DetailAttributeKey,
  DetailAttributes,
  genders,
  JapaneseAttributeName,
  JapaneseObjectClass,
  ObjectClass,
  prefectures,
} from "@/interfaces/aggregated-data.interface";
import { MouseEventHandler, useEffect, useState } from "react";
import { TrashIcon } from "@primer/octicons-react";
import { GraphType, GraphSeries } from "@/interfaces/graph-series.interface";

export function SeriesConfigCard(props: {
  setShow: (show: boolean) => void;
  setName: (name: string | undefined) => void;
  setGraphType: (graphType: GraphType) => void;
  setFocusedAttribute: (focusedAttribute: DetailAttributeKey | undefined) => void;
  setPlacement: (placement: Placement | undefined) => void;
  setObjectClass: (objectClass: ObjectClass | undefined) => void;
  setExclude: (exclude: GraphSeries["exclude"]) => void;
  onRemoveClick: MouseEventHandler;
}) {
  // 親に流したい状態
  const [show, setShow] = useState(true);
  useEffect(() => props.setShow(show), [show]);
  const [graphType, setGraphType] = useState<GraphType>("simple");
  useEffect(() => props.setGraphType(graphType), [graphType]);
  const [focusedAttributeIndex, setFocusedAttributeIndex] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (filterCandidates && focusedAttributeIndex !== undefined)
      props.setFocusedAttribute(
        Object.keys(filterCandidates)[focusedAttributeIndex] as DetailAttributeKey,
      );
  }, [focusedAttributeIndex]);

  const [placement, setPlacement] = useState<keyof typeof places | undefined>(undefined);
  useEffect(() => {
    props.setPlacement(placement ? places[placement].placement : undefined);
    if (placement !== undefined) {
      setObjectClasses(places[placement].targetObjects);
    } else {
      setObjectClasses(undefined);
    }
  }, [placement]);
  // 対象のオブジェクトクラスは間接的にカメラの設置場所に依存する
  const [objectClassIndex, setObjectClassIndex] = useState<number | undefined>(undefined);
  useEffect(() => {
    console.log(objectClassIndex);
    if (objectClasses && objectClassIndex !== undefined) {
      const objectClass = objectClasses[objectClassIndex];
      props.setObjectClass(objectClass);
      if (objectClass === "Face") {
        setFilterCandidates({
          genders,
          ageRanges,
        });
      } else if (objectClass === "LicensePlate") {
        setFilterCandidates({
          carCategories,
          prefectures,
        });
      } else {
        setFilterCandidates(undefined);
      }
    }
  }, [objectClassIndex]);
  // フィルタで取り除く値は間接的に対象のオブジェクトクラスに依存する
  const [exclude, setExclude] = useState<GraphSeries["exclude"]>(undefined);
  useEffect(() => {
    props.setExclude(exclude);
  }, [exclude]);

  // コンポーネント内のデータの管理に利用する状態
  const [objectClasses, setObjectClasses] = useState<ObjectClass[] | undefined>(undefined);
  useEffect(() => {
    setObjectClassIndex(undefined);
  }, [objectClasses]);
  const [filterCandidates, setFilterCandidates] = useState<
    Partial<typeof DetailAttributes> | undefined
  >(undefined);
  useEffect(() => {
    setExclude(undefined);
  }, [filterCandidates]);

  const defaultSeriesName = () =>
    `${placement ? places[placement].text : ""}${
      objectClasses && objectClassIndex !== undefined
        ? "の" + JapaneseObjectClass[objectClasses[objectClassIndex]]
        : placement
          ? "での"
          : ""
    }検出回数`;
  const [name, setName] = useState<string | undefined>(undefined);
  useEffect(
    () => props.setName(name ?? defaultSeriesName()),
    [name, placement, objectClasses, objectClassIndex],
  );

  const onFilterCheckChenge = (k: DetailAttributeKey, v: string, s: boolean) => {
    const newValues = { ...exclude };
    if (s && newValues[k]) newValues[k] = newValues[k].filter((w) => w !== v);
    else newValues[k] = newValues[k] ? [...newValues[k], v] : [v];
    console.log(newValues);
    setExclude(newValues);
  };

  return (
    <Card className="flex w-full flex-col gap-y-4 p-4">
      <div className="flex justify-between">
        <label className="flex flex-row items-center gap-x-2">
          <Checkbox onCheckedChange={(v) => setShow(!!v)} className="block" checked={show} />
          <span>表示する</span>
        </label>
        <Button variant="destructive" size="icon" onClick={props.onRemoveClick}>
          <TrashIcon size="medium" />
        </Button>
      </div>
      <div>
        <span>系統名</span>
        <Input
          onChange={(v) => setName(!!v.target.value ? v.target.value : undefined)}
          placeholder={defaultSeriesName()}
        />
      </div>
      <div>
        <span>設置場所</span>
        <Select onValueChange={(v) => setPlacement(v as keyof typeof places | undefined)}>
          <SelectTrigger>
            <SelectValue placeholder="AIカメラの設置場所" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(places).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <span>検出対象</span>
        <Select disabled={!placement} onValueChange={(v) => setObjectClassIndex(Number(v))}>
          <SelectTrigger>
            <SelectValue placeholder="AIカメラの検出対象" />
          </SelectTrigger>
          <SelectContent>
            {placement && objectClasses
              ? objectClasses.map((objectClass, i) => (
                  <SelectItem key={objectClass} value={i.toString()}>
                    {JapaneseObjectClass[objectClass]}
                  </SelectItem>
                ))
              : null}
          </SelectContent>
        </Select>
      </div>
      {objectClasses &&
      objectClassIndex !== undefined &&
      objectClasses[objectClassIndex] !== "Person" ? (
        <div>
          <span>グラフ種類</span>
          <RadioGroup
            defaultValue="simple"
            onValueChange={(v: "simple" | "stack" | "ratio") => setGraphType(v)}
            className="mt-2 pl-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="simple" id="simple" />
              <Label htmlFor="simple">単純棒グラフ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stack" id="stack" />
              <Label htmlFor="stack">積み上げ棒グラフ</Label>
            </div>
            {graphType === "stack" ? (
              <Select onValueChange={(v) => setFocusedAttributeIndex(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="積み上げる属性" />
                </SelectTrigger>
                <SelectContent>
                  {filterCandidates
                    ? Object.keys(filterCandidates).map((v, i) => (
                        <SelectItem key={v} value={i.toString()}>
                          {JapaneseAttributeName[v as DetailAttributeKey]}
                        </SelectItem>
                      ))
                    : null}
                </SelectContent>
              </Select>
            ) : undefined}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ratio" id="ratio" />
              <Label htmlFor="ratio">割合棒グラフ</Label>
            </div>
            {graphType === "ratio" ? (
              <Select onValueChange={(v) => setFocusedAttributeIndex(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="割合表示する属性" />
                </SelectTrigger>
                <SelectContent>
                  {filterCandidates
                    ? Object.keys(filterCandidates).map((v, i) => (
                        <SelectItem key={v} value={i.toString()}>
                          {JapaneseAttributeName[v as DetailAttributeKey]}
                        </SelectItem>
                      ))
                    : null}
                </SelectContent>
              </Select>
            ) : undefined}
          </RadioGroup>
        </div>
      ) : undefined}
      {filterCandidates ? (
        <div>
          <span>フィルタ</span>
          {Object.entries(filterCandidates).map(([k, v]) => (
            <div className="mt-2 pl-2" key={`${k}`}>
              <span>{JapaneseAttributeName[k as DetailAttributeKey]}</span>
              <div className="pl-2">
                {Object.entries(v).map(([l, w]) => (
                  <label key={l} className="flex flex-row items-center gap-x-2">
                    <Checkbox
                      onCheckedChange={(s) => onFilterCheckChenge(k as DetailAttributeKey, l, !!s)}
                      className="block"
                      checked={!exclude?.[k]?.includes(l)}
                    />
                    <span>{w}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : undefined}
    </Card>
  );
}
