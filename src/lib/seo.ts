import { pageTitle } from "@/data/site";

export function seo(title: string | undefined, description: string) {
  const t = pageTitle(title);
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: t },
      { name: "twitter:description", content: description },
    ],
  };
}
