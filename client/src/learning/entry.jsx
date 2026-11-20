import StoryTraditions from './adapters/StoryTraditions.jsx';
import PythonArcade from './adapters/PythonArcade.jsx';
import BakeryCrow from './adapters/BakeryCrow.jsx';
import FindSquashBug from './adapters/FindSquashBug.jsx';
import DictionaryDiscovery from './adapters/DictionaryDiscovery.jsx';
import MagicPetShop from './adapters/MagicPetShop.jsx';
import PokoJourney from './adapters/PokoJourney.jsx';
import EternalMold from './adapters/EternalMold.jsx';
import AntColony from './adapters/AntColony.jsx';
import RoboDoraemon from './adapters/RoboDoraemon.jsx';
import ThievesAtWell from './adapters/ThievesAtWell.jsx';
import BirdFamily from './adapters/BirdFamily.jsx';
import SignSquad from './adapters/SignSquad.jsx';
import RosewoodManor from './adapters/RosewoodManor.jsx';
import TreasureKingdom from './adapters/TreasureKingdom.jsx';
import DabbosOrchard from './adapters/DabbosOrchard.jsx';
import DoraemonCollections from './adapters/DoraemonCollections.jsx';
import RecursionDiscovery from './adapters/RecursionDiscovery.jsx';
import WildlifeJournal from './adapters/WildlifeJournal.jsx';
import TuplePlayground from './adapters/TuplePlayground.jsx';
import DasaraFestival from './adapters/DasaraFestival.jsx';
import DharmaValidator from './adapters/DharmaValidator.jsx';
import OracleJourney from './adapters/OracleJourney.jsx';
import HawkinsDivision from './adapters/HawkinsDivision.jsx';
import RaidurgAdventure from './adapters/RaidurgAdventure.jsx';
import MagicLogic from './adapters/MagicLogic.jsx';
import CalicoJack from './adapters/CalicoJack.jsx';
import PyFarm from './adapters/PyFarm.jsx';
import TiffinTrail from './adapters/TiffinTrail.jsx';
import MemoryModules from './adapters/MemoryModules.jsx';
import {CricketChase,LoopControlDiscovery} from './adapters/CricketStories.jsx';
import AttendanceReading from './adapters/AttendanceReading.jsx';
import IterationJourney from './adapters/IterationJourney.jsx';
import BetaalTales from './adapters/BetaalTales.jsx';
import SamsungStories from './adapters/SamsungStories.jsx';
import CampusFest from "./adapters/CampusFest.jsx";
import EverydayPython from "./adapters/EverydayPython.jsx";
import RestaurantStory from "./adapters/RestaurantStory.jsx";
import AdderStory from "./adapters/AdderStory.jsx";
import InvestorRoom from './adapters/InvestorRoom.jsx';
import MelaStory from './adapters/MelaStory.jsx';
import DashavataraStory from './adapters/DashavataraStory.jsx';
import LostForestStory from './adapters/LostForestStory.jsx';
import React from "react";
import { createRoot } from "react-dom/client";
import CollectionPage from "./CollectionPage.jsx";
import SequencePlayer from "./SequencePlayer.jsx";
import SmartParkingGate from "./adapters/SmartParkingGate.jsx";
import AuthoredHtmlStory from "./AuthoredHtmlStory.jsx";
import AuthoredBook from './AuthoredBook.jsx';
import { cancelPython } from "../../../library/learning/python-client.mjs";

class LessonBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    return this.state.error ? (
      <div role="alert" className="lesson-stage">
        <h2>This lesson needs attention.</h2>
        <p>{this.state.error.message}</p>
        <button className="button secondary" onClick={() => location.reload()}>
          Reload PyBe
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
const authoredStories = {
  'story-traditions':StoryTraditions,
  'python-arcade':PythonArcade,
  'bakery-crow':BakeryCrow,
  'find-squash-bug':FindSquashBug,
  'dictionary-discovery':DictionaryDiscovery,
  'magic-pet-shop':MagicPetShop,
  'poko-journey':PokoJourney,
  'eternal-mold':EternalMold,
  'ant-colony':AntColony,
  'robo-doraemon':RoboDoraemon,
  'thieves-at-well':ThievesAtWell,
  'bird-family':BirdFamily,
  'sign-squad':SignSquad,
  'rosewood-manor':RosewoodManor,
  'treasure-kingdom':TreasureKingdom,
  'dabbos-orchard':DabbosOrchard,
  'doraemon-collections':DoraemonCollections,
  'recursion-discovery':RecursionDiscovery,
  'wildlife-journal':WildlifeJournal,
  'tuple-playground':TuplePlayground,
  'dasara-festival':DasaraFestival,
  'dharma-validator':DharmaValidator,
  'oracle-journey':OracleJourney,
  'hawkins-division':HawkinsDivision,
  'raidurg-adventure':RaidurgAdventure,
  'magic-logic':MagicLogic,
  'calico-jack':CalicoJack,
  'pyfarm':PyFarm,
  'tiffin-trail':TiffinTrail,
  'memory-modules': MemoryModules,
  'cricket-chase':CricketChase,
  'loop-control-discovery':LoopControlDiscovery,
  'attendance-reading': AttendanceReading,
  'iteration-journey': IterationJourney,
  'betaal-tales': BetaalTales,
  'samsung-stories': SamsungStories,
  'investor-room': InvestorRoom,
  'mela-gatekeeper': MelaStory,
  'dashavatara': DashavataraStory,
  'lost-forest': LostForestStory,
  "smart-parking-gate": SmartParkingGate,
  "campus-fest": CampusFest,
  "everyday-python": EverydayPython,
  "restaurant-orders": RestaurantStory,
  adder: AdderStory,
};
function LessonContent({ lesson, onComplete }) {
  if(lesson.kind==='book')return <AuthoredBook lesson={lesson} onComplete={onComplete}/>;
  if (lesson.kind === "html")
    return <AuthoredHtmlStory lesson={lesson} onComplete={onComplete} />;
  if (lesson.kind === "component") {
    const Story = authoredStories[lesson.component];
    if (!Story) throw new Error("The authored story adapter is unavailable.");
    return <Story onComplete={onComplete} />;
  }
  if (lesson.kind === "sequence")
    return <SequencePlayer lesson={lesson} onComplete={onComplete} />;
  return <CollectionPage lesson={lesson} onComplete={onComplete} />;
}
export function mountLesson(element, lesson, onComplete) {
  const root = createRoot(element);
  root.render(
    <LessonBoundary>
      <LessonContent lesson={lesson} onComplete={onComplete} />
    </LessonBoundary>,
  );
  return () => {
    cancelPython();
    root.unmount();
  };
}
