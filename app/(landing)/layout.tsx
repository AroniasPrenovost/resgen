import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const LandingLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className={`landing-redesign ${instrumentSerif.variable} h-full min-h-screen overflow-auto`}>
      {children}
    </main>
   );
}

export default LandingLayout;
