import { toast } from "@/hooks/use-toast";

export const adminToast = {
  success(title: string, description?: string) {
    toast({ title, description });
  },
  error(title: string, description?: string) {
    toast({ title, description, variant: "destructive" });
  },
};
