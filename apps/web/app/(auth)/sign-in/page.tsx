import type { Metadata } from 'next';
import * as React from 'react';

import { SignInForm } from '@/components/auth/sign-in-form';

export const metadata: Metadata = {
  title: 'Sign in | Synapse CRM',
  description: 'Sign in to your Synapse CRM workspace account.',
};

export default function SignInPage() {
  return (
    <React.Suspense fallback={null}>
      <SignInForm />
    </React.Suspense>
  );
}
