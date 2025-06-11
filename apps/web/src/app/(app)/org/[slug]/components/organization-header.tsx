import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, CheckCircle2, Globe, Mail, Pencil } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GetOrganizationResponse } from '@/http/organizations/get-organization';

export function OrganizationHeader({ organization }: GetOrganizationResponse) {
  const createdAt = format(new Date(organization.createdAt), "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Image
              src={organization.avatarUrl ?? '/placeholder.png'}
              alt={organization.name}
              width={80}
              height={80}
              className="rounded-xl border"
            />
            <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500">
              <CheckCircle2 className="h-3 w-3 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
              <Badge variant="secondary" className="border-green-400 bg-green-100 text-green-800">
                Ativo
              </Badge>
              <Badge variant="outline" className="border-purple-200 text-purple-700">
                Plano Enterprise
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>@{organization.slug}</span>
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span>{organization.domain}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Cliente desde {createdAt}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Enviar email
          </Button>
          <Button size="sm">
            <Globe className="mr-2 h-4 w-4" />
            Acessar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
