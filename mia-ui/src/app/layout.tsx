import { 
  Inter, 
  Instrument_Serif, 
  Playfair_Display, 
  Montserrat, 
  Roboto, 
  Lora,
  Bebas_Neue,
  Oswald,
  Libre_Baskerville,
  Cinzel,
  Poppins,
  Raleway,
  Quicksand,
  Space_Grotesk,
  Cormorant_Garamond,
  Work_Sans
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-serif" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--font-playfair" });
const montserrat = Montserrat({ subsets: ["latin"], display: "swap", variable: "--font-montserrat" });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-roboto" });
const lora = Lora({ subsets: ["latin"], display: "swap", variable: "--font-lora" });
const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-bebas" });
const oswald = Oswald({ subsets: ["latin"], display: "swap", variable: "--font-oswald" });
const libreBaskerville = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-baskerville" });
const cinzel = Cinzel({ subsets: ["latin"], display: "swap", variable: "--font-cinzel" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap", variable: "--font-poppins" });
const raleway = Raleway({ subsets: ["latin"], display: "swap", variable: "--font-raleway" });
const quicksand = Quicksand({ subsets: ["latin"], display: "swap", variable: "--font-quicksand" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-space" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600"], display: "swap", variable: "--font-cormorant" });
const workSans = Work_Sans({ subsets: ["latin"], display: "swap", variable: "--font-work" });

export const metadata = {
  title: "Mail Manus - Your email, done.",
  description: "Mail Manus turns your messy email threads into structured to-dos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`
        ${inter.variable} 
        ${instrumentSerif.variable} 
        ${playfair.variable} 
        ${montserrat.variable} 
        ${roboto.variable} 
        ${lora.variable} 
        ${bebasNeue.variable}
        ${oswald.variable}
        ${libreBaskerville.variable}
        ${cinzel.variable}
        ${poppins.variable}
        ${raleway.variable}
        ${quicksand.variable}
        ${spaceGrotesk.variable}
        ${cormorant.variable}
        ${workSans.variable}
        font-sans antialiased
      `} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
