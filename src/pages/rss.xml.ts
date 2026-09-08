import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "../data/site";
import type { APIContext } from "astro";

// A feed for the Journal. Free, open, and the one way readers can follow
// without handing an email address to anybody.
export async function GET(context: APIContext) {
  const posts = (await getCollection("blog")).sort((a, b) =>
    b.data.date.localeCompare(a.data.date),
  );

  return rss({
    title: "The Haven Journal",
    description:
      "Writing on relationships, dating, trust, and love in both the real and the digital world, from Katherine L. Carter.",
    site: context.site ?? site.domain,
    trailingSlash: false,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: new Date(`${p.data.date}T09:00:00Z`),
      link: `/blog/${p.id}`,
      categories: [p.data.category],
    })),
    customData: `<language>en-us</language><copyright>© ${new Date().getFullYear()} Katherine L. Carter</copyright>`,
  });
}
