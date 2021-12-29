import { BadRequestException } from '@nestjs/common';
import { HydratedDocument, Model, Query } from 'mongoose';

export const useQueryFeatures = async <T = any>(
  document: Model<T>,
  query: { [key: string]: string },
) => {
  const { fields, limit, page, sort, ...filter } = query;

  let q = document.find(
    JSON.parse(
      JSON.stringify(filter).replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`,
      ),
    ),
  );

  if (fields) {
    q = q.select(fields.split(',').join(' '));
  }

  if (sort) {
    q = q.sort(sort.split(',').join(' '));
  }

  const skip = (parseInt(page || '1') - 1) * parseInt(limit || '50');

  q = q.skip(skip).limit(parseInt(limit || '50'));

  if (+page) {
    const totalPages = await document.countDocuments();

    if (skip >= totalPages) {
      throw new BadRequestException('Page not found');
    }
  }

  return { query: q };
};
