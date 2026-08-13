import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";
import PropertyDetailContent from "@/app/components/properties/PropertyDetailContent";

const PropertyDetailPage = async ({ params }: { params: { id: string } }) => {
    const property = await apiService.get(`/api/properties/${params.id}`);
    const userId = await getUserId();

    return (
        <PropertyDetailContent
            property={property}
            userId={userId}
        />
    );
};

export default PropertyDetailPage;