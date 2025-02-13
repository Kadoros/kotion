This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

it is dev 

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Secand, run the next commad to set up a Convex dev deployment:
```bash
npx convex dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


# Kotion Word Memorising App

## Overview
The Kotion Word Memorising App is an application that optimizes vocabulary learning based on the SuperMemo algorithm (SM-2). This app automatically adjusts the spaced repetition to provide users with the optimal review schedule.

## SuperMemo-Based Learning Method
Kotion follows these principles:

1. **Optimal Review Intervals**: Words are reviewed at the appropriate times to help store them in long-term memory.
2. **Personalized Learning Difficulty**: The review intervals and difficulty are automatically adjusted based on the user's response accuracy.
3. **Efficient Learning Management**: The daily learning load and review schedule are optimized to minimize stress.

## Application of the SM-2 Algorithm
Kotion applies the SuperMemo algorithm in the following way:

1. Each word is managed as an individual unit.
2. Initial review intervals are set:
   - `I(1) := 1` (review after 1 day)
   - `I(2) := 6` (review after 6 days)
   - `I(n) := I(n-1) * EF` (subsequent intervals are adjusted)
3. The user evaluates their answer during the review on a scale of 0 to 5:
   - 5: Perfect recall
   - 4: Slight hesitation
   - 3: Correct but with difficulty
   - 2: Incorrect (but somewhat familiar)
   - 1: Incorrect (almost no memory)
   - 0: Completely forgotten
4. The `E-Factor` is adjusted based on the score:

   ``` EF' := EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))```
    - The EF value is kept at a minimum of 1.3.
5. If the score is below 3, the word's review interval is reset, and it is relearned.
6. After a day's learning, words with a score below 4 are reviewed until they reach a score of 4 or higher.

## Learning Effectiveness
Experimental learning results using Kotion:
- **Annual Learning Speed**: 270 words/month
- **Average Daily Learning Time**: 30-40 minutes
- **Long-Term Retention Rate**: Around 90%

The Kotion Word Memorising App provides a personalized spaced repetition system, helping users efficiently memorize vocabulary. It delivers the optimal learning experience based on the SuperMemo algorithm.
