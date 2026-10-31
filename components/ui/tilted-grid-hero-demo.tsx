import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";

const IMAGES = [
  {
    src: "/assets/aistudio/01_ACT_Fibernet_fd957732.png",
    alt: "ACT Fibernet Broadband Subscription",
  },
  {
    src: "/assets/aistudio/02_SonyLIV_PrimeVideo_7f76cede.png",
    alt: "SonyLIV and Prime Video OTT Bundle",
  },
  {
    src: "/assets/aistudio/03_Crunchyroll_0d744424.png",
    alt: "Crunchyroll Anime Streaming",
  },
  {
    src: "/assets/aistudio/04_YouTube_Premium_f738050d.png",
    alt: "YouTube Premium",
  },
  {
    src: "/assets/aistudio/05_Spotify_Premium_aea5ebdb.png",
    alt: "Spotify Premium Music",
  },
  {
    src: "/assets/aistudio/06_Netflix_India_dd70703c.png",
    alt: "Netflix India Streaming Plans",
  },
  {
    src: "/assets/aistudio/07_Claude_781c961b.png",
    alt: "Claude AI Pro Subscription",
  },
  {
    src: "/assets/aistudio/08_Amazon_Kindle_0f8287c9.png",
    alt: "Amazon Kindle Unlimited",
  },
  {
    src: "/assets/aistudio/09_JioHotstar_52661f2f.png",
    alt: "JioHotstar Entertainment",
  },
  {
    src: "/assets/aistudio/10_Coursera_Plus_7b2df381.png",
    alt: "Coursera Plus Learning Subscription",
  },
];

export default function TiltedGridHeroDemo() {
  return (
    <TiltedGridHero
      images={IMAGES}
      className="h-[560px] w-full rounded-[28px] border border-[#1b1411]/10 bg-[#eee5dc] shadow-xl overflow-hidden"
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-between py-12 text-center pointer-events-none">
        <div className="px-6">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#33cc7a] text-[#1b1411] mb-4 shadow-sm">
            Curved 3D Carousel
          </span>
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-[#1b1411] sm:text-5xl leading-[1.05]">
            Every subscription,
            <br />
            brought into focus.
          </h1>
        </div>
        <p className="max-w-md text-balance px-6 text-sm text-[#66574f] font-normal">
          OTT, broadband, cloud AI & education tiers curving through our real-time recurring orchestration engine.
        </p>
      </div>
    </TiltedGridHero>
  );
}

export { TiltedGridHeroDemo };
