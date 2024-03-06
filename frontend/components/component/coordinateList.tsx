interface CoordinateListProps {
  georefMarkerPairs: GeorefMarkerPair[];
}
interface GeorefMarkerPair {
  latLong: number[];
  pixelCoords: number[];
}

const CoordinateList: React.FC<CoordinateListProps> = ({
  georefMarkerPairs,
}) => {
  if (!georefMarkerPairs.length) return null;

  return (
    <div className="absolute bottom-0 right-0">
      <table className="table-auto w-full text-sm text-left">
        <thead>
          <tr>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Map X</th>
            <th>Map Y</th>
          </tr>
        </thead>
        <tbody>
          {georefMarkerPairs.map((pair, index) => (
            <tr key={index}>
              <td>{pair.latLong[0]}</td>
              <td>{pair.latLong[1]}</td>
              <td>{pair.pixelCoords[0]}</td>
              <td>{pair.pixelCoords[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoordinateList;
