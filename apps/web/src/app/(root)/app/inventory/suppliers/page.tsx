import {
  Building,
  ChevronDown,
  Filter,
  Phone,
  Plus,
  Truck,
} from 'lucide-react';
import { H2, Muted, P } from '@/components/design/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

const SUPPLIERS_PAGE = () => {
  const suppliers = [
    {
      id: 's1',
      name: 'Global Supplies Inc.',
      type: 'Material Supplier',
      category: 'Packaging',
      contact: '+1-202-555-0183',
      status: 'active',
      lastUpdated: '2025-08-29',
      description:
        'Provides packaging materials including boxes, labels, and shipping supplies.',
    },
    {
      id: 's2',
      name: 'Fresh Produce Co.',
      type: 'Raw Materials',
      category: 'Food Ingredients',
      contact: '+1-202-555-0199',
      status: 'active',
      lastUpdated: '2025-08-27',
      description:
        'Organic produce supplier for all raw ingredients needed in product creation.',
    },
    {
      id: 's3',
      name: 'TechParts Warehouse',
      type: 'Component Supplier',
      category: 'Electronics',
      contact: '+1-202-555-0101',
      status: 'inactive',
      lastUpdated: '2025-08-20',
      description:
        'Supplier of electronic components and spare parts for devices and kits.',
    },
    {
      id: 's4',
      name: 'Local Artisan Collective',
      type: 'Specialty Supplier',
      category: 'Handmade Goods',
      contact: '+1-202-555-0112',
      status: 'active',
      lastUpdated: '2025-08-21',
      description:
        'Handcrafted items and specialty materials from local artisans.',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? { color: 'bg-green-100 text-green-800', text: 'Active' }
      : { color: 'bg-gray-100 text-gray-800', text: 'Inactive' };
  };

  return (
    <main className="relative space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <H2 className="font-bold text-3xl">Suppliers</H2>
          <Muted>
            Track suppliers, their offerings, and sourcing information.
          </Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Supplier
          </Button>
        </div>
      </div>

      <Separator />

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => {
          const statusInfo = getStatusBadge(supplier.status);

          return (
            <Card
              className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
              key={supplier.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500 p-2">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <Muted className="text-sm">{supplier.category}</Muted>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                  <Muted className="text-sm">
                    Updated: {formatDate(supplier.lastUpdated)}
                  </Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <p className="line-clamp-3 text-muted-foreground text-sm">
                  {supplier.description}
                </p>
                <div className="flex flex-col items-start justify-between gap-1 font-medium text-sm">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" /> {supplier.contact}
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {supplier.type}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create CTA */}
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-fit">
              <H2 className="font-semibold text-xl">Add New Supplier</H2>
              <P>Register a new supplier and track their offerings.</P>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Supplier
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default SUPPLIERS_PAGE;
