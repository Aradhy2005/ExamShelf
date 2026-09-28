import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://examshelf.in"),

  title: {
    default: "ExamShelf - Educational Resources",
    template: "%s | ExamShelf",
  },

  description:
    "Discover quality educational resources, notes, tutorials, and study materials on ExamShelf.",

  openGraph: {
    title: "ExamShelf - Educational Resources",
    description:
      "Discover quality educational resources, notes, tutorials, and study materials on ExamShelf.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}