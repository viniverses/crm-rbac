import { format } from 'date-fns';
import { AtSign, Calendar, Slash, Users } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { GetOrganizationResponse } from '@/http/organizations/get-organization';

export function OrganizationHeader({ organization }: GetOrganizationResponse) {
  const createdAt = format(new Date(organization.createdAt), 'dd.MM.yyyy');

  return (
    <Card className="py-0">
      <CardContent className="p-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="bg-muted relative size-30 overflow-hidden rounded-md border">
            <Image
              src={organization.avatarUrl || '/placeholder.svg'}
              alt={`${organization.name} logo`}
              className="object-cover"
              fill
            />
          </div>

          <div className="flex flex-1 flex-col space-y-1">
            <div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                Enterprise
              </Badge>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{organization.name}</h1>
              <div className="text-foreground mt-1 flex items-center gap-2 text-sm">
                <Slash className="h-4 w-4" />
                <span>{organization.slug}</span>
              </div>

              <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                <AtSign className="h-4 w-4" />
                <span>{organization.domain}</span>
              </div>

              <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{createdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-2 md:flex-row md:items-center">
            <div className="mt-3 flex flex-wrap gap-4">
              <div className="flex items-center gap-1 text-sm">
                <Users className="text-muted-foreground h-4 w-4" />
                <span>42 Contacts</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span>Customer since Apr 2023</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
