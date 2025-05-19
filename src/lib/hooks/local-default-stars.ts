export const DEFAULT_KEY = "default";

export function useLocalDefaultStars() {
  const defaultItem = window.localStorage.getItem(DEFAULT_KEY);
  const defaultData = JSON.parse(defaultItem ?? "{}");

  const defaultStar = (title: string, starSeries: string) => {
    const defaultStar = { title, starSeries };
    window.localStorage.setItem(DEFAULT_KEY, JSON.stringify(defaultStar));
  };

  const removeDefaultStar = () => {
    window.localStorage.removeItem(DEFAULT_KEY);
  };

  const getDefaultTitle = () => {
    const defaultTitle = defaultData.title;
    return defaultTitle;
  };

  const getDefaultSeries = () => {
    const defaultSeries = defaultData.starSeries;
    return defaultSeries;
  };

  return { defaultStar, removeDefaultStar, getDefaultTitle, getDefaultSeries };
}
