export class PaymentPlanDto {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  features: string[];
  tag?: string;
  sortIndex: number;
  stripePricingTableId: string;
  stripePublishableKey: string;
}
