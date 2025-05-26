import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function refreshToken(): Promise<string> {
  console.log("Starting token refresh...");
  console.log("Credentials check:", {
    hasClientId: !!CLIENT_ID,
    hasClientSecret: !!CLIENT_SECRET,
    hasRefreshToken: !!REFRESH_TOKEN,
  });

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error("SPOTIFY_CREDENTIALS_MISSING");
  }

  try {
    console.log("Making request to Spotify token endpoint...");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: REFRESH_TOKEN,
      }),
    });

    console.log("Token response status:", response.status);
    const data = await response.json();

    if (!response.ok) {
      console.error("Token Refresh Error Response:", {
        status: response.status,
        data: data,
      });
      throw new Error(
        data.error_description || data.error || "Failed to refresh token"
      );
    }

    console.log("Token refresh successful");
    accessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;
    return data.access_token;
  } catch (error) {
    console.error("Token Refresh Error:", error);
    throw error;
  }
}

async function getAccessToken(): Promise<string> {
  console.log("Getting access token...");
  console.log("Current token state:", {
    hasToken: !!accessToken,
    tokenExpiry: tokenExpiry,
    currentTime: Date.now(),
  });

  // If we have a valid token, return it
  if (accessToken && tokenExpiry > Date.now() + 1000) {
    console.log("Using existing token");
    return accessToken;
  }

  // Otherwise, refresh the token
  console.log("Token expired or missing, refreshing...");
  return refreshToken();
}

async function getCurrentlyPlaying(token: string) {
  console.log("Fetching currently playing...");
  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    }
  );

  console.log("Currently playing response status:", response.status);

  if (response.status === 204) {
    return { playing: false, message: "No track currently playing" };
  }

  if (response.status === 401) {
    console.log("Token unauthorized, forcing refresh");
    accessToken = null;
    tokenExpiry = 0;
    throw new Error("Token expired");
  }

  if (!response.ok) {
    const error = await response.json();
    console.error("Spotify API Error:", error);
    throw new Error(
      error.error?.message || "Failed to fetch currently playing"
    );
  }

  const data = await response.json();
  console.log("Successfully fetched currently playing");
  return data;
}

export async function GET() {
  try {
    let retries = 0;
    const maxRetries = 2;

    while (retries < maxRetries) {
      try {
        console.log(`Attempt ${retries + 1} of ${maxRetries}`);
        const token = await getAccessToken();
        const data = await getCurrentlyPlaying(token);
        return NextResponse.json(data);
      } catch (error) {
        console.error(`Error on attempt ${retries + 1}:`, error);

        // Handle missing credentials gracefully
        if (
          error instanceof Error &&
          error.message === "SPOTIFY_CREDENTIALS_MISSING"
        ) {
          return NextResponse.json(
            {
              playing: false,
              message: "Spotify integration unavailable in development",
            },
            { status: 200 }
          );
        }

        if (
          error instanceof Error &&
          error.message === "Token expired" &&
          retries < maxRetries - 1
        ) {
          retries++;
          accessToken = null;
          tokenExpiry = 0;
          continue;
        }
        throw error;
      }
    }
  } catch (error) {
    console.error("Final error:", error);

    // Handle missing credentials gracefully
    if (
      error instanceof Error &&
      error.message === "SPOTIFY_CREDENTIALS_MISSING"
    ) {
      return NextResponse.json(
        {
          playing: false,
          message: "Spotify integration unavailable in development",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch currently playing",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
