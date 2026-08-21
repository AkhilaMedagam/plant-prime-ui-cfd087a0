import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Sun,
  CheckCircle2,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import { DashboardLayout } from "@/components/site/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/weather")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Agricultural Weather Intelligence — AgriSmart" },
      {
        name: "description",
        content:
          "Localized farm weather forecasts, spray timing advisories, and rainfall predictions.",
      },
      { property: "og:title", content: "Weather Intelligence — AgriSmart" },
      {
        property: "og:description",
        content: "Localized farm weather forecasts and spray timing advisories.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WeatherPage,
});

const FORECAST_DAYS = [
  {
    day: "Today",
    temp: "31°C / 22°C",
    condition: "Partly Cloudy",
    rain: "10%",
    wind: "12 km/h",
    icon: CloudSun,
    sprayOk: true,
  },
  {
    day: "Tomorrow",
    temp: "33°C / 23°C",
    condition: "Sunny & Clear",
    rain: "0%",
    wind: "8 km/h",
    icon: Sun,
    sprayOk: true,
  },
  {
    day: "Wednesday",
    temp: "29°C / 21°C",
    condition: "Scattered Showers",
    rain: "65%",
    wind: "24 km/h",
    icon: CloudRain,
    sprayOk: false,
  },
  {
    day: "Thursday",
    temp: "28°C / 20°C",
    condition: "Light Rain",
    rain: "40%",
    wind: "18 km/h",
    icon: CloudRain,
    sprayOk: false,
  },
  {
    day: "Friday",
    temp: "30°C / 22°C",
    condition: "Mostly Sunny",
    rain: "15%",
    wind: "10 km/h",
    icon: CloudSun,
    sprayOk: true,
  },
];

function WeatherPage() {
  const [location, setLocation] = useState("Guntur, Andhra Pradesh");
  const [currentLocation, setCurrentLocation] = useState("Guntur, Andhra Pradesh");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) setCurrentLocation(location.trim());
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Agricultural Weather
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Microclimate forecasts and spray suitability conditions for your farm.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter village or district..."
                className="pl-9 text-sm w-48 sm:w-60"
              />
            </div>
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>
        </div>

        {/* Current Weather Card */}
        <div className="rounded-3xl border border-border bg-gradient-to-br from-card to-accent/40 p-6 sm:p-8 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-medium text-sm">
                <MapPin className="h-4 w-4" />
                <span>{currentLocation}</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl sm:text-6xl font-black tracking-tight">31°C</span>
                <span className="text-lg font-semibold text-muted-foreground">Partly Cloudy</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Updated just now · High: 33°C / Low: 22°C
              </p>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Droplets className="h-4 w-4 text-primary" /> Humidity
                </div>
                <p className="text-lg font-bold">58%</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Wind className="h-4 w-4 text-primary" /> Wind Speed
                </div>
                <p className="text-lg font-bold">12 km/h ENE</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CloudRain className="h-4 w-4 text-primary" /> Rain Chance
                </div>
                <p className="text-lg font-bold">10%</p>
              </div>
            </div>
          </div>

          {/* Spray Window Advisory */}
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                Favorable Spray Window Today (6:00 AM - 10:30 AM)
              </p>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-400 mt-0.5">
                Wind speed is below 15 km/h and no heavy precipitation expected for the next 24
                hours. Good conditions for foliar nutrient and pesticide application.
              </p>
            </div>
          </div>
        </div>

        {/* 5-Day Farm Forecast */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">5-Day Agricultural Forecast</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {FORECAST_DAYS.map((f) => (
              <div
                key={f.day}
                className="rounded-2xl border border-border bg-card p-4 shadow-soft text-center space-y-3"
              >
                <p className="font-semibold text-sm">{f.day}</p>
                <div className="grid place-items-center">
                  <f.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">{f.temp}</p>
                  <p className="text-xs text-muted-foreground">{f.condition}</p>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Rain: {f.rain}</span>
                  <span
                    className={
                      f.sprayOk ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"
                    }
                  >
                    {f.sprayOk ? "Spray OK" : "No Spray"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
