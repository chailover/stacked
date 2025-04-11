# Stacked - Life Toolkit for Modern Students

A comprehensive toolkit designed to help students stay on top of their academic and personal life. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **GPA Calculator**: Calculate weighted and unweighted GPA
- **Budget Tracker**: Track income and expenses
- **College Cost Estimator**: Estimate and compare college costs
- **To-Do List**: Manage tasks and deadlines
- **Countdown Timer**: Track important dates
- **Resume Builder**: Create professional resumes
- **And more tools coming soon!**

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   ├── tools/            # Tool-specific components
│   └── ui/               # UI components
├── lib/                  # Utility functions
├── hooks/               # Custom React hooks
├── store/               # Zustand store
└── types/               # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
