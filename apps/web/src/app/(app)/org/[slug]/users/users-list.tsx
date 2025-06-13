import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ExternalLink, MoreVertical, Settings, Users } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const members = [
  {
    id: 'member-1',
    name: 'João Silva',
    email: 'joao.silva@acme.com',
    status: 'active',
    department: 'Vendas',
    role: 'Gerente de Vendas',
    lastLogin: '2024-03-15T10:00:00Z',
    accessType: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'member-2',
    name: 'Maria Santos',
    email: 'maria.santos@acme.com',
    status: 'active',
    department: 'Marketing',
    role: 'Analista de Marketing',
    lastLogin: '2024-03-14T14:30:00Z',
    accessType: 'user',
    createdAt: '2024-02-03T14:30:00Z',
  },
  {
    id: 'member-3',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@acme.com',
    status: 'inactive',
    department: 'TI',
    role: 'Desenvolvedor',
    lastLogin: '2024-03-10T09:15:00Z',
    accessType: 'user',
    createdAt: '2024-01-22T09:15:00Z',
  },
  {
    id: 'member-4',
    name: 'Ana Costa',
    email: 'ana.costa@acme.com',
    status: 'active',
    department: 'RH',
    role: 'Coordenadora de RH',
    lastLogin: '2024-03-15T08:45:00Z',
    accessType: 'admin',
    createdAt: '2024-02-10T11:20:00Z',
  },
  {
    id: 'member-5',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@acme.com',
    status: 'active',
    department: 'Financeiro',
    role: 'Analista Financeiro',
    lastLogin: '2024-03-15T09:30:00Z',
    accessType: 'user',
    createdAt: '2024-03-01T15:40:00Z',
  },
  {
    id: 'member-6',
    name: 'Juliana Lima',
    email: 'juliana.lima@acme.com',
    status: 'inactive',
    department: 'Marketing',
    role: 'Designer Gráfico',
    lastLogin: '2024-03-08T16:20:00Z',
    accessType: 'user',
    createdAt: '2024-02-15T13:10:00Z',
  },
  {
    id: 'member-7',
    name: 'Roberto Alves',
    email: 'roberto.alves@acme.com',
    status: 'active',
    department: 'Vendas',
    role: 'Representante Comercial',
    lastLogin: '2024-03-15T11:15:00Z',
    accessType: 'user',
    createdAt: '2024-03-05T10:30:00Z',
  },
  {
    id: 'member-8',
    name: 'Fernanda Souza',
    email: 'fernanda.souza@acme.com',
    status: 'active',
    department: 'TI',
    role: 'Analista de Sistemas',
    lastLogin: '2024-03-15T10:45:00Z',
    accessType: 'admin',
    createdAt: '2024-01-30T14:25:00Z',
  },
  {
    id: 'member-9',
    name: 'Lucas Martins',
    email: 'lucas.martins@acme.com',
    status: 'active',
    department: 'Financeiro',
    role: 'Contador',
    lastLogin: '2024-03-14T17:30:00Z',
    accessType: 'user',
    createdAt: '2024-02-20T09:15:00Z',
  },
  {
    id: 'member-10',
    name: 'Patrícia Santos',
    email: 'patricia.santos@acme.com',
    status: 'inactive',
    department: 'RH',
    role: 'Assistente de RH',
    lastLogin: '2024-03-05T13:45:00Z',
    accessType: 'user',
    createdAt: '2024-03-10T11:50:00Z',
  },
];

export function UsersList() {
  return (
    <div className="space-y-4">
      <Card className="p-0">
        <CardContent className="overflow-hidden rounded-md p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground bg-muted p-4 font-semibold">Usuário</TableHead>
                <TableHead className="text-muted-foreground bg-muted p-4 font-semibold">Status</TableHead>
                <TableHead className="text-muted-foreground bg-muted p-4 font-semibold">Departamento</TableHead>
                <TableHead className="text-muted-foreground bg-muted p-4 font-semibold">Cargo</TableHead>
                <TableHead className="text-muted-foreground bg-muted p-4 font-semibold">Último Login</TableHead>
                <TableHead className="text-muted-foreground bg-muted p-4 font-semibold">Tipo de Acesso</TableHead>
                <TableHead className="text-muted-foreground bg-muted p-4 font-semibold">Criado em</TableHead>
                <TableHead className="text-muted-foreground bg-muted p-4 font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="px-3">
                    <div className="flex items-center gap-3 py-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={'/placeholder.svg'} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-muted-foreground text-sm">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.status === 'active' ? (
                      <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-500">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-500">
                        Inativo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            {formatDistanceToNow(new Date(member.lastLogin), { locale: ptBR, addSuffix: true })}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {format(new Date(member.lastLogin), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.accessType === 'admin' ? 'default' : 'secondary'}>
                      {member.accessType === 'admin' ? 'Administrador' : 'Usuário'}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(member.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>Ver Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Users className="mr-2 h-4 w-4" />
                          <span>Remover</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
