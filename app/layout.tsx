import "./globals.css";
import { Manrope } from "next/font/google";

const manrope = Manrope({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

export const metadata = {
    title: "kwondoeon",
    description: "kwondoeon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={manrope.className}>
            <body>{children}</body>
        </html>
    );
}
