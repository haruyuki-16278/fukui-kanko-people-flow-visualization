import { Place } from "@/interfaces/place.interface";
import { readdirSync, readFileSync } from "fs";
import Papa from "papaparse";

export class DataService {
  private static _instance: DataService;
  private readonly cwd = process.cwd();

  constructor() {
    if (typeof window !== "undefined") throw new Error();
    if (DataService._instance) {
      return DataService._instance;
    }
    DataService._instance = this;
  }

  async get(place: Place, year: number, month: number, day: number): Promise<string[][]> {
    const dir = `${this.cwd}/public/people-flow-data/${place}/${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/`;
    try {
      const files = readdirSync(dir);
      const parsed = (
        await Promise.all(
          files.map(
            async (file) => Papa.parse<string[]>(readFileSync(`${dir}/${file}`).toString()).data,
          ),
        )
      ).flat();
      return parsed;
    } catch (error) {
      console.warn(`${dir} is not available.`, error);
      return Promise.resolve([]);
    }
  }
}
