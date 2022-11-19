import { render, screen } from "@testing-library/react";
import { stripe } from "../../services/stripe";
import Home, { getStaticProps } from "../../pages";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

jest.mock("next-auth/react", () => {
  return {
    useSession: () => ({
      data: null,
      authorization: "unauthorized",
    }),
  };
});

jest.mock("../../services/stripe");

describe("Home page", () => {
  it("should render correctly", () => {
    render(<Home product={{ priceId: "fake-price-id", amount: "R$10,00" }} />);

    expect(screen.getByText(/R\$10,00/)).toBeInTheDocument();
  });

  it("should load initial data", async () => {
    const retrieveStripePriceMocked = jest.mocked(stripe.prices.retrieve);

    retrieveStripePriceMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
