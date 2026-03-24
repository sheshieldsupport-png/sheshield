import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Car,
  ChevronRight,
  MapPin,
  Navigation2,
  Phone,
  Star,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import type { Ride, VehicleType } from "../types/app";

const VEHICLES: {
  type: VehicleType;
  emoji: string;
  label: string;
  price: string;
}[] = [
  { type: "taxi", emoji: "🚕", label: "Taxi", price: "₹120–160" },
  { type: "bike", emoji: "🛵", label: "Bike", price: "₹40–60" },
  { type: "auto", emoji: "🛺", label: "Auto", price: "₹60–90" },
  { type: "car", emoji: "🚗", label: "Car", price: "₹180–220" },
];

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];

export default function BookRideScreen() {
  const { setScreen, setActiveRide, addHistory } = useApp();
  const [vehicle, setVehicle] = useState<VehicleType>("auto");
  const [pickup, setPickup] = useState("Station Road, Berhampur");
  const [destination, setDestination] = useState("");
  const [driverFound, setDriverFound] = useState(false);
  const [finding, setFinding] = useState(false);

  function handleFindDriver() {
    if (!destination.trim()) return;
    setFinding(true);
    setTimeout(() => {
      setFinding(false);
      setDriverFound(true);
    }, 1800);
  }

  function handleStartRide() {
    const ride: Ride = {
      id: Date.now().toString(),
      driver: {
        name: "Rajesh Kumar",
        phone: "9876543210",
        vehicle: "OD07 AB 1234",
        vehicleType: vehicle,
        rating: 4.8,
        photo: "/assets/generated/driver-rajesh.dim_120x120.png",
      },
      pickup,
      destination: destination || "Gandhi Market",
      startTime: new Date(),
      status: "active",
    };
    setActiveRide(ride);
    addHistory({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "ride",
      description: `${vehicle.charAt(0).toUpperCase() + vehicle.slice(1)} Ride — ${pickup} → ${destination || "Gandhi Market"}`,
      status: "completed",
      location: "Berhampur, Odisha",
    });
    setScreen("active");
  }

  return (
    <div className="flex flex-col gap-5 pb-4 animate-slide-up">
      <div className="flex items-center gap-3">
        <button
          type="button"
          data-ocid="book.back.button"
          onClick={() => setScreen("home")}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display text-xl font-bold">Book a Ride</h2>
          <p className="text-xs text-muted-foreground">
            Choose your vehicle & enter route
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Vehicle Type
        </p>
        <div className="grid grid-cols-4 gap-2">
          {VEHICLES.map((v) => (
            <button
              type="button"
              key={v.type}
              data-ocid={`book.vehicle_${v.type}.toggle`}
              onClick={() => setVehicle(v.type)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${vehicle === v.type ? "scale-105" : "opacity-70 hover:opacity-100"}`}
              style={{
                background:
                  vehicle === v.type
                    ? "oklch(0.58 0.25 340 / 0.08)"
                    : "oklch(1 0 0)",
                borderColor:
                  vehicle === v.type
                    ? "oklch(0.58 0.25 340 / 0.7)"
                    : "oklch(0.88 0.005 265)",
                boxShadow: "0 1px 3px oklch(0 0 0 / 0.05)",
              }}
            >
              <span className="text-2xl">{v.emoji}</span>
              <span className="text-xs font-semibold text-foreground">
                {v.label}
              </span>
              <span className="text-xs text-muted-foreground">{v.price}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <MapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "oklch(0.55 0.18 145)" }}
          />
          <Input
            data-ocid="book.pickup.input"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Pickup location"
            className="pl-10 h-11"
          />
        </div>
        <div className="relative">
          <Navigation2
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "oklch(0.58 0.25 340)" }}
          />
          <Input
            data-ocid="book.destination.input"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where to? e.g. Gandhi Market"
            className="pl-10 h-11"
          />
        </div>
      </div>

      {!driverFound ? (
        <Button
          data-ocid="book.find_driver.button"
          onClick={handleFindDriver}
          disabled={finding || !destination.trim()}
          className="w-full h-12 font-semibold text-sm"
          style={{ background: "oklch(0.58 0.25 340)", color: "white" }}
        >
          {finding ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Finding Driver...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Find Driver
            </span>
          )}
        </Button>
      ) : (
        <div
          className="rounded-2xl border p-4 animate-slide-up"
          style={{
            background: "oklch(1 0 0)",
            borderColor: "oklch(0.58 0.25 340 / 0.3)",
            boxShadow: "0 2px 8px oklch(0.58 0.25 340 / 0.1)",
          }}
          data-ocid="book.driver.card"
        >
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 rounded-xl flex-shrink-0">
              <AvatarImage
                src="/assets/generated/driver-rajesh.dim_120x120.png"
                alt="Rajesh Kumar"
              />
              <AvatarFallback
                className="rounded-xl text-lg font-bold"
                style={{ background: "oklch(0.58 0.25 340 / 0.1)" }}
              >
                RK
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-base">
                  Rajesh Kumar
                </h3>
                <Badge
                  className="text-xs"
                  style={{
                    background: "oklch(0.55 0.18 145 / 0.15)",
                    color: "oklch(0.45 0.16 145)",
                    border: "1px solid oklch(0.55 0.18 145 / 0.4)",
                  }}
                >
                  Verified ✓
                </Badge>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {STAR_KEYS.map((k, i) => (
                  <Star
                    key={k}
                    className={`w-3 h-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-yellow-400/30"}`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  4.8 (312 trips)
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div>
                  <p className="text-xs text-muted-foreground">Vehicle No.</p>
                  <p className="text-xs font-semibold font-mono">
                    OD07 AB 1234
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-xs font-semibold capitalize">{vehicle}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-xs font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    9876543210
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ETA</p>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "oklch(0.55 0.18 145)" }}
                  >
                    3 mins
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button
              data-ocid="book.cancel.button"
              variant="outline"
              onClick={() => setDriverFound(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              data-ocid="book.start_ride.button"
              onClick={handleStartRide}
              className="flex-1 font-semibold"
              style={{ background: "oklch(0.58 0.25 340)" }}
            >
              Start Ride <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
