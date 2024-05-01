module.exports = (fn) => {
  return async (_parent, args) => {
    try {
      return await fn(_parent, args);
    } catch (error) {
      console.log(error.message);
    }
  };
};
