import {readProgress,saveProgress} from '../../../../../library/learning/core.mjs';
import {createStoryTimersHook} from '../../../../../shared/story-timers.mjs';
const useStoryTimers=createStoryTimersHook(React);
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { TOUR_DATA } from '../data/tours';

const TourContext = createContext();

export const TourProvider = ({ children, rootRef, assetBase = '', onComplete }) => {
  const {setTimeout}=useStoryTimers();
  const [completedSections,setCompletedSections]=useState(()=>readProgress(localStorage,'tuple-playground').completed);
  const completeSection=useCallback(id=>setCompletedSections(prev=>prev.includes(id)?prev:[...prev,id]),[]);
  const resetSections=()=>{saveProgress(localStorage,'tuple-playground',{completed:[]});setCompletedSections([]);};
  useEffect(()=>{saveProgress(localStorage,'tuple-playground',{completed:completedSections});if(['1','2','3','final'].every(id=>completedSections.includes(id)))onComplete?.();},[completedSections,onComplete]);
  const [activeTour, setActiveTour] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [taskCompleted, setTaskCompleted] = useState(false);
  
  // NEW: A simple trigger to force the overlay to recalculate
  const [layoutTrigger, setLayoutTrigger] = useState(0);

  const startTour = (tourName) => {
    if (TOUR_DATA[tourName] && TOUR_DATA[tourName].length > 0) {
      setActiveTour(tourName);
      setCurrentStep(0);
      setTaskCompleted(false);
    }
  };

  const nextStep = () => {
    const maxSteps = TOUR_DATA[activeTour].length;
    if (currentStep + 1 < maxSteps) {
      setCurrentStep(prev => prev + 1);
      setTaskCompleted(false); // Resets the text for the next step
    } else {
      setTimeout(() => setActiveTour(null), 100); // Ends tour if on the last step
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setTaskCompleted(true);
    }
  };

  const completeTask = (expectedStep) => {
    if (!activeTour || !TOUR_DATA[activeTour]?.[currentStep] || currentStep !== expectedStep) return;
    const stepData = TOUR_DATA[activeTour][currentStep];
    if (stepData.automated) {
      nextStep();
    } else {
      setTaskCompleted(true);
    }
  };

  // NEW: Function to manually trigger a layout refresh
  const updateTourLayout = () => setLayoutTrigger(prev => prev + 1);

  const skipTour = () => setActiveTour(null);

  return (
    <TourContext.Provider value={{ 
      rootRef,assetBase,completedSections,completeSection,resetSections,
      activeTour, currentStep, taskCompleted, layoutTrigger, // exported trigger
      startTour, nextStep, prevStep, completeTask, skipTour, updateTourLayout, // exported function
      tourSteps: activeTour ? TOUR_DATA[activeTour] : [] 
    }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);