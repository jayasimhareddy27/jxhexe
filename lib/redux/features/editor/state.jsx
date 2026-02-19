export const initialState = {
  activeId: null,      // The MongoDB _id of the document
  type: null,          // 'resume' or 'coverletter'
  loading: 'idle',
  formDataMap: {
    designConfig: {
      layout: "primary",
      order: [],
      containers: {},
      selectedContainer: null, 
      visibility: {}, 
    }
  },
};