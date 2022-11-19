import { render, screen } from "@testing-library/react";
import Posts, { getStaticProps } from "../../pages/posts";
import { prismicClient } from "../../services/prismic";

const posts = [
  {
    slug: "my-new-post",
    title: "My new Post",
    excerpt: "Post excerpt",
    updatedAt: "10 de Abril",
  },
];

jest.mock("@prismicio/client", () => {
  return {
    createClient: () => {
      return {
        getAllByType: jest.fn(),
      };
    },
  };
});

describe("Posts page", () => {
  it("should render correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("My new Post")).toBeInTheDocument();
  });

  it("should load initial data", async () => {
    const prismicClientMocked = jest.mocked(prismicClient);

    prismicClientMocked.getAllByType.mockReturnValueOnce([
      {
        uid: "my-new-post",
        data: {
          title: [
            {
              type: "heading1",
              text: "my-new-post",
            },
          ],
          content: [
            {
              type: "paragraph",
              text: "Post excerpt",
            },
          ],
        },
        last_publication_date: "04-01-2021",
      },
    ] as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "my-new-post",
              title: "my-new-post",
              excerpt: "Post excerpt",
              updatedAt: "01 de abril de 2021",
            },
          ],
        },
      })
    );
  });
});
