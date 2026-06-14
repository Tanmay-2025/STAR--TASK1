// app/page.tsx
import About from "@/components/main/About";
import AchievementsComponent from "@/components/main/Achivements";
import ActivitiesComponent from "@/components/main/Activities";
import FestComponent from "@/components/main/Fest";
import Hero from "@/components/main/Hero";
import ProjectsComponent from "@/components/main/Projects";

// --- Type Definitions ---
export interface Project {
  id: number;
  topic: string;
  description: string;
  image_url: string;
}

export interface ClubActivity {
  id: number;
  activity: string;
  content: string;
  image_url: string;
}

export interface Achievement {
  id: number;
  achievement: string;
  link: string;
}

export interface Fest {
  id: number;
  festname: string;
  description: string;
  link: string;
  image_url: string;
}

// --- Static Data ---
const staticProjects: Project[] = [
  {
    id: 1,
    topic: "STAC Website",
    description: "The official website of STAC IIT Mandi, built with Next.js, featuring astronomy-themed UI, event pages, and team showcases.",
    image_url: "/SpaceWebsite.png",
  },
  {
    id: 2,
    topic: "Lunar DEM Analysis",
    description: "Digital Elevation Model analysis tools for lunar surface terrain classification and visualization using Python and ML pipelines.",
    image_url: "/glaxy.png",
  },
  {
    id: 3,
    topic: "Observatory Dashboard",
    description: "A real-time dashboard for tracking celestial events, telescope scheduling, and observation logging for club activities.",
    image_url: "/CardImage.png",
  },
];

const staticActivities: ClubActivity[] = [
  {
    id: 1,
    activity: "Stargazing Sessions",
    content: "Regular night-sky observation sessions using the club's telescopes, identifying constellations, planets, and deep-sky objects.",
    image_url: "/glaxy.png",
  },
  {
    id: 2,
    activity: "Technical Workshops",
    content: "Hands-on workshops covering astrophotography, data analysis, Python for astronomy, and web development for scientific tools.",
    image_url: "/CardImage.png",
  },
  {
    id: 3,
    activity: "Research Projects",
    content: "Collaborative research projects in areas like lunar surface analysis, satellite data processing, and astronomical image processing.",
    image_url: "/SpaceWebsite.png",
  },
];

const staticAchievements: Achievement[] = [
  {
    id: 1,
    achievement: "AIR 5 at Inter IIT Tech Meet 13.0 — Astronomy Event (IIT Bombay)",
    link: "#",
  },
  {
    id: 2,
    achievement: "Successful deployment of STAC Observatory Management System",
    link: "#",
  },
  {
    id: 3,
    achievement: "Published research on Lunar X-ray Fluorescence Spectroscopy analysis",
    link: "#",
  },
];

const staticFests: Fest[] = [
  {
    id: 1,
    festname: "ASTRAX",
    description: "An inter-college astronomy meet featuring quizzes, astrophotography competitions, telescope building, and night sky observation challenges.",
    link: "#",
    image_url: "/glaxy.png",
  },
  {
    id: 2,
    festname: "ZENITH",
    description: "An intra-college astronomy festival with talks by renowned astronomers, workshops, hackathons, and sky-mapping competitions.",
    link: "#",
    image_url: "/CardImage.png",
  },
];

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col">
        <Hero />

        <div className="relative z-10 -mt-24 sm:-mt-32 md:-mt-40 lg:-mt-48 xl:-mt-56">
          <About />

          {staticActivities.length > 0 && (
            <ActivitiesComponent activities={staticActivities} />
          )}

          <div className="relative">
            {staticFests.length > 0 && (
              <FestComponent fests={staticFests} />
            )}
          </div>

          {staticProjects.length > 0 && (
            <ProjectsComponent projects={staticProjects} />
          )}

          {staticAchievements.length > 0 && (
            <AchievementsComponent achievements={staticAchievements} />
          )}
        </div>
      </div>
    </main>
  );
}