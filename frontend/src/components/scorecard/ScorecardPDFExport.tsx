"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ScorecardPDFExportProps {
  targetElementId: string;
  reportId: string;
}

export function ScorecardPDFExport({
  targetElementId,
  reportId,
}: ScorecardPDFExportProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      const element = document.getElementById(targetElementId);
      if (!element) {
        throw new Error("Scorecard element not found in DOM");
      }

      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`JomirDalal_Scorecard_${reportId}.pdf`);

      toast({
        title: "পিডিএফ রিপোর্ট প্রস্তুত!",
        description: `স্কোরকার্ড সফলভাবে ডাউনলোড হয়েছে: JomirDalal_Scorecard_${reportId}.pdf`,
        variant: "green",
      });
    } catch (err) {
      console.error("PDF generation error, opening browser print:", err);
      window.print();
      toast({
        title: "প্রিন্ট উইন্ডো খোলা হয়েছে",
        description: "আপনি প্রিন্ট অথবা Save as PDF নির্বাচন করতে পারেন।",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExportPDF}
      disabled={isExporting}
      size="sm"
      className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm h-9 px-4 rounded-lg transition-colors"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          পিডিএফ তৈরি হচ্ছে...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          পিডিএফ ডাউনলোড
        </>
      )}
    </Button>
  );
}
