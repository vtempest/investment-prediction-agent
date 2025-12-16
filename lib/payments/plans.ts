export interface Plan {
  id: number,
  name: string,
  priceId: string,
  limits: any,
  features: string[],
  price: number,
  trialDays: number
}

export const plans: Plan[] = [
  {
    id: 1,
    name: "pro",
    priceId: "price_1Sf25tD6sln9a8JlVfI0B6WR",
    limits: {
      tokens: 1000
    },
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "10 GB storage"
    ],
    price: 19.99,
    trialDays: 7,
  },

  // {
  //   id: 2,
  //   name: "pro",
  //   priceId: "price_1Rk2OzQ70YfWGPkSD4IBXRDo",
  //   limits: {
  //     tokens: 300
  //   },
  //   features: [
  //     "Gives you access to pro features!",
  //     "Upto 10 team members",
  //     "Upto 20 GB storage",
  //     "Upto 10 pages",
  //     "Phone & email support",
  //     "AI assistance"
  //   ],
  //   price: 29.99,
  //   trialDays: 0
  // },
  // {
  //   id: 3,
  //   name: "Premium",
  //   priceId: "price_1RCQTRDYd93YQoGLLd7bh8Kf",
  //   limits: {
  //     tokens: 900
  //   },
  //   features: [
  //     "Unlimited projects",
  //     "Advanced analytics",
  //     "Priority support",
  //     "100 GB storage"
  //   ],
  //   price: 59.99,
  //   trialDays: 7
  // }
]