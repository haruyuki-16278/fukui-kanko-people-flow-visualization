import { GraphSeries } from "@/interfaces/graph-series.interface";
import { useEffect, useState } from "react";
import { getDateTimeString } from "../date";

export const STAR_KEY = "stars";

export function useLocalStars() {
  const [stars, setStars] = useState<{ [title: string]: string }>({});

  useEffect(() => {
    const res = JSON.parse(localStorage.getItem(STAR_KEY) ?? "{}");
    setStars(res);
  }, []);

  const appendStar = (title: string | undefined, seriesAll: GraphSeries[] | undefined) => {
    const newStars = { ...stars };
    newStars[title === undefined || title === "" ? getDateTimeString(new Date()) : title] =
      JSON.stringify(seriesAll);
    window.localStorage.setItem(STAR_KEY, JSON.stringify(newStars));
    setStars(newStars);
  };

  const removeStar = (title: string) => {
    const newStars = { ...stars };
    delete newStars[title];
    window.localStorage.setItem(STAR_KEY, JSON.stringify(newStars));
    setStars(newStars);
  };

  return { stars, appendStar, removeStar };
}
