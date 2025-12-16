"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { plans, type Plan } from "@/lib/payments/plans";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PremiumUpgrade() {
    const { data: session } = authClient.useSession();
    // @ts-ignore - useActiveSubscription is provided by stripe plugin; type inference might be lagging
    const { data: activeSubscription, isPending: isLoadingSubscription } = authClient.useActiveSubscription();
    const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

    const handleUpgrade = async (plan: Plan) => {
        setLoadingPlanId(plan.id);
        try {
            await authClient.subscription.upgrade({
                plan: plan.name,
                successUrl: "/dashboard/settings?success=true",
                cancelUrl: "/dashboard/settings?cancelled=true",
            });
        } catch (error) {
            console.error("Subscription error:", error);
            toast.error("Failed to start subscription process");
        } finally {
            setLoadingPlanId(null);
        }
    };

    if (isLoadingSubscription) {
        return (
            <Card className="w-full mb-8">
                <CardHeader>
                    <CardTitle>Loading subscription details...</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    // Filter out free plans if you only want to show upgrades, 
    // or show all. Typically upgrades are paid.
    // Assuming 'price > 0' means paid.
    const upgradePlans = plans.filter(p => p.price > 0);
    const currentPlanId = activeSubscription ? activeSubscription.planId : null; // Mapping might be needed depending on how better-auth returns plan ID

    // If already on a premium plan, maybe manage it instead? 
    // For now, let's just list the plans as requested.

    return (
        <Card className="w-full border-primary/20 bg-primary/5 mb-8">
            <CardHeader>
                <CardTitle className="text-2xl text-primary">Upgrade Your Plan</CardTitle>
                <CardDescription>
                    Unlock advanced features and higher limits with our premium plans.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upgradePlans.map((plan) => {
                        const isCurrent = activeSubscription?.plan === plan.name; // Simplified check
                        return (
                            <Card key={plan.id} className={`flex flex-col ${isCurrent ? 'border-primary shadow-md' : ''}`}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                                        {isCurrent && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Current</span>}
                                    </CardTitle>
                                    <div className="text-3xl font-bold">
                                        ${plan.price}
                                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                                    </div>
                                    {plan.trialDays > 0 && (
                                        <div className="text-sm text-green-600 font-medium">
                                            {plan.trialDays}-day free trial
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <ul className="space-y-2 text-sm">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        onClick={() => handleUpgrade(plan)}
                                        disabled={loadingPlanId === plan.id || isCurrent}
                                        variant={isCurrent ? "outline" : "default"}
                                    >
                                        {loadingPlanId === plan.id ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : isCurrent ? (
                                            "Current Plan"
                                        ) : (
                                            `Upgrade to ${plan.name}`
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
