import { CSSProperties, useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {} from 'react';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, {
	GeolocateControl,
	NavigationControl,
	MapLayerMouseEvent,
	Marker,
} from 'react-map-gl';

interface ILocationType {
	latitude: number;
	longitude: number;
}

interface ILocation {
	features: Array<{
		place_name: string;
	}>;
}

function App() {
	const [currentLocation, setCurentLocation] = useState<ILocationType>({
		longitude: 0,
		latitude: 0,
	});
	const [locationData, setLocationData] = useState<ILocation>();
	// const [loading, setLoading] = useState(false);
	// const [error, setError] = useState('');

	useEffect(() => {
		if (window.navigator) {
			window.navigator.geolocation.watchPosition(position => {
				const { latitude, longitude } = position.coords;

				setCurentLocation({
					latitude: latitude,
					longitude: longitude,
				});
			});
		}
	}, []);

	const key = import.meta.env.VITE_APP_MAP_BOX_KEY;

	const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${currentLocation.longitude},${currentLocation.latitude}.json?access_token=${key}`;

	useEffect(() => {
		const getLocationData = async () => {
			try {
				// setLoading(true);
				const response = await axios(apiUrl);

				setLocationData(response?.data);
			} catch (error: any) {
				// setError(error?.message);
				alert(error.message);
			}
		};
		getLocationData();
	}, [currentLocation.latitude, currentLocation.longitude]);

	const mapStyle = useMemo<CSSProperties>(
		() => ({
			position: 'fixed',
			inset: 0,
		}),
		[]
	);

	const mapReRenderKey = `longitude=${currentLocation.longitude}&latitude=${currentLocation.latitude}`;
	return (
		<div className="App">
			{/* <p>{JSON.stringify(locationData?.features[0]?.place_name)}</p> */}
			<Map
				key={mapReRenderKey}
				initialViewState={{
					latitude: currentLocation.latitude,
					longitude: currentLocation.longitude,
					zoom: 18,
				}}
				mapboxAccessToken={key}
				style={mapStyle}
				mapStyle={'mapbox://styles/mapbox/dark-v11'}
			>
				<Marker
					longitude={currentLocation.longitude}
					latitude={currentLocation.latitude}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="icon icon-tabler icon-tabler-navigation"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						strokeWidth="2"
						stroke="currentColor"
						fill="#8ecae6"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						<path d="M12 18.5l7.265 2.463a0.535 .535 0 0 0 .57 -.116a0.548 .548 0 0 0 .134 -.572l-7.969 -17.275l-7.97 17.275a0.547 .547 0 0 0 .135 .572a0.535 .535 0 0 0 .57 .116l7.265 -2.463"></path>
					</svg>
				</Marker>
				<GeolocateControl />
				<NavigationControl />
			</Map>
		</div>
	);
}

export default App;
