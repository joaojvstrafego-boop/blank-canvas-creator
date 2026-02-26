import { useState, useRef } from "react";
import { Plus, Trash2, Download, FileText, Save, Check } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BudgetItem {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
}

interface CompanyProfile {
  companyName: string;
  phone: string;
  address: string;
  currency: string;
}

const CURRENCIES = [
  { code: "MXN", symbol: "$", label: "🇲🇽 Peso Mexicano (MXN)" },
  { code: "BRL", symbol: "R$", label: "🇧🇷 Real Brasileiro (BRL)" },
  { code: "ARS", symbol: "$", label: "🇦🇷 Peso Argentino (ARS)" },
  { code: "COP", symbol: "$", label: "🇨🇴 Peso Colombiano (COP)" },
  { code: "CLP", symbol: "$", label: "🇨🇱 Peso Chileno (CLP)" },
  { code: "PEN", symbol: "S/", label: "🇵🇪 Sol Peruano (PEN)" },
  { code: "UYU", symbol: "$", label: "🇺🇾 Peso Uruguayo (UYU)" },
  { code: "BOB", symbol: "Bs", label: "🇧🇴 Boliviano (BOB)" },
  { code: "PYG", symbol: "₲", label: "🇵🇾 Guaraní (PYG)" },
  { code: "GTQ", symbol: "Q", label: "🇬🇹 Quetzal (GTQ)" },
  { code: "HNL", symbol: "L", label: "🇭🇳 Lempira (HNL)" },
  { code: "NIO", symbol: "C$", label: "🇳🇮 Córdoba (NIO)" },
  { code: "CRC", symbol: "₡", label: "🇨🇷 Colón (CRC)" },
  { code: "PAB", symbol: "B/.", label: "🇵🇦 Balboa (PAB)" },
  { code: "DOP", symbol: "RD$", label: "🇩🇴 Peso Dominicano (DOP)" },
  { code: "VES", symbol: "Bs.S", label: "🇻🇪 Bolívar (VES)" },
  { code: "USD", symbol: "$", label: "🇺🇸 Dólar (USD)" },
  { code: "EUR", symbol: "€", label: "🇪🇺 Euro (EUR)" },
];

const STORAGE_KEY = "budget-company-profile";

const loadProfile = (): CompanyProfile => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { companyName: "", phone: "", address: "", currency: "MXN" };
};

const generateId = () => Math.random().toString(36).slice(2, 9);

const emptyItem = (): BudgetItem => ({
  id: generateId(),
  product: "",
  quantity: 1,
  unitPrice: 0,
});

const BudgetGenerator = () => {
  const [profile, setProfile] = useState<CompanyProfile>(loadProfile);
  const [saved, setSaved] = useState(false);
  const [clientName, setClientName] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<BudgetItem[]>([emptyItem()]);

  const updateProfile = (field: keyof CompanyProfile, value: string) => {
    setProfile((p) => ({ ...p, [field]: value }));
    setSaved(false);
  };

  const saveProfile = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: string | number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  const curr = CURRENCIES.find((c) => c.code === profile.currency) || CURRENCIES[0];

  const formatCurrency = (v: number) =>
    `${curr.symbol} ${v.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const generatePdf = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pw = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentW = pw - margin * 2;
    let y = 20;

    // Header background
    doc.setFillColor(26, 26, 46);
    doc.rect(0, 0, pw, 28, "F");

    // Accent line
    doc.setFillColor(233, 69, 96);
    doc.rect(0, 28, pw, 1.5, "F");

    // Logo popcorn bucket
    doc.setFillColor(233, 69, 96);
    doc.triangle(15, 7, 27, 7, 26, 22, "F");
    doc.triangle(15, 7, 16, 22, 26, 22, "F");
    doc.setFillColor(245, 197, 24);
    [
      [18, 6], [24, 6], [21, 4.5], [16.5, 8], [25.5, 8],
    ].forEach(([cx, cy]) => {
      doc.circle(cx, cy, 2, "F");
    });

    // Company name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(profile.companyName || "Mi Negocio de Palomitas", 32, 13);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    doc.text("PRESUPUESTO", 32, 19);

    // Date + currency
    const today = new Date().toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.setFontSize(8);
    doc.text(today, pw - margin, 13, { align: "right" });
    doc.text(`Moneda: ${profile.currency}`, pw - margin, 19, { align: "right" });

    y = 36;

    // Company info under header
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    if (profile.phone) {
      doc.text(`Tel: ${profile.phone}`, margin, y);
      y += 5;
    }
    if (profile.address) {
      doc.text(`Dir: ${profile.address}`, margin, y);
      y += 5;
    }

    y += 4;

    // Client
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("CLIENTE:", margin, y);
    doc.setTextColor(26, 26, 46);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(clientName || "—", margin + 22, y);
    doc.setFont("helvetica", "normal");
    y += 10;

    // Table header
    const colX = { product: margin, qty: margin + contentW * 0.55, unit: margin + contentW * 0.7, total: pw - margin };
    doc.setFillColor(240, 240, 245);
    doc.rect(margin - 2, y - 4, contentW + 4, 8, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 26, 46);
    doc.text("PRODUCTO", colX.product, y);
    doc.text("CANT.", colX.qty, y);
    doc.text("P. UNIT.", colX.unit, y);
    doc.text("TOTAL", colX.total, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 8;

    // Table rows
    doc.setFontSize(9);
    items.forEach((item, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin - 2, y - 4, contentW + 4, 7, "F");
      }
      doc.setTextColor(51, 51, 51);
      doc.text(item.product || "—", colX.product, y);
      doc.text(String(item.quantity), colX.qty, y);
      doc.text(formatCurrency(item.unitPrice), colX.unit, y);
      doc.text(formatCurrency(item.quantity * item.unitPrice), colX.total, y, { align: "right" });
      y += 7;

      // Page break check
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // Divider
    y += 3;
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, pw - margin, y);
    y += 8;

    // Total
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 26, 46);
    doc.text(`TOTAL: ${formatCurrency(subtotal)}`, pw - margin, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 12;

    // Notes
    if (notes) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      doc.text("OBSERVACIONES:", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(68, 68, 68);
      doc.setFontSize(8);
      const splitNotes = doc.splitTextToSize(notes, contentW);
      doc.text(splitNotes, margin, y);
      y += splitNotes.length * 4 + 5;
    }

    // Footer
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFillColor(26, 26, 46);
    doc.rect(0, pageH - 12, pw, 12, "F");
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `${profile.companyName || "Mi Negocio de Palomitas"} • Presupuesto generado automáticamente`,
      pw / 2,
      pageH - 5,
      { align: "center" }
    );

    // Save as PDF (compatible with all devices including mobile)
    const fileName = `Presupuesto_${(clientName || "cliente").replace(/\s+/g, "_")}.pdf`;
    try {
      const pdfBlob = doc.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      // Fallback: if download attribute not supported, open in new tab
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (e) {
      // Ultimate fallback: open PDF in new window
      const pdfDataUri = doc.output("datauristring");
      window.open(pdfDataUri, "_blank");
    }
  };

  const isValid = items.some((i) => i.product.trim() && i.unitPrice > 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Company profile (saved) */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl tracking-wider text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Datos de tu Empresa
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={saveProfile}
            className="gap-1.5"
          >
            {saved ? <Check className="w-4 h-4 text-green-500" /> : <Save className="w-4 h-4" />}
            {saved ? "¡Guardado!" : "Guardar"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground -mt-3">
          Estos datos se guardan en tu dispositivo para que no tengas que llenarlos cada vez.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="company">Nombre de tu empresa / marca</Label>
            <Input
              id="company"
              placeholder="Ej: Palomitas Deliciosas"
              value={profile.companyName}
              onChange={(e) => updateProfile("companyName", e.target.value.slice(0, 60))}
              maxLength={60}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Tu teléfono</Label>
            <Input
              id="phone"
              placeholder="Ej: +52 55 1234 5678"
              value={profile.phone}
              onChange={(e) => updateProfile("phone", e.target.value.slice(0, 30))}
              maxLength={30}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Dirección (opcional)</Label>
            <Input
              id="address"
              placeholder="Ej: Calle Principal 123, Ciudad"
              value={profile.address}
              onChange={(e) => updateProfile("address", e.target.value.slice(0, 100))}
              maxLength={100}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Moneda</Label>
            <Select value={profile.currency} onValueChange={(v) => updateProfile("currency", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Client + budget */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h3 className="font-display text-xl tracking-wider text-foreground">
          Datos del Cliente
        </h3>
        <div className="space-y-1.5 max-w-sm">
          <Label htmlFor="client">Nombre del cliente</Label>
          <Input
            id="client"
            placeholder="Ej: María López"
            value={clientName}
            onChange={(e) => setClientName(e.target.value.slice(0, 60))}
            maxLength={60}
          />
        </div>
      </div>

      {/* Items */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-display text-xl tracking-wider text-foreground">
          Productos
        </h3>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_80px_100px_40px] sm:grid-cols-[1fr_100px_120px_40px] gap-2 items-end"
            >
              <div className="space-y-1">
                {idx === 0 && <Label className="text-xs text-muted-foreground">Producto</Label>}
                <Input
                  placeholder="Ej: Palomitas de Nutella"
                  value={item.product}
                  onChange={(e) => updateItem(item.id, "product", e.target.value.slice(0, 80))}
                  maxLength={80}
                />
              </div>
              <div className="space-y-1">
                {idx === 0 && <Label className="text-xs text-muted-foreground">Cant.</Label>}
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.id, "quantity", Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
              </div>
              <div className="space-y-1">
                {idx === 0 && <Label className="text-xs text-muted-foreground">Precio ({curr.symbol})</Label>}
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  placeholder="0.00"
                  value={item.unitPrice || ""}
                  onChange={(e) =>
                    updateItem(item.id, "unitPrice", Math.max(0, parseFloat(e.target.value) || 0))
                  }
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 1}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={addItem} className="gap-1.5">
          <Plus className="w-4 h-4" /> Agregar producto
        </Button>

        <div className="flex justify-end pt-2 border-t border-border">
          <span className="font-display text-lg tracking-wider text-foreground">
            Total: {formatCurrency(subtotal)}
          </span>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-3">
        <Label htmlFor="notes">Observaciones (opcional)</Label>
        <textarea
          id="notes"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-y"
          placeholder="Ej: Entrega el sábado 15 de marzo. Incluye empaques individuales."
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 500))}
          maxLength={500}
        />
      </div>

      <Button
        onClick={generatePdf}
        disabled={!isValid}
        className="w-full gap-2 h-12 text-base"
      >
        <Download className="w-5 h-5" />
        Generar y Descargar Presupuesto
      </Button>

      
    </div>
  );
};

export default BudgetGenerator;
