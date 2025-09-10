const { supabaseAdmin } = require('../config/supabaseClient');

/**
 * Calculate the current logging streak for a user
 * A streak is the number of consecutive days with at least one food log entry
 * @param {string} userId - The user's ID
 * @returns {Promise<number>} The current streak count
 */
async function calculateLoggingStreak(userId) {
  try {
    // Get all food logs for the user, ordered by date
    const { data: foodLogs, error } = await supabaseAdmin
      .from('food_entries')
      .select('consumed_at')
      .eq('user_id', userId)
      .order('consumed_at', { ascending: false });

    if (error) {
      console.error('Error fetching food logs for streak:', error);
      return 0;
    }

    if (!foodLogs || foodLogs.length === 0) {
      return 0; // No logs, no streak
    }

    // Group logs by date (ignoring time)
    const logDates = new Set();
    foodLogs.forEach(log => {
      const date = new Date(log.consumed_at);
      const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      logDates.add(dateString);
    });

    // Convert to sorted array of dates
    const uniqueDates = Array.from(logDates).map(dateStr => {
      const [year, month, day] = dateStr.split('-');
      return new Date(parseInt(year), parseInt(month), parseInt(day));
    }).sort((a, b) => b - a); // Most recent first

    if (uniqueDates.length === 0) {
      return 0;
    }

    // Check if streak includes today or yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const mostRecentLog = uniqueDates[0];
    mostRecentLog.setHours(0, 0, 0, 0);

    // If the most recent log is older than yesterday, streak is broken
    if (mostRecentLog < yesterday) {
      return 0;
    }

    // Count consecutive days
    let streak = 0;
    let currentDate = mostRecentLog;

    for (let i = 0; i < uniqueDates.length; i++) {
      const logDate = uniqueDates[i];
      logDate.setHours(0, 0, 0, 0);

      // Check if this date is the expected consecutive date
      if (logDate.getTime() === currentDate.getTime()) {
        streak++;
        // Move to the previous day for next check
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // Gap found, streak ends
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}

/**
 * Calculate weekly logging statistics
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} Weekly stats including days logged
 */
async function calculateWeeklyLoggingStats(userId) {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const { data: foodLogs, error } = await supabaseAdmin
      .from('food_entries')
      .select('consumed_at')
      .eq('user_id', userId)
      .gte('consumed_at', oneWeekAgo.toISOString());

    if (error) {
      console.error('Error fetching weekly logs:', error);
      return { daysLogged: 0, totalLogs: 0 };
    }

    if (!foodLogs || foodLogs.length === 0) {
      return { daysLogged: 0, totalLogs: 0 };
    }

    // Count unique days
    const uniqueDays = new Set();
    foodLogs.forEach(log => {
      const date = new Date(log.consumed_at);
      uniqueDays.add(date.toDateString());
    });

    return {
      daysLogged: uniqueDays.size,
      totalLogs: foodLogs.length,
      averageLogsPerDay: Math.round((foodLogs.length / uniqueDays.size) * 10) / 10
    };
  } catch (error) {
    console.error('Error calculating weekly stats:', error);
    return { daysLogged: 0, totalLogs: 0 };
  }
}

module.exports = {
  calculateLoggingStreak,
  calculateWeeklyLoggingStats
};
