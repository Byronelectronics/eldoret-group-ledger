import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Clock, TrendingUp, FileText } from 'lucide-react';
import { Transaction } from '@/types/group';

// Mock transactions for demo
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    memberId: 'mem001',
    memberName: 'Grace Jepkosgei',
    amount: 5000,
    type: 'contribution',
    description: 'Monthly contribution - January',
    status: 'approved',
    createdAt: '2024-01-15T10:30:00Z',
    approvedBy: 'Mary Chebet',
    approvedAt: '2024-01-15T11:00:00Z',
  },
  {
    id: '2',
    memberId: 'mem001',
    memberName: 'Grace Jepkosgei',
    amount: 5000,
    type: 'contribution',
    description: 'Monthly contribution - February',
    status: 'approved',
    createdAt: '2024-02-15T09:00:00Z',
    approvedBy: 'Mary Chebet',
    approvedAt: '2024-02-15T09:30:00Z',
  },
  {
    id: '3',
    memberId: 'mem001',
    memberName: 'Grace Jepkosgei',
    amount: 5000,
    type: 'contribution',
    description: 'Monthly contribution - March',
    status: 'pending',
    createdAt: '2024-03-15T14:00:00Z',
  },
];

const MemberDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Filter transactions for current member
  const memberTransactions = MOCK_TRANSACTIONS.filter(
    t => t.memberId === currentUser?.memberId
  );
  
  const approvedTransactions = memberTransactions.filter(t => t.status === 'approved');
  const pendingTransactions = memberTransactions.filter(t => t.status === 'pending');
  
  const totalBalance = approvedTransactions.reduce((sum, t) => 
    t.type === 'contribution' ? sum + t.amount : sum - t.amount, 0
  );
  
  const lastTransaction = approvedTransactions[approvedTransactions.length - 1];
  const lastPostedDate = lastTransaction 
    ? new Date(lastTransaction.approvedAt || lastTransaction.createdAt).toLocaleDateString('en-KE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'No transactions yet';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground">
          Welcome, {currentUser?.name.split(' ')[0]}!
        </h2>
        <p className="text-muted-foreground">
          Member ID: {currentUser?.memberId}
        </p>
      </div>

      {/* Balance Card - Green themed */}
      <Card className="bg-success/20 border-success/30 glow-success">
        <CardHeader className="pb-2">
          <CardDescription className="text-success-foreground/70 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Your Balance
          </CardDescription>
          <CardTitle className="text-4xl font-bold text-success">
            KES {totalBalance.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-success-foreground/70">
            <Clock className="w-4 h-4" />
            <span>Last posted: {lastPostedDate}</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Contributions</p>
                <p className="text-xl font-bold text-foreground">{approvedTransactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-foreground">{pendingTransactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Ledger */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            My Transaction History
          </CardTitle>
          <CardDescription>
            Your personal contribution ledger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {memberTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No transactions yet
              </p>
            ) : (
              memberTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString('en-KE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'contribution' 
                        ? 'text-success' 
                        : 'text-destructive'
                    }`}>
                      {transaction.type === 'contribution' ? '+' : '-'}
                      KES {transaction.amount.toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      transaction.status === 'approved'
                        ? 'bg-success/20 text-success'
                        : transaction.status === 'pending'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-destructive/20 text-destructive'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDashboard;
