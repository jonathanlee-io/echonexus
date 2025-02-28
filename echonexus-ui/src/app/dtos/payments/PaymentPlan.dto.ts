export interface PaymentPlanDto {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  features: string[];
  tag?: string;
  stripePricingTableId: string;
  stripePublishableKey: string;
}
