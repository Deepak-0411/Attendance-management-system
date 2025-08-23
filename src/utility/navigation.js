let globalNavigate = null;

export const setGlobalNavigate = (navigateFn) => {  
  globalNavigate = navigateFn;
};

export const navigateTo = (path) => {
  if (typeof globalNavigate === "function") {
    globalNavigate(path);
  } else {
    console.warn("Navigation function not set yet.");
  }
};
