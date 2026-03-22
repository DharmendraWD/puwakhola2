'use client';

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // uses localStorage
import counterReducer from '../slices/counterSLice/counterSlice';
import userDetailsReducer from '../slices/loggedInUserDets/loggedInUserDetsSlice';
import heroSectionReducer from '../slices/heroSection/heroSlice';
import aboutusReducer from '../slices/aboutusSlice/aboutUsSlice';
import missionReducer from '../slices/missionSlice/missionSlice';
import teamReducer from '../slices/teamSlice/teamSlice';
import galleryReducer from '../slices/gallerySlice/gallerySlice';
import blogReducer from '../slices/blogSlice/blogSlice';
import faqReducer from "../slices/faqSlice/faqSlice";
import messageReducer from '../slices/messageSlice/messageSlice';
import otherReducer from '../slices/otherSlice/otherSlice';
import userinfoReducer from '../slices/userSlice/userSlice'; 
import projectReducer from '../slices/projects/projectSlice';


const rootReducer = combineReducers({
  counter: counterReducer,
  user: userDetailsReducer, 
  projects: projectReducer,
  heroSection: heroSectionReducer,
  aboutus: aboutusReducer,
  mission: missionReducer,
  team: teamReducer,
  gallery: galleryReducer,
  blogs: blogReducer,
  faqs: faqReducer, 
  messages: messageReducer,
  other: otherReducer,
  users: userinfoReducer
});
const persistConfig = {
  key: 'root-puwa',
  version: 1,
  storage,
  whitelist: ['counter', 'user'  ], // persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const createStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, 
      }),
  });

  const persistor = persistStore(store);

  return { store, persistor };
};