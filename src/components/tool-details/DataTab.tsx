
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tool, ToolRecord, ToolField } from "@/providers/ToolsProvider";
import { Plus, Edit, Trash2, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataTabProps {
  tool: Tool;
  records: ToolRecord[];
  handleCreateRecord: () => Promise<void>;
  handleUpdateRecord: () => Promise<void>;
  handleDeleteRecord: (recordId: string) => Promise<void>;
  startEditingRecord: (record: ToolRecord) => void;
  isCreatingRecord: boolean;
  setIsCreatingRecord: (isCreating: boolean) => void;
  recordFormData: Record<string, any>;
  setRecordFormData: (formData: Record<string, any>) => void;
  editingRecord: ToolRecord | null;
  setEditingRecord: (record: ToolRecord | null) => void;
  isProcessing: boolean;
}

export function DataTab({
  tool,
  records,
  handleCreateRecord,
  handleUpdateRecord,
  handleDeleteRecord,
  startEditingRecord,
  isCreatingRecord,
  setIsCreatingRecord,
  recordFormData,
  setRecordFormData,
  editingRecord,
  setEditingRecord,
  isProcessing
}: DataTabProps) {
  const { toast } = useToast();
  
  const handleFormChange = (field: string, value: any) => {
    setRecordFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const renderFieldInput = (field: ToolField) => {
    const value = recordFormData[field.name] || '';
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <Input
            type={field.type}
            id={field.id}
            value={value}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            value={value}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            rows={3}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            id={field.id}
            value={value}
            onChange={(e) => handleFormChange(field.name, e.target.valueAsNumber || 0)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            id={field.id}
            value={value}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
          />
        );
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(value) => handleFormChange(field.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'boolean':
        return (
          <Select
            value={value?.toString() || ''}
            onValueChange={(value) => handleFormChange(field.name, value === 'true')}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Records</h2>
        
        <Dialog
          open={isCreatingRecord}
          onOpenChange={(open) => {
            setIsCreatingRecord(open);
            if (!open) setRecordFormData({});
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Record</DialogTitle>
              <DialogDescription>
                Enter the details for your new record
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {tool.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={field.id} className="text-sm font-medium block">
                    {field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderFieldInput(field)}
                  {field.description && (
                    <p className="text-xs text-muted-foreground">
                      {field.description}
                    </p>
                  )}
                </div>
              ))}
              
              <Button 
                className="w-full mt-2" 
                onClick={handleCreateRecord}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Record"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog
          open={!!editingRecord}
          onOpenChange={(open) => {
            if (!open) {
              setEditingRecord(null);
              setRecordFormData({});
            }
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Record</DialogTitle>
              <DialogDescription>
                Update the details for this record
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {tool.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={field.id} className="text-sm font-medium block">
                    {field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderFieldInput(field)}
                  {field.description && (
                    <p className="text-xs text-muted-foreground">
                      {field.description}
                    </p>
                  )}
                </div>
              ))}
              
              <Button 
                className="w-full mt-2" 
                onClick={handleUpdateRecord}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Update Record"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {records.length > 0 ? (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {tool.fields.map((field) => (
                  <TableHead key={field.id}>{field.name}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  {tool.fields.map((field) => (
                    <TableCell key={field.id}>
                      {field.type === 'boolean' 
                        ? (record.data[field.name] ? 'Yes' : 'No')
                        : record.data[field.name] || '-'}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => startEditingRecord(record)}
                      disabled={isProcessing}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteRecord(record.id)}
                      disabled={isProcessing}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center bg-muted/30 rounded-lg border border-dashed">
          <h3 className="font-medium mb-2">No records yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first record to get started
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsCreatingRecord(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
      )}
    </>
  );
}
