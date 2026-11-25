import CatalogSection from '../components/CatalogSection';

export default function AppliancesPage() {
  return (
    <CatalogSection
      department="appliance"
      badge="Ambient Engineering"
      title="Smart Lighting & Home Appliances"
      subtitle="Explore dimmable sculptural fixtures, warm-spectrum Kelvin luminaires, and whisper-quiet architectural appliances calibrated for modern living."
      showTechSpecs
    />
  );
}
