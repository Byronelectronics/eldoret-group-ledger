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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Users, Search, MoreVertical, Key, Trash2, UserCog } from 'lucide-react';
import { Member, ROLE_LABELS, UserRole } from '@/types/group';
import { toast } from '@/hooks/use-toast';

// Mock members data
const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    memberId: 'admin001',
    name: 'System Administrator',
    idNumber: '00000000',
    phoneNumber: '0700000000',
    pin: '1234',
    role: 'overall_admin',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '2',
    memberId: 'chair001',
    name: 'John Kiprop',
    idNumber: '12345678',
    phoneNumber: '0712345678',
    pin: '5678',
    role: 'chairman',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '3',
    memberId: 'treas001',
    name: 'Mary Chebet',
    idNumber: '23456789',
    phoneNumber: '0723456789',
    pin: '9012',
    role: 'treasurer',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '4',
    memberId: 'sec001',
    name: 'Peter Kiptoo',
    idNumber: '34567890',
    phoneNumber: '0734567890',
    pin: '3456',
    role: 'secretary',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '5',
    memberId: 'mem001',
    name: 'Grace Jepkosgei',
    idNumber: '45678901',
    phoneNumber: '0745678901',
    pin: '7890',
    role: 'member',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
];

const MemberManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members] = useState<Member[]>(MOCK_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newPin, setNewPin] = useState('');

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResetPin = () => {
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    setNewPin(generatedPin);
    toast({
      title: "PIN Reset",
      description: `New temporary PIN for ${selectedMember?.name}: ${generatedPin}`,
    });
    setShowResetDialog(false);
    setSelectedMember(null);
  };

  const handleDeleteMember = () => {
    toast({
      title: "Member Removed",
      description: `${selectedMember?.name} has been removed from the group`,
      variant: "destructive",
    });
    setShowDeleteDialog(false);
    setSelectedMember(null);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'chairman':
        return 'bg-admin-gold/20 text-admin-gold';
      case 'overall_admin':
        return 'bg-primary/20 text-primary';
      case 'treasurer':
        return 'bg-treasurer-amber/20 text-treasurer-amber';
      case 'secretary':
        return 'bg-secretary-cyan/20 text-secretary-cyan';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Member Management
          </CardTitle>
          <CardDescription>
            View and manage group members
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or member ID..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No members found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell className="text-muted-foreground">{member.memberId}</TableCell>
                      <TableCell className="text-muted-foreground">{member.phoneNumber}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                          {ROLE_LABELS[member.role]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.isActive 
                            ? 'bg-success/20 text-success' 
                            : 'bg-destructive/20 text-destructive'
                        }`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-card">
                            <DropdownMenuItem onClick={() => {
                              setSelectedMember(member);
                              setShowResetDialog(true);
                            }}>
                              <Key className="w-4 h-4 mr-2" />
                              Reset PIN
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCog className="w-4 h-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setSelectedMember(member);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Reset PIN Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Reset Member PIN</DialogTitle>
            <DialogDescription>
              Generate a new temporary PIN for {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              This will generate a new 4-digit PIN. The member will need to change it on their next login.
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPin}>
              Generate New PIN
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedMember?.name} from the group?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-destructive text-sm">
              This action cannot be undone. All member data will be permanently deleted.
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember}>
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemberManagement;
