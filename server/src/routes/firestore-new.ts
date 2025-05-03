import express, { Request, Response, NextFunction } from 'express';
import { db, auth } from '../firebase-admin';

const router = express.Router();

// Add type declaration for the extended Request
declare global {
  namespace Express {
    interface Request {
      uid?: string;
    }
  }
}

// Middleware to verify Firebase ID token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await auth.verifyIdToken(idToken);

      // Add the user ID to the request
      req.uid = decodedToken.uid;

      next();
    } catch (error) {
      console.error('Error verifying ID token:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  })();
};

// Get a document
router.get('/:collection/:id', verifyToken, (req: Request, res: Response) => {
  (async () => {
    try {
      const { collection, id } = req.params;

      // Get the document
      const doc = await db.collection(collection).doc(id).get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Return the document data
      return res.status(200).json({
        id: doc.id,
        ...doc.data(),
      });
    } catch (error) {
      console.error('Error getting document:', error);
      return res.status(500).json({ error: 'Failed to get document' });
    }
  })();
});

// Query documents
router.post('/:collection/query', verifyToken, (req: Request, res: Response) => {
  (async () => {
    try {
      const { collection } = req.params;
      const { filters = [], orderBy, limit } = req.body;

      let query: any = db.collection(collection);

      // Apply filters
      filters.forEach((filter: { field: string; operator: string; value: any }) => {
        query = query.where(filter.field, filter.operator, filter.value);
      });

      // Apply orderBy
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction);
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      // Execute the query
      const snapshot = await query.get();

      // Return the results
      const results = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json(results);
    } catch (error) {
      console.error('Error querying documents:', error);
      return res.status(500).json({ error: 'Failed to query documents' });
    }
  })();
});

// Create a document
router.post('/:collection', verifyToken, (req: Request, res: Response) => {
  (async () => {
    try {
      const { collection } = req.params;
      const data = req.body;

      // Add the user ID to the data
      if (req.uid) {
        data.userId = req.uid;
      }

      // Add a timestamp
      data.timestamp = new Date();

      // Create the document
      const docRef = await db.collection(collection).add(data);

      return res.status(201).json({
        id: docRef.id,
        ...data,
      });
    } catch (error) {
      console.error('Error creating document:', error);
      return res.status(500).json({ error: 'Failed to create document' });
    }
  })();
});

// Update a document
router.put('/:collection/:id', verifyToken, (req: Request, res: Response) => {
  (async () => {
    try {
      const { collection, id } = req.params;
      const data = req.body;

      // Add an updated timestamp
      data.updatedAt = new Date();

      // Update the document
      await db.collection(collection).doc(id).update(data);

      return res.status(200).json({
        id,
        ...data,
      });
    } catch (error) {
      console.error('Error updating document:', error);
      return res.status(500).json({ error: 'Failed to update document' });
    }
  })();
});

// Delete a document
router.delete('/:collection/:id', verifyToken, (req: Request, res: Response) => {
  (async () => {
    try {
      const { collection, id } = req.params;

      // Delete the document
      await db.collection(collection).doc(id).delete();

      return res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Error deleting document:', error);
      return res.status(500).json({ error: 'Failed to delete document' });
    }
  })();
});

export default router;
