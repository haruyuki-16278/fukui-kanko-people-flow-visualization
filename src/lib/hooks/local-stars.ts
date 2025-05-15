import { GraphSeries } from "@/interfaces/graph-series.interface";
import { useEffect, useState } from "react";
import { getDateTimeString } from "../date";

export const STAR_KEY = "stars";
export const DAFAULT_KEY = "default";

export function useLocalStars() {
  const [stars, setStars] = useState<{ [title: string]: string }>({});

  useEffect(() => {
    const res = JSON.parse(localStorage.getItem(STAR_KEY) ?? "{}");
    setStars(res);
  }, []);

  const appendStar = (title: string | undefined, seriesAll: { [key: string]: GraphSeries }) => {
    const nextStars = { ...stars };
    nextStars[title === undefined || title === "" ? getDateTimeString(new Date()) : title] =
      JSON.stringify(Object.values(seriesAll));
    window.localStorage.setItem(STAR_KEY, JSON.stringify(nextStars));
    setStars(nextStars);
  };

  const removeStar = (title: string) => {
    const nextStars = { ...stars };
    delete nextStars[title];
    window.localStorage.setItem(STAR_KEY, JSON.stringify(nextStars));
    setStars(nextStars);
  };

  const defaultStar = (title: string) => {
    const starSeries = getStarData(title);
    const defaultStar = { title, starSeries };
    window.localStorage.setItem(DAFAULT_KEY, JSON.stringify(defaultStar));
  };

  const removedefaultStar = () => {
    window.localStorage.removeItem(DAFAULT_KEY);
  };

  const getStarData = (title: string) => {
    return stars[title];
  };

  const getDefaultTitle = () => {
    const defaultItem = window.localStorage.getItem(DAFAULT_KEY);
    const defaultData = JSON.parse(defaultItem ?? "{}");
    const defaultTitle = defaultData.title;
    return defaultTitle;
  };

  return { stars, appendStar, removeStar, defaultStar, removedefaultStar, getDefaultTitle };
}
