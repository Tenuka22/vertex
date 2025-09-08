'use client';
import { useRouter } from 'next/navigation';
import { TransactionForm } from '@/components/forms/transaction';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Scroller } from '@/components/ui/scroller';

const TransactionCreate = () => {
  const router = useRouter();
  return (
    <Dialog onOpenChange={() => router.back()} open>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
        </DialogHeader>
        <Scroller className="max-h-[80vh] pr-3">
          <TransactionForm />
        </Scroller>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionCreate;
