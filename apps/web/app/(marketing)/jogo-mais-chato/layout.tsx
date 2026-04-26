import { Bungee } from "next/font/google";
import { ChatoProviders } from "./_components/chato-providers";

const bungee = Bungee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export default function JogoMaisChatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={bungee.variable}>
      <ChatoProviders>{children}</ChatoProviders>
    </div>
  );
}
