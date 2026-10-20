import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Please enter a valid international phone number'),
});

export const aboutYouSchema = z
  .object({
    nationality: z.string().min(2, 'Please select your nationality'),
    startDate: z.string().min(4, 'Arrival date is required'),
    endDate: z.string().min(4, 'Departure date is required'),
    interests: z.array(z.string()).min(1, 'Select at least one interest'),
  })
  .refine(
    (data) => {
      const s = new Date(data.startDate).getTime();
      const e = new Date(data.endDate).getTime();
      if (isNaN(s) || isNaN(e)) return true;
      return e >= s;
    },
    {
      message: 'Departure date must be on or after arrival date',
      path: ['endDate'],
    }
  );

export const emergencyContactSchema = z.object({
  name: z.string().min(2, 'Contact name is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
});

export const merchantRegisterSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  city: z.string().min(2, 'City is required'),
  category: z.enum(['Restaurant', 'Guide', 'Driver', 'Craftsman', 'Experience']),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  priceLabel: z.string().optional(),
  description: z.string().optional(),
});
