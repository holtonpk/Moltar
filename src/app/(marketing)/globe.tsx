"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import createGlobe, { Marker } from "cobe";
import { useSpring } from "react-spring";
import useIntersectionObserver from "@/lib/hooks/use-intersection-observer";

export default function GlobeClient() {
  const divRef = useRef<any>();
  const entry = useIntersectionObserver(divRef, {});
  const isVisible = !!entry?.isIntersecting;
  const [showGlobe, setShowGlobe] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowGlobe(true);
    } else {
      setShowGlobe(false);
    }
  }, [isVisible]);

  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = window.document.createElement("canvas");
      const ctx =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      (ctx as any).getSupportedExtensions();
    } catch (e) {
      // WebGL isn't properly supported
      setWebglSupported(false);
      console.log("WebGL not supported, hiding globe animation...");
      return;
    }
  }, []);

  return (
    <div
      ref={divRef}
      className={`${
        webglSupported ? "min-h-[500px] sm:min-h-[1000px]" : "min-h-[50px]"
      } h-full`}
    >
      {webglSupported && showGlobe && <GlobeAnimation />}
    </div>
  );
}

const GlobeAnimation = () => {
  const canvasRef = useRef<any>();
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 60,
      precision: 0.001,
    },
  }));
  var style = getComputedStyle(document.body);
  const dark = parseInt(style.getPropertyValue("--globe-style"));

  useEffect(() => {
    let phi = -0.5;
    let width = 0;
    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener("resize", onResize);
    onResize();
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 1,
      width,
      height: width,
      phi,
      theta: 0.12,
      dark: dark,
      diffuse: 0.5,
      scale: 1,
      mapSamples: 20000,
      mapBrightness: 4,
      baseColor: [1, 1, 1],
      markerColor: [249 / 255, 115 / 255, 22 / 255],
      offset: [0, 0],
      glowColor: [0.8, 0.8, 0.8],
      markers: markers as Marker[],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        phi += 0.002;
        state.phi = phi + r.get();
        state.width = width;
        state.height = width;
      },
    });
    setTimeout(() => (canvasRef.current.style.opacity = "1"));
    return () => globe.destroy();
  });

  const [showModal, setShowModal] = useState(true);

  return (
    <div className="absolute flex items-center w-full top-0 z-40 ">
      <div
        style={{
          width: "100%",
          maxWidth: 1000,
          aspectRatio: "1",
          margin: "auto",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            pointerInteracting.current =
              e.clientX - pointerInteractionMovement.current;
            canvasRef.current.style.cursor = "grabbing";
          }}
          onPointerUp={() => {
            pointerInteracting.current = null;
            canvasRef.current.style.cursor = "grab";
          }}
          onPointerOut={() => {
            pointerInteracting.current = null;
            canvasRef.current.style.cursor = "grab";
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta;
              api.start({
                r: delta / 200,
              });
            }
          }}
          onTouchMove={(e) => {
            if (pointerInteracting.current !== null && e.touches[0]) {
              const delta = e.touches[0].clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta;
              api.start({
                r: delta / 100,
              });
            }
          }}
          style={{
            width: "100%",
            height: "100%",
            contain: "layout paint size",
            opacity: 0,
            transition: "opacity 1s ease",
          }}
        />
      </div>
    </div>
  );
};

const locations = [
  { location: [40.712776, -74.005974] }, // New York, NY
  { location: [34.052235, -118.243683] }, // Los Angeles, CA
  { location: [41.878113, -87.629799] }, // Chicago, IL
  { location: [29.760427, -95.369804] }, // Houston, TX
  { location: [33.448376, -112.074036] }, // Phoenix, AZ
  { location: [39.952583, -75.165222] }, // Philadelphia, PA
  { location: [29.424122, -98.493629] }, // San Antonio, TX
  { location: [32.715736, -117.161087] }, // San Diego, CA
  { location: [32.776665, -96.796989] }, // Dallas, TX
  { location: [37.774929, -122.419418] }, // San Francisco, CA
  { location: [47.606209, -122.332069] }, // Seattle, WA
  { location: [39.739235, -104.99025] }, // Denver, CO
  { location: [42.360082, -71.058884] }, // Boston, MA
  { location: [36.162663, -86.781601] }, // Nashville, TN
  { location: [38.907192, -77.036873] }, // Washington, D.C.
  { location: [33.748997, -84.387985] }, // Atlanta, GA
  { location: [44.977753, -93.265011] }, // Minneapolis, MN
  { location: [37.540725, -77.436048] }, // Richmond, VA
  { location: [27.950575, -82.457177] }, // Tampa, FL
  { location: [35.149532, -90.04898] }, // Memphis, TN
  { location: [51.507351, -0.127758] }, // London
  { location: [48.856613, 2.352222] }, // Paris
  { location: [52.520008, 13.404954] }, // Berlin
  { location: [35.689487, 139.691711] }, // Tokyo
  { location: [37.566536, 126.977966] }, // Seoul
  { location: [31.230391, 121.473702] }, // Shanghai
  { location: [19.432608, -99.133209] }, // Mexico City
  { location: [-23.55052, -46.633308] }, // Sao Paulo
  { location: [-34.603684, -58.381559] }, // Buenos Aires
  { location: [28.613939, 77.209023] }, // New Delhi
  { location: [19.075983, 72.877655] }, // Mumbai
  { location: [31.54972, 74.343612] }, // Lahore
  { location: [33.684421, 73.047882] }, // Islamabad
  { location: [-33.92487, 18.424055] }, // Cape Town
  { location: [-26.204103, 28.047304] }, // Johannesburg
  { location: [30.04442, 31.235712] }, // Cairo
  { location: [-1.292066, 36.821946] }, // Nairobi
  { location: [41.902782, 12.496365] }, // Rome
  { location: [45.465454, 9.186516] }, // Milan
  { location: [59.329323, 18.068581] }, // Stockholm
  { location: [55.676098, 12.568337] }, // Copenhagen
  { location: [60.169857, 24.938379] }, // Helsinki
  { location: [59.913868, 10.752245] }, // Oslo
  { location: [40.416775, -3.70379] }, // Madrid
  { location: [51.219448, 4.402464] }, // Antwerp
  { location: [50.850346, 4.351721] }, // Brussels
  { location: [52.366697, 4.89454] }, // Amsterdam
  { location: [53.349805, -6.26031] }, // Dublin
  { location: [1.352083, 103.819839] }, // Singapore
  { location: [13.756331, 100.501762] }, // Bangkok
  { location: [3.139003, 101.686852] }, // Kuala Lumpur
  { location: [-6.208763, 106.845599] }, // Jakarta
  { location: [14.599512, 120.984222] }, // Manila
  { location: [-33.86882, 151.20929] }, // Sydney, NSW
  { location: [-37.813629, 144.963058] }, // Melbourne, VIC
  { location: [-27.46977, 153.025131] }, // Brisbane, QLD
  { location: [-31.950527, 115.860457] }, // Perth, WA
  { location: [-34.928499, 138.600746] }, // Adelaide, SA
  { location: [-41.28646, 174.77623] }, // Wellington
  { location: [43.653225, -79.383186] }, // Toronto
  { location: [45.50169, -73.567253] }, // Montreal
  { location: [49.28273, -123.120735] }, // Vancouver
  { location: [59.437, 24.7536] }, // Tallinn
  { location: [56.9496, 24.1052] }, // Riga
];

const markers = locations.map((location) => {
  return {
    ...location,
    size: Math.random() * 0.05 + 0.02,
  };
});
