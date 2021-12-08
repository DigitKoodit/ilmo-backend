import type { GetEntriesOpts } from "../../types/cache";
import type { EventContent } from "../../types/contentful";
import * as contentfulClient from "contentful";
import { config } from "dotenv";
import { cached } from "../cache";
config();

// Initialize Contentful JS client
const client = contentfulClient.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

/**
 * Returns an array of all entries that have a specified field with the specified value.
 */
export const getEntriesByFieldValue = async <T>({
  field,
  value,
  contentType,
  locale,
}: GetEntriesOpts): Promise<contentfulClient.Entry<T>[] | null> => {
  const response = await client.getEntries<T>({
    content_type: contentType,
    [`fields.${field}[in]`]: value,
    include: 5, // fetch references 5 levels deep
    locale,
  });

  return response?.items || null;
};

/**
 * Returns the content of an event, cached for 5 seconds
 */
export const getEventContentCached = async (
  slug: string
): Promise<EventContent | undefined> => {
  return cached(
    `event-${slug}`,
    // cache for 5 seconds
    5,
    // recaches the event info if it's no longer cached
    async () => {
      return (
        await getEntriesByFieldValue({
          field: "slug",
          value: slug,
          contentType: "event",
        })
      )?.[0] as EventContent;
    }
  );
};
