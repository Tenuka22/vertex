import {
  ChevronDown,
  DollarSign,
  Filter,
  Package,
  Plus,
  Store,
  Tag,
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

const PRODUCTS_SERVICES_PAGE = () => {
  const offerings = [
    {
      id: 'p1',
      name: 'Premium Website Design',
      type: 'Service',
      price: 1200,
      category: 'Design',
      status: 'active',
      lastUpdated: '2025-08-28',
      description: 'Custom-designed websites tailored to your brand.',
    },
    {
      id: 'p2',
      name: 'SEO Optimization Package',
      type: 'Service',
      price: 500,
      category: 'Marketing',
      status: 'active',
      lastUpdated: '2025-08-26',
      description: 'Boost your website ranking with advanced SEO strategies.',
    },
    {
      id: 'p3',
      name: 'E-commerce Template',
      type: 'Product',
      price: 299,
      category: 'Templates',
      status: 'active',
      lastUpdated: '2025-08-24',
      description: 'Prebuilt e-commerce storefront ready for deployment.',
    },
    {
      id: 'p4',
      name: 'Branding Kit',
      type: 'Product',
      price: 150,
      category: 'Branding',
      status: 'inactive',
      lastUpdated: '2025-08-22',
      description: 'Logos, typography, and brand guidelines for consistency.',
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
          <H2 className="font-bold text-3xl">Products & Services</H2>
          <Muted>
            Manage your offerings and keep track of availability and pricing.
          </Muted>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" variant="outline">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Offering
          </Button>
        </div>
      </div>

      <Separator />

      {/* Offerings Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offerings.map((item) => {
          const statusInfo = getStatusBadge(item.status);

          return (
            <Card
              className="flex cursor-pointer flex-col border shadow-md transition-all hover:shadow-lg"
              key={item.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500 p-2">
                      {item.type === 'Service' ? (
                        <Store className="h-5 w-5 text-white" />
                      ) : (
                        <Package className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Muted className="text-sm">{item.category}</Muted>
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
                    Updated: {formatDate(item.lastUpdated)}
                  </Muted>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <p className="line-clamp-3 text-muted-foreground text-sm">
                  {item.description}
                </p>
                <div className="flex items-center justify-between font-medium text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />${item.price}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {item.type}
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
              <H2 className="font-semibold text-xl">
                Add New Product or Service
              </H2>
              <P>
                Create a new offering to showcase your products and services.
              </P>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Offering
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default PRODUCTS_SERVICES_PAGE;
