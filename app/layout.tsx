import "./globals.css";
import { Manrope } from "next/font/google";

// Define the local Manrope font with all weights
const manrope = Manrope({ subsets: ["latin"] });

export const metadata = {
    title: "DE 導彦",
    description: "Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={manrope.className}>{children}</body>
        </html>
    );
}
