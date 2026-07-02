import { useEffect, useState } from "react";
import { fetchStoryblokPage, StoryblokPageFetchResult } from "../utils/storyblok";

interface StoryblokPageState extends StoryblokPageFetchResult {
  isLoading: boolean;
}

const INITIAL_STATE: StoryblokPageState = {
  story: null,
  content: null,
  source: "fallback",
  isLoading: true,
};

export function useStoryblokPage(slug: string) {
  const [state, setState] = useState<StoryblokPageState>(INITIAL_STATE);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      setState((current) => ({ ...current, isLoading: true }));
      const result = await fetchStoryblokPage(slug);

      if (!active) return;

      setState({
        ...result,
        isLoading: false,
      });
    }

    loadPage();

    return () => {
      active = false;
    };
  }, [slug]);

  return state;
}
