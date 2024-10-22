import "./globals.css";
import { Manrope } from "next/font/google";
import { AnimatePresence } from "framer-motion";

// Define the local Manrope font with all weights
const manrope = Manrope({ subsets: ["latin"] });

export const metadata = {
    title: "NRU PROJECT 211.",
    description: "느루(NRU): '한번에 몰아치지 않고 시간을 길게 늦추어 잡아서'라는 뜻",
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
