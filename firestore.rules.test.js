import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import fs from 'fs';

const PROJECT_ID = 'firestore-rules-test';
let testEnv;

before(async () => {
  // Load the rules file
  const rules = fs.readFileSync('firestore.rules.test', 'utf8');

  // Initialize the test environment
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: rules,
    }
  });
});

after(async () => {
  // Clean up the test environment
  await testEnv.cleanup();
});

beforeEach(async () => {
  // Clear the database between tests
  await testEnv.clearFirestore();
});

describe('KaspaTaxi Firestore Rules', () => {

  // Test data
  const testRide = {
    riderId: 'rider1',
    driverId: null,
    status: 'pending',
    pickupLocation: { lat: 40.7128, lng: -74.0060 },
    dropoffLocation: { lat: 40.7580, lng: -73.9855 }
  };

  const acceptedRide = {
    riderId: 'rider1',
    driverId: 'driver1',
    status: 'accepted',
    pickupLocation: { lat: 40.7128, lng: -74.0060 },
    dropoffLocation: { lat: 40.7580, lng: -73.9855 }
  };

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    isDriver: false
  };

  const driverUser = {
    name: 'Test Driver',
    email: 'driver@example.com',
    isDriver: true
  };

  // Test cases for rides collection
  describe('Rides Collection', () => {

    beforeEach(async () => {
      // Set up test data
      const admin = testEnv.authenticatedContext('admin');
      const adminDb = admin.firestore();

      await adminDb.collection('rides').doc('pending-ride').set(testRide);
      await adminDb.collection('rides').doc('accepted-ride').set(acceptedRide);
    });

    it('allows riders to read their own rides', async () => {
      const rider = testEnv.authenticatedContext('rider1');
      const riderDb = rider.firestore();

      await assertSucceeds(riderDb.collection('rides').doc('pending-ride').get());
      await assertSucceeds(riderDb.collection('rides').doc('accepted-ride').get());
    });

    it('prevents riders from reading other riders\' rides', async () => {
      const otherRider = testEnv.authenticatedContext('rider2');
      const otherRiderDb = otherRider.firestore();

      await assertFails(otherRiderDb.collection('rides').doc('pending-ride').get());
      await assertFails(otherRiderDb.collection('rides').doc('accepted-ride').get());
    });

    it('allows drivers to read rides they\'ve accepted', async () => {
      const driver = testEnv.authenticatedContext('driver1');
      const driverDb = driver.firestore();

      await assertSucceeds(driverDb.collection('rides').doc('accepted-ride').get());
    });

    it('prevents drivers from reading rides they haven\'t accepted', async () => {
      const otherDriver = testEnv.authenticatedContext('driver2');
      const otherDriverDb = otherDriver.firestore();

      await assertFails(otherDriverDb.collection('rides').doc('accepted-ride').get());
    });

    it('allows any authenticated user to read pending rides', async () => {
      const driver = testEnv.authenticatedContext('driver1');
      const driverDb = driver.firestore();

      const otherDriver = testEnv.authenticatedContext('driver2');
      const otherDriverDb = otherDriver.firestore();

      await assertSucceeds(driverDb.collection('rides').doc('pending-ride').get());
      await assertSucceeds(otherDriverDb.collection('rides').doc('pending-ride').get());
    });

    it('prevents unauthenticated users from reading any rides', async () => {
      const unauthenticated = testEnv.unauthenticatedContext();
      const unauthenticatedDb = unauthenticated.firestore();

      await assertFails(unauthenticatedDb.collection('rides').doc('pending-ride').get());
      await assertFails(unauthenticatedDb.collection('rides').doc('accepted-ride').get());
    });

    it('allows riders to create rides', async () => {
      const rider = testEnv.authenticatedContext('rider2');
      const riderDb = rider.firestore();

      const newRide = {
        riderId: 'rider2',
        driverId: null,
        status: 'pending',
        pickupLocation: { lat: 40.7128, lng: -74.0060 },
        dropoffLocation: { lat: 40.7580, lng: -73.9855 }
      };

      await assertSucceeds(riderDb.collection('rides').doc('new-ride').set(newRide));
    });

    it('prevents riders from creating rides with someone else\'s ID', async () => {
      const rider = testEnv.authenticatedContext('rider2');
      const riderDb = rider.firestore();

      const invalidRide = {
        riderId: 'rider1', // Different from authenticated user
        driverId: null,
        status: 'pending',
        pickupLocation: { lat: 40.7128, lng: -74.0060 },
        dropoffLocation: { lat: 40.7580, lng: -73.9855 }
      };

      await assertFails(riderDb.collection('rides').doc('invalid-ride').set(invalidRide));
    });

    it('allows drivers to update rides they\'ve accepted', async () => {
      const driver = testEnv.authenticatedContext('driver1');
      const driverDb = driver.firestore();

      await assertSucceeds(driverDb.collection('rides').doc('accepted-ride').update({
        status: 'ongoing'
      }));
    });

    it('prevents drivers from updating rides they haven\'t accepted', async () => {
      const otherDriver = testEnv.authenticatedContext('driver2');
      const otherDriverDb = otherDriver.firestore();

      await assertFails(otherDriverDb.collection('rides').doc('accepted-ride').update({
        status: 'ongoing'
      }));
    });

    it('allows riders to cancel their own pending rides', async () => {
      const rider = testEnv.authenticatedContext('rider1');
      const riderDb = rider.firestore();

      await assertSucceeds(riderDb.collection('rides').doc('pending-ride').update({
        status: 'cancelled'
      }));
    });

    it('prevents riders from cancelling rides that aren\'t pending', async () => {
      const rider = testEnv.authenticatedContext('rider1');
      const riderDb = rider.firestore();

      await assertFails(riderDb.collection('rides').doc('accepted-ride').update({
        status: 'cancelled'
      }));
    });
  });

  // Test cases for users collection
  describe('Users Collection', () => {

    beforeEach(async () => {
      // Set up test data
      const admin = testEnv.authenticatedContext('admin');
      const adminDb = admin.firestore();

      await adminDb.collection('users').doc('user1').set(testUser);
      await adminDb.collection('users').doc('driver1').set(driverUser);
    });

    it('allows users to read their own documents', async () => {
      const user = testEnv.authenticatedContext('user1');
      const userDb = user.firestore();

      await assertSucceeds(userDb.collection('users').doc('user1').get());
    });

    it('prevents users from reading other users\' documents', async () => {
      const user = testEnv.authenticatedContext('user1');
      const userDb = user.firestore();

      await assertFails(userDb.collection('users').doc('driver1').get());
    });

    it('allows users to write to their own documents', async () => {
      const user = testEnv.authenticatedContext('user1');
      const userDb = user.firestore();

      await assertSucceeds(userDb.collection('users').doc('user1').update({
        name: 'Updated Name'
      }));
    });

    it('prevents users from writing to other users\' documents', async () => {
      const user = testEnv.authenticatedContext('user1');
      const userDb = user.firestore();

      await assertFails(userDb.collection('users').doc('driver1').update({
        name: 'Hacked Name'
      }));
    });
  });
});
