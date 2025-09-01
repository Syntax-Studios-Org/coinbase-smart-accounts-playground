import { NextRequest, NextResponse } from "next/server";

interface PricesRequest {
  tokenIds: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: PricesRequest = await request.json();
    const { tokenIds } = body;

    if (!tokenIds || !Array.isArray(tokenIds)) {
      return NextResponse.json(
        { error: "Invalid tokenIds array" },
        { status: 400 }
      );
    }

    // For demo purposes, return mock prices
    // In production, you would fetch from CoinGecko or another price API
    const mockPrices: Record<string, number | null> = {
      "ethereum": 3200,
      "usd-coin": 1.00,
      "weth": 3200,
      "dai": 1.00,
      "coinbase-wrapped-btc": 95000,
      "tether": 1.00,
      "zora": 0.15,
      "layerzero": 4.50,
      "pancakeswap-token": 2.80,
    };

    const prices: Record<string, number | null> = {};
    tokenIds.forEach(tokenId => {
      prices[tokenId] = mockPrices[tokenId] || null;
    });

    return NextResponse.json({ prices });
  } catch (error) {
    console.error("Error fetching prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}