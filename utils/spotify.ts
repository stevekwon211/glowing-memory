const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const REDIRECT_URI =
    process.env.NODE_ENV === "production" ? "https://kwondoeon.vercel.app/callback" : "http://localhost:3001/callback";
const SCOPES = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-read-playback-position",
    "user-read-private",
    "user-modify-playback-state",
];

function generateCodeVerifier(length: number) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export async function redirectToAuthCodeFlow() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams({
        client_id: CLIENT_ID!,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        scope: SCOPES.join(" "),
        code_challenge_method: "S256",
        code_challenge: challenge,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(code: string) {
    const verifier = localStorage.getItem("verifier");

    if (!verifier) {
        throw new Error("No verifier found");
    }

    const params = new URLSearchParams({
        client_id: CLIENT_ID!,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: verifier,
        scope: SCOPES.join(" "),
    });

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Token Error:", data);
            throw new Error(data.error_description || "Failed to get access token");
        }

        // 인증 성공 후 verifier 삭제
        localStorage.removeItem("verifier");

        // 토큰 저장
        localStorage.setItem("spotify_token", data.access_token);
        if (data.refresh_token) {
            localStorage.setItem("spotify_refresh_token", data.refresh_token);
        }

        return data.access_token;
    } catch (error) {
        console.error("Error getting access token:", error);
        throw error;
    }
}

export async function refreshAccessToken() {
    const refresh_token = localStorage.getItem("spotify_refresh_token");

    if (!refresh_token) {
        throw new Error("No refresh token available");
    }

    const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
        client_id: CLIENT_ID!,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    localStorage.setItem("spotify_token", data.access_token);
    return data.access_token;
}

export async function getCurrentlyPlaying(token: string) {
    if (!token) {
        console.error("No token provided to getCurrentlyPlaying");
        throw new Error("No token provided");
    }

    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 204) {
            return null;
        }

        if (!response.ok) {
            const error = await response.json();
            console.error("API Error:", error);
            throw error;
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching currently playing:", error);
        throw error;
    }
}
