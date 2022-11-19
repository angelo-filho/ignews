import { createClient } from "@prismicio/client";

export const prismicClient = createClient("Ignews2-angelino", {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});
