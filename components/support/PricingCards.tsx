import { Heart, PawPrint, Home, Building2, Crown, type LucideIcon } from 'lucide-react';

const PLANS: {
  name: string;
  icon: LucideIcon;
  monthly: number;
  yearly: number;
  free?: boolean;
}[] = [
  { name: 'Gratis', icon: Heart, monthly: 0, yearly: 0, free: true },
  { name: 'Hundägare', icon: PawPrint, monthly: 39, yearly: 299 },
  { name: 'Hundvakt', icon: Home, monthly: 49, yearly: 399 },
  { name: 'Hunddagis', icon: Building2, monthly: 99, yearly: 799 },
  { name: 'Kennel', icon: Crown, monthly: 129, yearly: 1049 },
];

function savingsPct(monthly: number, yearly: number) {
  return Math.round((1 - yearly / (monthly * 12)) * 100);
}

export function PricingCards() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {PLANS.map((plan) => {
        const Icon = plan.icon;
        const savings = plan.free ? 0 : savingsPct(plan.monthly, plan.yearly);
        return (
          <div
            key={plan.name}
            className={`rounded-xl p-4 text-center ${plan.free ? 'col-span-2 sm:col-span-1' : ''} ${
              plan.free
                ? 'border border-flocken-olive/30 bg-flocken-olive/10'
                : 'border border-flocken-sand bg-white'
            }`}
          >
            <div
              className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                plan.free ? 'bg-flocken-olive/20' : 'bg-flocken-cream'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${plan.free ? 'text-flocken-olive' : 'text-flocken-brown'}`}
                aria-hidden
              />
            </div>
            <p className="text-sm font-semibold text-flocken-brown">{plan.name}</p>
            {plan.free ? (
              <p className="mt-1 text-lg font-bold text-flocken-olive">Alltid gratis</p>
            ) : (
              <>
                <p className="mt-1 text-lg font-bold text-flocken-brown">
                  {plan.monthly} kr
                  <span className="text-xs font-normal text-flocken-brown/60">/mån</span>
                </p>
                <p className="text-xs text-flocken-brown/60">{plan.yearly} kr/år</p>
                <span className="mt-1 inline-block rounded-full bg-flocken-olive/10 px-2 py-0.5 text-xs font-medium text-flocken-olive">
                  Spara {savings}%
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
