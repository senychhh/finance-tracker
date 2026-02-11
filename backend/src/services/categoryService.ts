/**
 * Category service: business logic for categories.
 */

import type { Category } from '../types';
import * as categoryRepository from '../repositories/categoryRepository';
import type { CreateCategoryInput } from '../repositories/categoryRepository';

export const createCategory = async (
  userId: number,
  input: { name: string; type: string }
): Promise<Category> => {
  const payload: CreateCategoryInput = {
    userId,
    name: input.name.trim(),
    type: input.type.trim(),
  };
  return categoryRepository.createCategory(payload);
};

export const getCategoryById = async (
  id: number,
  userId: number
): Promise<Category | null> => {
  return categoryRepository.findCategoryById(id, userId);
};

export const listCategories = async (userId: number): Promise<Category[]> => {
  return categoryRepository.listCategoriesByUserId(userId);
};
