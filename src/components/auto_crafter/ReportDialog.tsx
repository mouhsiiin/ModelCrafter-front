import React, { FormEvent, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface JsonData {
  [key: string]: string | number;
}

const ReportDialog = ({ jsonData }: { jsonData: JsonData[] }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    try {
      // Call the createPDF function
      await createPDF(formData.name, formData.description, jsonData);
      console.log('PDF created successfully');

      // Close the dialog and reset the form
      setOpen(false);
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating PDF:', error);
    }
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createPDF = async (
    title: string,
    description: string,
    jsonData: JsonData[],
  ): Promise<void> => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();

      const { width, height } = page.getSize();
      const fontSize = 20;
      const margin = 50;
      const rowHeight = 20;
      const columnWidth = 100;

      // Draw title
      page.drawText(title, {
        x: margin,
        y: height - margin,
        size: fontSize,
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
        color: rgb(0, 0, 0),
      });

      // Draw description
      page.drawText(description, {
        x: margin,
        y: height - margin - 30,
        size: fontSize - 4,
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
        color: rgb(0, 0, 0),
      });

      // Draw table headers
      const headers = Object.keys(jsonData[0]);
      let y = height - margin - 60; // Starting Y position for the table
      headers.forEach((header, colIndex) => {
        page.drawText(header, {
          x: margin + colIndex * columnWidth,
          y,
          size: fontSize - 4,
          color: rgb(0, 0, 0),
        });
      });

      // Draw table rows
      jsonData.forEach((row, rowIndex) => {
        y -= rowHeight; // Move down for the next row
        headers.forEach((header, colIndex) => {
          page.drawText(String(row[header]), {
            x: margin + colIndex * columnWidth,
            y,
            size: fontSize - 4,
            color: rgb(0, 0, 0),
          });
        });
      });

      // Draw table borders
      const tableWidth = headers.length * columnWidth;
      const tableHeight = (jsonData.length + 1) * rowHeight;
      page.drawRectangle({
        x: margin,
        y: y - rowHeight,
        width: tableWidth,
        height: tableHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      // Save and download the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error in createPDF:', error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2">Create Report</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Report Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter report name"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit">
              <Download className="h-4 w-4 mr-2" />
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;