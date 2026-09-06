import { prisma } from '@/lib/prisma';
import type { VerificationDoc } from '@/types';

export async function uploadVerificationDocument(
  userId: string,
  documentType: string,
  documentNumber: string,
  documentUrl: string,
  expiryDate?: Date
): Promise<VerificationDoc> {
  const doc = await prisma.verificationDoc.upsert({
    where: {
      userId_documentType: {
        userId,
        documentType: documentType as any,
      },
    },
    update: {
      documentNumber,
      documentUrl,
      expiryDate,
      status: 'PENDING',
    },
    create: {
      userId,
      documentType: documentType as any,
      documentNumber,
      documentUrl,
      expiryDate,
      status: 'PENDING',
    },
  });

  return doc as VerificationDoc;
}

export async function getVerificationStatus(userId: string): Promise<VerificationDoc[]> {
  const docs = await prisma.verificationDoc.findMany({
    where: { userId },
  });

  return docs as VerificationDoc[];
}

export async function approveVerification(docId: string, adminId: string): Promise<VerificationDoc> {
  const doc = await prisma.verificationDoc.update({
    where: { id: docId },
    data: {
      status: 'APPROVED',
      approvedAt: new Date(),
      approvedBy: adminId,
    },
  });

  return doc as VerificationDoc;
}

export async function rejectVerification(
  docId: string,
  adminId: string,
  reason: string
): Promise<VerificationDoc> {
  const doc = await prisma.verificationDoc.update({
    where: { id: docId },
    data: {
      status: 'REJECTED',
      rejectionReason: reason,
    },
  });

  return doc as VerificationDoc;
}
