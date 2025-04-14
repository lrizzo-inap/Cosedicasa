// src/utils/gracePeriod.js

import { differenceInSeconds, addSeconds } from 'date-fns';
import { CHORE_STATUS } from '../data/models'; // <<< ADD THIS IMPORT

// Default grace period in seconds (e.g., 5 minutes)
const GRACE_PERIOD_SECONDS = 300; // 5 * 60

/**
 * Calculates the end time of the grace period for a task.
 * @param {Date | string} completedAt - The timestamp when the task was marked completed.
 * @param {number} [gracePeriodDuration=GRACE_PERIOD_SECONDS] - Optional duration in seconds.
 * @returns {Date | null} - The Date object representing the end of the grace period, or null.
 */
export const calculateGracePeriodEnd = (completedAt, gracePeriodDuration = GRACE_PERIOD_SECONDS) => {
    if (!completedAt) return null;
    const completedDate = typeof completedAt === 'string' ? new Date(completedAt) : completedAt;
    return addSeconds(completedDate, gracePeriodDuration);
};

/**
 * Checks if the grace period for a task is currently active.
 * @param {Task} task - The task object. Should have 'status' and 'completedAt' properties.
 * @param {number} [gracePeriodDuration=GRACE_PERIOD_SECONDS] - Optional duration in seconds.
 * @returns {boolean} - True if the grace period is active, false otherwise.
 */
export const isGracePeriodActive = (task, gracePeriodDuration = GRACE_PERIOD_SECONDS) => {
    if (!task || !task.completedAt) {
        return false;
    }
    const now = new Date();
    const gracePeriodEndTime = calculateGracePeriodEnd(task.completedAt, gracePeriodDuration);

    // Check if task status allows for grace period and if current time is within the period
    // Using the imported CHORE_STATUS constants now
    return task.status !== CHORE_STATUS.APPROVED && // Assuming APPROVED means finalized
           task.status !== CHORE_STATUS.CANCELLED &&
           task.status !== CHORE_STATUS.REJECTED && // Add other final statuses if needed
           gracePeriodEndTime && now < gracePeriodEndTime;
};


/**
 * Gets the remaining time in the grace period in seconds.
 * @param {Task} task - The task object.
 * @param {number} [gracePeriodDuration=GRACE_PERIOD_SECONDS] - Optional duration in seconds.
 * @returns {number} - Remaining seconds, or 0 if not active or expired.
 */
 export const getGracePeriodRemainingSeconds = (task, gracePeriodDuration = GRACE_PERIOD_SECONDS) => {
     if (!isGracePeriodActive(task, gracePeriodDuration)) {
         return 0;
     }
     const now = new Date();
     const gracePeriodEndTime = calculateGracePeriodEnd(task.completedAt, gracePeriodDuration);
     return Math.max(0, differenceInSeconds(gracePeriodEndTime, now));
 };
