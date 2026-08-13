from datetime import date, timedelta
from django.core.management.base import BaseCommand
from useraccount.models import User
from property.models import Property, PropertyImage, Reservation, Review


class Command(BaseCommand):
    help = 'Seeds database with realistic India-based Airbnb users, properties, multi-image galleries, reviews, and bookings'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Seeding India-based Airbnb database...'))

        # 1. Clear existing data
        Review.objects.all().delete()
        Reservation.objects.all().delete()
        PropertyImage.objects.all().delete()
        Property.objects.all().delete()
        User.objects.filter(email__in=[
            'superhost@airbnb.com',
            'host1@airbnb.com',
            'host2@airbnb.com',
            'guest@airbnb.com',
            'priya.sharma@airbnb.com',
            'rohit.verma@airbnb.com',
            'ananya.patel@airbnb.com',
            'rahul.mehta@airbnb.com',
        ]).delete()

        # 2. Create Indian Demo Users
        self.stdout.write('Creating Indian hosts and travelers...')
        
        superhost = User.objects.create_user(
            name='Priya Sharma',
            email='superhost@airbnb.com',
            password='password123',
            bio='Architect & luxury boutique host based in Goa. Hosting bespoke villas and heritage retreats across India for 7+ years. Superhost passionate about curated local experiences.',
            is_host=True,
            is_superhost=True,
            phone_number='+91 98201 23456',
            location='Goa, India',
            avatar_url_field='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
        )

        host1 = User.objects.create_user(
            name='Rohit Verma',
            email='host1@airbnb.com',
            password='password123',
            bio='Himalayan naturalist & wooden chalet designer. Welcoming mountain lovers and mindful travelers to the peaceful hills of Himachal and Kashmir.',
            is_host=True,
            is_superhost=True,
            phone_number='+91 98112 34567',
            location='Manali, Himachal Pradesh, India',
            avatar_url_field='https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
        )

        host2 = User.objects.create_user(
            name='Ananya Patel',
            email='host2@airbnb.com',
            password='password123',
            bio='Heritage architect passionate about Rajasthani Havelis, royal palaces, handloom textiles, and authentic regional gastronomy.',
            is_host=True,
            is_superhost=False,
            phone_number='+91 98290 87654',
            location='Udaipur, Rajasthan, India',
            avatar_url_field='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        )

        guest = User.objects.create_user(
            name='Rahul Mehta',
            email='guest@airbnb.com',
            password='password123',
            bio='Fullstack software engineer and digital nomad working remotely while exploring scenic getaways and heritage stays across India.',
            is_host=False,
            is_superhost=False,
            phone_number='+91 99001 98765',
            location='Bengaluru, Karnataka, India',
            avatar_url_field='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
        )

        # 3. Seed 16 Curated Indian Properties
        self.stdout.write('Creating 16 curated Indian properties & galleries...')

        properties_data = [
            {
                'title': 'Villa Sol de Goa - Private Infinity Pool & Sunken Lounge',
                'description': 'Tucked among swaying coconut palms in North Goa, this Portuguese-Goan luxury villa features a private infinity pool, sunken poolside bar, lush tropical garden, high vaulted ceilings, and walking distance to Anjuna beach.',
                'price_per_night': 12500,
                'cleaning_fee': 1200,
                'bedrooms': 4,
                'beds': 4,
                'bathrooms': 4,
                'guests': 8,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Goa',
                'address': 'Near Anjuna Beach Road, Anjuna, Goa',
                'latitude': 15.5808,
                'longitude': 73.7423,
                'category': 'Beachfront',
                'property_type': 'Villa',
                'amenities': ['Wifi', 'Pool', 'Air conditioning', 'Kitchen', 'Free parking', 'Hot tub', 'Dedicated workspace', 'Patio or balcony', 'BBQ grill', 'Power backup'],
                'primary_image_url': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': superhost,
            },
            {
                'title': 'Cedar Wood Himalayan Chalet with Snow Mountain Views',
                'description': 'Perched amid deodar forests in Old Manali, this handcrafted cedar and river-stone chalet offers sweeping 360-degree views of snow-capped Himalayan peaks, an authentic bukhari fireplace, glass attic bedroom, and outdoor bonfire pit.',
                'price_per_night': 6800,
                'cleaning_fee': 800,
                'bedrooms': 3,
                'beds': 3,
                'bathrooms': 2,
                'guests': 6,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Manali',
                'address': 'Log Huts Area, Old Manali, Himachal Pradesh',
                'latitude': 32.2432,
                'longitude': 77.1892,
                'category': 'Cabins',
                'property_type': 'Chalet',
                'amenities': ['Wifi', 'Indoor fireplace', 'Kitchen', 'Free parking', 'Dedicated workspace', 'Mountain view', 'Patio or balcony', 'Heater', 'Bonfire'],
                'primary_image_url': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': host1,
            },
            {
                'title': 'Royal Haveli Suite Overlooking Lake Pichola & City Palace',
                'description': 'Experience Mewar royal luxury inside this 250-year-old restored lakeside Haveli. Features traditional Jharokha balconies directly overlooking Lake Pichola, intricate marble carvings, antique Belgian chandeliers, and rooftop dining.',
                'price_per_night': 14500,
                'cleaning_fee': 1500,
                'bedrooms': 2,
                'beds': 2,
                'bathrooms': 2,
                'guests': 4,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Udaipur',
                'address': 'Lal Ghat, Lake Pichola, Udaipur, Rajasthan',
                'latitude': 24.5764,
                'longitude': 73.6835,
                'category': 'Mansions',
                'property_type': 'Heritage Haveli',
                'amenities': ['Wifi', 'Air conditioning', 'Lake view', 'Kitchen', 'Breakfast included', 'Patio or balcony', 'Waterfront', 'Dedicated workspace'],
                'primary_image_url': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': host2,
            },
            {
                'title': 'Luxury Teak Houseboat with Private Chef on Kerala Backwaters',
                'description': 'Glide peacefully through the tranquil palm-fringed lagoons of Alleppey. This ultra-luxury private Kettuvallam houseboat is handcrafted from wild teak and bamboo, featuring an air-conditioned glass sun deck, private chef, and Ayurvedic meals.',
                'price_per_night': 9500,
                'cleaning_fee': 900,
                'bedrooms': 2,
                'beds': 2,
                'bathrooms': 2,
                'guests': 4,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Alleppey',
                'address': 'Finishing Point Road, Punnamada, Alleppey, Kerala',
                'latitude': 9.4981,
                'longitude': 76.3388,
                'category': 'Lakefront',
                'property_type': 'Houseboat',
                'amenities': ['Wifi', 'Air conditioning', 'Breakfast included', 'Lake view', 'Waterfront', 'Patio or balcony'],
                'primary_image_url': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': superhost,
            },
            {
                'title': 'Ganges Riverside Zen Retreat with Yoga Shala & Garden',
                'description': 'Located in the spiritual heart of Tapovan, this serene stone retreat overlooks the holy River Ganges and foothills of the Himalayas. Features a private yoga pavilion, sound meditation hall, organic herb garden, and pristine mountain air.',
                'price_per_night': 4200,
                'cleaning_fee': 600,
                'bedrooms': 2,
                'beds': 2,
                'bathrooms': 2,
                'guests': 4,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Rishikesh',
                'address': 'Tapovan, Laxman Jhula, Rishikesh, Uttarakhand',
                'latitude': 30.1314,
                'longitude': 78.3242,
                'category': 'Countryside',
                'property_type': 'Cottage',
                'amenities': ['Wifi', 'Kitchen', 'Free parking', 'Dedicated workspace', 'Mountain view', 'River view', 'Patio or balcony', 'Yoga props'],
                'primary_image_url': 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': host1,
            },
            {
                'title': 'Bandra Sea-Facing Luxury High-Rise Designer Penthouse',
                'description': 'Panoramic Arabian Sea sunset views from every room. Situated on Carter Road in Bandra West, this duplex penthouse features 12-ft ceilings, an expansive terrace overlooking the sea, Italian marble flooring, and designer modular kitchen.',
                'price_per_night': 16000,
                'cleaning_fee': 1800,
                'bedrooms': 3,
                'beds': 3,
                'bathrooms': 3,
                'guests': 6,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Mumbai',
                'address': 'Carter Road, Bandra West, Mumbai, Maharashtra',
                'latitude': 19.0607,
                'longitude': 72.8258,
                'category': 'Iconic Cities',
                'property_type': 'Penthouse',
                'amenities': ['Wifi', 'Air conditioning', 'Elevator', 'Gym', 'Kitchen', 'Dedicated workspace', 'Sea view', 'City skyline view', 'Washer', 'Dryer'],
                'primary_image_url': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': superhost,
            },
            {
                'title': 'Indiranagar Eco-Chic Studio Loft with Private Rooftop Garden',
                'description': 'A sun-drenched industrial minimalist loft in the trendiest neighborhood of Bengaluru. Steps away from artisan cafes, craft breweries, and tech hubs. Equipped with 300 Mbps fiber internet, ergonomic workstation, and lush terrace garden.',
                'price_per_night': 3800,
                'cleaning_fee': 500,
                'bedrooms': 1,
                'beds': 1,
                'bathrooms': 1,
                'guests': 2,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Bengaluru',
                'address': '100 Feet Road, Indiranagar, Bengaluru, Karnataka',
                'latitude': 12.9784,
                'longitude': 77.6408,
                'category': 'Trending',
                'property_type': 'Loft',
                'amenities': ['Wifi', 'Air conditioning', 'Kitchen', 'Dedicated workspace', 'Washer', 'Balcony', 'City view', 'Power backup'],
                'primary_image_url': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': superhost,
            },
            {
                'title': 'Pink City Heritage Courtyard Palace with Jharokha Balconies',
                'description': 'Step into the era of Rajput royalty inside this grand Jaipur Haveli. Highlights include hand-painted fresco ceilings, private central courtyard with marble fountain, plunge pool, and rooftop views of Nahargarh Fort.',
                'price_per_night': 11000,
                'cleaning_fee': 1200,
                'bedrooms': 3,
                'beds': 4,
                'bathrooms': 3,
                'guests': 7,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Jaipur',
                'address': 'Near Hawa Mahal, Pink City, Jaipur, Rajasthan',
                'latitude': 26.9239,
                'longitude': 75.8267,
                'category': 'Design',
                'property_type': 'Palace Suite',
                'amenities': ['Wifi', 'Pool', 'Air conditioning', 'Kitchen', 'Free parking', 'Patio or balcony', 'Breakfast included'],
                'primary_image_url': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': host2,
            },
            {
                'title': 'Coffee Plantation Wooden Treehouse in Western Ghats Rainforest',
                'description': 'Suspended 30 feet high in the canopy of a 50-acre organic coffee and spice estate in Coorg. Features panoramic plantation views, natural stream bathing, birdsong mornings, wood-fired fireplace, and freshly roasted estate coffee.',
                'price_per_night': 5500,
                'cleaning_fee': 700,
                'bedrooms': 1,
                'beds': 2,
                'bathrooms': 1,
                'guests': 3,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Coorg',
                'address': 'Madikeri Estate Road, Coorg, Karnataka',
                'latitude': 12.4244,
                'longitude': 75.7382,
                'category': 'Cabins',
                'property_type': 'Treehouse',
                'amenities': ['Wifi', 'Hot tub', 'Kitchen', 'Free parking', 'Mountain view', 'Patio or balcony', 'Breakfast included'],
                'primary_image_url': 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': host1,
            },
            {
                'title': 'Snow-Clad Alpine Pine Cottage with Bukhari Fireplace',
                'description': 'A fairy-tale wooden winter lodge in the heart of Gulmarg. Direct ski-in / ski-out access to the Gulmarg Gondola, snow-capped pine forest views, heated floors, wool rugs, and Kashmiri Kahwa tea on arrival.',
                'price_per_night': 8200,
                'cleaning_fee': 900,
                'bedrooms': 2,
                'beds': 3,
                'bathrooms': 2,
                'guests': 5,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Gulmarg',
                'address': 'Near Gulmarg Gondola Base, Gulmarg, Jammu and Kashmir',
                'latitude': 34.0484,
                'longitude': 74.3805,
                'category': 'Cabins',
                'property_type': 'Chalet',
                'amenities': ['Wifi', 'Indoor fireplace', 'Ski-in/ski-out', 'Free parking', 'Mountain view', 'Heater', 'Breakfast included'],
                'primary_image_url': 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': host1,
            },
            {
                'title': 'French Quarter Colonial Heritage Villa with Bougainvillea Courtyard',
                'description': 'Historic 18th-century French-Tamil mansion in the picturesque White Town of Pondicherry. Features high arched doorways, antique teak furniture, pastel yellow facade, private plunge pool, and a 2-minute stroll to the Promenade Beach.',
                'price_per_night': 7200,
                'cleaning_fee': 800,
                'bedrooms': 3,
                'beds': 3,
                'bathrooms': 3,
                'guests': 6,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Pondicherry',
                'address': 'Rue Suffren, White Town, Puducherry',
                'latitude': 11.9338,
                'longitude': 79.8335,
                'category': 'Design',
                'property_type': 'Villa',
                'amenities': ['Wifi', 'Pool', 'Air conditioning', 'Kitchen', 'Patio or balcony', 'Dedicated workspace', 'Sea view'],
                'primary_image_url': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': superhost,
            },
            {
                'title': 'High Altitude Geodesic Stargazing Dome in Nubra Valley',
                'description': 'Experience the surreal mountain deserts of Ladakh inside an insulated geodesic glass dome. Positioned under zero-pollution dark skies for world-class Milky Way stargazing, with custom heated beds and solar energy.',
                'price_per_night': 6200,
                'cleaning_fee': 600,
                'bedrooms': 1,
                'beds': 1,
                'bathrooms': 1,
                'guests': 2,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Ladakh',
                'address': 'Hunder Sand Dunes, Nubra Valley, Ladakh',
                'latitude': 34.5802,
                'longitude': 77.4691,
                'category': 'Trending',
                'property_type': 'Dome / Igloo',
                'amenities': ['Wifi', 'Free parking', 'Heater', 'Mountain view', 'Breakfast included', 'Bonfire'],
                'primary_image_url': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': host1,
            },
            {
                'title': 'Radhanagar Coral Reef Private Beach Bungalow in Havelock',
                'description': 'Walk barefoot directly onto Asia top-rated Radhanagar Beach. This eco-luxury timber bungalow features outdoor rain showers, hammocks among coconut groves, private scuba diving access, and pristine turquoise ocean views.',
                'price_per_night': 10500,
                'cleaning_fee': 1100,
                'bedrooms': 2,
                'beds': 2,
                'bathrooms': 2,
                'guests': 4,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Andaman',
                'address': 'Radhanagar Beach Road, Havelock Island, Andaman & Nicobar',
                'latitude': 11.9812,
                'longitude': 92.9567,
                'category': 'Beachfront',
                'property_type': 'Bungalow',
                'amenities': ['Wifi', 'Air conditioning', 'Kitchen', 'Free parking', 'Ocean view', 'Beachfront', 'Patio or balcony'],
                'primary_image_url': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': superhost,
            },
            {
                'title': 'Misty Tea Estate Colonial Bungalow with Valley Views',
                'description': 'A 1920s British colonial planter bungalow set among 200 acres of emerald tea gardens in Munnar. Includes antique fireplace, wide wooden verandahs overlooking the mist-covered Western Ghats, and tea tasting tours.',
                'price_per_night': 5800,
                'cleaning_fee': 700,
                'bedrooms': 3,
                'beds': 3,
                'bathrooms': 2,
                'guests': 6,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Munnar',
                'address': 'Tea County Road, Munnar, Kerala',
                'latitude': 10.0889,
                'longitude': 77.0595,
                'category': 'Countryside',
                'property_type': 'Bungalow',
                'amenities': ['Wifi', 'Indoor fireplace', 'Kitchen', 'Free parking', 'Garden view', 'Mountain view', 'Breakfast included'],
                'primary_image_url': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': host1,
            },
            {
                'title': 'Historic Ghat-Facing Heritage Mansion with Rooftop Sunrise View',
                'description': 'Overlooking Assi Ghat and the eternal waters of the sacred Ganges in Varanasi. This restored sandstone Haveli offers serene rooftop yoga at dawn, classical music soirees, and direct access to evening Ganga Aarti.',
                'price_per_night': 4900,
                'cleaning_fee': 600,
                'bedrooms': 2,
                'beds': 2,
                'bathrooms': 2,
                'guests': 4,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Varanasi',
                'address': 'Assi Ghat, Shivala, Varanasi, Uttar Pradesh',
                'latitude': 25.2905,
                'longitude': 83.0069,
                'category': 'Iconic Cities',
                'property_type': 'Heritage Haveli',
                'amenities': ['Wifi', 'Air conditioning', 'River view', 'Breakfast included', 'Patio or balcony', 'Dedicated workspace'],
                'primary_image_url': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': host2,
            },
            {
                'title': 'Cliffside Glass Villa with Infinity Pool & Western Ghats Fog Views',
                'description': 'Cantilevered off a cliff in Lonavala, this glass-walled architectural marvel features a heated infinity pool overlooking deep green valleys and seasonal waterfalls. Perfect luxury weekend retreat just 2 hours from Mumbai and Pune.',
                'price_per_night': 13500,
                'cleaning_fee': 1400,
                'bedrooms': 4,
                'beds': 5,
                'bathrooms': 4,
                'guests': 9,
                'country': 'India',
                'country_code': 'IN',
                'city': 'Lonavala',
                'address': 'Tiger Point Road, Lonavala, Maharashtra',
                'latitude': 18.7557,
                'longitude': 73.4091,
                'category': 'Mansions',
                'property_type': 'Villa',
                'amenities': ['Wifi', 'Pool', 'Hot tub', 'Air conditioning', 'Kitchen', 'Free parking', 'Mountain view', 'Patio or balcony', 'BBQ grill'],
                'primary_image_url': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                'gallery': [
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
                ],
                'landlord': superhost,
            },
        ]

        created_properties = []
        for p_data in properties_data:
            gallery = p_data.pop('gallery', [])
            prop = Property.objects.create(**p_data)
            created_properties.append(prop)

            for idx, img_url in enumerate(gallery):
                PropertyImage.objects.create(property=prop, image_url=img_url, order=idx)

        # 4. Seed Authentic Indian Stay Reviews
        self.stdout.write('Creating authentic guest reviews...')
        sample_reviews = [
            ("Unbelievable hospitality and view! The infinity pool and sunset were magical. Priya is a true Superhost who helped us with local dining and hidden spots.", 5.0, 5.0, 5.0, 5.0, 5.0, 5.0),
            ("Peaceful, sparkling clean, and breathtaking Himalayan scenery. Waking up to mountain views with hot chai was the highlight of our vacation.", 4.9, 5.0, 4.9, 5.0, 5.0, 4.8),
            ("A royal experience in the truest sense! Overlooking the lake was mesmerizing. Everything was impeccably maintained.", 5.0, 5.0, 5.0, 5.0, 5.0, 5.0),
            ("Super fast WiFi for remote work and walking distance to the best cafes. Loved the private terrace garden!", 4.8, 4.8, 4.9, 5.0, 5.0, 4.7),
        ]

        for prop in created_properties:
            for idx, rev in enumerate(sample_reviews[:2]):
                Review.objects.create(
                    property=prop,
                    author=guest if idx % 2 == 0 else host2,
                    rating=rev[1],
                    cleanliness_rating=rev[2],
                    accuracy_rating=rev[3],
                    communication_rating=rev[4],
                    location_rating=rev[5],
                    value_rating=rev[6],
                    comment=rev[0]
                )

        # 5. Seed Wishlist Favorites
        guest.favorites.add(created_properties[0], created_properties[1], created_properties[2], created_properties[5])

        # 6. Seed Sample Reservations (Trips & Calendar Booking Blocking)
        self.stdout.write('Creating sample bookings...')
        today = date.today()

        # Reservation 1: Active upcoming Goa trip for guest
        r1_start = today + timedelta(days=5)
        r1_end = today + timedelta(days=9)
        r1_nights = 4
        r1_total = (created_properties[0].price_per_night * r1_nights) + created_properties[0].cleaning_fee + 2500
        Reservation.objects.create(
            property=created_properties[0],
            start_date=r1_start,
            end_date=r1_end,
            number_of_nights=r1_nights,
            guests=4,
            cleaning_fee=created_properties[0].cleaning_fee,
            service_fee=2500,
            total_price=r1_total,
            status='confirmed',
            payment_status='paid',
            created_by=guest
        )

        # Reservation 2: Active upcoming Manali trip
        r2_start = today + timedelta(days=12)
        r2_end = today + timedelta(days=16)
        r2_nights = 4
        r2_total = (created_properties[1].price_per_night * r2_nights) + created_properties[1].cleaning_fee + 1500
        Reservation.objects.create(
            property=created_properties[1],
            start_date=r2_start,
            end_date=r2_end,
            number_of_nights=r2_nights,
            guests=2,
            cleaning_fee=created_properties[1].cleaning_fee,
            service_fee=1500,
            total_price=r2_total,
            status='confirmed',
            payment_status='paid',
            created_by=guest
        )

        # Reservation 3: Past completed trip in Udaipur
        r3_start = today - timedelta(days=25)
        r3_end = today - timedelta(days=21)
        r3_nights = 4
        r3_total = (created_properties[2].price_per_night * r3_nights) + created_properties[2].cleaning_fee + 3000
        Reservation.objects.create(
            property=created_properties[2],
            start_date=r3_start,
            end_date=r3_end,
            number_of_nights=r3_nights,
            guests=2,
            cleaning_fee=created_properties[2].cleaning_fee,
            service_fee=3000,
            total_price=r3_total,
            status='completed',
            payment_status='paid',
            created_by=guest
        )

        self.stdout.write(self.style.SUCCESS(
            f'Successfully seeded India-based Airbnb database!\n'
            f'- Users: 4 (Priya Sharma, Rohit Verma, Ananya Patel, Rahul Mehta)\n'
            f'- Properties: {len(created_properties)} across Goa, Manali, Udaipur, Kerala, Mumbai, Bengaluru, Rishikesh, etc.\n'
            f'- Reviews: {Review.objects.count()} authentic reviews\n'
            f'- Reservations: {Reservation.objects.count()} active & completed bookings\n'
            f'Default password for all accounts: password123'
        ))

