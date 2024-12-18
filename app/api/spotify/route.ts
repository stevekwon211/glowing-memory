import { NextResponse } from "next/server";

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken() {
    if (accessToken && tokenExpiry > Date.now()) {
        return accessToken;
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: REFRESH_TOKEN!,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Token Error:", data);
        throw new Error("Failed to refresh token");
    }

    accessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;
    return accessToken;
}

export async function GET() {
    try {
        const token = await getAccessToken();
        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            next: { revalidate: 0 }, // 캐시 비활성화
        });

        if (response.status === 204) {
            return NextResponse.json({ playing: false, message: "No track currently playing" });
        }

        if (!response.ok) {
            const error = await response.json();
            console.error("Spotify API Error:", error);
            throw new Error("Failed to fetch currently playing");
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to fetch currently playing" }, { status: 500 });
    }
}
