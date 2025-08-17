
import type { Match } from '../types/Match';

/**
 * @interface TimeSlotData
 * Defines the data structure for tracking goal statistics within a specific time interval.
 * Differentiates between the first goal (scored/conceded) and subsequent goals in a match.
 */
interface TimeSlotData {
  timeSlot: string; // Identifier for the time interval (e.g., '0-15').
  scoredFirstGoal: number; // Count of matches where the team scored the *first* of their goals in this slot.
  scoredAdditionalGoals: number; // Count of subsequent goals scored by the team in this slot.
  concededFirstGoal: number; // Count of matches where the team conceded the *first* of their opponent's goals in this slot.
  concededAdditionalGoals: number; // Count of subsequent goals conceded by the team in this slot.
}

/**
 * Analyzes and calculates the distribution of goals scored and conceded by a specific team across different time slots.
 * This function provides deep insights by tracking not just the quantity of goals, but also their sequence (first vs. additional).
 * @param {Match[]} matches - An array of match objects to be analyzed.
 * @param {string} teamName - The name of the team to generate the analysis for.
 * @returns {TimeSlotData[]} An array of TimeSlotData objects, one for each time interval.
 */
export function calculateGoalDistribution(matches: Match[], teamName: string): TimeSlotData[] {
  const timeSlots: Record<string, TimeSlotData> = {
    '0-15': { timeSlot: '0-15', scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
    '16-30': { timeSlot: '16-30', scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
    '31-45': { timeSlot: '31-45', scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
    '45+': { timeSlot: '45+', scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
    '46-60': { timeSlot: '46-60', scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
    '61-75': { timeSlot: '61-75', scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
    '76-90': { timeSlot: '76-90', scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
    '90+': { timeSlot: '90+', scoredFirstGoal: 0, scoredAdditionalGoals: 0, concededFirstGoal: 0, concededAdditionalGoals: 0 },
  };

  matches.forEach(match => {
    // Sort goals chronologically to establish the sequence of events within the match.
    const sortedGoals = [...match.gol].sort((a, b) => {
      const minuteA = parseInt(a.minuto);
      const minuteB = parseInt(b.minuto);
      return minuteA - minuteB;
    });

    // Identify the first goal scored and conceded in this match to differentiate them from subsequent goals.
    const firstScoredGoal = sortedGoals.find(g => g.squadra === teamName);
    const firstConcededGoal = sortedGoals.find(g => g.squadra !== teamName);

    sortedGoals.forEach(goal => {
      const timeSlot = getTimeSlot(goal.minuto);
      const isTeamGoal = goal.squadra === teamName;

      if (isTeamGoal) {
        if (goal === firstScoredGoal) {
          timeSlots[timeSlot].scoredFirstGoal++;
        } else {
          timeSlots[timeSlot].scoredAdditionalGoals++;
        }
      } else {
        if (goal === firstConcededGoal) {
          timeSlots[timeSlot].concededFirstGoal++;
        } else {
          timeSlots[timeSlot].concededAdditionalGoals++;
        }
      }
    });
  });

  return Object.values(timeSlots);
}

/**
 * @private
 * Maps a goal's minute string to a predefined time slot.
 * Handles regular time and injury time notations.
 * @param {string} minute - The minute of the goal (e.g., '23', '45+2').
 * @returns {string} The corresponding time slot (e.g., '16-30', '45+').
 */
function getTimeSlot(minute: string): string {
  if (minute.includes('45+')) return '45+';
  if (minute.includes('90+')) return '90+';

  const minuteNum = parseInt(minute);
  if (minuteNum <= 15) return '0-15';
  if (minuteNum <= 30) return '16-30';
  if (minuteNum <= 45) return '31-45';
  if (minuteNum <= 60) return '46-60';
  if (minuteNum <= 75) return '61-75';
  return '76-90';
}
