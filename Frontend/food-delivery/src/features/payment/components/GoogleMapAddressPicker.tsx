import React, { useCallback, useRef, useState, useEffect } from 'react';
import { LoadScript, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';

type LatLng = { lat: number; lng: number };

const libraries: ("places")[] = ["places"];

interface GoogleMapAddressPickerProps {
    initialAddress?: string;
    initialPosition?: { lat: number; lng: number };
    onAddressSelect: (address: { full: string; lat: number; lng: number }) => void;
    onPositionChange?: (position: { lat: number; lng: number }) => void;
}

const defaultCenter = {
    lat: 21.0285, // Hanoi center
    lng: 105.8542,
};

const GoogleMapAddressPicker: React.FC<GoogleMapAddressPickerProps> = ({
    initialAddress = '',
    initialPosition,
    onAddressSelect,
    onPositionChange,
}) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markerPosition, setMarkerPosition] = useState<LatLng>(() => {
        if (initialPosition && initialPosition.lat != null && initialPosition.lng != null) {
            return { lat: initialPosition.lat, lng: initialPosition.lng };
        }
        return defaultCenter;
    });
    const [address, setAddress] = useState<string>(initialAddress);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);

    // Initialize geocoder
    useEffect(() => {
        if (window.google?.maps) {
            geocoderRef.current = new window.google.maps.Geocoder();
        }
    }, []);

    // Geocode position to address
    const geocodePosition = useCallback(async (position: LatLng) => {
        if (!geocoderRef.current) return;

        setIsLoadingAddress(true);
        try {
            const results = await geocoderRef.current.geocode({ location: position });
            if (results.results && results.results.length > 0) {
                const formattedAddress = results.results[0].formatted_address;
                setAddress(formattedAddress);
                onAddressSelect({
                    full: formattedAddress,
                    lat: position.lat,
                    lng: position.lng,
                });
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        } finally {
            setIsLoadingAddress(false);
        }
    }, [onAddressSelect]);

    // Handle map click
    const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
                const newPosition = {
                    lat,
                    lng,
                };
                setMarkerPosition(newPosition);
                geocodePosition(newPosition);
                if (onPositionChange) {
                    onPositionChange(newPosition);
                }
            }
        }
    }, [geocodePosition, onPositionChange]);

    // Handle marker drag end
    const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
                const newPosition = {
                    lat,
                    lng,
                };
                setMarkerPosition(newPosition);
                geocodePosition(newPosition);
                if (onPositionChange) {
                    onPositionChange(newPosition);
                }
            }
        }
    }, [geocodePosition, onPositionChange]);

    // Handle autocomplete place selection
    const handlePlaceSelect = useCallback(() => {
        if (!autocompleteRef.current) return;

        const place = autocompleteRef.current.getPlace();
        if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
                const position = {
                    lat,
                    lng,
                };
                const formattedAddress = place.formatted_address || place.name || '';

                setMarkerPosition(position);
                setAddress(formattedAddress);
                
                // Center map on selected place
                if (map) {
                    map.panTo(position);
                }

                onAddressSelect({
                    full: formattedAddress,
                    lat: position.lat,
                    lng: position.lng,
                });

                if (onPositionChange) {
                    onPositionChange(position);
                }
            }
        }
    }, [map, onAddressSelect, onPositionChange]);

    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };

    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tìm kiếm địa chỉ
                    </label>
                    <Autocomplete
                        onLoad={(autocomplete) => {
                            autocompleteRef.current = autocomplete;
                        }}
                        onPlaceChanged={handlePlaceSelect}
                        options={{
                            componentRestrictions: { country: 'vn' }, // Restrict to Vietnam
                            fields: ['geometry', 'formatted_address', 'name'],
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Nhập địa chỉ hoặc tên địa điểm..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </Autocomplete>
                    {isLoadingAddress && (
                        <p className="text-xs text-gray-500 mt-1">Đang tải địa chỉ...</p>
                    )}
                </div>

                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={markerPosition}
                        zoom={15}
                        onClick={handleMapClick}
                        onLoad={(mapInstance) => {
                            setMap(mapInstance);
                            if (initialPosition) {
                                mapInstance.setCenter(initialPosition);
                            }
                        }}
                        options={{
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: true,
                        }}
                    >
                        <Marker
                            position={markerPosition}
                            draggable={true}
                            onDragEnd={handleMarkerDragEnd}
                            animation={window.google?.maps?.Animation?.DROP}
                        />
                    </GoogleMap>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                    <p>• Nhập địa chỉ vào ô tìm kiếm hoặc click trên bản đồ để chọn vị trí</p>
                    <p>• Kéo marker để điều chỉnh vị trí chính xác</p>
                    {markerPosition && markerPosition.lat != null && markerPosition.lng != null && (
                        <p className="font-medium text-gray-700 mt-2">
                            Tọa độ: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
                        </p>
                    )}
                </div>
            </div>
        </LoadScript>
    );
};

export default GoogleMapAddressPicker;

