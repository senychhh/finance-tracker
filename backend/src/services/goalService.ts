/**
 * Goal service: business logic for goals.
 */

import type { Goal } from '../types';
import * as goalRepository from '../repositories/goalRepository';
import type { CreateGoal } from '../types';

export const createGoal = async (
  userId: number,
  input: {
    name: string;
    targetAmount: number;
    currentAmount?: number;
    deadline?: string | null;
  }
): Promise<Goal> => {
  const payload: CreateGoal = {
    user_id: userId,
    name: input.name.trim(),
    target_amount: input.targetAmount,
    current_amount: input.currentAmount ?? 0,
    deadline: input.deadline ?? null,
  };
  return goalRepository.createGoal(payload);
};

export const getGoalById = async (
  id: number,
  userId: number
): Promise<Goal | null> => {
  return goalRepository.findGoalById(id, userId);
};

export const listGoals = async (userId: number): Promise<Goal[]> => {
  return goalRepository.listGoalsByUserId(userId);
};
