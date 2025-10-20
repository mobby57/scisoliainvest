import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const createSci = async (req: Request, res: Response) => {
  try {
    const { name, siren, capital } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const sci = await prisma.sci.create({
      data: {
        name,
        siren,
        capital: capital || 0
      }
    });

    return res.status(201).json({
      success: true,
      data: sci
    });
  } catch (error) {
    console.error('Create SCI error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSciList = async (req: Request, res: Response) => {
  try {
    const scis = await prisma.sci.findMany({
      include: {
        associates: true,
        properties: true
      }
    });

    return res.json({
      success: true,
      data: scis
    });
  } catch (error) {
    console.error('Get SCI list error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSciById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sci = await prisma.sci.findUnique({
      where: { id },
      include: {
        associates: true,
        properties: true
      }
    });

    if (!sci) {
      return res.status(404).json({ success: false, message: 'SCI not found' });
    }

    return res.json({
      success: true,
      data: sci
    });
  } catch (error) {
    console.error('Get SCI by ID error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSci = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, siren, capital } = req.body;

    const sci = await prisma.sci.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(siren && { siren }),
        ...(capital && { capital })
      }
    });

    return res.json({
      success: true,
      data: sci
    });
  } catch (error) {
    console.error('Update SCI error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteSci = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.sci.delete({
      where: { id }
    });

    return res.json({ success: true, message: 'SCI deleted successfully' });
  } catch (error) {
    console.error('Delete SCI error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


