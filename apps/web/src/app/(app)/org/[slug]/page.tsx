import { MoreHorizontal, TrendingUp } from 'lucide-react';

import { ErrorMessage } from '@/components/error-message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getOrganization } from '@/http/organizations/get-organization';

import { MetricsCards } from './components/metrics-cards';
import { OrganizationHeader } from './components/organization-header';
import { RecentActivity } from './components/recent-activity';
import { SalesChart } from './components/sales-chart';

interface OrganizationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const { slug } = await params;
  const response = await getOrganization(slug);

  if (!response.success) {
    return <ErrorMessage message={response.message} />;
  }

  const { organization } = response.data;

  return (
    <div className="space-y-6">
      <OrganizationHeader organization={organization} />

      <MetricsCards />

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sales Chart */}
        <Card className="gap-3 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <span>Vendas dos Últimos 6 Meses</span>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardTitle>
            <Separator className="my-2 opacity-50" />
          </CardHeader>
          <CardContent className="overflow-hidden">
            <SalesChart />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}
