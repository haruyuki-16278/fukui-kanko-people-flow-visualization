"use client";

import { Graph, graphs } from "@/interfaces/graph.interface";
import { ChangeEvent } from "react";

export default function CompareGraphNavigation(props: { currentGraph: Graph }) {
  const onChangePlace = (ev: ChangeEvent<HTMLSelectElement>) => {
    const newPlace = ev.target.value;
    location.pathname = [
      ...location.pathname.split("/").map((v, i) => {
        if (i === 3) return newPlace;
        else return v;
      }),
    ].join("/");
  };

  return (
    <select
      className={`w-[${graphs[props.currentGraph].length + 1}em]`}
      onChange={onChangePlace}
      defaultValue={props.currentGraph}
    >
      {Object.entries(graphs).map((v, i) => (
        <option value={v[0]} key={`${i}-${v[0]}`}>
          {v[1]}
        </option>
      ))}
    </select>
  );
}
