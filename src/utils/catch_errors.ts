// export const catch_errors2 = async (fn: (...args: any) => any, ...args: any) => {
//   try {
//     return [await fn(...args)];
//   } catch (e) {
//     return [null, e];
//   }
// };

// type CatchErrors = <IT, OT>(fn: IT) => OT

export const catch_errors = <IT extends Function, OT>(fn: IT) => {
  return (async (...args: any[]) => {
    try {
      return [await fn(...args), null];
    } catch (e) {
      return [null, e];
    }
  }) as OT;
};

// type CatchErrors = (fn: (...args: any[]) => any) => (args: any) => Promise<[any, any]>;

// export const catch_errors: CatchErrors = (fn) => {
//   return async (...args) => {
//     try {
//       return [await fn(...args), null];
//     } catch (e) {
//       return [null, e];
//     }
//   };
// };
