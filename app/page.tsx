import { ExtrusionStage } from "@/components/home/ExtrusionStage.client";
import { PortfolioContent } from "@/components/home/PortfolioContent";
import { experiences, projects } from "@/components/home/data";

export default function Home() {
  return (
    <main className="extrusion-page">
      <ExtrusionStage />
      <PortfolioContent experiences={experiences} projects={projects} />
    </main>
  );
}
