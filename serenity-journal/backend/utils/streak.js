// Recalculates a user's writing streak whenever a new journal entry is saved.
// A streak continues if the new entry is on the same day as the last one,
// or exactly one calendar day later. Otherwise it resets to 1.
export const updateStreak = (user, entryDate = new Date()) => {
  const today = new Date(entryDate);
  today.setHours(0, 0, 0, 0);

  if (!user.lastEntryDate) {
    user.currentStreak = 1;
  } else {
    const last = new Date(user.lastEntryDate);
    last.setHours(0, 0, 0, 0);

    const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, streak unchanged
    } else if (diffDays === 1) {
      user.currentStreak += 1;
    } else {
      user.currentStreak = 1;
    }
  }

  user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
  user.lastEntryDate = today;
};
