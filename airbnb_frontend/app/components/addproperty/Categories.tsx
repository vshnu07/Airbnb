'use client';

interface CategoriesProps {
    dataCategory: string;
    setCategory: (category: string) => void;
}

const addCategories = [
    { name: 'Beachfront', icon: '🏖️' },
    { name: 'Cabins', icon: '🪵' },
    { name: 'Mansions', icon: '🏰' },
    { name: 'Countryside', icon: '🌾' },
    { name: 'Lakefront', icon: '⛵' },
    { name: 'Castles', icon: '👑' },
    { name: 'Iconic cities', icon: '🏙️' },
    { name: 'Amazing pools', icon: '🏊' },
    { name: 'Tiny homes', icon: '⛺' },
    { name: 'Trending', icon: '🔥' },
    { name: 'Luxe', icon: '✨' },
];

const Categories: React.FC<CategoriesProps> = ({
    dataCategory,
    setCategory
}) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {addCategories.map((cat) => {
                const isSelected = dataCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                    <div
                        key={cat.name}
                        onClick={() => setCategory(cat.name)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center space-x-3 ${
                            isSelected
                                ? 'border-black bg-gray-50 ring-1 ring-black'
                                : 'border-gray-200 hover:border-gray-400'
                        }`}
                    >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="text-xs font-bold text-gray-900">{cat.name}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default Categories;