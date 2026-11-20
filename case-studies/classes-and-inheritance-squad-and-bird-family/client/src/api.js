import {readStoryState,saveStoryState} from '../../../../shared/story-state.mjs';
// Keep authored reflection/quiz notes locally in the common PyBe namespace.
export async function saveNotes(patch){const next={...readStoryState(localStorage,'bird-family','notes',{}),...patch};saveStoryState(localStorage,'bird-family','notes',next);return next;}
