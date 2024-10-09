import { Manrope } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const manrope = Manrope({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "ah?",
    description: "Doeon's space",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={manrope.className}>
            <body>{children}</body>
        </html>
    );
}
