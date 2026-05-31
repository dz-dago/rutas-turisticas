import React, { useEffect, useRef, useState } from "react";

function MapaInteractivo({ lugares }) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !lugares || lugares.length === 0 || !mapRef.current) {
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: {
        lat: lugares[0].ubicacion?.lat || 15.319,
        lng: lugares[0].ubicacion?.lng || -91.471
      },
      zoom: 13,
      styles: [
        {
          featureType: "all",
          elementType: "geometry",
          stylers: [{ color: "#242f3e" }]
        },
        {
          featureType: "all",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#242f3e" }]
        },
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ color: "#746855" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }]
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#283d6a" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }]
        }
      ]
    });

    const bounds = new window.google.maps.LatLngBounds();

    lugares.forEach((local, index) => {
      if (local.ubicacion?.lat && local.ubicacion?.lng) {
        const position = {
          lat: local.ubicacion.lat,
          lng: local.ubicacion.lng
        };

        bounds.extend(position);

        new window.google.maps.Marker({
          position,
          map,
          title: local.nombre,
          label: {
            text: String(index + 1),
            color: "white",
            fontWeight: "bold"
          },
          animation: window.google.maps.Animation.DROP
        });
      }
    });

    if (lugares.length > 1) {
      map.fitBounds(bounds);
    }
  }, [mapLoaded, lugares]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-3xl bg-zinc-800"
    />
  );
}

export default MapaInteractivo;
