import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface CreateClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: any) => Promise<void>;
}

export function CreateClientModal({ open, onOpenChange, onCreate }: CreateClientModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      industry: '',
      client_type: 'Corporation',
      health_status: 'green'
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await onCreate(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create client', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Client Name</Label>
            <Input 
              id="name" 
              placeholder="Acme Corp" 
              {...register('name', { required: 'Name is required' })} 
            />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input 
              id="industry" 
              placeholder="Technology, Energy, etc." 
              {...register('industry')} 
            />
          </div>

          {/* Note: Select component in Shadcn often needs Controller with react-hook-form, 
              but for simplicity/speed with raw HTML select or non-controlled might be easier 
              if I don't want to import Controller. 
              However, let's use standard HTML select for reliability if Shadcn Select is complex to wire without Controller.
              Actually, let's use the provided Select component if possible, but simplest is native select for avoiding issues.
              I will use native select styled with standard classes or just Input for now to be safe.
              Let's use native select for reliability.
          */}
          <div className="space-y-2">
            <Label htmlFor="client_type">Client Type</Label>
            <select 
              id="client_type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('client_type')}
            >
              <option value="Corporation">Corporation</option>
              <option value="Association">Association</option>
              <option value="Coalition">Coalition</option>
              <option value="Non-Profit">Non-Profit</option>
              <option value="Government">Government</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="health_status">Initial Health Status</Label>
            <select
              id="health_status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('health_status')}
            >
              <option value="green">Healthy</option>
              <option value="yellow">At Risk</option>
              <option value="red">Critical</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
