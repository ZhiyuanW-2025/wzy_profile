import { mapContent } from "@/content/site";
import { StudioArchive } from "./reference-city/StudioArchive";
import { PolisChapters } from "./reference-city/PolisChapters";
import { ClientProjects } from "./reference-city/ClientProjects";
import { AgentSystemFile } from "./reference-city/AgentSystemFile";
import type { PlaceId } from "@/content/reference-city";

type MapCard = (typeof mapContent.mapCards)[number];

export function ProjectDetail({ card, onNavigate, onClose }: { card: MapCard; onNavigate: (id: PlaceId) => void; onClose: () => void }) {
  if (card.id === "experience-card") {
    return <StudioArchive onNavigate={onNavigate} />;
  }

  if (card.id === "polis-card") {
    return <PolisChapters />;
  }

  if (card.id === "client-card") {
    return <ClientProjects />;
  }

  return <AgentSystemFile onClose={onClose} />;
}
