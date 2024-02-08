export default function MapStyleToggle({
  onStyleChange,
}: {
  onStyleChange: Function;
}) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onStyleChange(`mapbox://styles/mapbox/${event.target.id}`);
  };

  return (
    <div
      onChange={handleChange}
      className="flex flex-col items-left ms-2 text-sm font-medium bg-white rounded-md shadow-md divide-x divide-gray-200 p-2"
    >
      <input
        type="radio"
        id="streets-v12"
        name="mapStyleToggle"
        value="streets"
      />
      <label htmlFor="streets-v12">Streets</label>
      <input
        type="radio"
        id="satellite-streets-v12"
        name="mapStyleToggle"
        value="satellite"
      />
      <label htmlFor="satellite-streets-v12">Satellite</label>
    </div>
  );
}
