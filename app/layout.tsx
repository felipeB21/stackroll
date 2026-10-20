import { Geist_Pixel } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { siteMetadata, siteViewport, jsonLd } from "@/lib/seo";

const geistPixel = Geist_Pixel({
  subsets: ["latin"],
  variable: "--font-geist-pixel",
});
export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("dark h-full antialiased", geistPixel.className)}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
