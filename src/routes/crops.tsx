import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sprout, Calendar, Droplets, SunMedium, ShieldAlert, Plus, Check } from "lucide-react";
import { DashboardLayout } from "@/components/site/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { db, collection, addDoc, onSnapshot, serverTimestamp } from "@/lib/firebase";

export const Route = createFileRoute("/crops")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Crop Advisory — AgriSmart" },
      {
        name: "description",
        content: "Explore seasonal crop guidance, optimal planting calendars, and pest advisories.",
      },
      { property: "og:title", content: "Crop Advisory — AgriSmart" },
      {
        property: "og:description",
        content: "Explore seasonal crop guidance, optimal planting calendars, and pest advisories.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CropsPage,
});

const POPULAR_CROPS = [
  {
    name: "Wheat (Rabi)",
    season: "Winter (Oct - Apr)",
    soilType: "Loamy / Clay Loam",
    waterReq: "450 - 650 mm",
    duration: "110 - 140 days",
    yieldPotential: "45 - 55 Q/ha",
    keyTips: "Apply first irrigation at CRI stage (21 days after sowing). Monitor for yellow rust.",
  },
  {
    name: "Rice / Paddy (Kharif)",
    season: "Monsoon (Jun - Nov)",
    soilType: "Clay / Silty Clay",
    waterReq: "1100 - 1500 mm",
    duration: "120 - 150 days",
    yieldPotential: "50 - 65 Q/ha",
    keyTips:
      "Maintain 2-5cm standing water during tillering. Watch for blast disease during humidity spikes.",
  },
  {
    name: "Cotton (Kharif)",
    season: "Summer/Monsoon (May - Dec)",
    soilType: "Deep Black Soils",
    waterReq: "700 - 1000 mm",
    duration: "150 - 180 days",
    yieldPotential: "20 - 30 Q/ha",
    keyTips:
      "Space properly to prevent boll rot. Install pheromone traps for pink bollworm monitoring.",
  },
  {
    name: "Tomato (Year-round)",
    season: "All seasons",
    soilType: "Well-drained Sandy Loam",
    waterReq: "600 - 800 mm",
    duration: "90 - 120 days",
    yieldPotential: "350 - 500 Q/ha",
    keyTips:
      "Stake plants for better aeration. Avoid overhead watering to prevent early blight and bacterial wilt.",
  },
  {
    name: "Mustard / Rapeseed",
    season: "Rabi (Oct - Mar)",
    soilType: "Light to Heavy Loam",
    waterReq: "250 - 400 mm",
    duration: "105 - 130 days",
    yieldPotential: "15 - 22 Q/ha",
    keyTips:
      "Crucial irrigation at flowering and pod formation stages. Watch for aphids in cloudy weather.",
  },
  {
    name: "Chilli / Red Pepper",
    season: "Kharif & Rabi",
    soilType: "Well-drained Loamy Soil",
    waterReq: "500 - 700 mm",
    duration: "140 - 180 days",
    yieldPotential: "25 - 40 Q/ha",
    keyTips: "Provide raised beds to avoid damping off. Treat seeds before nursery sowing.",
  },
];

type SavedCrop = {
  id: string;
  userId: string;
  cropName: string;
  acres: string;
  plantedDate: string;
  status: string;
  createdAt?: unknown;
};

function CropsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("");
  const [savedCrops, setSavedCrops] = useState<SavedCrop[]>([]);
  const [newCropName, setNewCropName] = useState("");
  const [newCropAcres, setNewCropAcres] = useState("");
  const [addingCrop, setAddingCrop] = useState(false);

  // Subscribe to user's saved crops in Firestore
  useEffect(() => {
    if (!user) return;
    const cropsCol = collection(db, "crops");
    const unsub = onSnapshot(cropsCol, (snap) => {
      const list: SavedCrop[] = [];
      snap.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid) {
          list.push({
            id: doc.id,
            userId: data.userId,
            cropName: data.cropName,
            acres: data.acres,
            plantedDate: data.plantedDate,
            status: data.status,
            createdAt: data.createdAt,
          });
        }
      });
      setSavedCrops(list);
    });

    return () => unsub();
  }, [user]);

  const handleAddMyCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName.trim() || !user) return;
    setAddingCrop(true);

    try {
      await addDoc(collection(db, "crops"), {
        userId: user.uid,
        cropName: newCropName.trim(),
        acres: newCropAcres.trim() || "1",
        plantedDate: new Date().toISOString().split("T")[0],
        status: "Growing",
        createdAt: serverTimestamp(),
      });
      setNewCropName("");
      setNewCropAcres("");
    } catch (err) {
      console.error("Failed to add crop to Firestore:", err);
    } finally {
      setAddingCrop(false);
    }
  };

  const filteredCrops = POPULAR_CROPS.filter(
    (c) =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      c.season.toLowerCase().includes(filter.toLowerCase()) ||
      c.soilType.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Crop Management & Advisory
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore recommended planting schedules, soil suitability, and track your active field
            crops.
          </p>
        </div>

        {/* My Active Field Crops */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" /> My Active Crops
              </h2>
              <p className="text-xs text-muted-foreground">
                Crops saved to your personal Firestore farm ledger.
              </p>
            </div>

            <form onSubmit={handleAddMyCrop} className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Crop name (e.g. Wheat)"
                value={newCropName}
                onChange={(e) => setNewCropName(e.target.value)}
                className="w-40 sm:w-48 text-sm"
              />
              <Input
                placeholder="Acres"
                value={newCropAcres}
                onChange={(e) => setNewCropAcres(e.target.value)}
                className="w-20 text-sm"
              />
              <Button
                type="submit"
                size="sm"
                disabled={addingCrop || !newCropName.trim()}
                className="gap-1"
              >
                <Plus className="h-4 w-4" /> Add
              </Button>
            </form>
          </div>

          {savedCrops.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No crops tracked yet. Add your first crop above to monitor its growth cycle.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {savedCrops.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-border bg-background p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{c.cropName}</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-primary/10 text-primary border-primary/20"
                    >
                      {c.status || "Growing"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      Area: <span className="text-foreground">{c.acres} acres</span>
                    </p>
                    <p>
                      Planted: <span className="text-foreground">{c.plantedDate}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agricultural Crop Knowledgebase */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Recommended Regional Crops</h2>
            <Input
              placeholder="Search by crop, season, or soil..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-xs text-sm"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCrops.map((crop) => (
              <div
                key={crop.name}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-foreground">{crop.name}</h3>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {crop.season}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>
                        Duration:{" "}
                        <strong className="text-foreground font-medium">{crop.duration}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3.5 w-3.5 text-primary" />
                      <span>
                        Water:{" "}
                        <strong className="text-foreground font-medium">{crop.waterReq}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SunMedium className="h-3.5 w-3.5 text-primary" />
                      <span>
                        Soil:{" "}
                        <strong className="text-foreground font-medium">{crop.soilType}</strong>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs bg-muted/60 p-2.5 rounded-lg text-muted-foreground leading-relaxed mt-2">
                    💡 {crop.keyTips}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    setNewCropName(crop.name.split(" ")[0]);
                    setNewCropAcres("2");
                  }}
                >
                  Track This Crop
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
