import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FileText, Search, Check, X, Edit2 } from 'lucide-react';
import { Transaction } from '@/types/group';
import { toast } from '@/hooks/use-toast';

interface GroupLedgerProps {
  transactions: Transaction[];
  canEdit: boolean;
  canApprove: boolean;
}

const GroupLedger: React.FC<GroupLedgerProps> = ({ transactions, canEdit, canApprove }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState('');

  const filteredTransactions = transactions.filter(t =>
    t.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (transaction: Transaction) => {
    toast({
      title: "Transaction Approved",
      description: `Approved ${transaction.memberName}'s contribution of KES ${transaction.amount.toLocaleString()}`,
    });
  };

  const handleReject = (transaction: Transaction) => {
    toast({
      title: "Transaction Rejected",
      description: `Rejected ${transaction.memberName}'s contribution`,
      variant: "destructive",
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditAmount(transaction.amount.toString());
  };

  const handleSaveEdit = () => {
    if (editingTransaction && editAmount) {
      toast({
        title: "Transaction Updated",
        description: `Updated amount to KES ${parseFloat(editAmount).toLocaleString()}`,
      });
      setEditingTransaction(null);
      setEditAmount('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Group Transaction Ledger
          </CardTitle>
          <CardDescription>
            All member transactions and contributions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by member name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>Member</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  {(canEdit || canApprove) && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.memberName}</TableCell>
                      <TableCell className="text-muted-foreground">{transaction.description}</TableCell>
                      <TableCell className={`text-right font-bold ${
                        transaction.type === 'contribution' ? 'text-success' : 'text-destructive'
                      }`}>
                        {transaction.type === 'contribution' ? '+' : '-'}
                        KES {transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'approved'
                            ? 'bg-success/20 text-success'
                            : transaction.status === 'pending'
                            ? 'bg-accent/20 text-accent'
                            : 'bg-destructive/20 text-destructive'
                        }`}>
                          {transaction.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(transaction.createdAt)}
                      </TableCell>
                      {(canEdit || canApprove) && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {canApprove && transaction.status === 'pending' && (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-success hover:text-success hover:bg-success/20"
                                  onClick={() => handleApprove(transaction)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/20"
                                  onClick={() => handleReject(transaction)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {canEdit && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/20"
                                onClick={() => handleEdit(transaction)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Edit Transaction Amount</DialogTitle>
            <DialogDescription>
              Modify the transaction amount for {editingTransaction?.memberName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Amount</Label>
              <p className="text-lg font-bold text-foreground">
                KES {editingTransaction?.amount.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newAmount">New Amount (KES)</Label>
              <Input
                id="newAmount"
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                placeholder="Enter new amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingTransaction(null)}>
              Cancel
            </Button>
            <Button variant="finance" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupLedger;
