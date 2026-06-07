import { HeaderV2 } from '@/components/shared/HeaderV2';
import { HomepageFooterV2 } from '@/components/marketing/HomepageFooterV2';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Flocken - Ett enklare liv som hundägare",
  description: "Underlätta vardagen som hundägare med funktionerna Hundar, Passa, Rasta och Besöka. För ett bättre liv som hund.",
  openGraph: {
    title: "Flocken - Ett enklare liv som hundägare",
    description: "Underlätta vardagen som hundägare med funktionerna Hundar, Passa, Rasta och Besöka",
    images: ['/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg'],
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderV2 />
      {children}
      <HomepageFooterV2 />
    </>
  );
}

