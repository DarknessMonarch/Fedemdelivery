import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import Dropdown from "@/app/components/Dropdown";
import { useTrackingStore } from "@/app/store/Tracking";
import { useDrawerStore } from "@/app/store/Drawer";
import CountriesData from "@/app/utility/Countries";
import styles from "@/app/styles/shipping.module.css";

import { FaWeightHanging as WeightIcon } from "react-icons/fa";
import {
  MdOutlineCategory as ProductTypeIcon,
  MdOutlinePlace as CountryIcon,
  MdOutlineLocalShipping as ShipmentIcon,
} from "react-icons/md";

export default function Shipping() {
  const router = useRouter();
  const { isAuth, email, accessToken } = useAuthStore();
  const createTracking = useTrackingStore((state) => state.createTracking);
  const { togglePopup } = useDrawerStore();
  const countryNames = CountriesData.map((country) => country.name);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    weight: "",
    productType: "",
    country: "",
    shipmentMode: "",
  });

  const [totalCost, setTotalCost] = useState(null);

  const calculateShippingCost = ({
    weight,
    productType,
    country,
    shipmentMode,
  }) => {
    const pricingRules = {
      baseCostPerKg: 10,
      productTypeMultipliers: {
        fragile: 2.0,
        standard: 1.0,
        oversized: 1.8,
      },
      regionMultipliers: {
        "North America": 1.2,
        "South America": 1.6,
        Europe: 1.5,
        Asia: 1.7,
        Africa: 2.0,
        Oceania: 1.9,
        "Middle East": 1.8,
        Default: 2.0,
      },
      shipmentModeMultipliers: {
        road: 1.0,
        air: 1.5,
        sea: 1.2,
      },
    };

    const getRegion = (countryCode) => {
      const regions = {
        northAmerica: ["US", "CA", "MX"],
        southAmerica: ["AR", "BR", "CL", "CO", "PE", "VE"],
        europe: [
          "GB",
          "FR",
          "DE",
          "IT",
          "ES",
          "NL",
          "BE",
          "CH",
          "SE",
          "NO",
          "DK",
        ],
        asia: ["CN", "JP", "IN", "KR", "SG", "TH", "MY", "ID"],
        africa: ["ZA", "EG", "NG", "MA", "DZ", "KE"],
        oceania: ["AU", "NZ"],
        middleEast: ["AE", "SA", "IR", "IL", "QA", "KW"],
      };

      for (const [region, countries] of Object.entries(regions)) {
        if (countries.includes(countryCode))
          return region.replace(/[A-Z]/g, " $&").trim();
      }

      return "Default";
    };

    const productTypeMultiplier =
      pricingRules.productTypeMultipliers[productType.toLowerCase()] || 1.0;
    const countryCode =
      CountriesData.find((c) => c.name === country)?.code || "US";
    const regionMultiplier =
      pricingRules.regionMultipliers[getRegion(countryCode)] ||
      pricingRules.regionMultipliers.Default;
    const shipmentModeMultiplier =
      pricingRules.shipmentModeMultipliers[shipmentMode.toLowerCase()] || 1.0;

    const weightCost = parseFloat(weight) * pricingRules.baseCostPerKg;
    return (
      weightCost *
      productTypeMultiplier *
      regionMultiplier *
      shipmentModeMultiplier
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuth) {
      toast.error("Please log in to calculate shipping cost.");
      return;
    }

    const { weight, productType, country, shipmentMode } = formData;

    if (!weight || !productType || !country || !shipmentMode) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (isNaN(weight) || parseFloat(weight) <= 0) {
      toast.error("Please enter a valid weight.");
      return;
    }

    setIsLoading(true);
    try {
      const cost = calculateShippingCost(formData);
      const formattedCost = cost.toFixed(2);
      setTotalCost(formattedCost);

      const trackingData = {
        email,
        country,
        weight,
        shipmentType: shipmentMode,
        totalPrice: formattedCost,
      };

      const result = await createTracking(trackingData, accessToken);

      if (result.success) {
        setIsLoading(false);
        togglePopup();
        toast.success(
          "Shipping cost calculated and tracking created successfully!"
        );
        toast.success(
          "Check your email for tracking ID  pay for  delivery to start and track your package."
        );

        const currentUrl = new URL(window.location.href);
        const searchParams = currentUrl.searchParams;

        searchParams.set("weight", weight);
        searchParams.set("country", country);
        searchParams.set("shipmentMode", shipmentMode);
        searchParams.set("price", formattedCost);
        searchParams.set("trackingId", result.trackingDetails.trackingId);

        router.replace(`${currentUrl.pathname}?${searchParams.toString()}`);
      } else {
        toast.error(result.message);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("An error occurred while processing your request.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (Object.values(formData).every((value) => value === "")) {
      const currentUrl = new URL(window.location.href);
      currentUrl.search = "";
      router.replace(currentUrl.toString());
    }
  }, [formData, router]);

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formInput}>
        <WeightIcon className={styles.formIcon} />
        <input
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
          placeholder="Weight (kg)"
        />
      </div>

      <Dropdown
        options={["Fragile", "Standard", "Oversized"]}
        onSelect={(option) =>
          setFormData((prev) => ({ ...prev, productType: option }))
        }
        dropPlaceHolder="Select Product Type"
        Icon={<ProductTypeIcon className={styles.formIcon} />}
      />
      <Dropdown
        options={["Road", "Air", "Sea"]}
        onSelect={(option) =>
          setFormData((prev) => ({ ...prev, shipmentMode: option }))
        }
        dropPlaceHolder="Select Shipment Mode"
        Icon={<ShipmentIcon className={styles.formIcon} />}
      />
      <Dropdown
        options={countryNames}
        onSelect={(option) =>
          setFormData((prev) => ({ ...prev, country: option }))
        }
        dropPlaceHolder="Select Country"
        Icon={<CountryIcon className={styles.formIcon} />}
      />

      <button type="submit" disabled={isLoading} className={styles.formButton}>
        {isLoading ? <Loader /> : "Calculate Shipping Cost"}
      </button>

      <p>Our terms and conditions apply</p>
    </form>
  );
}
