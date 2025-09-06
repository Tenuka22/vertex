'use client';

import {
  AlertCircle,
  AlertTriangle,
  Loader2,
  Plus,
  RefreshCw,
  WifiOff,
} from 'lucide-react';
import type React from 'react';
import { H2, Muted } from '@/components/design/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ICON_SIZE_SMALL = 'h-4 w-4';
const HTTP_NOT_FOUND = 404;
const HTTP_FORBIDDEN = 403;
const LOADING_SKELETON_COUNT = 4;

type LoadingSkeletonProps = {
  className?: string;
  variant?: 'default' | 'text' | 'circle' | 'button';
};

type ExtendedError = Error & {
  status?: number;
  code?: string;
};

type EntityPageWrapperProps = {
  title: string;
  description: string;
  data: unknown[];
  isLoading: boolean;
  isFetching: boolean;
  error: ExtendedError | null;
  onRefetch: () => void;
  onAddEntry: () => void;
  entityNameSingular: string;
  entityNamePlural: string;
  additionalActions?: React.ReactNode;
  renderStats?: () => React.ReactNode;
  renderTable?: () => React.ReactNode;
  renderEmptyState?: () => React.ReactNode;
  renderQuickActions?: () => React.ReactNode;
};

const LoadingSkeleton = ({
  className = '',
  variant = 'default',
}: LoadingSkeletonProps) => {
  const baseClasses = 'animate-pulse bg-muted';
  const variantClasses = {
    default: 'rounded',
    text: 'rounded-sm',
    circle: 'rounded-full',
    button: 'rounded-md',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

const LoadingCard = ({ showIcon = true }: { showIcon?: boolean }) => (
  <Card className="shadow-md transition-all duration-200">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <LoadingSkeleton className="h-4 w-20" variant="text" />
          <LoadingSkeleton className="h-8 w-32" variant="text" />
          <LoadingSkeleton className="h-3 w-24" variant="text" />
        </div>
        {showIcon && <LoadingSkeleton className="h-8 w-8" variant="circle" />}
      </div>
    </CardContent>
  </Card>
);

const getErrorDetails = (error: ExtendedError) => {
  if (error.status === HTTP_NOT_FOUND) {
    return {
      icon: AlertTriangle,
      title: 'Data Not Found',
      description:
        "The data you're looking for doesn't exist or has been moved.",
      variant: 'warning' as const,
    };
  }

  if (error.status === HTTP_FORBIDDEN) {
    return {
      icon: AlertCircle,
      title: 'Access Denied',
      description: "You don't have permission to access this data.",
      variant: 'destructive' as const,
    };
  }

  if (error.code === 'NETWORK_ERROR' || error.message?.includes('fetch')) {
    return {
      icon: WifiOff,
      title: 'Connection Problem',
      description:
        'Unable to connect to the server. Please check your internet connection.',
      variant: 'warning' as const,
    };
  }

  return {
    icon: AlertCircle,
    title: 'Something Went Wrong',
    description:
      error.message || 'An unexpected error occurred while loading your data.',
    variant: 'destructive' as const,
  };
};

const ErrorCard = ({
  error,
  onRetry,
}: {
  error: ExtendedError;
  onRetry?: () => void;
}) => {
  const { icon: Icon, title, description, variant } = getErrorDetails(error);

  const getErrorCardClassName = () => {
    return variant === 'warning'
      ? 'border-yellow-200 bg-yellow-50/50'
      : 'border-destructive/20 bg-destructive/5';
  };

  const getTitleClassName = () => {
    return variant === 'warning' ? 'text-yellow-700' : 'text-destructive';
  };

  return (
    <Card
      className={`shadow-md transition-all duration-200 ${getErrorCardClassName()}`}
    >
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${getTitleClassName()}`}>
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button className="gap-2" onClick={onRetry} variant="outline">
              <RefreshCw className={ICON_SIZE_SMALL} />
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()} variant="ghost">
              Refresh Page
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const DefaultEmptyState = ({
  onAddEntry,
  entityNameSingular,
}: {
  onAddEntry: () => void;
  entityNameSingular: string;
}) => (
  <Card className="border-2 border-dashed shadow-md transition-all duration-200 hover:shadow-lg">
    <CardContent className="py-12 text-center">
      <H2 className="mb-2 font-semibold text-xl">
        No {entityNameSingular} Data Yet
      </H2>
      <Button className="mt-4 gap-2" onClick={onAddEntry} size="lg">
        <Plus className={ICON_SIZE_SMALL} />
        Create Your First {entityNameSingular}
      </Button>
    </CardContent>
  </Card>
);

const EntityPageWrapper = ({
  title,
  description,
  data,
  isLoading,
  isFetching,
  error,
  onRefetch,
  onAddEntry,
  entityNameSingular,
  additionalActions,
  renderStats,
  renderTable,
  renderEmptyState,
  renderQuickActions,
}: EntityPageWrapperProps) => {
  const dataCount = data.length;
  const entryText = dataCount === 1 ? 'entry' : 'entries';

  if (isLoading) {
    return (
      <main className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <LoadingSkeleton className="h-9 w-48" />
            <LoadingSkeleton className="h-5 w-64" />
          </div>
          <div className="flex gap-2">
            <LoadingSkeleton className="h-10 w-20" variant="button" />
            <LoadingSkeleton className="h-10 w-28" variant="button" />
          </div>
        </div>
        <Separator />

        {renderStats && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: LOADING_SKELETON_COUNT }, () =>
              crypto.randomUUID()
            ).map((i) => (
              <LoadingCard key={`loading-card-${i}`} />
            ))}
          </div>
        )}

        <div className="space-y-4">
          <LoadingSkeleton className="h-6 w-32" />
          <LoadingSkeleton className="h-64 w-full" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <H2 className="font-bold text-3xl">{title}</H2>
            <Muted>{description}</Muted>
          </div>
          <div className="flex gap-2">
            {additionalActions}
            <Button className="gap-2" disabled>
              <Plus className={ICON_SIZE_SMALL} /> Add {entityNameSingular}
            </Button>
          </div>
        </div>
        <Separator />
        <ErrorCard error={error} onRetry={onRefetch} />
      </main>
    );
  }

  return (
    <main className="relative space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <H2 className="font-bold text-3xl">{title}</H2>
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
            <Badge className="text-xs" variant="outline">
              {dataCount} {entryText}
            </Badge>
          </div>
          <Muted>{description}</Muted>
        </div>
        <div className="flex gap-2">
          <Button
            className="gap-2"
            disabled={isFetching}
            onClick={onRefetch}
            variant="outline"
          >
            <RefreshCw
              className={`${ICON_SIZE_SMALL} ${isFetching ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          {additionalActions}
          <Button className="gap-2" onClick={onAddEntry}>
            <Plus className={ICON_SIZE_SMALL} /> Add {entityNameSingular}
          </Button>
        </div>
      </div>
      <Separator />

      {dataCount === 0 ? (
        renderEmptyState?.() || (
          <DefaultEmptyState
            entityNameSingular={entityNameSingular}
            onAddEntry={onAddEntry}
          />
        )
      ) : (
        <>
          {renderStats?.()}
          {renderTable?.()}
        </>
      )}

      {renderQuickActions?.()}
    </main>
  );
};

export default EntityPageWrapper;
