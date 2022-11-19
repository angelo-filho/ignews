import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { prismicClient } from "../../services/prismic";

const post = {
  slug: "my-new-post",
  title: "My new Post",
  content: "<p>Post excerpt</p>",
  updatedAt: "10 de Abril",
};

jest.mock("next-auth/react");

jest.mock("next/router", () => {
  return {
    useRouter: jest.fn(),
  };
});

jest.mock("@prismicio/client", () => {
  return {
    createClient() {
      return {
        getByUID: jest.fn(),
      };
    },
  };
});

describe("Post preview page", () => {
  it("should render correctly", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<Post post={post} />);

    expect(screen.getByText("My new Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("should redirect user to full post when user is subscribed", async () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: "fake-active-subscription",
        expires: null,
      },
      status: "authenticated",
    } as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(
      <RouterContext.Provider value={{ push: jest.fn() } as any}>
        <Post post={post} />
      </RouterContext.Provider>
    );

    expect(pushMock).toBeCalledWith("/posts/my-new-post");
  });

  it("should load initial data", async () => {
    const prismicClientMocked = jest.mocked(prismicClient);

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

    const response = await getStaticProps({
      params: {
        slug: "fake-slug",
      },
    });

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
