import { getUserTransaction } from '@/app/actions/transactions';
import { TransactionForm } from '@/components/forms/transaction';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Scroller } from '@/components/ui/scroller';

const TRANSACTION_EDIT_PAGE = async ({
  params,
}: {
  params: Promise<{
    transactionId: string;
  }>;
}) => {
  const transactionId = (await params).transactionId;
  const { transaction } = await getUserTransaction(transactionId);
  return (
    <Dialog open>
      <DialogContent className="max-w-2xl [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
        </DialogHeader>
        <Scroller className="max-h-[80vh] pr-3">
          <TransactionForm data={{ ...transaction }} />
        </Scroller>
      </DialogContent>
    </Dialog>
  );
};

export default TRANSACTION_EDIT_PAGE;
