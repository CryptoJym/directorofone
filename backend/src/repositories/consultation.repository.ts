import prisma from '../config/database';
import { Consultation, ConsultationStatus, Prisma } from '../generated/prisma';

export class ConsultationRepository {
  /**
   * Create a new consultation request
   */
  async create(data: {
    name: string;
    email: string;
    company?: string;
    department?: string;
    challenges: string;
    userId?: string;
  }): Promise<Consultation> {
    const bookingId = `DOO-${Date.now()}`;
    
    return prisma.consultation.create({
      data: {
        ...data,
        bookingId,
        status: ConsultationStatus.PENDING,
      },
    });
  }

  /**
   * Find consultation by ID
   */
  async findById(id: string): Promise<Consultation | null> {
    return prisma.consultation.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  /**
   * Find consultation by booking ID
   */
  async findByBookingId(bookingId: string): Promise<Consultation | null> {
    return prisma.consultation.findUnique({
      where: { bookingId },
      include: { user: true },
    });
  }

  /**
   * Get all consultations with optional filters
   */
  async findAll(params?: {
    status?: ConsultationStatus;
    userId?: string;
    skip?: number;
    take?: number;
    orderBy?: Prisma.ConsultationOrderByWithRelationInput;
  }): Promise<{ consultations: Consultation[]; total: number }> {
    const { status, userId, skip = 0, take = 10, orderBy = { createdAt: 'desc' } } = params || {};

    const where: Prisma.ConsultationWhereInput = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
        where,
        skip,
        take,
        orderBy,
        include: { user: true },
      }),
      prisma.consultation.count({ where }),
    ]);

    return { consultations, total };
  }

  /**
   * Update consultation
   */
  async update(
    id: string,
    data: Partial<{
      status: ConsultationStatus;
      scheduledDate: Date;
      notes: string;
    }>
  ): Promise<Consultation> {
    return prisma.consultation.update({
      where: { id },
      data,
    });
  }

  /**
   * Schedule a consultation
   */
  async schedule(id: string, scheduledDate: Date, notes?: string): Promise<Consultation> {
    return this.update(id, {
      status: ConsultationStatus.SCHEDULED,
      scheduledDate,
      notes,
    });
  }

  /**
   * Complete a consultation
   */
  async complete(id: string, notes: string): Promise<Consultation> {
    return this.update(id, {
      status: ConsultationStatus.COMPLETED,
      notes,
    });
  }

  /**
   * Cancel a consultation
   */
  async cancel(id: string, reason?: string): Promise<Consultation> {
    return this.update(id, {
      status: ConsultationStatus.CANCELLED,
      notes: reason,
    });
  }

  /**
   * Get consultation statistics
   */
  async getStats(userId?: string): Promise<{
    total: number;
    pending: number;
    scheduled: number;
    completed: number;
    cancelled: number;
  }> {
    const where: Prisma.ConsultationWhereInput = userId ? { userId } : {};

    const stats = await prisma.consultation.groupBy({
      by: ['status'],
      where,
      _count: true,
    });

    const result = {
      total: 0,
      pending: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    };

    stats.forEach(stat => {
      const count = stat._count;
      result.total += count;
      result[stat.status.toLowerCase() as keyof typeof result] = count;
    });

    return result;
  }
}

export default new ConsultationRepository();