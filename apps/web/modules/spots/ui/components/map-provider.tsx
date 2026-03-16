"use client";

import {
  createContext,
  use,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
import type { Coordinates } from "@workspace/backend/lib/types";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Id, Doc } from "@workspace/backend/_generated/dataModel";

type ViewState = { latitude: number; longitude: number; zoom: number };

type MapContextValue = {
  spots: Doc<"spots">[] | undefined;
  currentUser: Doc<"users"> | null | undefined;
  isSignedIn: boolean | undefined;
  isLoaded: boolean;
  voteBySpotId: Map<Id<"spots">, number>;
  selectedSpotId: Id<"spots"> | null;
  setSelectedSpotId: (id: Id<"spots"> | null) => void;
  pickingLocation: boolean;
  setPickingLocation: (v: boolean) => void;
  pickedLocation: Coordinates | null;
  setPickedLocation: (loc: Coordinates | null) => void;
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  viewState: ViewState;
  userLocation: Coordinates | null;
  selectedSpot: Doc<"spots"> | null;
  handleMapClick: (e: { lngLat: { lat: number; lng: number } }) => void;
  handleSelectSpot: (id: Id<"spots">) => void;
  handleFabClick: () => void;
  handleMove: (evt: { viewState: ViewState }) => void;
};

const MapContext = createContext<MapContextValue | null>(null);

export function useMapContext() {
  const ctx = use(MapContext);
  if (!ctx) throw new Error("useMapContext must be used within a MapProvider");
  return ctx;
}

const DEFAULT_CENTER = { latitude: -23.5505, longitude: -46.6333 };

export function MapProvider({ children }: { children: ReactNode }) {
  const spots = useQuery(api.spots.listActive);
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser, isSignedIn ? {} : "skip");

  const [selectedSpotId, setSelectedSpotId] = useState<Id<"spots"> | null>(null);
  const [pickingLocation, setPickingLocation] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<Coordinates | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewState, setViewState] = useState<ViewState>({ ...DEFAULT_CENTER, zoom: 12 });
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const geolocateAttempted = useRef(false);

  const spotIds = useMemo(() => spots?.map((s) => s._id) ?? [], [spots]);
  const myVotes = useQuery(
    api.votes.getMyVotes,
    isSignedIn && spotIds.length > 0 ? { spotIds } : "skip"
  );
  const voteBySpotId = useMemo(() => {
    const map = new Map<Id<"spots">, number>();
    if (myVotes) {
      for (const v of myVotes) {
        map.set(v.spotId, v.value);
      }
    }
    return map;
  }, [myVotes]);

  useEffect(() => {
    if (geolocateAttempted.current) return;
    geolocateAttempted.current = true;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setUserLocation(loc);
          setViewState((prev) => ({ ...prev, ...loc }));
        },
        () => {},
        { timeout: 5000, enableHighAccuracy: false }
      );
    }
  }, []);

  const handleMapClick = useCallback(
    (e: { lngLat: { lat: number; lng: number } }) => {
      if (pickingLocation) {
        setPickedLocation({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
        setPickingLocation(false);
        setAddDialogOpen(true);
      } else {
        setSelectedSpotId(null);
      }
    },
    [pickingLocation]
  );

  const handleSelectSpot = useCallback((id: Id<"spots">) => {
    setSelectedSpotId(id);
  }, []);

  const handleFabClick = useCallback(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { router.push("/sign-in?redirect_url=/mapa"); return; }
    if (currentUser === undefined) return;
    if (!currentUser || currentUser.status !== "approved") {
      toast.error("Sua conta está aguardando aprovação");
      return;
    }
    setAddDialogOpen(true);
  }, [isLoaded, isSignedIn, currentUser, router]);

  const handleMove = useCallback(
    (evt: { viewState: ViewState }) => setViewState(evt.viewState),
    [],
  );

  const selectedSpot = useMemo(
    () => spots?.find((s) => s._id === selectedSpotId) ?? null,
    [spots, selectedSpotId]
  );

  const value = useMemo<MapContextValue>(() => ({
    spots,
    currentUser,
    isSignedIn,
    isLoaded,
    voteBySpotId,
    selectedSpotId,
    setSelectedSpotId,
    pickingLocation,
    setPickingLocation,
    pickedLocation,
    setPickedLocation,
    addDialogOpen,
    setAddDialogOpen,
    viewState,
    userLocation,
    selectedSpot,
    handleMapClick,
    handleSelectSpot,
    handleFabClick,
    handleMove,
  }), [
    spots,
    currentUser,
    isSignedIn,
    isLoaded,
    voteBySpotId,
    selectedSpotId,
    pickingLocation,
    pickedLocation,
    addDialogOpen,
    viewState,
    userLocation,
    selectedSpot,
    handleMapClick,
    handleSelectSpot,
    handleFabClick,
    handleMove,
  ]);

  return <MapContext value={value}>{children}</MapContext>;
}
