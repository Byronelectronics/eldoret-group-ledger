import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, Upload, Image, FileText, AlertCircle } from 'lucide-react';
import { UserRole, ROLE_LABELS } from '@/types/group';
import { toast } from '@/hooks/use-toast';

const MemberRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    phoneNumber: '',
    role: 'member' as UserRole,
  });
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [documentPhoto, setDocumentPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPin, setGeneratedPin] = useState<string | null>(null);
  const [generatedMemberId, setGeneratedMemberId] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (type: 'passport' | 'document', file: File | null) => {
    if (type === 'passport') {
      setPassportPhoto(file);
    } else {
      setDocumentPhoto(file);
    }
  };

  const generateMemberId = (name: string) => {
    const prefix = name.substring(0, 3).toLowerCase();
    const random = Math.floor(100 + Math.random() * 900);
    return `${prefix}${random}`;
  };

  const generatePin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.idNumber || !formData.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const memberId = generateMemberId(formData.name);
    const pin = generatePin();

    setGeneratedMemberId(memberId);
    setGeneratedPin(pin);

    toast({
      title: "Member Registered",
      description: `${formData.name} has been successfully registered`,
    });

    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      idNumber: '',
      phoneNumber: '',
      role: 'member',
    });
    setPassportPhoto(null);
    setDocumentPhoto(null);
    setGeneratedPin(null);
    setGeneratedMemberId(null);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          Register New Member
        </CardTitle>
        <CardDescription>
          Add a new member to the group
        </CardDescription>
      </CardHeader>
      <CardContent>
        {generatedPin && generatedMemberId ? (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 bg-success/10 border border-success/30 rounded-lg text-center space-y-4">
              <h3 className="text-lg font-bold text-success">Registration Successful!</h3>
              <div className="space-y-2">
                <p className="text-muted-foreground">Member credentials:</p>
                <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member ID:</span>
                    <span className="font-bold text-foreground">{generatedMemberId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temporary PIN:</span>
                    <span className="font-bold text-foreground">{generatedPin}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Please share these credentials securely with the new member.
                </p>
              </div>
            </div>
            <Button onClick={handleReset} className="w-full">
              Register Another Member
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="h-12"
              />
            </div>

            {/* ID Number */}
            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number *</Label>
              <Input
                id="idNumber"
                type="text"
                placeholder="Enter national ID number"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                className="h-12"
                inputMode="numeric"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="e.g., 0712345678"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="h-12"
                inputMode="tel"
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Position in Group</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleInputChange('role', value)}
              >
                <SelectTrigger id="role" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Photo Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Passport Photo */}
              <div className="space-y-2">
                <Label>Passport Photo</Label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('passport', e.target.files?.[0] || null)}
                    className="hidden"
                    id="passport-upload"
                  />
                  <label
                    htmlFor="passport-upload"
                    className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                  >
                    {passportPhoto ? (
                      <div className="text-center">
                        <Image className="w-8 h-8 mx-auto text-success mb-2" />
                        <span className="text-sm text-muted-foreground truncate max-w-[120px] block">
                          {passportPhoto.name}
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Upload Photo</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Document Photo */}
              <div className="space-y-2">
                <Label>ID Document Photo</Label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('document', e.target.files?.[0] || null)}
                    className="hidden"
                    id="document-upload"
                  />
                  <label
                    htmlFor="document-upload"
                    className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                  >
                    {documentPhoto ? (
                      <div className="text-center">
                        <FileText className="w-8 h-8 mx-auto text-success mb-2" />
                        <span className="text-sm text-muted-foreground truncate max-w-[120px] block">
                          {documentPhoto.name}
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Upload Document</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-2 p-3 bg-primary/10 border border-primary/30 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground">
                A unique Member ID and temporary PIN will be generated automatically. 
                Share these credentials securely with the new member.
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="xl" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register Member'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberRegistration;
