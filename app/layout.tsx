import "./globals.css";
import { Manrope } from "next/font/google";
import { AnimatePresence } from "framer-motion";

// Define the local Manrope font with all weights
const manrope = Manrope({ subsets: ["latin"] });

export const metadata = {
    title: "DE 導彦",
    description: "Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={manrope.className}>
            <body>
                <AnimatePresence mode="wait">{children}</AnimatePresence>
            </body>
        </html>
    );
}
