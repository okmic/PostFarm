db.getSiblingDB('admin').auth('admin', 'password');

try {
  if (!rs.status().ok) {
    rs.initiate({
      _id: "rs0",
      members: [{ _id: 0, host: "mongodb:27017" }]
    });
    print("Replica set initialized");
  } else {
    print("Replica set already initialized");
  }
} catch (e) {
  print("Error initializing replica set: " + e);
}