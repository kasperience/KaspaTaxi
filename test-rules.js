import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import fs from 'fs';

const PROJECT_ID = 'firestore-rules-test';
let testEnv;

async function setup() {
  // Load the rules file
  const rules = fs.readFileSync('firestore.rules.test', 'utf8');
  
  // Initialize the test environment
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: rules,
    }
  });
  
  // Clear the database
  await testEnv.clearFirestore();
  
  // Set up test data
  const admin = testEnv.authenticatedContext('admin');
  const adminDb = admin.firestore();
  
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
  
  await adminDb.collection('rides').doc('pending-ride').set(testRide);
  await adminDb.collection('rides').doc('accepted-ride').set(acceptedRide);
  await adminDb.collection('users').doc('user1').set(testUser);
  await adminDb.collection('users').doc('driver1').set(driverUser);
  
  console.log('Test environment set up successfully');
}

async function testRidesCollection() {
  console.log('\n--- Testing Rides Collection ---');
  
  // Test: Riders can read their own rides
  try {
    const rider = testEnv.authenticatedContext('rider1');
    const riderDb = rider.firestore();
    
    await assertSucceeds(riderDb.collection('rides').doc('pending-ride').get());
    await assertSucceeds(riderDb.collection('rides').doc('accepted-ride').get());
    console.log('✅ Riders can read their own rides');
  } catch (error) {
    console.error('❌ Riders cannot read their own rides:', error);
  }
  
  // Test: Riders cannot read other riders' rides
  try {
    const otherRider = testEnv.authenticatedContext('rider2');
    const otherRiderDb = otherRider.firestore();
    
    await assertFails(otherRiderDb.collection('rides').doc('pending-ride').get());
    console.log('✅ Riders cannot read other riders\' rides');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  // Test: Drivers can read rides they've accepted
  try {
    const driver = testEnv.authenticatedContext('driver1');
    const driverDb = driver.firestore();
    
    await assertSucceeds(driverDb.collection('rides').doc('accepted-ride').get());
    console.log('✅ Drivers can read rides they\'ve accepted');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  // Test: Drivers cannot read rides they haven't accepted
  try {
    const otherDriver = testEnv.authenticatedContext('driver2');
    const otherDriverDb = otherDriver.firestore();
    
    await assertFails(otherDriverDb.collection('rides').doc('accepted-ride').get());
    console.log('✅ Drivers cannot read rides they haven\'t accepted');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  // Test: Any authenticated user can read pending rides
  try {
    const driver = testEnv.authenticatedContext('driver2');
    const driverDb = driver.firestore();
    
    await assertSucceeds(driverDb.collection('rides').doc('pending-ride').get());
    console.log('✅ Any authenticated user can read pending rides');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  // Test: Unauthenticated users cannot read any rides
  try {
    const unauthenticated = testEnv.unauthenticatedContext();
    const unauthenticatedDb = unauthenticated.firestore();
    
    await assertFails(unauthenticatedDb.collection('rides').doc('pending-ride').get());
    console.log('✅ Unauthenticated users cannot read any rides');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  // Test: Riders can create rides
  try {
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
    console.log('✅ Riders can create rides');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  // Test: Riders cannot create rides with someone else's ID
  try {
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
    console.log('✅ Riders cannot create rides with someone else\'s ID');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  // Test: Drivers can update rides they've accepted
  try {
    const driver = testEnv.authenticatedContext('driver1');
    const driverDb = driver.firestore();
    
    await assertSucceeds(driverDb.collection('rides').doc('accepted-ride').update({
      status: 'ongoing'
    }));
    console.log('✅ Drivers can update rides they\'ve accepted');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  // Test: Riders can cancel their own pending rides
  try {
    const rider = testEnv.authenticatedContext('rider1');
    const riderDb = rider.firestore();
    
    await assertSucceeds(riderDb.collection('rides').doc('pending-ride').update({
      status: 'cancelled'
    }));
    console.log('✅ Riders can cancel their own pending rides');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function testUsersCollection() {
  console.log('\n--- Testing Users Collection ---');
  
  // Test: Users can read their own documents
  try {
    const user = testEnv.authenticatedContext('user1');
    const userDb = user.firestore();
    
    await assertSucceeds(userDb.collection('users').doc('user1').get());
    console.log('✅ Users can read their own documents');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  // Test: Users cannot read other users' documents
  try {
    const user = testEnv.authenticatedContext('user1');
    const userDb = user.firestore();
    
    await assertFails(userDb.collection('users').doc('driver1').get());
    console.log('✅ Users cannot read other users\' documents');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  // Test: Users can write to their own documents
  try {
    const user = testEnv.authenticatedContext('user1');
    const userDb = user.firestore();
    
    await assertSucceeds(userDb.collection('users').doc('user1').update({
      name: 'Updated Name'
    }));
    console.log('✅ Users can write to their own documents');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  // Test: Users cannot write to other users' documents
  try {
    const user = testEnv.authenticatedContext('user1');
    const userDb = user.firestore();
    
    await assertFails(userDb.collection('users').doc('driver1').update({
      name: 'Hacked Name'
    }));
    console.log('✅ Users cannot write to other users\' documents');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function cleanup() {
  await testEnv.cleanup();
  console.log('\nTest environment cleaned up');
}

async function runTests() {
  try {
    await setup();
    await testRidesCollection();
    await testUsersCollection();
  } catch (error) {
    console.error('Error running tests:', error);
  } finally {
    await cleanup();
  }
}

runTests();
