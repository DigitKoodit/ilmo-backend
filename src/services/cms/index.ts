import * as contentfulClient from "contentful";

// Initialize Contentful JS client
const client = contentfulClient.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

type GetEntriesOpts = {
  field: string;
  value: string;
  contentType: string;
  locale?: string;
};

/**
 * Returns an array of all entries that have a specified field with the specified value.
 */
const getEntriesByFieldValue = async <T>({
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
