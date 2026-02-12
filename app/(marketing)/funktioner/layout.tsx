import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Flockens funktioner - Para, Passa, Rasta, Besöka",
  description: "Lär dig mer om Flockens fyra huvudfunktioner: Para, Passa, Rasta och Besöka. Se hur appen fungerar i praktiken.",
  openGraph: {
    title: "Flockens funktioner - Para, Passa, Rasta, Besöka",
    description: "Lär dig mer om Flockens fyra huvudfunktioner och se hur appen fungerar i praktiken",
  },
};

export default function FunktionerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
