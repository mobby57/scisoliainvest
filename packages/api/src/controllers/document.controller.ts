import { Request, Response } from 'express';

import Document from '../../models/Document';
import { createAuditLog } from '../services/audit.service';
import { generatePVPDF, generateQuittancePDF } from '../utils/pdfGenerator.js';

export const generateQuittance = async (req: Request, res: Response) => {
  try {
    const { leaseId, amount } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const tenantId = req.user.tenantId;

    // Generate PDF
    const pdfBuffer = await generateQuittancePDF({ leaseId, amount });

    // Save document record
    const document = new Document({
      tenantId,
      leaseId,
      name: `Quittance Loyer - ${new Date().toLocaleDateString()}`,
      type: 'QUITTANCE',
      url: `/uploads/quittances/${Date.now()}.pdf`,
      status: 'DRAFT',
      metadata: { amount, generatedAt: new Date() }
    });

    await document.save();

    // Create audit log
    await createAuditLog({
      tenantId: tenantId || '',
      action: 'CREATE',
      userId: req.user.userId || '',
      entityType: 'DOCUMENT',
      entityId: document._id.toString(),
      newValues: document.toObject()
    });

    res.status(201).json(document);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

export const generatePV = async (req: Request, res: Response) => {
  try {
    const { agmId } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const tenantId = req.user.tenantId;

    // Generate PDF
    const pdfBuffer = await generatePVPDF({ agmId });

    // Save document record
    const document = new Document({
      tenantId,
      agmId,
      name: `PV AG - ${new Date().toLocaleDateString()}`,
      type: 'PV_AG',
      url: `/uploads/pv/${Date.now()}.pdf`,
      status: 'DRAFT',
      metadata: { generatedAt: new Date() }
    });

    await document.save();

    // Create audit log
    await createAuditLog({
      tenantId: tenantId || '',
      action: 'CREATE',
      userId: req.user.userId || '',
      entityType: 'DOCUMENT',
      entityId: document._id.toString(),
      newValues: document.toObject()
    });

    res.status(201).json(document);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

export const downloadDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // TODO: Implement actual file download logic
    res.json({ message: 'Download endpoint', document });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

export const publishDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    document.status = 'PUBLISHED';
    await document.save();

    // Create audit log
    await createAuditLog({
      tenantId: req.user.tenantId || '',
      action: 'UPDATE',
      userId: req.user.userId || '',
      entityType: 'DOCUMENT',
      entityId: document._id.toString(),
      newValues: { status: 'PUBLISHED' }
    });

    res.json(document);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};
