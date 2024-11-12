"use client";

import { Place, places } from "@/interfaces/place.interface";
import { ChangeEvent } from "react";

export default function ComparePlaceNavigation(props: { currentPlace: Place }) {
  const onChangePlace = (ev: ChangeEvent<HTMLSelectElement>) => {
    const newPlace = ev.target.value;
    location.pathname = [
      ...location.pathname.split("/").map((v, i) => {
        if (i === 2) return newPlace;
        else return v;
      }),
    ].join("/");
  };

  return (
    <select
      className={`w-[${places[props.currentPlace].length + 1}em]`}
      onChange={onChangePlace}
      defaultValue={props.currentPlace}
    >
      {Object.entries(places).map((v, i) => (
        <option value={v[0]} key={`${i}-${v[0]}`}>
          {v[1]}
        </option>
      ))}
    </select>
  );
}
