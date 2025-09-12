let handler = null;

export const setOfflineHandler = (fn) => {
  handler = fn;
};

export const triggerOfflineHandler = () => handler;
