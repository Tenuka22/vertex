'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DatePicker({
  value,
  id,
  onValueChange,
}: {
  id?: string;
  value: Date;
  onValueChange: (v: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          data-empty={!value}
          variant="outline"
        >
          <CalendarIcon />
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          id={id}
          mode="single"
          onSelect={onValueChange}
          required
          selected={value}
        />
      </PopoverContent>
    </Popover>
  );
}
