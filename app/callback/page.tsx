"use client";

import { useEffect } from "react";
import { getAccessToken } from "@/utils/spotify";
import { useRouter } from "next/navigation";

export default function Callback() {
    const router = useRouter();

    useEffect(() => {
        async function handleCallback() {
            try {
                // URL에서 코드 파라미터 가져오기
                const params = new URLSearchParams(window.location.search);
                const code = params.get("code");

                if (!code) {
                    console.error("No code found in URL");
                    router.push("/");
                    return;
                }

                // 토큰 받아오기
                const token = await getAccessToken(code);

                // 토큰 저장
                if (token) {
                    localStorage.setItem("spotify_token", token);
                    console.log("Token successfully saved");
                }

                // 메인 페이지로 리다이렉트
                router.push("/");
            } catch (error) {
                console.error("Error in callback:", error);
                router.push("/");
            }
        }

        handleCallback();
    }, [router]);

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <p>Authenticating with Spotify...</p>
        </div>
    );
}
