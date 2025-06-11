import { Building2, CreditCard, Database, ExternalLink, MoreVertical, Settings, Users } from 'lucide-react';

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

const tenants = [
  {
    id: 'tenant-1',
    name: 'Acme Corporation',
    domain: 'acme.modularcrm.com',
    status: 'active',
    users: 42,
    storage: '2.1 GB',
    created: '2025-01-15T10:00:00Z',
    plan: 'enterprise',
  },
  {
    id: 'tenant-2',
    name: 'TechCo Industries',
    domain: 'techco.modularcrm.com',
    status: 'active',
    users: 28,
    storage: '1.7 GB',
    created: '2025-02-03T14:30:00Z',
    plan: 'professional',
  },
  {
    id: 'tenant-3',
    name: 'Global Services Inc',
    domain: 'globalservices.modularcrm.com',
    status: 'active',
    users: 64,
    storage: '3.5 GB',
    created: '2024-11-22T09:15:00Z',
    plan: 'enterprise',
  },
  {
    id: 'tenant-4',
    name: 'Startup Solutions',
    domain: 'startup.modularcrm.com',
    status: 'trial',
    users: 8,
    storage: '0.4 GB',
    created: '2025-03-01T16:45:00Z',
    plan: 'trial',
  },
  {
    id: 'tenant-5',
    name: 'Local Business Co',
    domain: 'localbiz.modularcrm.com',
    status: 'active',
    users: 15,
    storage: '0.9 GB',
    created: '2025-02-15T11:30:00Z',
    plan: 'standard',
  },
];

export function MemberList() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-md border">
                        <Building2 className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-muted-foreground text-sm">{tenant.domain}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tenant.status === 'active' ? (
                      <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-500">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-yellow-500/20 bg-yellow-500/10 text-yellow-500">
                        Trial
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="text-muted-foreground h-4 w-4" />
                      <span>{tenant.users}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Database className="text-muted-foreground h-4 w-4" />
                      <span>{tenant.storage}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(tenant.created).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tenant.plan === 'enterprise'
                          ? 'default'
                          : tenant.plan === 'professional'
                            ? 'secondary'
                            : tenant.plan === 'trial'
                              ? 'outline'
                              : 'secondary'
                      }
                    >
                      {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                    </Badge>
                  </TableCell>
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
                          <span>Access Portal</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Billing</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          <span>Manage Users</span>
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
