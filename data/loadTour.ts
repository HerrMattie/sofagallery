export type TourFile = {
  slug: string;
  title: string;
  subtitle: string;
  items: Array<{
    objectNumber?: string;
    title: string;
    maker: string;
    year?: string;
    imageHero?: string;
    imageThumb?: string;
    license?: string;
    museum?: string;
    facts?: Record<string, string>;
    story?: string | null;
    sources?: Array<{ label: string; url: string }>;
  }>;
};

export async function loadTour(slug: string): Promise<TourFile> {
  const res = await fetch(`/data/tours/${slug}.json`);
  if (!res.ok) throw new Error(`Kon tour niet laden: ${slug}`);
  return (await res.json()) as TourFile;
}