export interface FallbackProperty {
    id: string;
    title: string;
    description: string;
    price_per_night: number;
    cleaning_fee: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    guests: number;
    country: string;
    city: string;
    category: string;
    property_type: string;
    amenities: string[];
    image_url: string;
    images?: { id: string; image_url: string }[];
    rating_avg: number;
    reviews_count: number;
    is_favorite: boolean;
    landlord: {
        id: string;
        name: string;
        avatar_url: string;
        is_superhost: boolean;
    };
}

export const FALLBACK_PROPERTIES: FallbackProperty[] = [
    {
        id: '5bef37f7-d162-43ca-96bb-e85d9d96482e',
        title: 'Villa Sol de Goa - Private Infinity Pool & Sunken Lounge',
        description: 'Tucked among swaying coconut palms in North Goa, this Portuguese-Goan luxury villa features a private infinity pool, sunken poolside bar, lush tropical garden, high vaulted ceilings, and walking distance to Anjuna beach.',
        price_per_night: 12500,
        cleaning_fee: 1200,
        bedrooms: 4,
        beds: 4,
        bathrooms: 4,
        guests: 8,
        country: 'India',
        city: 'Goa',
        category: 'Beachfront',
        property_type: 'Villa',
        amenities: ['Wifi', 'Pool', 'Air conditioning', 'Kitchen', 'Free parking', 'Hot tub', 'Dedicated workspace', 'Patio or balcony'],
        image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        images: [
            { id: '1', image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
            { id: '2', image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80' },
            { id: '3', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
        ],
        rating_avg: 4.95,
        reviews_count: 28,
        is_favorite: false,
        landlord: {
            id: 'superhost-1',
            name: 'Priya Sharma',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
            is_superhost: true,
        },
    },
    {
        id: 'a89c23de-234b-4890-a3bc-918273645e01',
        title: 'Cedar Wood Himalayan Chalet with Snow Mountain Views',
        description: 'Perched amid deodar forests in Old Manali, this handcrafted cedar and river-stone chalet offers sweeping 360-degree views of snow-capped Himalayan peaks, an authentic bukhari fireplace, and outdoor bonfire pit.',
        price_per_night: 6800,
        cleaning_fee: 800,
        bedrooms: 3,
        beds: 3,
        bathrooms: 2,
        guests: 6,
        country: 'India',
        city: 'Manali',
        category: 'Cabins',
        property_type: 'Chalet',
        amenities: ['Wifi', 'Indoor fireplace', 'Kitchen', 'Free parking', 'Dedicated workspace', 'Mountain view', 'Patio or balcony'],
        image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        images: [
            { id: '1', image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80' },
            { id: '2', image_url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80' },
        ],
        rating_avg: 4.92,
        reviews_count: 19,
        is_favorite: false,
        landlord: {
            id: 'host-1',
            name: 'Rohit Verma',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
            is_superhost: true,
        },
    },
    {
        id: 'b12c34ef-567a-4bc8-8901-23456789abcd',
        title: 'Royal Haveli Suite Overlooking Lake Pichola & City Palace',
        description: 'Experience Mewar royal luxury inside this 250-year-old restored lakeside Haveli. Features traditional Jharokha balconies directly overlooking Lake Pichola, intricate marble carvings, and rooftop dining.',
        price_per_night: 14500,
        cleaning_fee: 1500,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        guests: 4,
        country: 'India',
        city: 'Udaipur',
        category: 'Mansions',
        property_type: 'Heritage Haveli',
        amenities: ['Wifi', 'Air conditioning', 'Lake view', 'Kitchen', 'Breakfast included', 'Patio or balcony', 'Waterfront'],
        image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
        images: [
            { id: '1', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
            { id: '2', image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
        ],
        rating_avg: 4.98,
        reviews_count: 34,
        is_favorite: false,
        landlord: {
            id: 'host-2',
            name: 'Ananya Patel',
            avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
            is_superhost: true,
        },
    },
    {
        id: 'c23d45fa-678b-4cd9-9012-3456789abcde',
        title: 'Luxury Teak Houseboat with Private Chef on Kerala Backwaters',
        description: 'Glide peacefully through the tranquil palm-fringed lagoons of Alleppey. This ultra-luxury private Kettuvallam houseboat features an air-conditioned glass sun deck and private chef serving Ayurvedic meals.',
        price_per_night: 9500,
        cleaning_fee: 900,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        guests: 4,
        country: 'India',
        city: 'Alleppey',
        category: 'Lakefront',
        property_type: 'Houseboat',
        amenities: ['Wifi', 'Air conditioning', 'Breakfast included', 'Lake view', 'Waterfront', 'Patio or balcony'],
        image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
        images: [
            { id: '1', image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
            { id: '2', image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80' },
        ],
        rating_avg: 4.96,
        reviews_count: 22,
        is_favorite: false,
        landlord: {
            id: 'superhost-1',
            name: 'Priya Sharma',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
            is_superhost: true,
        },
    },
    {
        id: 'd34e56fb-789c-4de0-0123-456789abcdef',
        title: 'Ganges Riverside Zen Retreat with Yoga Shala & Garden',
        description: 'Located in the spiritual heart of Tapovan, this serene stone retreat overlooks the holy River Ganges and foothills of the Himalayas. Features a private yoga pavilion, meditation hall, and organic herb garden.',
        price_per_night: 4200,
        cleaning_fee: 600,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        guests: 4,
        country: 'India',
        city: 'Rishikesh',
        category: 'Countryside',
        property_type: 'Cottage',
        amenities: ['Wifi', 'Kitchen', 'Free parking', 'Dedicated workspace', 'Mountain view', 'River view', 'Patio or balcony'],
        image_url: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
        images: [
            { id: '1', image_url: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80' },
            { id: '2', image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
        ],
        rating_avg: 4.88,
        reviews_count: 16,
        is_favorite: false,
        landlord: {
            id: 'host-1',
            name: 'Rohit Verma',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
            is_superhost: true,
        },
    },
    {
        id: 'e45f670c-890d-4ef1-1234-56789abcdef0',
        title: 'Bandra Sea-Facing Luxury High-Rise Designer Penthouse',
        description: 'Panoramic Arabian Sea sunset views from every room. Situated on Carter Road in Bandra West, this duplex penthouse features 12-ft ceilings, an expansive terrace overlooking the sea, and Italian marble flooring.',
        price_per_night: 16000,
        cleaning_fee: 1800,
        bedrooms: 3,
        beds: 3,
        bathrooms: 3,
        guests: 6,
        country: 'India',
        city: 'Mumbai',
        category: 'Iconic Cities',
        property_type: 'Penthouse',
        amenities: ['Wifi', 'Air conditioning', 'Elevator', 'Gym', 'Kitchen', 'Dedicated workspace', 'Sea view', 'City skyline view'],
        image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        images: [
            { id: '1', image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80' },
            { id: '2', image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80' },
        ],
        rating_avg: 4.97,
        reviews_count: 31,
        is_favorite: false,
        landlord: {
            id: 'superhost-1',
            name: 'Priya Sharma',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
            is_superhost: true,
        },
    },
    {
        id: 'f560781d-901e-4f02-2345-6789abcdef01',
        title: 'Indiranagar Eco-Chic Studio Loft with Private Rooftop Garden',
        description: 'A sun-drenched industrial minimalist loft in the trendiest neighborhood of Bengaluru. Steps away from artisan cafes, craft breweries, and tech hubs. Equipped with 300 Mbps fiber internet and lush terrace garden.',
        price_per_night: 3800,
        cleaning_fee: 500,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        guests: 2,
        country: 'India',
        city: 'Bengaluru',
        category: 'Trending',
        property_type: 'Loft',
        amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Dedicated workspace', 'Patio or balcony', 'Free parking'],
        image_url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
        images: [
            { id: '1', image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80' },
        ],
        rating_avg: 4.94,
        reviews_count: 27,
        is_favorite: false,
        landlord: {
            id: 'host-2',
            name: 'Ananya Patel',
            avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
            is_superhost: true,
        },
    },
    {
        id: '0171892e-012f-4013-3456-789abcdef012',
        title: 'Amber Fort View Royal Suite in Pink City Heritage Mansion',
        description: 'Wake up to morning views of the majestic Aravalli hills and Amber Fort. Adorned with hand-block-printed textiles, royal frescoes, hand-carved sandstone arches, and an open rooftop pavilion.',
        price_per_night: 5500,
        cleaning_fee: 700,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        guests: 4,
        country: 'India',
        city: 'Jaipur',
        category: 'Castles',
        property_type: 'Heritage Mansion',
        amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Breakfast included', 'Patio or balcony', 'Fort view'],
        image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        images: [
            { id: '1', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
        ],
        rating_avg: 4.91,
        reviews_count: 23,
        is_favorite: false,
        landlord: {
            id: 'host-2',
            name: 'Ananya Patel',
            avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
            is_superhost: true,
        },
    },
];

export function getFallbackProperties(queryStr?: string) {
    if (!queryStr) {
        return { data: FALLBACK_PROPERTIES, count: FALLBACK_PROPERTIES.length, favorites: [] };
    }

    let filtered = [...FALLBACK_PROPERTIES];
    const params = new URLSearchParams(queryStr.replace(/^\?/, ''));

    const category = params.get('category');
    if (category && category !== 'All Stays') {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    const city = params.get('city') || params.get('query');
    if (city) {
        const lower = city.toLowerCase();
        filtered = filtered.filter(p => 
            p.city.toLowerCase().includes(lower) || 
            p.title.toLowerCase().includes(lower) ||
            p.country.toLowerCase().includes(lower)
        );
    }

    const minPrice = params.get('min_price');
    if (minPrice) {
        filtered = filtered.filter(p => p.price_per_night >= Number(minPrice));
    }

    const maxPrice = params.get('max_price');
    if (maxPrice) {
        filtered = filtered.filter(p => p.price_per_night <= Number(maxPrice));
    }

    const guests = params.get('numGuests');
    if (guests) {
        filtered = filtered.filter(p => p.guests >= Number(guests));
    }

    return {
        data: filtered.length > 0 ? filtered : FALLBACK_PROPERTIES,
        count: filtered.length > 0 ? filtered.length : FALLBACK_PROPERTIES.length,
        favorites: []
    };
}

export function getFallbackPropertyById(id: string) {
    return FALLBACK_PROPERTIES.find(p => p.id === id) || FALLBACK_PROPERTIES[0];
}
