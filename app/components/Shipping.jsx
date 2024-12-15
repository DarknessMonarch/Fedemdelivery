import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import Dropdown from "@/app/components/Dropdown";
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
    // pricing logic:
    const pricingRules = {
      baseCostPerKg: 10, // cost per kg in USD
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
      const northAmerica = ["US", "CA", "MX"];
      const southAmerica = ["AR", "BR", "CL", "CO", "PE", "VE"];
      const europe = [
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
      ];
      const asia = ["CN", "JP", "IN", "KR", "SG", "TH", "MY", "ID"];
      const africa = ["ZA", "EG", "NG", "MA", "DZ", "KE"];
      const oceania = ["AU", "NZ"];
      const middleEast = ["AE", "SA", "IR", "IL", "QA", "KW"];

      if (northAmerica.includes(countryCode)) return "North America";
      if (southAmerica.includes(countryCode)) return "South America";
      if (europe.includes(countryCode)) return "Europe";
      if (asia.includes(countryCode)) return "Asia";
      if (africa.includes(countryCode)) return "Africa";
      if (oceania.includes(countryCode)) return "Oceania";
      if (middleEast.includes(countryCode)) return "Middle East";

      return "Default";
    };


    const productTypeMultiplier =
      pricingRules.productTypeMultipliers[productType.toLowerCase()] || 1.0;

    const countryCode =
      CountriesData.find((c) => c.name === country)?.code || "US";
    const regionMultiplier =
      pricingRules.regionMultipliers[getRegion(countryCode)] ||
      pricingRules.regionMultipliers["Default"];

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

  const handleSubmit = (e) => {
    e.preventDefault();

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
    setTimeout(() => {
      const cost = calculateShippingCost(formData);
      const formattedCost = cost.toFixed(2);
      setTotalCost(formattedCost);
      setIsLoading(false);
      togglePopup();
      toast.success("Shipping cost calculated successfully!");

      const currentUrl = new URL(window.location.href);
      const searchParams = currentUrl.searchParams;

      searchParams.set("weight", weight);
      searchParams.set("country", country);
      searchParams.set("shipmentMode", shipmentMode);
      searchParams.set("price", formattedCost);

      router.replace(`${currentUrl.pathname}?${searchParams.toString()}`);
    }, 1000);
  };

  useEffect(() => {
    if (
      formData.weight === "" &&
      formData.productType === "" &&
      formData.country === "" &&
      formData.shipmentMode === ""
    ) {
      const currentUrl = new URL(window.location.href);
      currentUrl.search = "";
      router.replace(currentUrl.toString());
    }
  }, [formData, router]);

  return (
    <>
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

        <button
          type="submit"
          disabled={isLoading}
          className={styles.formButton}
        >
          {isLoading ? <Loader /> : "Calculate Shipping Cost"}
        </button>

        <p>Our terms and conditions apply</p>
      </form>
    </>
  );
}
