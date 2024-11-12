import CompareDateNavigation from "@/components/compare-date-navigation.component";
import CompareGraphNavigation from "@/components/compare-graph-navigation.component";
import ComparePlaceNavigation from "@/components/compare-place-navigation.component";
import DetectedFaceGraph from "@/components/graphs/detected-face.component";
import DetectedPeopleGraph from "@/components/graphs/detected-people.component";
import EstimatedAgeGraph from "@/components/graphs/estimated-age.component";
import EstimatedGenderGraph from "@/components/graphs/estimated-gender.component";
import { isPlace, Place, places } from "@/interfaces/place.interface";
import { DateService } from "@/services/date.service";
import { ReactElement } from "react";

const graphs = ["detected-face", "detected-people", "estimated-age", "estimated-gender"] as const;

export async function generateStaticParams() {
  const yesterday = DateService.yesterday();
  const dates: string[] = [];
  for (
    let i = new Date(DateService.minDate);
    i.getTime() < yesterday.getTime();
    i.setDate(i.getDate() + 1)
  ) {
    dates.push(
      `${i.getFullYear().toString()}-${(i.getMonth() + 1).toString().padStart(2, "0")}-${i.getDate().toString().padStart(2, "0")}`,
    );
  }

  const routes: {
    place: Place;
    graph: (typeof graphs)[number];
    left: string;
    right: string;
  }[] = [];
  Object.keys(places)
    .filter((v) => isPlace(v))
    .forEach((place) => {
      graphs.forEach((graph) => {
        dates.forEach((left) => {
          dates.forEach((right) => {
            routes.push({
              place,
              graph,
              left,
              right,
            });
          });
        });
      });
    });

  return routes;
}

export default async function page({
  params,
}: {
  params: Promise<{
    place: Place;
    graph: (typeof graphs)[number];
    left: string;
    right: string;
  }>;
}) {
  const leftDate = new Date((await params).left);
  const rightDate = new Date((await params).right);

  const graphs: { left: ReactElement; right: ReactElement } = {
    left: <></>,
    right: <></>,
  };
  switch ((await params).graph) {
    case "detected-people":
      graphs.left = <DetectedPeopleGraph place={(await params).place} date={leftDate} />;
      graphs.right = <DetectedPeopleGraph place={(await params).place} date={rightDate} />;
      break;
    case "detected-face":
      graphs.left = <DetectedFaceGraph place={(await params).place} date={leftDate} />;
      graphs.right = <DetectedFaceGraph place={(await params).place} date={rightDate} />;
      break;
    case "estimated-age":
      graphs.left = <EstimatedAgeGraph place={(await params).place} date={leftDate} />;
      graphs.right = <EstimatedAgeGraph place={(await params).place} date={rightDate} />;
      break;
    case "estimated-gender":
      graphs.left = <EstimatedGenderGraph place={(await params).place} date={leftDate} />;
      graphs.right = <EstimatedGenderGraph place={(await params).place} date={rightDate} />;
      break;
  }

  return (
    <article className="mb-4 flex flex-col items-center p-4">
      <h2 className="mb-2 text-xl font-bold">
        <ComparePlaceNavigation currentPlace={(await params).place} />
        の<CompareGraphNavigation currentGraph={(await params).graph} />
        の比較
      </h2>
      <div className="grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <CompareDateNavigation currentDateStr={(await params).left} viewPosition="left" />
          {graphs.left}
        </div>
        <div>
          <CompareDateNavigation currentDateStr={(await params).right} viewPosition="right" />
          {graphs.right}
        </div>
      </div>
    </article>
  );
}
