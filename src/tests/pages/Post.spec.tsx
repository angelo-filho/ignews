import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { prismicClient } from "../../services/prismic";

const post = {
  slug: "my-new-post",
  title: "My new Post",
  content: "<p>Post excerpt</p>",
  updatedAt: "10 de Abril",
};

jest.mock("next-auth/react");

jest.mock("@prismicio/client", () => {
  return {
    createClient: () => {
      return {
        getByUID: jest.fn(),
      };
    },
  };
});

describe("Post page", () => {
  it("should render correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("My new Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
  });

  it("should redirect user if no subscription is found", async () => {
    const getSessionMocked = jest.mocked(getSession);

    getSessionMocked.mockReturnValueOnce({
      activeSubscription: null,
    } as any);

    const response = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: {
        slug: "fake-slug",
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: { destination: `/posts/preview/fake-slug`, permanent: false },
      })
    );
  });

  it("should load initial data", async () => {
    const getSessionMocked = jest.mocked(getSession);
    const prismicClientMocked = jest.mocked(prismicClient);

    getSessionMocked.mockReturnValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);

    prismicClientMocked.getByUID.mockReturnValueOnce({
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
            text: "Post content",
            spans: [],
          },
        ],
      },
      last_publication_date: "04-01-2021",
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: "fake-slug",
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "fake-slug",
            title: "my-new-post",
            content: "<p>Post content</p>",
            updatedAt: "01 de abril de 2021",
          },
        },
      })
    );
  });
});
