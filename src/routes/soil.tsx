import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FlaskConical, Droplets, CheckCircle, AlertCircle, Info, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/site/DashboardLayout";
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

export const Route = createFileRoute("/soil")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Soil Health & Nutrient Advisory — AgriSmart" },
      {
        name: "description",
        content:
          "Calculate soil pH, NPK balance, and receive custom organic & fertilizer recommendations.",
      },
      { property: "og:title", content: "Soil Health & Nutrient Advisory — AgriSmart" },
      {
        property: "og:description",
        content: "Calculate soil pH, NPK balance, and fertilizer recommendations.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SoilPage,
});

function SoilPage() {
  const [soilType, setSoilType] = useState("alluvial");
  const [ph, setPh] = useState("6.5");
  const [nitrogen, setNitrogen] = useState("medium");
  const [phosphorus, setPhosphorus] = useState("low");
  const [potassium, setPotassium] = useState("medium");
  const [analyzed, setAnalyzed] = useState(false);

  const numericPh = parseFloat(ph) || 7.0;

  const getPhStatus = () => {
    if (numericPh < 6.0)
      return {
        label: "Acidic Soil",
        color: "text-amber-500",
        advice: "Consider adding agricultural lime or dolomite to raise pH.",
      };
    if (numericPh > 7.5)
      return {
        label: "Alkaline Soil",
        color: "text-blue-500",
        advice: "Apply gypsum or elemental sulfur and organic compost to lower alkalinity.",
      };
    return {
      label: "Optimal pH (Neutral)",
      color: "text-emerald-500",
      advice: "Excellent pH range for maximum nutrient availability.",
    };
  };

  const status = getPhStatus();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Soil Health & Nutrients
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Test your soil parameters and calculate NPK replenishment guidelines for optimal yield.
          </p>
        </div>

        {/* Soil Health Calculator */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 space-y-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" /> Soil Test Parameters
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="soilType">Primary Soil Type</Label>
                <Select value={soilType} onValueChange={setSoilType}>
                  <SelectTrigger id="soilType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alluvial">Alluvial Soil (River Basins)</SelectItem>
                    <SelectItem value="black">Black Clay (Regur / Cotton)</SelectItem>
                    <SelectItem value="red">Red & Yellow Loam</SelectItem>
                    <SelectItem value="laterite">Laterite Soil</SelectItem>
                    <SelectItem value="sandy">Sandy / Coastal Soil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ph">Soil pH Level (4.0 - 9.0)</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  min="4"
                  max="9.5"
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="nitrogen" className="text-xs">
                    Nitrogen (N)
                  </Label>
                  <Select value={nitrogen} onValueChange={setNitrogen}>
                    <SelectTrigger id="nitrogen" className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phosphorus" className="text-xs">
                    Phosphorus (P)
                  </Label>
                  <Select value={phosphorus} onValueChange={setPhosphorus}>
                    <SelectTrigger id="phosphorus" className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="potassium" className="text-xs">
                    Potassium (K)
                  </Label>
                  <Select value={potassium} onValueChange={setPotassium}>
                    <SelectTrigger id="potassium" className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => setAnalyzed(true)} className="w-full gap-2 mt-4">
                <Sparkles className="h-4 w-4" /> Calculate Advisory
              </Button>
            </div>
          </div>

          {/* Analysis & Recommendations */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" /> Soil Health Summary
              </h2>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl bg-muted/60 p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">pH Status:</span>
                    <span className={`font-bold ${status.color}`}>
                      {status.label} ({numericPh})
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{status.advice}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Nutrient Recommendations</h3>
                  <ul className="text-xs space-y-2 text-muted-foreground">
                    {nitrogen === "low" && (
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          <strong>Nitrogen deficient:</strong> Apply well-rotted farmyard manure
                          (FYM), vermicompost, or split doses of Urea / Neem-coated urea.
                        </span>
                      </li>
                    )}
                    {phosphorus === "low" && (
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          <strong>Phosphorus deficient:</strong> Incorporate Single Super Phosphate
                          (SSP) or DAP at root zone depth during field preparation.
                        </span>
                      </li>
                    )}
                    {potassium === "low" && (
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          <strong>Potassium deficient:</strong> Apply Muriate of Potash (MOP) to
                          improve plant disease resistance and grain filling.
                        </span>
                      </li>
                    )}
                    {nitrogen !== "low" && phosphorus !== "low" && potassium !== "low" && (
                      <li className="flex items-start gap-2 text-emerald-600">
                        <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>
                          Soil nutrient profile is balanced. Maintain organic carbon with crop
                          residue incorporation and cover cropping.
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground flex items-center gap-2.5">
              <Info className="h-4 w-4 text-primary shrink-0" />
              <span>
                For precise soil testing, submit a composite soil sample to your nearest Krishi
                Vigyan Kendra (KVK).
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
