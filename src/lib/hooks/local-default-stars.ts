export const DAFAULT_KEY = "default";

export function useLocalDefaultStars() {
  const defaultItem = window.localStorage.getItem(DAFAULT_KEY);
  const defaultData = JSON.parse(defaultItem ?? "{}");

  const defaultStar = (title: string, starSeries: string) => {
    const defaultStar = { title, starSeries };
    window.localStorage.setItem(DAFAULT_KEY, JSON.stringify(defaultStar));
  };

  const removeDefaultStar = () => {
    window.localStorage.removeItem(DAFAULT_KEY);
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
