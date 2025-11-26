import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, Plus, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock members for selection
const MOCK_MEMBERS = [
  { id: 'mem001', name: 'Grace Jepkosgei' },
  { id: 'chair001', name: 'John Kiprop' },
  { id: 'treas001', name: 'Mary Chebet' },
  { id: 'sec001', name: 'Peter Kiptoo' },
];

const FinanceEntry: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState('contribution');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember || !amount || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const memberName = MOCK_MEMBERS.find(m => m.id === selectedMember)?.name;
    
    toast({
      title: "Transaction Recorded",
      description: `${transactionType === 'contribution' ? 'Contribution' : 'Withdrawal'} of KES ${parseFloat(amount).toLocaleString()} for ${memberName} has been recorded`,
    });

    // Reset form
    setSelectedMember('');
    setAmount('');
    setDescription('');
    setTransactionType('contribution');
    setIsSubmitting(false);
  };

  return (
    <Card className="glass-card border-accent/30">
      <CardHeader className="bg-accent/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-accent">
          <DollarSign className="w-5 h-5" />
          Finance Entry
        </CardTitle>
        <CardDescription>
          Record member contributions and financial transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Member Selection */}
          <div className="space-y-2">
            <Label htmlFor="member">Select Member</Label>
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger id="member" className="h-12">
                <SelectValue placeholder="Choose a member" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_MEMBERS.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {member.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Type */}
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={transactionType === 'contribution' ? 'success' : 'secondary'}
                className="h-12"
                onClick={() => setTransactionType('contribution')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Contribution
              </Button>
              <Button
                type="button"
                variant={transactionType === 'withdrawal' ? 'destructive' : 'secondary'}
                className="h-12"
                onClick={() => setTransactionType('withdrawal')}
              >
                Withdrawal
              </Button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (KES)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                KES
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 pl-14 text-lg font-bold"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., Monthly contribution - March 2024"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="finance" 
            size="xl" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Recording...' : 'Record Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FinanceEntry;
