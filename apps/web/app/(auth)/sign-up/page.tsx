import type { Metadata } from 'next';

import { SignUpForm } from '@/components/auth/sign-up-form';

export const metadata: Metadata = {
  title: 'Sign up | Synapse CRM',
  description: 'Create a new Synapse CRM workspace account.',
};

export default function SignUpPage() {
  return <SignUpForm />;
}
