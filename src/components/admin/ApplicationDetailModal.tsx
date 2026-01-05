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
                <p className="font-medium">{application.student_name || application.studentName || application.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{application.date_of_birth || application.dateOfBirth || application.date_of_birth || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{application.gender || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grade Level</p>
                <p className="font-medium">{application.grade_level || application.gradeLevel || application.grade_level || "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Parent/Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Parent Name</p>
                <p className="font-medium">{application.parent_name || application.parentName || application.parent_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Relationship</p>
                <p className="font-medium">{application.relationship || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{application.phone || application.parent_phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{application.email || application.parent_email || "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Campus Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Campus</p>
                <p className="font-medium">{application.campus || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Boarding</p>
                <p className="font-medium">{application.boarding || "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <Badge 
                  variant={
                    application.payment_status === "COMPLETED" || application.payment_status === "PAID" ? "default" : 
                    application.payment_status === "PENDING" ? "secondary" : 
                    application.payment_status === "FAILED" || application.payment_status === "CANCELLED" ? "destructive" :
                    "default"
                  }
                >
                  {application.payment_status || "PENDING"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="font-medium">{application.payment_amount ? `UGX ${application.payment_amount}` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Date</p>
                <p className="font-medium">{application.payment_date ? new Date(application.payment_date).toLocaleString() : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmation Code</p>
                <p className="font-mono text-xs break-all">{application.payment_confirmation_code || "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">How did you hear about us?</p>
                <p className="font-medium">{application.how_heard || application.howHeard || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Application Status</p>
                <Badge 
                  variant={
                    application.application_status === "ACCEPTED" ? "default" : 
                    application.application_status === "SUBMITTED" || application.application_status === "PENDING" ? "secondary" : 
                    application.application_status === "REJECTED" ? "destructive" :
                    "default"
                  }
                >
                  {application.application_status || "SUBMITTED"}
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Application ID</p>
            <p className="font-mono text-sm">{application.id || "N/A"}</p>
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