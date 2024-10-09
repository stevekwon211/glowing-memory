import "./globals.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

// Define the local Manrope font with all weights
const manrope = localFont({
    src: [
        {
            path: "../public/fonts/Manrope-ExtraLight.ttf",
            weight: "200",
            style: "normal",
        },
        {
            path: "../public/fonts/Manrope-Light.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "../public/fonts/Manrope-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/fonts/Manrope-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../public/fonts/Manrope-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../public/fonts/Manrope-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../public/fonts/Manrope-ExtraBold.ttf",
            weight: "800",
            style: "normal",
        },
    ],
    variable: "--font-manrope",
    display: "swap",
});

// Keep the Inter font if you're still using it
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "ah?",
    description: "doeon kwon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.className} ${manrope.variable}`}>{children}</body>
        </html>
    );
}
