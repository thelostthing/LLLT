function toCartesian(lat, lon) {
  const R = 6371; // Radius of the Earth in kilometers
  const latRad = lat * (Math.PI / 180);
  const lonRad = lon * (Math.PI / 180);
  return {
      x: R * Math.cos(latRad) * Math.cos(lonRad),
      y: R * Math.cos(latRad) * Math.sin(lonRad),
      z: R * Math.sin(latRad)
  };
}

function toLatLon(x, y, z) {
  const R = 6371; // Radius of the Earth in kilometers
  const lat = Math.asin(z / R) * (180 / Math.PI);
  const lon = Math.atan2(y, x) * (180 / Math.PI);
  return { latitude: lat, longitude: lon };
}

function calculateCenterOfMass(gpsPoints) {
  if (!gpsPoints || gpsPoints.length === 0) {
      throw new Error("No GPS points provided");
  }

  let totalX = 0;
  let totalY = 0;
  let totalZ = 0;

  // Convert each GPS point to Cartesian coordinates and sum them
  gpsPoints.forEach(point => {
      const { x, y, z } = toCartesian(point.latitude, point.longitude);
      totalX += x;
      totalY += y;
      totalZ += z;
  });

  // Calculate the average of the Cartesian coordinates
  const numPoints = gpsPoints.length;
  const avgX = totalX / numPoints;
  const avgY = totalY / numPoints;
  const avgZ = totalZ / numPoints;

  // Convert the average Cartesian coordinates back to latitude and longitude
  return toLatLon(avgX, avgY, avgZ);
}

function calculateDistance(coords1, coords2) {
  const toRad = (value) => (value * Math.PI) / 180;

  const lat1 = coords1.latitude;
  const lon1 = coords1.longitude;
  const lat2 = coords2.latitude;
  const lon2 = coords2.longitude;

  const R = 6371e3; // Radius of the Earth in meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
}

// https://developers.weixin.qq.com/miniprogram/dev/component/map.html
const MapScaleTencent = [
  {scale: 3, distance: 1000000},
  {scale: 4, distance: 500000},
  {scale: 5, distance: 200000},
  {scale: 6, distance: 100000},
  {scale: 7, distance: 50000},
  {scale: 8, distance: 25000},
  {scale: 9, distance: 20000},
  {scale: 10, distance: 10000},
  {scale: 11, distance: 5000},
  {scale: 12, distance: 2000},
  {scale: 13, distance: 1000},
  {scale: 14, distance: 500},
  {scale: 15, distance: 200},
  {scale: 16, distance: 100},
  {scale: 17, distance: 50},
  {scale: 18, distance: 20},
  {scale: 19, distance: 10},
  {scale: 20, distance: 5},
]
const getScreenWidthCm = (distanceRpx, distance, scale) => {
  const distace_percm = MapScaleTencent.find(tmp => tmp.scale == scale).distance;
  return distance / distace_percm / (distanceRpx / 750)
}

module.exports = {
  calculateCenterOfMass,
  calculateDistance,
  MapScaleTencent,
  getScreenWidthCm,
};
