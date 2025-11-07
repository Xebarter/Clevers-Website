"use client";

import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ApplicationDetailModalProps {
  application: any;
  open: boolean;
  onClose: () => void;
}

export default function ApplicationDetailModal({ 
  application, 
  open, 
  onClose 
}: ApplicationDetailModalProps) {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{application.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{application.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{application.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grade Level</p>
                <p className="font-medium">{application.gradeLevel}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Parent/Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Parent Name</p>
                <p className="font-medium">{application.parentName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Relationship</p>
                <p className="font-medium">{application.relationship}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{application.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{application.email}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Campus Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Campus</p>
                <p className="font-medium">{application.campus}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Boarding</p>
                <p className="font-medium">{application.boarding}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">How did you hear about us?</p>
                <p className="font-medium">{application.howHeard}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <Badge 
                  variant={
                    application.paymentStatus === "completed" ? "default" : 
                    application.paymentStatus === "pending" ? "secondary" : "destructive"
                  }
                >
                  {application.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Application ID</p>
            <p className="font-mono text-sm">{application.applicationId}</p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}